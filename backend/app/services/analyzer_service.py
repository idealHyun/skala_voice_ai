from typing import Dict
import os
import json
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
    STT로부터 받은 상담 대화 문자열을 바탕으로 고객 발화 중심 분석 수행
    """

    # 1. 화자 태그 정리
    formatted_text = dialogue_text.replace("고객:", "[고객]:").replace("상담원:", "[상담사]:").strip()

    # 2. 프롬프트 (JSON 응답 유도 + 값 제약 분리 명시)
    system_prompt = """
    너는 보험 상담 데이터를 분석하는 AI야.

    아래는 [상담사]: 와 [고객]: 사이의 대화 기록이야.
    너는 고객([고객]:)의 발화를 중심으로 다음 정보를 정확히 추출해.

    📌 출력은 반드시 **다음 JSON 형식**으로만 응답하고, **그 외 문장은 절대 출력하지 마.**

    예시 출력:
    {
      "summary": "건강보험에서 입원과 수술비 보장을 원함",
      "question_type": "정보 요청형",
      "emotion": "중립",
      "keywords": "건강보험,입원,수술"
    }

    📌 각 필드 조건:
    - summary: 고객의 목적과 요청 흐름을 1~2문장으로 요약 (예: 요청 내용 + 맥락 포함)
    - question_type: 질문 유형을 분류하세요. 의문형 / 정보 요청형 / 의도 표출형 중 하나
    - emotion: 고객의 감정을 분류하세요. 긍정 / 중립 / 부정 중 하나
    - keywords: 쉼표(,)로 구분된 상담 목적과 관련된 핵심 키워드 **정확히 3개**, **공백 없이 출력**
    """

    messages = [
        {"role": "system", "content": system_prompt.strip()},
        {"role": "user", "content": formatted_text}
    ]

    # 3. GPT 호출
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0
    )

    # 4. 응답 파싱
    content = response.choices[0].message.content.strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:

        parsed = {
            "summary": "(파싱 실패)",
            "question_type": "(파싱 실패)",
            "emotion": "(파싱 실패)",
            "keywords": "(파싱 실패)"
        }

    return parsed

def get_purpose_vector(keywords: str) -> list:
    """
    쉼표로 구분된 키워드 문자열을 임베딩
    """
    return embedding_model.embed_query(keywords)
