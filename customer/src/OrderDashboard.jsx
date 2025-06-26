import React, { useState } from "react";

const numToChinese = n => ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'][n-1] || n;

const OrderDashboard = ({ onClose, orders = [], completeOrder = () => {}, removeOrder = () => {} }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  // 如果所有訂單都完成，直接顯示沒有訂單
  if (orders.length > 0 && orders.every(o => o.complete)) {
    return <div style={{padding: 24}}>目前沒有訂單</div>;
  }

  const filteredOrders = showCompleted ? orders.filter(o => o.complete) : orders.filter(o => !o.complete);

  if (filteredOrders.length === 0) return <div style={{padding: 24}}>目前沒有{showCompleted ? '已完成' : '未完成'}訂單</div>;

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #eee", padding: 24, maxWidth: 420, margin: "32px auto" }}>
      <h2 style={{ textAlign: "center", fontSize: 32, marginBottom: 24 }}>訂單</h2>
      <button onClick={() => setShowCompleted(v => !v)} style={{ marginBottom: 18, background: '#007aff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 18 }}>
        {showCompleted ? '顯示未完成訂單' : '顯示已完成訂單'}
      </button>
      {filteredOrders.map((order, idx) => (
        <div key={order.orderId} style={{ border: "1px solid #eee", borderRadius: 12, marginBottom: 24, padding: 16, opacity: order.complete ? 0.7 : 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            {order.complete && <span style={{ color: '#0a0', fontSize: 22, marginRight: 6 }}>✔️</span>}
            訂單編號 {numToChinese(order.orderId)}
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 22, marginBottom: 4 }}>
              <span>{item.name} X{item.qty || 1}</span>
              <span>{item.price * (item.qty || 1)}</span>
            </div>
          ))}
          <div style={{ color: "#e00", fontWeight: "bold", fontSize: 24, margin: "12px 0" }}>總金額 {order.total}</div>
          {!order.complete && (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { completeOrder(orders.findIndex(o => o.orderId === order.orderId)); }} style={{ flex: 1, background: "#e00", color: "#fff", fontSize: 20, border: "none", borderRadius: 8, padding: 10 }}>完成訂單</button>
              <button onClick={() => removeOrder(orders.findIndex(o => o.orderId === order.orderId))} style={{ flex: 1, background: "#e00", color: "#fff", fontSize: 20, border: "none", borderRadius: 8, padding: 10 }}>刪除訂單</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderDashboard; 