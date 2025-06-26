import React, { useEffect, useState } from 'react';
import OrderDashboard from './OrderDashboard';
import { OrderProvider } from './OrderContext.jsx';

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

  return (
    <OrderProvider>
      <OrderDashboard orders={orders} completeOrder={completeOrder} removeOrder={removeOrder} />
    </OrderProvider>
  );
}

export default AdminApp;
