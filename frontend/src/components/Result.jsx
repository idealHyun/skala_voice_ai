import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useCustomer } from '../context/CustomerContext';

export default function Result() {
  const [recommendJson, setRecommendJson] = useState(null);
  const { state } = useLocation();
  const resultText = state.result;
  const customer = useCustomer();


  useEffect(() => {
    if (!resultText) return;

    const fetchData = async () => {
      const analyzeRes = await fetch(`${process.env.REACT_APP_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: resultText }),
      });

      const analyzeJson = await analyzeRes.json();

      const predictRes = await fetch(`${process.env.REACT_APP_MODEL_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "나이":customer.age,
          "성별":customer.gender,
          "결혼여부":customer.married,
          "직업":customer.occupation,
          "소득":customer.income_range,
          "목적벡터":analyzeJson.embedding
        }),
      });

      const predictJson = await predictRes.json();

      const recommendRes = await fetch(`${process.env.REACT_APP_API_URL}/recommend/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "top3_recommendations":predictJson.answers,
          "keywords":analyzeJson.keywords
        }),
      });

      const recommendJson = await recommendRes.json();
      setRecommendJson(recommendJson)
    };

    fetchData();


  }, [resultText,customer]);

  if (!recommendJson) return null;

  return (
    <Box mt={5} px={4}>
      <Box textAlign="center" mb={3}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'white',
            backgroundColor: '#f36f21',
            padding: '0.5rem 1.5rem',
            borderRadius: 1,
            display: 'inline-block',
          }}
        >
          추천 보험 상품 결과
        </Typography>
      </Box>
      {recommendJson.answers.map((item, index) => {
        const paragraphs = item.answer.split('\n\n');
        const last = paragraphs.pop();

        return (
          <Card key={index} variant="outlined" sx={{ mt: 4, mb: 4, borderRadius: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={3} pt={2}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                예측 확률: {(item.probability * 100).toFixed(1)}%
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            <CardContent>
              <Box sx={{ textAlign: 'justify', px: 2 }}>
                {paragraphs.map((p, i) => (
                  <Typography key={i} variant="body2" paragraph>
                    {p}
                  </Typography>
                ))}
                {/* 결론 문단 */}
                {last && (
                  <Typography variant="body2" paragraph>
                    <h3>👉🏻 {last}</h3>
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}


