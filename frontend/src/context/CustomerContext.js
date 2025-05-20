import { createContext, useContext, useState } from 'react';

export const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  return (
    <CustomerContext.Provider value={{ customer, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);