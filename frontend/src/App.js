import React, { useState, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [loadingTTS, setLoadingTTS] = useState(false);

  const [sttText, setSttText] = useState('');
  const [loadingSTT, setLoadingSTT] = useState(false);
  const audioInputRef = useRef(null);

  const handleTTS = async () => {
    setLoadingTTS(true);
    const formData = new FormData();
    formData.append('text', text);

    try {
      console.log(process.env.REACT_APP_API_URL);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tts`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data);
      }

      setAudioSrc(`${process.env.REACT_APP_UPLOAD_URL}${data.file_path}`);
    } catch (error) {
      console.error('TTS Error:', error);
      alert(`TTS 처리 중 오류 발생: ${error.message}`);
    } finally {
      setLoadingTTS(false);
    }
  };



  const handleSTT = async () => {
    if (!audioInputRef.current.files[0]) {
      alert('파일을 선택하세요 ');
      return;
    }

    setLoadingSTT(true);
    const formData = new FormData();
    formData.append('audio', audioInputRef.current.files[0]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/stt`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('STT 요청 실패');

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSttText(data.text);
    } catch (error) {
      console.error(error);
      alert('STT 처리 중 오류 발생');
    } finally {
      setLoadingSTT(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Text-to-Speech 1111</h1>
      <textarea
        rows="5"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="여기에 텍스트 입력"
      />
      <br />
      <button onClick={handleTTS} disabled={loadingTTS}>
        {loadingTTS ? '처리 중...' : 'TTS 변환'}
      </button>
      <br /><br />
      {audioSrc && <audio controls src={audioSrc} />}

      <hr style={{ margin: '3rem 0' }} />

      <h1>Speech-to-Text</h1>
      <input type="file" accept=".webm" ref={audioInputRef} />
      <br />
      <button onClick={handleSTT} disabled={loadingSTT}>
        {loadingSTT ? '처리 중...' : 'STT 변환'}
      </button>
      <br /><br />
      {sttText && (
        <div>
          <h3>인식된 텍스트:</h3>
          <pre>{sttText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
