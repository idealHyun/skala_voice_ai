import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from '@mui/material';
import ExistingForm from './ExistingForm';
import NewForm from './NewForm';

export default function Form() {
  const [userType, setUserType] = useState('');

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <FormControl component="fieldset">
        <FormLabel component="legend">회원형태</FormLabel>
        <RadioGroup
          row
          name="user-type"
          value={userType}
          onChange={handleChange}
        >
          <FormControlLabel value="existing" control={<Radio />} label="기존 회원" />
          <FormControlLabel value="new" control={<Radio />} label="신규 회원" />
        </RadioGroup>
      </FormControl>

      <Box mt={5}>
        {userType === 'existing' && <ExistingForm />}
        {userType === 'new' && <NewForm />}
        {!userType && (
          <Typography variant="body2" color="textSecondary">
            회원 유형을 선택해 주세요.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
