import React, { useState } from "react";
import { useOrders } from "./OrderContext";

const numToChinese = n => ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'][n-1] || n;

const OrderDashboard = ({ onClose, orders: propOrders, completeOrder: propCompleteOrder, removeOrder: propRemoveOrder }) => {
  const context = useOrders ? useOrders() : {};
  const orders = propOrders || context.orders || [];
  const completeOrder = propCompleteOrder || context.completeOrder || (()=>{});
  const removeOrder = propRemoveOrder || context.removeOrder || (()=>{});
  const [showCompleted, setShowCompleted] = useState(false);

  function getDateString(dateVal) {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') return dateVal.slice(0, 10);
    if (dateVal.toDate) return dateVal.toDate().toISOString().slice(0, 10);
    return '';
  }
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCompletedOrders = orders.filter(o => o.complete && getDateString(o.createdAt) === todayStr);
  const todayTotal = todayCompletedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const filteredOrders = showCompleted
    ? orders.filter(o => o.complete).sort((a, b) => (getDateString(b.createdAt) > getDateString(a.createdAt) ? 1 : -1))
    : orders.filter(o => !o.complete);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px #eee",
      padding: 24,
      maxWidth: '98vw',
      minWidth: 0,
      margin: "0 auto 24px auto",
      paddingTop: 8,
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: filteredOrders.length === 0 ? "center" : "flex-start",
      boxSizing: 'border-box',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <button onClick={() => setShowCompleted(v => !v)} style={{ position: 'absolute', left: 4, top: 16, fontSize: 13, background: '#eee', color: '#333', border: 'none', borderRadius: 5, padding: '4px 10px', fontWeight: 600, zIndex: 10 }}>
        {showCompleted ? '已完成' : '未完成'}
      </button>
      <h2 style={{ textAlign: "center", fontSize: 32, marginBottom: 28, width: '100%' }}>訂單</h2>
      {showCompleted && (
        <div style={{ width: '100%', marginBottom: 18, fontSize: 24, fontWeight: 700, color: '#007aff', textAlign: 'center' }}>
          今天總營業額：<span style={{ color: '#e00', fontWeight: 800 }}>{todayTotal}</span>
        </div>
      )}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => setShowCompleted(v => !v)} style={{ display: 'none' }} />
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
        {filteredOrders.length === 0 ? (
          <div style={{ border: "2px solid #eee", borderRadius: 16, minHeight: 80, minWidth: '40vw', maxWidth: '80vw', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#bbb', fontWeight: 500, marginLeft: 0, padding: '32px 8px', margin: '0 auto' }}>
            暫無訂單
          </div>
        ) : (
          filteredOrders.map((order, idx) => (
            <div key={order.orderId || idx} style={{ border: "2px solid #eee", borderRadius: 18, background: '#fafbfc', padding: 24, minWidth: 180, maxWidth: 340, width: '100%', margin: '0 auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 'bold', fontSize: 26, marginBottom: 16, letterSpacing: 2, textAlign: 'left', width: '100%' }}>訂單{numToChinese(idx+1)}</div>
              <div style={{ width: '100%', marginBottom: 8 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 20, marginBottom: 8 }}>
                    <span>{item.name} X{item.qty || 1}</span>
                    <span>{item.price * (item.qty || 1)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px 0' }}>
                <span style={{ color: "#e00", fontWeight: "bold", fontSize: 22, textAlign: 'left' }}>總計</span>
                <span style={{ color: "#e00", fontWeight: "bold", fontSize: 22, textAlign: 'right' }}>{order.total}</span>
              </div>
              <div style={{ display: 'flex', width: '100%', gap: 12, marginTop: 10 }}>
                <button onClick={() => completeOrder(orders.findIndex(o => o === order))} style={{ flex: 1, background: '#007aff', color: '#fff', fontSize: 18, fontWeight: 600, border: 'none', borderRadius: 12, padding: '14px 0' }}>完成</button>
                <button onClick={() => removeOrder(orders.findIndex(o => o === order))} style={{ flex: 1, background: '#e00', color: '#fff', fontSize: 18, fontWeight: 600, border: 'none', borderRadius: 12, padding: '14px 0' }}>刪除</button>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          h2 { font-size: 20px !important; text-align: center !important; }
          button { font-size: 16px !important; padding: 12px 0 !important; }
          div[style*='border: 2px solid'] { font-size: 16px !important; min-width: 80vw !important; max-width: 80vw !important; padding: 6vw 2vw !important; }
          div[style*='font-size: 26px'] { font-size: 18px !important; text-align: left !important; }
          html, body { overflow-x: hidden !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderDashboard; 