import React from 'react';
import ExistingForm from './ExistingForm';
import NewForm from './NewForm';

function Form({ userType }) {
  if (userType === 'existing') return <ExistingForm />;
  if (userType === 'new') return <NewForm />;
  return null;
}

export default Form;
