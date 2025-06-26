import React, { useEffect, useState } from 'react';
import OrderDashboard from './OrderDashboard';
import { OrderProvider } from './OrderContext.jsx';

const DEMO_ORDER = [
  {
    orderId: 1,
    items: [{ name: '起司蛋餅', qty: 2, price: 55 }],
    total: 110,
    complete: false
  }
];

function AdminApp() {
  const [orders, setOrders] = useState([]);

  // 每次載入都檢查 localStorage，沒資料就自動塞一筆假訂單
  useEffect(() => {
    const stored = localStorage.getItem('orders');
    if (stored && stored !== '[]') {
      setOrders(JSON.parse(stored));
    } else {
      setOrders(DEMO_ORDER);
      localStorage.setItem('orders', JSON.stringify(DEMO_ORDER));
    }
    // 監聽 localStorage 變化（多分頁同步）
    const loadOrders = () => {
      const s = localStorage.getItem('orders');
      setOrders(s ? JSON.parse(s) : []);
    };
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
