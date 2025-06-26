import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1);

  const addOrder = (order) => {
    const orderId = orderCounter;
    setOrders((prev) => [...prev, { ...order, orderId }]);
    setOrderCounter((prev) => prev + 1);
  };
  const removeOrder = (index) => setOrders((prev) => prev.filter((_, i) => i !== index));
  const completeOrder = (index) => setOrders((prev) => prev.map((order, i) => i === index ? { ...order, complete: true } : order));

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder, completeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}; 