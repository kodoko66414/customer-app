import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1);

  // 新增訂單直接寫入 Firestore
  const addOrder = async (order) => {
    await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: serverTimestamp(),
      complete: false
    });
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