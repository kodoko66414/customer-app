import React, { useState } from 'react';
import { getMenu } from './menuData';

function readMenuFile(file, cb) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      cb(data);
    } catch (err) {
      alert('菜單檔案格式錯誤');
    }
  };
  reader.readAsText(file);
}

// 新增：讀取 txt 檔案
function readTxtFile(file, cb) {
  const reader = new FileReader();
  reader.onload = e => {
    cb(e.target.result);
  };
  reader.readAsText(file, 'utf-8');
}

// 新增：讀取 doc/docx 檔案（用 mammoth 轉純文字）
async function readDocFile(file, cb) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.convertToPlainText({ arrayBuffer });
  cb(value);
}

export default function AdminPanel() {
  const [menu, setMenu] = useState(getMenu());
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      readTxtFile(file, text => parseTextToMenu(text));
      return;
    }
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      setOcrLoading(true);
      await readDocFile(file, text => {
        setOcrLoading(false);
        parseTextToMenu(text);
      });
      return;
    }
    // JSON 檔案
    readMenuFile(file, data => {
      if (Array.isArray(data)) {
        setMenu(data);
      } else if (data.menu) {
        setMenu(data.menu);
      } else {
        alert('菜單格式錯誤');
      }
    });
  };

  // 將純文字內容轉為菜單陣列
  function parseTextToMenu(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = lines.map(line => {
      const match = line.match(/(.+?)\s*(\d+)$/);
      if (match) return { name: match[1], price: Number(match[2]), id: Math.random() };
      return null;
    }).filter(Boolean);
    if (parsed.length) setMenu(parsed);
    else alert('無法從檔案辨識出菜單，請確認內容格式。');
  }

  const handleInputChange = e => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    setMenu([...menu, { ...newItem, id: menu.length + 1, price: Number(newItem.price) }]);
    setNewItem({ name: '', price: '' });
  };

  const handleEditItem = (idx, field, value) => {
    setMenu(menu.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleDeleteItem = idx => {
    const newMenu = menu.filter((_, i) => i !== idx);
    setMenu(newMenu);
    localStorage.setItem('shared_menu', JSON.stringify(newMenu));
  };

  const handleSurvey = () => {
    window.open('https://forms.gle/GFCu6dvxYtS8DhDr7', '_blank');
  };

  React.useEffect(() => {
    localStorage.setItem('shared_menu', JSON.stringify(menu));
  }, [menu]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #eee', minHeight: 600, paddingBottom: 120 }}>
      <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 24, marginTop: 48 }}>店家後台 - 菜單管理</h2>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 18, fontWeight: 600 }}>上傳菜單 JSON、Word、txt：</label>
        <input type="file" accept="application/json,.txt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} style={{ marginLeft: 12 }} />
        {ocrLoading && <span style={{ color: '#007aff', marginLeft: 12 }}>辨識中...</span>}
      </div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 22, marginBottom: 8 }}>新增品項</h3>
        <input name="name" placeholder="名稱" value={newItem.name} onChange={handleInputChange} style={{ fontSize: 18, marginRight: 8, width: 120 }} />
        <input name="price" placeholder="價格" type="number" value={newItem.price} onChange={handleInputChange} style={{ fontSize: 18, marginRight: 8, width: 100 }} />
        <button onClick={handleAddItem} style={{ fontSize: 18, background: '#007aff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px' }}>新增</button>
      </div>
      <div>
        <h3 style={{ fontSize: 22, marginBottom: 8 }}>菜單品項</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menu.map((item, idx) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, background: '#f5f5f7', borderRadius: 10, padding: 8 }}>
              <input value={item.name} onChange={e => handleEditItem(idx, 'name', e.target.value)} style={{ fontSize: 18, width: 120, marginRight: 8 }} />
              <input type="number" value={item.price} onChange={e => handleEditItem(idx, 'price', e.target.value)} style={{ fontSize: 18, width: 100, marginRight: 8 }} />
              <button onClick={() => handleDeleteItem(idx)} style={{ fontSize: 16, background: '#e00', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px' }}>刪除</button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ position: 'fixed', top: 8, right: 0, zIndex: 200 }}>
        <button
          onClick={handleSurvey}
          style={{ margin: 24, fontSize: 18, background: '#007aff', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, boxShadow: '0 2px 8px #eee', cursor: 'pointer' }}
        >我是店家</button>
      </div>
    </div>
  );
} 