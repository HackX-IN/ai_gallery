import React, { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentId, setPaymentId] = useState(null);

  return (
    <PaymentContext.Provider value={{ paymentId, setPaymentId }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  return useContext(PaymentContext);
};
