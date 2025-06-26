import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

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
  const [orders, setOrdersState] = useState([]);
  const ordersRef = useRef([]);

  // 初始化時從 localStorage 讀取並補齊欄位
  useEffect(() => {
    const s = localStorage.getItem('orders');
    let arr = [];
    try {
      arr = s ? JSON.parse(s) : [];
      arr = Array.isArray(arr) ? arr.map(fixOrder) : [];
    } catch {
      arr = [];
    }
    setOrdersState(arr);
    ordersRef.current = arr;
    localStorage.setItem('orders', JSON.stringify(arr));
  }, []);

  // 每5秒自動偵測 localStorage，有新訂單只 append，並補齊欄位
  useEffect(() => {
    const interval = setInterval(() => {
      const s = localStorage.getItem('orders');
      let arr = [];
      try {
        arr = s ? JSON.parse(s) : [];
        arr = Array.isArray(arr) ? arr.map(fixOrder) : [];
      } catch {
        arr = [];
      }
      // 只 append 新的（根據 orderId 判斷）
      const existingIds = new Set(ordersRef.current.map(o => o.orderId));
      const newOrders = arr.filter(o => !existingIds.has(o.orderId));
      if (newOrders.length > 0) {
        setOrdersState(prev => {
          const merged = [...prev, ...newOrders];
          ordersRef.current = merged;
          localStorage.setItem('orders', JSON.stringify(merged));
          return merged;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 新增訂單
  const addOrder = useCallback((order) => {
    setOrdersState(prev => {
      const s = localStorage.getItem('orders');
      let arr = [];
      try {
        arr = s ? JSON.parse(s) : [];
        arr = Array.isArray(arr) ? arr : [];
      } catch {
        arr = [];
      }
      const maxOrderId = getMaxOrderId(arr.length > prev.length ? arr : prev);
      const orderId = maxOrderId + 1;
      const today = new Date();
      const createdAt = today.toISOString().slice(0, 10);
      const total = order.items?.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) || 0;
      const newOrder = { ...order, orderId, createdAt, total, complete: false };
      const newArr = [...prev, newOrder];
      localStorage.setItem('orders', JSON.stringify(newArr));
      ordersRef.current = newArr;
      return newArr;
    });
  }, []);

  // 完成訂單
  const completeOrder = useCallback((index) => {
    setOrdersState(prev => {
      const newArr = prev.map((order, i) => i === index ? { ...order, complete: true } : order).map(fixOrder);
      localStorage.setItem('orders', JSON.stringify(newArr));
      ordersRef.current = newArr;
      return newArr;
    });
  }, []);

  // 刪除訂單
  const removeOrder = useCallback((index) => {
    setOrdersState(prev => {
      const newArr = prev.filter((_, i) => i !== index).map(fixOrder);
      localStorage.setItem('orders', JSON.stringify(newArr));
      ordersRef.current = newArr;
      return newArr;
    });
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder, completeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}; 