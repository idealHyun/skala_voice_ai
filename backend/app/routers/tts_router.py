from fastapi import APIRouter, HTTPException, Form
from app.services.tts_service import text_to_speech
import os

router = APIRouter()

# 출력 파일 저장할 uploads 폴더 경로
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def tts_endpoint(text: str = Form(...)):
    try:
        filename = "openai_tts_output.mp3"
        output_path = os.path.join(UPLOAD_DIR, filename)
        text_to_speech(text, output_path)
        return {
            "message": "TTS 처리 완료 (OpenAI TTS)",
            "file_path": f"/uploads/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
