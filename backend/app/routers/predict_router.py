# backend/app/api/predict_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from app.services.predict_service import predict_insurance

router = APIRouter()

# ✅ 입력 모델
class PredictRequest(BaseModel):
    나이: int = Field(..., example=35, description="고객의 나이")
    성별: str = Field(..., example="F", description="고객의 성별 (M/F)")
    결혼여부: str = Field(..., example="Y", description="결혼 여부 (Y/N)")
    직업: str = Field(..., example="회사원", description="고객의 직업")
    소득: str = Field(..., example="1,000~2,000만원", description="연소득 범위")
    목적벡터: List[float] = Field(..., example=[0.15, 0.32, 0.99], description="고객의 임베딩 벡터")

# ✅ 출력 모델
class PredictionItem(BaseModel):
    label: str = Field(..., example="실손보험")
    probability: float = Field(..., example=0.82)

class PredictResponse(BaseModel):
    top3_recommendations: List[PredictionItem]

# ✅ 엔드포인트
@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    try:
        result = predict_insurance(request.dict())
        return PredictResponse(top3_recommendations=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
