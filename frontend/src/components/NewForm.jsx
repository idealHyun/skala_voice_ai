import React from 'react';
import {
    Stack,
    TextField,
    Autocomplete,
    Grid,
    Typography,
    Button,
} from '@mui/material';

const genderOptions = ['여성', '남성'];
const jobOptions = ['공무원', '교사', '대학생', '대학원생', '자영업자', '주부', '프리랜서', '회사원', '기타'];
const incomeOptions = ['1,000만원 이하', '1,000~2,000만원', '2,000~3,000만원', '3,000~4,000만원', '4,000~5,000만원', '5,000만원 이상'];
const marriedOptions = ['기혼', '미혼'];

export default function NewForm() {
    return (
        <>
            <Typography variant="h5" gutterBottom>신규회원 정보 입력</Typography>
            <Stack spacing={3} mt={4}>
                <TextField required label="이름" fullWidth />

                <Autocomplete
                    options={genderOptions} renderInput={(params) => <TextField {...params} required label="성별" fullWidth />}
                />

                <TextField required label="나이" type="number" fullWidth />

                <Autocomplete
                    options={marriedOptions}
                    renderInput={(params) => <TextField {...params} required label="결혼 여부" fullWidth />}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField required label="주소" fullWidth placeholder="예: 경기도 성남시 분당구..." />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField required label="상세 주소" fullWidth placeholder="아파트, 호수 등" />
                    </Grid>
                </Grid>

                <TextField
                    required
                    label="휴대폰 번호"
                    fullWidth
                    placeholder="'-' 없이 숫자만 입력하세요"
                    inputProps={{ maxLength: 11, inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <Autocomplete
                    options={jobOptions}
                    renderInput={(params) => <TextField {...params} required label="직업" fullWidth />}
                />

                <Autocomplete
                    options={incomeOptions}
                    renderInput={(params) => <TextField {...params} required label="소득" fullWidth />}
                />
                <TextField required label="보험 가입 개수" type="number" fullWidth />
                <Button
                    color="orange"
                    variant="contained"
                    fullWidth
                    size="large"
                >
                    제출하기
                </Button>
            </Stack>
        </>
    );
}
