import os
from dotenv import load_dotenv
from openai import OpenAI
from typing import Dict
from langchain_openai import OpenAIEmbeddings

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

def analyze_conversation(text: str) -> Dict:
    prompt = f"""
    아래는 보험 상담 중 고객이 발화한 문장입니다.

    다음 정보를 순서대로 출력하세요:
    1. 고객 발화를 간단히 요약하세요. (한 문장)
    2. 질문 유형을 분류하세요. (의문형 / 정보 요청형 / 의도 표출형 중 하나)
    3. 고객의 감정을 분류하세요. (긍정 / 중립 / 부정 중 하나)
    4. 상담 목적과 관련된 핵심 단어 3개를 추출하세요. (쉼표로 구분)

    발화 내용:
    \"{text}\""""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
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
    return embedding_model.embed_query(keywords)
