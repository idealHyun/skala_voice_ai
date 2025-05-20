import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Loading from './Loading'
import axios from 'axios';
import theme from '../theme';
import { useNavigate } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Upload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setTranscript('');
    console.log('✅ 업로드된 파일:', file);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      setLoading(true);

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/stt/`, formData);
      console.log('🎤 STT 결과:', res.data.result);
      setTranscript(res.data.result);

    } catch (err) {
      console.error('❌ STT 요청 실패:', err.response?.data || err.message);
      alert('STT 실패: 텍스트 변환에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!transcript) return;
    navigate('/result', { state: { result: transcript } });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingTop={10}>
      <Typography variant="h6" gutterBottom>
        상담 녹음 파일을 업로드 해주세요
      </Typography>

      <Button
        component="label"
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: '#e0e0e0',
          color: '#000',
          '&:hover': {
            backgroundColor: theme.palette.orange.main,
            color: '#fff',
          },
        }}
        startIcon={<CloudUploadIcon />}
      >
        파일 업로드
        <VisuallyHiddenInput type="file" accept="audio/*" onChange={handleFileChange} />
      </Button>

      {uploadedFile && (
        <Typography variant="body2" mt={3}>
          업로드된 파일: <strong>{uploadedFile.name}</strong>
        </Typography>
      )}

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {transcript && (
        <>
          <Typography variant="body1" mt={4}>
            <h3>STT 결과:</h3><br />
            {transcript.split('\n').map((line, idx) => (
              <span key={idx}>{line}<br /></span>
            ))}
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 5,
              backgroundColor: theme.palette.orange.main,
              color: theme.palette.orange.contrastText,
              '&:hover': {
                backgroundColor: '#d85f1a',
              },
            }}
            onClick={handleConfirm}
          >
            결과 확인하기
          </Button>

        </>
      )}
    </Box>
  );
}