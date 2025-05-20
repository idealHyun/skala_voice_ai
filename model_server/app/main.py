from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import pickle
import numpy as np

app = FastAPI()

@app.get("/hello")
def read_root():
    return "hello world"

# 입력 스키마
class PredictRequest(BaseModel):
    나이: int = Field(..., example=35)
    성별: str = Field(..., example="F")
    결혼여부: str = Field(..., example="Y")
    직업: str = Field(..., example="회사원")
    소득: str = Field(..., example="1,000~2,000만원")
    목적벡터: List[float] = Field(..., example=[0.15, 0.32, 0.99])

# 출력 스키마
class PredictionItem(BaseModel):
    label: str = Field(..., example="실손보험")
    probability: float = Field(..., example=0.82)

class PredictResponse(BaseModel):
    top3_recommendations: List[PredictionItem]

# 모델·인코더 로드
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "gradientboosting_model_newest.pkl"
LABEL_ENCODER_PATH = BASE_DIR / "model" / "label_encoder_newest.pkl"
CATEGORY_ENCODERS_PATH = BASE_DIR / "model" / "category_encoders_newest.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)
with open(LABEL_ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)
with open(CATEGORY_ENCODERS_PATH, "rb") as f:
    category_encoders = pickle.load(f)

def _predict_insurance(data: dict) -> List[dict]:
    features = [
        data["나이"],
        category_encoders["성별"].transform([data["성별"]])[0],
        category_encoders["결혼여부"].transform([data["결혼여부"]])[0],
        category_encoders["직업"].transform([data["직업"]])[0],
        category_encoders["소득"].transform([data["소득"]])[0],
    ] + data["목적벡터"]

    X = np.array(features).reshape(1, -1)
    probs = model.predict_proba(X)[0]

    top3_idx = np.argsort(probs)[-3:][::-1]
    return [
        {"label": label_encoder.inverse_transform([i])[0], "probability": float(round(probs[i], 3))}
        for i in top3_idx
    ]

@app.post("/predict")
async def predict(req: PredictRequest):
    try:
        result = _predict_insurance(req.dict())
        return {"top3_recommendations": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
