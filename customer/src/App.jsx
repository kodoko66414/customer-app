import React, { useState, useEffect } from 'react';
import Home from './Home'; // 顧客點餐
import AdminOrderDashboard from './admin.jsx'; // 店家訂單
import AdminPanel from './AdminPanel'; // 店家後台

const TABS = [
  { key: 'customer', label: '顧客點餐' },
  { key: 'dashboard', label: '店家訂單' },
  { key: 'admin', label: '店家後台' },
];

// 假設有 1000 家店家資料
const STORES = Array.from({ length: 1000 }).map((_, i) => ({
  id: String(1000 + i),
  name: `第${i + 1}家分店`,
  logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${i + 1}` // 用隨機頭像做示意
}));

function StoreSelect({ onSelect }) {
  const [search, setSearch] = useState('');
  const filtered = STORES.filter(s => s.name.includes(search) || s.id.includes(search));
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontSize: 36, margin: '32px 0 16px 0', fontWeight: 700 }}>請選擇店家</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋店名或編號" style={{ fontSize: 20, padding: 12, borderRadius: 12, border: '1px solid #ccc', marginBottom: 24, width: 260 }} />
      <div style={{ maxHeight: 400, overflowY: 'auto', width: 320 }}>
        {filtered.slice(0, 30).map(store => (
          <div key={store.id} onClick={() => onSelect(store)} style={{ cursor: 'pointer', background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px #eee', marginBottom: 18, padding: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
            <img src={store.logo} alt="logo" style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', background: '#eee' }} />
            <div style={{ fontSize: 26, fontWeight: 700 }}>{store.name}</div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: '#888', fontSize: 20, textAlign: 'center' }}>查無店家</div>}
      </div>
    </div>
  );
}

function StoreInfo({ store }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div style={{ width: '100%', height: 220, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, boxShadow: '0 2px 12px #eee', marginBottom: 32 }}>
        <img src={store.logo} alt="logo" style={{ width: 160, height: 160, borderRadius: 32, objectFit: 'cover', background: '#eee' }} />
      </div>
      <div style={{ fontSize: 44, fontWeight: 900, marginTop: 24, letterSpacing: 2 }}>{store.name}</div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('customer');
  const [store, setStore] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('selected_store');
    if (saved) setStore(JSON.parse(saved));
  }, []);

  const handleSelectStore = s => {
    setStore(s);
    localStorage.setItem('selected_store', JSON.stringify(s));
  };

  if (!store) {
    return <StoreSelect onSelect={handleSelectStore} />;
  }

  // 可選：進入主 app 前顯示一次店家資訊
  // return <StoreInfo store={store} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        {tab === 'customer' && <Home />}
        {tab === 'dashboard' && <AdminOrderDashboard />}
        {tab === 'admin' && <AdminPanel />}
      </div>
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: '#fff', boxShadow: '0 -2px 8px #eee', display: 'flex', justifyContent: 'space-around', padding: '16px 0', zIndex: 100 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              fontSize: 24,
              padding: '18px 0',
              border: 'none',
              background: tab === t.key ? '#007aff' : '#f5f5f7',
              color: tab === t.key ? '#fff' : '#333',
              borderRadius: 0,
              fontWeight: 700,
              transition: 'background 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}