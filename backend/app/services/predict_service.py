# backend/app/services/predict_service.py
import pickle
import numpy as np
from pathlib import Path

# 모델 및 인코더 파일 경로
MODEL_PATH = Path("model/gradient_boosting_model.pkl")
LABEL_ENCODER_PATH = Path("model/label_encoder.pkl")
CATEGORY_ENCODERS_PATH = Path("model/category_encoders.pkl")

# 모델과 인코더 불러오기
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(LABEL_ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

with open(CATEGORY_ENCODERS_PATH, "rb") as f:
    category_encoders = pickle.load(f)  # dict 형태: {"성별": LabelEncoder, ...}

def predict_insurance(input_data: dict) -> list:
    try:
        # 필수 입력 항목
        features = [
            input_data["나이"],
            category_encoders["성별"].transform([input_data["성별"]])[0],
            category_encoders["결혼여부"].transform([input_data["결혼여부"]])[0],
            category_encoders["직업"].transform([input_data["직업"]])[0],
            category_encoders["소득"].transform([input_data["소득"]])[0]
        ] + input_data["목적벡터"]

        X = np.array(features).reshape(1, -1)
        probs = model.predict_proba(X)[0]

        top3_indices = np.argsort(probs)[-3:][::-1]
        top3_labels = label_encoder.inverse_transform(top3_indices)
        top3_probs = [round(probs[i], 3) for i in top3_indices]

        return [
            {"label": label, "probability": prob}
            for label, prob in zip(top3_labels, top3_probs)
        ]
    except Exception as e:
        raise RuntimeError(f"Prediction failed: {e}")