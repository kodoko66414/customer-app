import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

function AdminOrderDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: 32, textAlign: 'center', marginBottom: 24 }}>店家訂單端</h1>
      {orders.length === 0 ? (
        <div style={{ fontSize: 22, textAlign: 'center' }}>目前沒有訂單</div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 16, marginBottom: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>訂單時間：{order.createdAt?.toDate?.().toLocaleString?.() || "無"}</div>
            <ul style={{ paddingLeft: 20 }}>
              {order.items.map((item, idx) => (
                <li key={idx} style={{ fontSize: 18 }}>
                  {item.name} x {item.qty}（NT${item.price}）
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 18, color: '#007aff', marginTop: 8 }}>總計：NT${order.total}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrderDashboard; 