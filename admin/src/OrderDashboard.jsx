import React, { useState } from "react";
import { useOrders } from "./OrderContext";

const numToChinese = n => ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'][n-1] || n;

const OrderDashboard = ({ onClose, orders: propOrders, completeOrder: propCompleteOrder, removeOrder: propRemoveOrder }) => {
  const context = useOrders ? useOrders() : {};
  const orders = propOrders || context.orders || [];
  const completeOrder = propCompleteOrder || context.completeOrder || (()=>{});
  const removeOrder = propRemoveOrder || context.removeOrder || (()=>{});
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredOrders = showCompleted ? orders.filter(o => o.complete) : orders.filter(o => !o.complete);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCompletedOrders = orders.filter(o => o.complete && o.createdAt === todayStr);
  const todayTotal = todayCompletedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px #eee",
      padding: 24,
      maxWidth: 600,
      margin: "32px 8px 32px 8px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center"
    }}>
      <h2 style={{ textAlign: "left", fontSize: 36, marginBottom: 32, width: '100%' }}>訂單</h2>
      {showCompleted && (
        <div style={{ width: '100%', marginBottom: 18, fontSize: 28, fontWeight: 700, color: '#007aff', textAlign: 'left' }}>
          今天總營業額：<span style={{ color: '#e00', fontWeight: 800 }}>{todayTotal}</span>
        </div>
      )}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={() => setShowCompleted(v => !v)} style={{ marginBottom: 28, background: '#007aff', color: '#fff', border: 'none', borderRadius: 12, padding: '18px 36px', fontSize: 26, fontWeight: 600, display: 'block' }}>
          {showCompleted ? '顯示未完成訂單' : '顯示已完成訂單'}
        </button>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'flex-start', justifyContent: 'center' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ border: "2px solid #eee", borderRadius: 18, minHeight: 180, minWidth: 280, background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#bbb', fontWeight: 500, width: '100%' }}>
            暫無訂單
          </div>
        ) : (
          filteredOrders.map((order, idx) => (
            <div key={order.orderId || idx} style={{ border: "2px solid #eee", borderRadius: 18, background: '#fafbfc', padding: 32, minWidth: 280, width: '100%', maxWidth: 520, margin: '0 auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: 32, marginBottom: 22, letterSpacing: 2, textAlign: 'left', width: '100%' }}>訂單{numToChinese(idx+1)}</div>
              <div style={{ width: '100%', marginBottom: 8 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 28, marginBottom: 12 }}>
                    <span>{item.name} X{item.qty || 1}</span>
                    <span>{item.price * (item.qty || 1)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 18px 0' }}>
                <span style={{ color: "#e00", fontWeight: "bold", fontSize: 30, textAlign: 'left' }}>總計</span>
                <span style={{ color: "#e00", fontWeight: "bold", fontSize: 30, textAlign: 'right' }}>{order.total}</span>
              </div>
              {order.complete ? (
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginTop: 22, marginBottom: 8 }}>
                  <span style={{ flex: 1, color: '#007aff', fontWeight: 700, fontSize: 26, textAlign: 'center' }}>已完成</span>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 22, marginTop: 22, width: '100%' }}>
                  <button onClick={() => { completeOrder(orders.findIndex(o => o === order)); }} style={{ flex: 1, background: "#e00", color: "#fff", fontSize: 26, fontWeight: 600, border: "none", borderRadius: 12, padding: '22px 0' }}>完成訂單</button>
                </div>
              )}
              <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
                <button onClick={() => removeOrder(orders.findIndex(o => o === order))} style={{ flex: 1, background: "#888", color: "#fff", fontSize: 22, fontWeight: 600, border: "none", borderRadius: 12, padding: '16px 0' }}>刪除訂單</button>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          h2 { font-size: 28px !important; text-align: left !important; }
          button { font-size: 22px !important; padding: 22px 0 !important; }
          div[style*='border: 2px solid'] { font-size: 24px !important; min-width: 98vw !important; max-width: 98vw !important; padding: 8vw !important; }
          div[style*='font-size: 32px'] { font-size: 26px !important; text-align: left !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderDashboard; 