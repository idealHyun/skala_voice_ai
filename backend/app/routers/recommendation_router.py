from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import openai
from pinecone import Pinecone
from pydantic import BaseModel
from typing import List

class Recommendation(BaseModel):
    label: str
    probability: float


class MessageRequest(BaseModel):
    top3_recommendations: List[Recommendation]
    keywords: str

router = APIRouter()


@router.post("/message")
async def generate_message(req: MessageRequest):
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index(host=os.getenv("PINECONE_HOST"))

        embedding_model = "text-embedding-3-small"
        chat_model = "gpt-4o"

        # 결과 저장 리스트
        results = []
        keyword = req.keywords

        for rec in req.top3_recommendations:
            label = rec.label
            full_query = f"{label}은 {keyword}와 관련해서 어떤 점에 대해서 어필할 수 있을까?"

            query_emb = openai.embeddings.create(
                input=full_query,
                model=embedding_model
            ).data[0].embedding

            search_result = index.query(
                vector=query_emb,
                top_k=3,
                include_metadata=True,
                filter={"source": {"$eq": f"{label}.pdf"}}
            )

            retrieved_chunks = []
            for match in search_result["matches"]:
                md = match["metadata"]
                if md.get("type") == "text":
                    retrieved_chunks.append(f"(p.{md['page']}) {md.get('text', '')}")

            context = "\n\n".join(retrieved_chunks)

            prompt = (
                "아래는 보험 문서에서 추출된 내용이다:\n\n"
                f"{context}\n\n"
                "질문자는 다음과 같은 보험 관련 요구를 하고 있습니다:"
                f"{full_query}"
                "이 질문에 가장 적합한 보험 상품이 위 문서 중에 있다면,"
                "- 해당 상품의 이름이 무엇인지"
                "- 어떤 내용이 사용자의 요구와 일치하는지"
                "- 그 이유로 왜 이 보험을 추천하는지를"
                "구체적이고 설득력 있게 설명해 주세요."
                "단순 정보 나열이 아니라 '이 보험을 추천하는 이유'에 중심을 두세요."
            )

            system_prompt = (
                "너는 보험 추천 전문가이자 보험 약관 해석 전문가다. "
                "사용자의 질문은 보험 관련 상담 중 나온 요구사항일 수 있으며, "
                "이를 기반으로 벡터 검색된 문서들은 실제 보험 상품의 약관 또는 상품 설명이다. "
                "답변 시, 문서 내용에서 어떤 부분이 사용자의 요구와 관련되는지를 구체적으로 인용하고, "
                "왜 해당 보험이 적합한지를 논리적으로 설명하라. "
                "단순 요약이나 정보 나열이 아니라 설득력 있는 추천 설명을 하라."
            )

            completion = openai.chat.completions.create(
                model=chat_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )

            answer = completion.choices[0].message.content
            results.append({
                "label": label,
                "probability": rec.probability,
                "answer": answer
            })

        return {"answers": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
