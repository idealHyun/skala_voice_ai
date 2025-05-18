FROM python:3.11-slim

# ─────────────────────────────────────────
# 시스템 패키지: whisper 빌드·오디오 처리용
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        build-essential \
        rustc \
        cargo \
        ffmpeg \
        libsndfile1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ─────────────────────────────────────────
WORKDIR /app
COPY requirements.txt ./
COPY . /app

# 파이썬 패키지 설치
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
