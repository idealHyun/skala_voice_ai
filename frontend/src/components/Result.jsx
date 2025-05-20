import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';

const mockResult = {
  answers: [
    {
      label: '무배당 프리미라이프 참좋은더보장간병보험2504',
      probability: 0.457,
      answer:
        '사용자의 요구는 암, 수술, 보험금의 지급사유와 관련된 보장을 찾는 것입니다. 제공된 문서에서 "무배당 프리미라이프 참좋은더보장간병보험2504"가 이러한 요구에 적합한 이유를 설명하겠습니다.\n\n1. **암 보장**: ...',
    },
    {
      label: '무배당 프리미라이프 New간편암건강보험2504(PA)',
      probability: 0.317,
      answer:
        '사용자의 요구사항은 암, 수술, 보험금 지급 사유와 관련된 부분에서 어필할 수 있는 보험 상품을 찾는 것입니다. 제공된 문서에서 "무배당 프리미라이프 New간편암건강보험2504(PA)"는 ...',
    },
    {
      label: '무배당 프리미라이프 노후실손의료비보험2504',
      probability: 0.126,
      answer:
        '사용자의 요구사항은 암, 수술, 보험금 지급사유와 관련된 무배당 프리미라이프 노후실손의료비보험2504에 대한 어필 포인트입니다. 이와 관련하여 문서에서 추출된 내용을 바탕으로 해당 보험 상품을 추천하는 이유를 설명하겠습니다.\n\n### 추천 보험 상품: ...',
    },
  ],
};

export default function Result() {
  return (
    <Box mt={5} px={3}>
      <Typography variant="h4" gutterBottom>
        추천 보험 상품 결과
      </Typography>

      {mockResult.answers.map((item, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 4 }}>
          <CardHeader
            title={item.label}
            subheader={`예측 확률: ${(item.probability * 100).toFixed(1)}%`}
          />
          <Divider />
          <CardContent>
            <Typography
              variant="body2"
              component="div"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {item.answer}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
