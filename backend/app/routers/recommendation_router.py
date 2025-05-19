from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import openai
from pinecone import Pinecone
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Recommendation(BaseModel):
    label: str
    probability: float


class MessageRequest(BaseModel):
    top3_recommendations: List[Recommendation]

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

        for rec in req.top3_recommendations:
            label = rec.label
            full_query = f"{label}은 어떤게 좋아?"

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
                f"아래는 보험 문서에서 추출된 내용이다:\n\n"
                f"{context}\n\n"
                f'질문: "어떤게 좋아?"\n\n'
                f"문서에서 관련 내용을 찾아 추천 보험을 명시하고 이유를 설명하라."
            )

            system_prompt = (
                "너는 보험 추천 전문가이자 보험 약관 해석 전문가다. "
                "답변 시 문서 인용과 논리적 이유를 제시하라."
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
