import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import OrderDashboard from './OrderDashboard';

function AdminApp() {
  const [orders, setOrders] = useState([]);

  // 從 localStorage 讀取訂單
  useEffect(() => {
    const stored = localStorage.getItem('orders');
    if (stored) setOrders(JSON.parse(stored));
  }, []);

  // 完成/刪除訂單時同步 localStorage
  const completeOrder = (index) => {
    const newOrders = orders.map((o, i) => i === index ? { ...o, complete: true } : o);
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };
  const removeOrder = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  // 傳給 OrderDashboard 的 props
  return <OrderDashboard orders={orders} completeOrder={completeOrder} removeOrder={removeOrder} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />); 