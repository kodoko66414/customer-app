import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

function fixOrder(order) {
  const createdAt = order.createdAt || new Date().toISOString().slice(0, 10);
  const total = (typeof order.total === 'number') ? order.total : (order.items?.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) || 0);
  const orderId = typeof order.orderId === 'number' ? order.orderId : 1;
  return { ...order, createdAt, total, orderId };
}

function getMaxOrderId(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return Math.max(...arr.map(o => typeof o.orderId === 'number' ? o.orderId : 0));
}

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Firestore 實時監聽訂單
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(docSnap => ({ ...docSnap.data(), _id: docSnap.id })));
    });
    return () => unsubscribe();
  }, []);

  // 完成訂單
  const completeOrder = useCallback(async (index) => {
    const order = orders[index];
    if (!order || !order._id) return;
    await updateDoc(doc(db, "orders", order._id), { complete: true });
  }, [orders]);

  // 刪除訂單
  const removeOrder = useCallback(async (index) => {
    const order = orders[index];
    if (!order || !order._id) return;
    await deleteDoc(doc(db, "orders", order._id));
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder: null, removeOrder, completeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}; 