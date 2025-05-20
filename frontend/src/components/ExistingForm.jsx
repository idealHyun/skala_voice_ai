import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Box,
    Typography,
    Stack,
    Grid,
    Autocomplete,
} from '@mui/material';

const mockCustomers = [
    {
        id: 1,
        name: '홍길동',
        age: 40,
        gender: 'F',
        married: 'Y',
        address: '경기도',
        phone: '010-1234-1234',
        job: '회사원',
        income: '2,000~3,000만원',
        insuranceCount: 3,
    },
];

const jobOptions = ['공무원', '교사', '대학생', '대학원생', '자영업자', '주부', '프리랜서', '회사원', '기타'];
const incomeOptions = ['1,000만원 이하', '1,000~2,000만원', '2,000~3,000만원', '3,000~4,000만원', '4,000~5,000만원', '5,000만원 이상'];

function CustomerDisplayForm({ customer, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [edited, setEdited] = useState({ ...customer });
    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setEdited((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        setIsEditing(false);
        onUpdate(edited);
    };

    return (
        <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="outlined"
                    onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                >
                    {isEditing ? '수정 완료' : '수정하기'}
                </Button>
            </Box>

            <Box mt={3} mb={5}>
                <Typography variant="h5" gutterBottom>고객 정보</Typography>
                <Stack spacing={3} mt={2}>
                    <TextField
                        label="이름"
                        fullWidth
                        value={edited.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        InputProps={{ disabled: !isEditing }}
                    />

                    <Autocomplete
                        options={['여성', '남성']}
                        value={edited.gender === 'F' ? '여성' : '남성'}
                        onChange={(_, value) => handleChange('gender', value === '여성' ? 'F' : 'M')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="성별"
                                fullWidth
                                InputProps={{ ...params.InputProps, disabled: !isEditing }}
                            />
                        )}
                        disableClearable
                        disabled={!isEditing}
                    />

                    <TextField
                        label="나이"
                        type="number"
                        fullWidth
                        value={edited.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        InputProps={{ disabled: !isEditing }}
                    />

                    <Autocomplete
                        options={['기혼', '미혼']}
                        value={edited.married === 'Y' ? '기혼' : '미혼'}
                        onChange={(_, value) => handleChange('married', value === '기혼' ? 'Y' : 'N')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="결혼 여부"
                                fullWidth
                                InputProps={{ ...params.InputProps, disabled: !isEditing }}
                            />
                        )}
                        disableClearable
                        disabled={!isEditing}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="주소"
                                fullWidth
                                value={edited.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                InputProps={{ disabled: !isEditing }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="상세 주소"
                                fullWidth
                                value="-"
                                InputProps={{ disabled: true }}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label="휴대폰 번호"
                        fullWidth
                        value={edited.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        InputProps={{ disabled: !isEditing }}
                    />

                    <Autocomplete
                        options={jobOptions}
                        value={edited.job}
                        onChange={(_, value) => handleChange('job', value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="직업"
                                fullWidth
                                InputProps={{ ...params.InputProps, disabled: !isEditing }}
                            />
                        )}
                        disableClearable
                        disabled={!isEditing}
                    />

                    <Autocomplete
                        options={incomeOptions}
                        value={edited.income}
                        onChange={(_, value) => handleChange('income', value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="소득"
                                fullWidth
                                InputProps={{ ...params.InputProps, readOnly: !isEditing }}
                            />
                        )}
                        disableClearable
                        disabled={!isEditing}
                    />

                    <TextField
                        label="보험 가입 개수"
                        fullWidth
                        value={edited.insuranceCount}
                        onChange={(e) => handleChange('insuranceCount', e.target.value)}
                        InputProps={{ disabled: !isEditing }}
                    />

                    <Button
                        variant="contained"
                        color="orange"
                        fullWidth
                        size="large"
                        onClick={() => navigate('/upload')}
                    >
                        다음
                    </Button>
                </Stack>
            </Box>
        </>
    );
}

function ExistingForm() {
    const [name, setName] = useState('');
    const [phoneSuffix, setPhoneSuffix] = useState('');
    const [customer, setCustomer] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        const found = mockCustomers.find(
            (c) => c.name === name && c.phone.endsWith(phoneSuffix)
        );
        setCustomer(found || null);
        setSearched(true);
    };

    const handleUpdate = (updatedCustomer) => {
        setCustomer(updatedCustomer);
        console.log('Updated:', updatedCustomer);
    };

    return (
        <Box maxWidth={700} mx="auto">
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TextField
                    label="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="휴대폰 뒷 4자리"
                    value={phoneSuffix}
                    onChange={(e) => setPhoneSuffix(e.target.value)}
                    fullWidth
                />
                <Button
                    color="orange"
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSearch}
                >
                    조회
                </Button>
            </Stack>

            {searched && (
                <>
                    {customer ? (
                        <CustomerDisplayForm customer={customer} onUpdate={handleUpdate} />
                    ) : (
                        <Typography color="error">고객 정보를 찾을 수 없습니다.</Typography>
                    )}
                </>
            )}
        </Box>
    );
}

export default ExistingForm;
