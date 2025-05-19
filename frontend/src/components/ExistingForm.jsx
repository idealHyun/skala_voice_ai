import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
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
        income: 4000,
        insuranceCount: 3,
    },
];

function CustomerDisplayForm({ customer, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [edited, setEdited] = useState({ ...customer });

    const handleChange = (key, value) => {
        setEdited((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        setIsEditing(false);
        onUpdate(edited);
    };

    return (
        <>
            <Typography variant="h5" gutterBottom marginTop={5}>고객 정보</Typography>
            <Stack spacing={3} mt={4}>
                <TextField
                    label="이름"
                    fullWidth
                    value={edited.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    InputProps={{ readOnly: !isEditing }}
                />

                <Autocomplete
                    options={['여성', '남성']}
                    value={edited.gender === 'F' ? '여성' : '남성'}
                    onChange={(_, value) =>
                        handleChange('gender', value === '여성' ? 'F' : 'M')
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="성별"
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                readOnly: !isEditing,
                            }}
                        />
                    )}
                    disableClearable
                    readOnly={!isEditing}
                />

                <TextField
                    label="나이"
                    type="number"
                    fullWidth
                    value={edited.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    InputProps={{ readOnly: !isEditing }}
                />

                <Autocomplete
                    options={['기혼', '미혼']}
                    value={edited.married === 'Y' ? '기혼' : '미혼'}
                    onChange={(_, value) =>
                        handleChange('married', value === '기혼' ? 'Y' : 'N')
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="결혼 여부"
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                readOnly: !isEditing,
                            }}
                        />
                    )}
                    disableClearable
                    readOnly={!isEditing}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="주소"
                            fullWidth
                            value={edited.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            InputProps={{ readOnly: !isEditing }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="상세 주소"
                            fullWidth
                            value="-"
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                </Grid>

                <TextField
                    label="휴대폰 번호"
                    fullWidth
                    value={edited.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    InputProps={{ readOnly: !isEditing }}
                />

                <TextField
                    label="직업"
                    fullWidth
                    value={edited.job}
                    onChange={(e) => handleChange('job', e.target.value)}
                    InputProps={{ readOnly: !isEditing }}
                />

                <TextField
                    label="소득"
                    fullWidth
                    value={edited.income}
                    onChange={(e) => handleChange('income', e.target.value)}
                    InputProps={{ readOnly: !isEditing }}
                />

                <TextField
                    label="보험 가입 개수"
                    fullWidth
                    value={edited.insuranceCount}
                    onChange={(e) => handleChange('insuranceCount', e.target.value)}
                    InputProps={{ readOnly: !isEditing }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                >
                    {isEditing ? '수정 완료' : '수정하기'}
                </Button>
            </Stack>
        </>
    );
}

// ✅ 메인 컴포넌트
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
