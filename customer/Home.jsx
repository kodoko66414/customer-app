import React, { useState } from 'react';

const menu = [
  { id: 1, name: '起司蛋餅', price: 55, img: 'https://i.imgur.com/0y8Ftya.jpg' },
  { id: 2, name: '火腿蛋吐司', price: 45, img: 'https://i.imgur.com/8Km9tLL.jpg' },
  { id: 3, name: '蘿蔔糕', price: 35, img: 'https://i.imgur.com/1bX5QH6.jpg' },
  { id: 4, name: '鮪魚蛋餅', price: 60, img: 'https://i.imgur.com/2nCt3Sbl.jpg' },
  { id: 5, name: '玉米濃湯', price: 30, img: 'https://i.imgur.com/9g7i1vQ.jpg' },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  if (showCart) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 16 }}>購物車</h2>
        {cart.length === 0 ? <div style={{ fontSize: 24, textAlign: 'center' }}>尚未加入任何商品</div> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 8 }}>
                <img src={item.img} alt={item.name} style={{ width: 48, height: 48, borderRadius: 12, marginRight: 12 }} />
                <span style={{ fontSize: 22, flex: 1 }}>{item.name}</span>
                <span style={{ fontSize: 20, color: '#ff4d30', marginRight: 8 }}>NT${item.price}</span>
                <button onClick={() => setCart(cart.filter((_, j) => j !== i))} style={{ fontSize: 18, border: 'none', background: '#eee', borderRadius: 8, padding: '2px 8px' }}>刪除</button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ fontSize: 24, textAlign: 'right', margin: '16px 0' }}>
          總計：NT${cart.reduce((sum, item) => sum + item.price, 0)}
        </div>
        <button style={{ width: '100%', fontSize: 24, padding: 16, borderRadius: 16, background: '#007aff', color: '#fff', border: 'none', marginBottom: 12 }}>送出訂單</button>
        <button style={{ width: '100%', fontSize: 20, padding: 12, borderRadius: 12, background: '#f5f5f5', color: '#333', border: 'none' }} onClick={() => setShowCart(false)}>返回菜單</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: 36, textAlign: 'center', marginBottom: 24 }}>菜單</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {menu.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16 }}>
            <img src={item.img} alt={item.name} style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 16, marginBottom: 12 }} />
            <div style={{ fontSize: 28, color: '#222', marginBottom: 8 }}>{item.name}</div>
            <div style={{ fontSize: 22, color: '#ff4d30', marginBottom: 12 }}>NT${item.price}</div>
            <button onClick={() => addToCart(item)} style={{ fontSize: 20, padding: '10px 24px', borderRadius: 14, background: '#007aff', color: '#fff', border: 'none', marginBottom: 4 }}>加入購物車</button>
          </div>
        ))}
      </div>
      <button style={{ width: '100%', fontSize: 22, padding: 14, borderRadius: 14, background: '#ff9500', color: '#fff', border: 'none', marginTop: 32 }} onClick={() => setShowCart(true)}>
        購物車（{cart.length}）
      </button>
    </div>
  );
} 