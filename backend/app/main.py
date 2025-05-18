from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers.stt_router import router as stt_router
from app.routers.tts_router import router as tts_router
from app.routers.stt_tts_router import router as stt_tts_router
from fastapi.responses import JSONResponse, FileResponse
from dotenv import load_dotenv
import os

# .env 로딩
dotenv_path = os.path.join(os.path.dirname(__file__), 'app', '.env')
load_dotenv(dotenv_path)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.")

# 경로
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "routers", "uploads")
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend')
STT_TTS_HTML = os.path.join(FRONTEND_DIR, 'stt-tts.html')

# 최상위 앱
app = FastAPI()
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# API 전용 서브 앱
api_app = FastAPI()
app.mount("/api", api_app)

# CORS는 최상위 app 기준
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 모든 API는 여기 등록
api_app.include_router(stt_router, prefix="/stt")
api_app.include_router(tts_router, prefix="/tts")
api_app.include_router(stt_tts_router, prefix="/stt-tts")

@api_app.get("/hello")
def read_hello():
    return "hello word"

@api_app.get("/stt-tts")
async def serve_stt_tts_page():
    if not os.path.exists(STT_TTS_HTML):
        raise HTTPException(status_code=404, detail="stt-tts.html 파일을 찾을 수 없습니다.")
    return FileResponse(STT_TTS_HTML)

@api_app.get("/api-key")
async def get_api_key():
    return JSONResponse(content={"api_key": OPENAI_API_KEY})

# uvicorn 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
