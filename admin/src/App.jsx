import React, { useEffect, useState } from 'react';
import OrderDashboard from './OrderDashboard';
import { OrderProvider } from './OrderContext.jsx';

function AdminApp() {
  const [orders, setOrders] = useState([]);

  // 從 localStorage 讀取訂單，並監聽 localStorage 變化
  useEffect(() => {
    const loadOrders = () => {
      const stored = localStorage.getItem('orders');
      if (stored) setOrders(JSON.parse(stored));
      else setOrders([]);
    };
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  // 完成/刪除訂單時同步 localStorage
  const completeOrder = (index) => {
    setOrders(prev => {
      const newOrders = prev.map((o, i) => i === index ? { ...o, complete: true } : o);
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  };
  const removeOrder = (index) => {
    setOrders(prev => {
      const newOrders = prev.filter((_, i) => i !== index);
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  };

  return (
    <OrderProvider>
      <OrderDashboard orders={orders} completeOrder={completeOrder} removeOrder={removeOrder} />
    </OrderProvider>
  );
}

export default AdminApp;
