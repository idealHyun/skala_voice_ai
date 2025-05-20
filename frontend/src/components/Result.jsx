import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
} from '@mui/material';

const mockResult = [
    {
        label: '무배당 프리미라이프 참좋은더보장간병보험2504',
        probability: 0.457,
        answer:
            "무배당 프리미라이프 참좋은더보장간병보험2504 상품은 '암, 수술, 보험금의 지급사유' 요구를 충족하는 이유는 다음과 같습니다. 첫째, 이 보험 상품은 암 진단 시 보험금을 지급하는 조항을 포함하고 있습니다. 이는 암 진단을 받은 경우 경제적 부담을 덜어줄 수 있는 중요한 요소입니다. 둘째, 수술 관련 보장도 포함되어 있어, 수술이 필요한 상황에서 발생할 수 있는 의료비를 지원받을 수 있습니다. 이는 수술 후 회복 기간 동안의 재정적 안정을 도모할 수 있는 장점이 있습니다. 셋째, 보험금 지급사유에 대한 명확한 기준이 설정되어 있어, 보험금 청구 시 혼란을 줄이고 신속한 지급이 가능하도록 설계되어 있습니다.\n\n이러한 이유로 무배당 프리미라이프 참좋은더보장간병보험2504 상품은 암과 수술 관련 보장을 필요로 하는 고객에게 추천할 만합니다. 특히, 암과 수술로 인한 경제적 부담을 줄이고자 하는 분들에게 적합한 선택이 될 것입니다."
    },
    {
        label: '무배당 프리미라이프 New간편암건강보험2504(PA)',
        probability: 0.317,
        answer:
            "무배당 프리미라이프 New간편암건강보험2504(PA) 상품이 '암, 수술, 보험금의 지급사유' 요구를 충족하는 이유는 다음과 같습니다. 첫째, 이 보험 상품은 암 진단 시 보험금을 지급하는 조건을 명확히 하고 있습니다. 이는 암 진단 확정 시 보험금이 지급된다는 점에서 {암}과 직접 연결됩니다. 둘째, 수술에 대한 보장도 포함되어 있어, 암 수술 시 발생하는 비용을 보장받을 수 있습니다. 이는 {수술}과 관련된 부분을 충족시킵니다. 셋째, 보험금 지급 사유에 대한 명확한 기준이 제시되어 있어, 보험금 지급의 투명성을 확보하고 있습니다. 이는 {보험금의 지급사유}와 연결됩니다.\n\n이 보험 상품은 암 진단과 수술에 대한 보장을 통해 암 치료에 필요한 경제적 부담을 덜어줄 수 있는 실질적인 혜택을 제공합니다. 암과 관련된 다양한 상황에서 보험금이 지급되므로, 암 치료에 대한 걱정을 덜고자 하는 분들에게 추천할 수 있습니다."
    },
    {
        label: '무배당 프리미라이프 노후실손의료비보험2504',
        probability: 0.126,
        answer:
            "문서에서 발췌한 내용을 바탕으로 \"무배당 프리미라이프 노후실손의료비보험2504\" 상품이 '암, 수술, 보험금의 지급사유' 요구를 충족하는 이유를 설명하겠습니다.\n\n첫째, {암}과 관련하여 이 보험 상품은 암 진단 시 보험금을 지급하는 조항이 포함되어 있습니다. 이는 암 진단을 받은 경우, 피보험자가 경제적 부담을 덜 수 있도록 설계된 것입니다. 따라서 암과 관련된 보험금 지급 사유를 충족합니다.\n\n둘째, {수술}에 대한 부분에서는 수술이 필요한 경우 보험금이 지급된다는 조항이 명시되어 있습니다. 이는 수술로 인한 의료비 부담을 경감시키기 위한 것으로, 수술 관련 보험금 지급 사유를 충족합니다.\n\n셋째, {보험금의 지급사유}에 대해 이 상품은 보험금 지급 조건을 명확히 규정하고 있으며, 피보험자가 해당 조건을 충족할 경우 보험금을 지급하도록 설계되어 있습니다. 이는 보험금 지급의 명확성과 신뢰성을 높이는 요소입니다.\n\n따라서 \"무배당 프리미라이프 노후실손의료비보험2504\" 상품은 암 진단, 수술 필요 시, 그리고 명확한 보험금 지급 조건을 통해 피보험자에게 실질적인 혜택을 제공할 수 있는 상품으로 추천할 만합니다. 이러한 특성은 특히 노후에 예상치 못한 의료비 부담을 줄이고자 하는 분들에게 적합합니다."
    }
];

export default function Result() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversation:
                        '상담원: 안녕하세요, OOO보험 상담사입니다  어떤 보험 상담 원하시나요?\n고객: 건강보험 쪽으로 알아보고 있어요\n상담원: 네, 병원비 보장 중심으로 보실까요?\n고객: 네, 입원이나 수술비 보장되는 게 좋겠어요\n상담원: 그럼 OOO 건강보험을 추천드립니다  입원 시 하루 5만 원, 수술 시 최대 500만 원까지 보장됩니다\n고객: 보험료는요?\n상담원: 고객님 기존 월 4만 원대이고 20년 납입 후 평생 보장입니다\n고객: 설기안 받아볼 수 있을까요?\n상담원: 네, 성함과 생년월을 알려주시면 맞춤 설기안 보내드리겠습니다\n고객: 네, 알겠습니다 감사합니다\n상담원: 감사합니다 좋은 하루 되세요',
                }),
            });

            const json = await res.json();
            console.log(json);
            setData(json);
        };

        fetchData();
    }, []);

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

            {mockResult.map((item, index) => {
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
