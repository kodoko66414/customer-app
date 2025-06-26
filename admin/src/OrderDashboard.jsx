import React, { useState } from "react";
import { useOrders } from "./OrderContext";

const numToChinese = n => ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'][n-1] || n;

const OrderDashboard = ({ onClose, orders: propOrders, completeOrder: propCompleteOrder, removeOrder: propRemoveOrder }) => {
  const context = useOrders ? useOrders() : {};
  const orders = propOrders || context.orders || [];
  const completeOrder = propCompleteOrder || context.completeOrder || (()=>{});
  const removeOrder = propRemoveOrder || context.removeOrder || (()=>{});
  const [showCompleted, setShowCompleted] = useState(false);

  if (orders.length > 0 && orders.every(o => o.complete)) {
    return <div style={{padding: 24}}>目前沒有訂單</div>;
  }

  const filteredOrders = showCompleted ? orders.filter(o => o.complete) : orders.filter(o => !o.complete);

  if (filteredOrders.length === 0) {
    return <div style={{padding: 32, textAlign: 'center', color: '#888', fontSize: 20}}>目前沒有{showCompleted ? '已完成' : '未完成'}訂單</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #eee", padding: 24, maxWidth: 420, margin: "32px auto" }}>
      <h2 style={{ textAlign: "center", fontSize: 32, marginBottom: 24 }}>訂單</h2>
      <button onClick={() => setShowCompleted(v => !v)} style={{ marginBottom: 18, background: '#007aff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 18 }}>
        {showCompleted ? '顯示未完成訂單' : '顯示已完成訂單'}
      </button>
      {filteredOrders.map((order, idx) => (
        <div key={order.orderId || idx} style={{ border: "1px solid #eee", borderRadius: 12, marginBottom: 24, padding: 16, opacity: order.complete ? 0.7 : 1 }}>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 22, marginBottom: 4 }}>
              <span>{item.name} X{item.qty || 1}</span>
              <span>{item.price * (item.qty || 1)}</span>
            </div>
          ))}
          {!order.complete && (
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button onClick={() => { completeOrder(orders.findIndex(o => o === order)); }} style={{ flex: 1, background: "#e00", color: "#fff", fontSize: 20, border: "none", borderRadius: 8, padding: 10 }}>完成訂單</button>
              <button onClick={() => removeOrder(orders.findIndex(o => o === order))} style={{ flex: 1, background: "#e00", color: "#fff", fontSize: 20, border: "none", borderRadius: 8, padding: 10 }}>刪除訂單</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderDashboard; 