from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.analyzer_service import analyze_conversation, get_purpose_vector

router = APIRouter()

# 🟡 새로 바뀐 STT 형식: 문자열 전체를 받음
class AnalyzeRequest(BaseModel):
    result: str  # "고객: ...\n상담원: ..." 형식의 대화 문자열

class AnalyzeResponse(BaseModel):
    summary: str
    question_type: str
    emotion: str
    keywords: str
    embedding: List[float]

@router.post("/", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        # 🟡 문자열 기반 분석 함수 호출
        result = analyze_conversation(request.result)
        embedding = get_purpose_vector(result["keywords"])

        return AnalyzeResponse(
            summary=result["summary"],
            question_type=result["question_type"],
            emotion=result["emotion"],
            keywords=result["keywords"],
            embedding=embedding
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
