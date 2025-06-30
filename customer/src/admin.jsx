import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

function AdminOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 完成訂單
  const handleComplete = async (orderId) => {
    if (!orderId) return;
    await updateDoc(doc(db, "orders", orderId), { complete: true });
  };
  // 刪除訂單
  const handleDelete = async (orderId) => {
    if (!orderId) return;
    await deleteDoc(doc(db, "orders", orderId));
  };

  // 計算今日營收
  const today = new Date().toISOString().slice(0, 10);
  const todayTotal = orders.filter(o => {
    if (!o.createdAt) return false;
    const d = o.createdAt.toDate ? o.createdAt.toDate().toISOString().slice(0, 10) : '';
    return d === today;
  }).reduce((sum, o) => sum + (o.total || 0), 0);

  // 切換顯示已完成/未完成
  const filteredOrders = showCompleted ? orders.filter(o => o.complete) : orders.filter(o => !o.complete);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <button onClick={() => setShowCompleted(v => !v)} style={{ position: 'absolute', left: 16, top: 24, fontSize: 18, background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, zIndex: 10 }}>
        {showCompleted ? '已完成' : '未完成'}
      </button>
      <h1 style={{ fontSize: 32, textAlign: 'center', marginBottom: 24, marginTop: 48 }}>店家訂單端</h1>
      <div style={{ position: 'absolute', top: 24, right: 24, fontSize: 20, color: '#007aff', fontWeight: 700 }}>
        今日營收：NT${todayTotal}
      </div>
      {filteredOrders.length === 0 ? (
        <div style={{ fontSize: 22, textAlign: 'center' }}>目前沒有訂單</div>
      ) : (
        filteredOrders.map(order => (
          <div key={order.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 16, marginBottom: 18, opacity: order.complete ? 0.6 : 1, position: 'relative' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>訂單編號：{order.orderId || '無'}<br/>訂單時間：{order.createdAt?.toDate?.().toLocaleString?.() || "無"}</div>
            <ul style={{ paddingLeft: 20 }}>
              {order.items.map((item, idx) => (
                <li key={idx} style={{ fontSize: 18 }}>
                  {item.name} x {item.qty}（NT${item.price}）
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 18, color: '#007aff', marginTop: 8 }}>總計：NT${order.total}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {!order.complete && <button onClick={() => handleComplete(order.id)} style={{ flex: 1, background: '#007aff', color: '#fff', fontSize: 18, fontWeight: 600, border: 'none', borderRadius: 12, padding: '12px 0' }}>完成</button>}
              <button onClick={() => handleDelete(order.id)} style={{ flex: 1, background: '#e00', color: '#fff', fontSize: 18, fontWeight: 600, border: 'none', borderRadius: 12, padding: '12px 0' }}>刪除</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrderDashboard; 