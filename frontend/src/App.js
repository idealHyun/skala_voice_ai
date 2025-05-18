import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTTS = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('text', text);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tts`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('TTS 요청 실패');
      }

      const data = await response.json();
      setAudioSrc(`${process.env.REACT_APP_API_URL}${data.file_path}`);
    } catch (error) {
      console.error(error);
      alert('TTS 처리 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Text-to-Speech</h1>
      <textarea
        rows="5"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="여기에 텍스트 입력"
      />
      <br />
      <button onClick={handleTTS} disabled={loading}>
        {loading ? '처리 중...' : 'TTS 변환'}
      </button>
      <br /><br />
      {audioSrc && (
        <audio controls src={audioSrc} />
      )}
    </div>
  );
}

export default App;
