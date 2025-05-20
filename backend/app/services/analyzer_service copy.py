from typing import Dict
import os
from dotenv import load_dotenv
from openai import OpenAI
from langchain_openai import OpenAIEmbeddings

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

def analyze_conversation(dialogue_text: str) -> Dict:
    """
    STT가 제공한 문자열 기반 대화를 바탕으로 고객 발화를 중심으로 분석 수행
    """

    # 화자명을 GPT가 인식하는 포맷으로 정제
    formatted_text = dialogue_text.replace("고객:", "[고객]:").replace("상담원:", "[상담사]:")

    system_prompt = """
    너는 보험 상담 데이터를 분석하는 AI야.
    지금부터 상담사([상담사]:)와 고객([고객]:) 간의 대화 이력을 줄 테니,
    '고객'의 발화를 중심으로 다음을 분석해줘:

    1. 고객 발화를 간단히 요약하세요. (한 문장)
    2. 질문 유형을 분류하세요. (의문형 / 정보 요청형 / 의도 표출형 중 하나)
    3. 고객의 감정을 분류하세요. (긍정 / 중립 / 부정 중 하나)
    4. 상담 목적과 관련된 핵심 단어 3개를 추출하세요. (쉼표로 구분)
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": formatted_text.strip()}
    ]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0
    )

    content = response.choices[0].message.content.strip()
    lines = content.split("\n")

    summary = lines[0].split(":", 1)[-1].strip()
    question_type = lines[1].split(":", 1)[-1].strip()
    emotion = lines[2].split(":", 1)[-1].strip()
    keywords = lines[3].split(":", 1)[-1].strip()

    return {
        "summary": summary,
        "question_type": question_type,
        "emotion": emotion,
        "keywords": keywords
    }

def get_purpose_vector(keywords: str) -> list:
    """
    쉼표로 연결된 키워드 문자열을 임베딩하여 벡터 생성
    """
    return embedding_model.embed_query(keywords)