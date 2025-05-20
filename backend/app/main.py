from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers.stt_router import router as stt_router
from app.routers.tts_router import router as tts_router
from app.routers.stt_tts_router import router as stt_tts_router
from app.routers.recommendation_router import router as recommendation_router
from app.routers.customers_router import router as customers_router
from app.routers.stt_tts_router import router as predict_router
from dotenv import load_dotenv
import os

# .env 로딩
dotenv_path = os.path.join(os.path.dirname(__file__), 'app', '.env')
load_dotenv(dotenv_path)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 모든 API는 "/api" prefix로 직접 연결
app.include_router(stt_router, prefix="/stt")
app.include_router(tts_router, prefix="/tts")
app.include_router(stt_tts_router, prefix="/stt-tts")
app.include_router(recommendation_router, prefix="/recommendation")
app.include_router(customers_router, prefix="/customers")
app.include_router(predict_router, prefix="/predict")

@app.get("/hello")
def read_hello():
    return "hello word!!!!!!"

@app.get("/api-key")
async def get_api_key():
    return JSONResponse(content={"api_key": OPENAI_API_KEY})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
