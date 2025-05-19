from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.analyzer_service import analyze_conversation, get_purpose_vector

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    summary: str
    question_type: str
    emotion: str
    keywords: str         # 문자열로 수정
    embedding: List[float]

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        result = analyze_conversation(request.text)
        embedding = get_purpose_vector(result["keywords"])  # 여전히 str 입력

        return AnalyzeResponse(
            summary=result["summary"],
            question_type=result["question_type"],
            emotion=result["emotion"],
            keywords=result["keywords"],  # ✅ 문자열 그대로
            embedding=embedding
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
