import * as React from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from '@mui/material';
import Form from './Form';

export default function Home() {
  const [userType, setUserType] = React.useState('');

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <FormControl component="fieldset">
        <FormLabel component="legend">회원형태</FormLabel>
        <RadioGroup
          row
          aria-label="user-type"
          name="user-type"
          value={userType}
          onChange={handleChange}
        >
          <FormControlLabel value="existing" control={<Radio />} label="기존 회원" />
          <FormControlLabel value="new" control={<Radio />} label="신규 회원" />
        </RadioGroup>
      </FormControl>

      <Box mt={5}>
        <Form userType={userType} />
      </Box>
    </Box>
  );
}
