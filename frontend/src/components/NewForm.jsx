import {
    Stack,
    TextField,
    Autocomplete,
    Grid,
    Typography,
    Button,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const genderOptions = ['여성', '남성'];
const jobOptions = ['공무원', '교사', '대학생', '대학원생', '자영업자', '주부', '프리랜서', '회사원', '기타'];
const incomeOptions = ['1,000만원 이하', '1,000~2,000만원', '2,000~3,000만원', '3,000~4,000만원', '4,000~5,000만원', '5,000만원 이상'];
const marriedOptions = ['기혼', '미혼'];

export default function NewForm() {
    const [form, setForm] = useState({
        name: '',
        gender: '',
        age: '',
        married: '',
        address: '',
        addressDetail: '',
        phone: '',
        job: '',
        income: '',
        insuranceCount: '',
    });
    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            name: form.name,
            gender: form.gender === '남성' ? 'M' : 'F',
            age: Number(form.age),
            married: form.married === '기혼' ? 'Y' : 'N',
            address: form.address,
            address_detail: form.addressDetail,
            phone: form.phone,
            occupation: form.job,
            income_range: form.income,
            insurance_count: Number(form.insuranceCount) || 0,
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/customers`, payload);
            console.log('서버 응답:', res.data);

            const existing = JSON.parse(localStorage.getItem('members') || '[]');
            const updated = [...existing, form];
            localStorage.setItem('members', JSON.stringify(updated));

            navigate('/success');
        } catch (error) {
            console.error('제출 실패:', error);
            alert('제출 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <Typography variant="h5" gutterBottom>신규회원 정보 입력</Typography>
            <Stack spacing={3} mt={4}>
                <TextField
                    required label="이름" fullWidth
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />

                <Autocomplete
                    options={genderOptions}
                    value={form.gender}
                    onChange={(_, value) => handleChange('gender', value || '')}
                    renderInput={(params) => <TextField {...params} required label="성별" fullWidth />}
                />

                <TextField
                    required label="나이" type="number" fullWidth
                    value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                />

                <Autocomplete
                    options={marriedOptions}
                    value={form.married}
                    onChange={(_, value) => handleChange('married', value || '')}
                    renderInput={(params) => <TextField {...params} required label="결혼 여부" fullWidth />}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required label="주소" fullWidth
                            value={form.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required label="상세 주소" fullWidth
                            value={form.addressDetail}
                            onChange={(e) => handleChange('addressDetail', e.target.value)}
                        />
                    </Grid>
                </Grid>

                <TextField
                    required
                    label="휴대폰 번호"
                    fullWidth
                    inputProps={{ maxLength: 11, inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                />

                <Autocomplete
                    options={jobOptions}
                    value={form.job}
                    onChange={(_, value) => handleChange('job', value || '')}
                    renderInput={(params) => <TextField {...params} required label="직업" fullWidth />}
                />

                <Autocomplete
                    options={incomeOptions}
                    value={form.income}
                    onChange={(_, value) => handleChange('income', value || '')}
                    renderInput={(params) => <TextField {...params} required label="소득" fullWidth />}
                />

                <TextField
                    required
                    label="보험 가입 개수"
                    type="number"
                    fullWidth
                    value={form.insuranceCount}
                    onChange={(e) => handleChange('insuranceCount', e.target.value)}
                />

                <Button
                    color='orange'
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                >
                    제출하기
                </Button>
            </Stack>
        </>
    );
}
