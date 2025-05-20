import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import theme from '../theme';

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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('업로드된 파일:', file);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingTop={10}
      paddingBottom={20}
    >
      <Typography variant="h6" gutterBottom>
        상담 녹음 파일을 업로드 해주세요
      </Typography>

      <Button
        component="label"
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: theme.palette.orange.main,
          color: theme.palette.orange.contrastText,
          '&:hover': {
            backgroundColor: '#d85f1a',
          },
        }}
        startIcon={<CloudUploadIcon />}
      >
        파일 업로드
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>

      {uploadedFile && (
        <Typography variant="body2" mt={3}>
          업로드된 파일: <strong>{uploadedFile.name}</strong>
        </Typography>
      )}
    </Box>
  );
}
