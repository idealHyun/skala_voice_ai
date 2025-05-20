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

            system_prompt = (
                "역할: 보험 추천·약관 해석 전문가.\n"
                "출력 규칙:\n"
                "- 문단형 서술, 불릿 사용 금지.\n"
                "- 주장마다 인용 근거 포함.\n"
                "- 근거가 없으면 해당 주장 생략."
            )

            prompt = (
                f"문서 발췌:\n\n{context}\n\n"
                f"질문: \"{label} 상품이 '{keyword}' 요구를 충족하는 이유는?\"\n\n"
                "답변 작성 규칙:\n"
                "1. 문서에서 {label}·{keyword}와 직접 연결되는 문장만 인용하고 인용.\n"
                "2. 각 인용 근거를 요약·재구성하여 논리적 설명을 이어서 작성.\n"
                "3. 마지막 문단에 해당 상품에 대해 추천할 수 있는 멘트를 키워드와 관련지어 추천해줘."
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