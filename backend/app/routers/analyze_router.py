from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.analyzer_service import analyze_conversation, get_purpose_vector

router = APIRouter()

# STT 결과용 스키마
class STTEntry(BaseModel):
    speaker: str
    start: float
    end: float
    text: str

class AnalyzeRequest(BaseModel):
    dialogue: List[STTEntry]

class AnalyzeResponse(BaseModel):
    summary: str
    question_type: str
    emotion: str
    keywords: str
    embedding: List[float]

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        result = analyze_conversation([entry.dict() for entry in request.dialogue])
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
