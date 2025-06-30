import React, { useState, useRef } from 'react';
import { getMenu } from './menuData';
import ImageWithFallback from './ImageWithFallback';
import ScrollableMenuView from './ScrollableMenuView';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Audio elements
const likeAudio = typeof window !== 'undefined' ? new Audio(import.meta.env.BASE_URL + 'sounds/like.mp3') : null;
const dislikeAudio = typeof window !== 'undefined' ? new Audio(import.meta.env.BASE_URL + 'sounds/dislike.mp3') : null;

// Surprise messages
const surpriseMessages = [
  '🌟 你是今天的幸運兒！神秘小禮正在等你，快去櫃台兌換吧！',
  '✨ 命運女神眷顧了你！憑此畫面可領取【隱藏版驚喜】一份！',
  '🍔 店長偷偷放了一份獎勵在你手中，快去櫃台揭曉！'
];
const surpriseItem = { id: 999, name: '神秘小禮', price: 0, category: 'surprise' };

// 圖片自動判斷
function getImageSrc(category) {
  const valid = ['egg_pancake', 'milk_tea', 'coffee', 'turnip_cake', 'ham_egg_toast'];
  if (valid.includes(category)) {
    return `${import.meta.env.BASE_URL}images/${category}.png`;
  }
  return '';
}

function safePlay(audio) {
  if (!audio) return;
  try {
    if (audio.canPlayType && audio.canPlayType('audio/mpeg')) {
      audio.currentTime = 0;
      audio.play();
    }
  } catch (e) {
    // ignore NotSupportedError
  }
}

function getCategory(name) {
  if (name.includes('蛋餅') || name.includes('餅')) return '蛋餅';
  if (name.includes('奶茶') || name.includes('茶')) return '奶茶';
  if (name.includes('咖啡')) return '咖啡';
  if (name.includes('蘿蔔糕')) return '蘿蔔糕';
  if (name.includes('吐司') || name.includes('漢堡')) return '吐司/漢堡';
  return '其他';
}

function groupMenuByCategory(menu) {
  const groups = {};
  menu.forEach(item => {
    const cat = getCategory(item.name);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return groups;
}

function getHotSellers(menu) {
  // 從 localStorage 取得點餐次數
  let stats = {};
  try {
    stats = JSON.parse(localStorage.getItem('order_stats') || '{}');
  } catch {}
  // 依據點餐次數排序，取前三名
  return [...menu]
    .map(item => ({ ...item, count: stats[item.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function MenuPage({ menu, onBack, onAddToCart, onShowCart, cart }) {
  const handleBack = () => {
    safePlay(likeAudio);
    onBack();
  };
  const grouped = groupMenuByCategory(menu);
  const hotSellers = getHotSellers(menu);
  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', position: 'relative' }}>
      <button 
        onClick={handleBack}
        style={{ position: 'fixed', top: 24, left: 24, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '8px 16px', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10 }}
      >返回</button>
      <button 
        onClick={onShowCart} 
        style={{ position: 'fixed', top: 36, right: 24, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '8px 16px', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}
      >
        <span>🛒</span>
        <span>{cart.length}</span>
      </button>
      <div style={{ maxWidth: '100%', margin: '0 auto', fontFamily: 'Arial, sans-serif', paddingTop: 24, paddingBottom: 100 }}>
        <h1 style={{ fontSize: 40, textAlign: 'center', marginBottom: 32, letterSpacing: 8 }}>菜單</h1>
        <ScrollableMenuView title="熱銷餐點" items={hotSellers} onAddToCart={onAddToCart} getImageSrc={getImageSrc} />
        {Object.keys(grouped).map(cat => (
          <ScrollableMenuView key={cat} title={cat} items={grouped[cat]} onAddToCart={onAddToCart} getImageSrc={getImageSrc} />
        ))}
        <div style={{ position: 'fixed', bottom: 24, left: 24, right: 24, maxWidth: 400, margin: '0 auto' }}>
          <button onClick={handleBack} style={{ width: '100%', fontSize: 22, padding: 14, borderRadius: 14, background: '#ff9500', color: '#fff', border: 'none', boxShadow: '0 4px 12px rgba(255, 149, 0, 0.4)' }}>返回</button>
        </div>
      </div>
    </div>
  );
}

function getRandomOrderId() {
  return ('' + Math.floor(100 + Math.random() * 900));
}

function CartPage({ cart, onBack, onRemove, onSubmit, lastOrderId }) {
  const handleBack = () => {
    safePlay(likeAudio);
    onBack();
  };
  const handleRemove = (i) => {
    safePlay(likeAudio);
    onRemove(i);
  };
  const handleSubmit = () => {
    safePlay(likeAudio);
    onSubmit();
  };
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 16 }}>購物車</h2>
      {lastOrderId && (
        <div style={{ color: '#007aff', fontSize: 22, textAlign: 'center', marginBottom: 12 }}>
          已送出訂單，您的訂單編號：{lastOrderId}
        </div>
      )}
      {cart.length === 0 ? <div style={{ fontSize: 24, textAlign: 'center' }}>尚未加入任何商品</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 8 }}>
              {item.category === 'surprise' ? (
                <span style={{ fontSize: 40, width: 48, height: 48, textAlign: 'center', marginRight: 12 }}>🎁</span>
              ) : (
                <ImageWithFallback
                  src={getImageSrc(item.category)}
                  alt={item.name}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 18, marginRight: 12 }}
                />
              )}
              <span style={{ fontSize: 22, flex: 1 }}>{item.name}</span>
              <span style={{ fontSize: 20, color: '#ff4d30', marginRight: 8 }}>NT${item.price}</span>
              <button onClick={() => handleRemove(i)} style={{ fontSize: 18, border: 'none', background: '#eee', borderRadius: 8, padding: '2px 8px' }}>刪除</button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ fontSize: 24, textAlign: 'right', margin: '16px 0' }}>
        總計：NT${cart.reduce((sum, item) => sum + item.price, 0)}
      </div>
      <button onClick={handleSubmit} style={{ width: '100%', fontSize: 24, padding: 16, borderRadius: 16, background: '#007aff', color: '#fff', border: 'none', marginBottom: 12 }}>送出訂單</button>
      <button onClick={handleBack} style={{ width: '100%', fontSize: 20, padding: 12, borderRadius: 12, background: '#f5f5f5', color: '#333', border: 'none' }}>返回</button>
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(getMenu());
  const [currentItem, setCurrentItem] = useState(getMenu()[0] || null);
  const [cart, setCart] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [surprise, setSurprise] = useState(null);
  const [pendingNext, setPendingNext] = useState(false);
  const startXRef = useRef(0);
  const [lastOrderId, setLastOrderId] = useState(null);

  // 取得下一個商品
  function getNextItem(item) {
    const idx = getMenu().findIndex(i => i.id === item.id);
    return getMenu()[(idx + 1) % getMenu().length];
  }

  const handleAddToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  const animateOut = (dir) => {
    setAnimating(true);
    setDragX(dir * 500);
    setTimeout(() => {
      setDragX(0);
      setAnimating(false);
      if (dir === 1) {
        setCart(prevCart => [...prevCart, currentItem]);
      }
      // Check for a surprise! (e.g., 20% chance)
      if (Math.random() < 0.2) {
        const randomMessage = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
        setSurprise(randomMessage);
        setCart(prevCart => [...prevCart, surpriseItem]);
        setPendingNext(true); // 等 surprise 關閉後再切換
      } else {
        setCurrentItem(getNextItem(currentItem));
      }
    }, 250);
  };

  const handleLike = () => {
    if (animating) return;
    safePlay(likeAudio);
    animateOut(1);
  };

  const handleDislike = () => {
    if (animating) return;
    safePlay(dislikeAudio);
    animateOut(-1);
  };

  const handleTouchStart = (e) => {
    if (animating) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || animating) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || animating) return;
    setIsDragging(false);
    const threshold = 80;
    if (dragX > threshold) {
      animateOut(1);
    } else if (dragX < -threshold) {
      animateOut(-1);
    } else {
      setDragX(0);
    }
  };

  const handleShowMenu = () => {
    safePlay(likeAudio);
    setShowMenu(true);
  };

  const handleShowCart = () => {
    safePlay(likeAudio);
    setShowCart(true);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    const items = cart.reduce((acc, item) => {
      const found = acc.find(i => i.id === item.id);
      if (found) found.qty = (found.qty || 1) + 1;
      else acc.push({ ...item, qty: 1 });
      return acc;
    }, []);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderId = getRandomOrderId();
    // 統計點餐次數
    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem('order_stats') || '{}');
    } catch {}
    cart.forEach(item => {
      stats[item.id] = (stats[item.id] || 0) + 1;
    });
    localStorage.setItem('order_stats', JSON.stringify(stats));
    await addDoc(collection(db, "orders"), {
      items,
      total,
      orderId,
      createdAt: serverTimestamp()
    });
    setCart([]);
    setLastOrderId(orderId);
  };

  const handleRemoveFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  if (showMenu) {
    return <MenuPage menu={menu} onBack={() => setShowMenu(false)} onAddToCart={handleAddToCart} onShowCart={() => {
      if (likeAudio) { likeAudio.currentTime = 0; likeAudio.play(); }
      setShowMenu(false);
      setShowCart(true);
    }} cart={cart} />;
  }
  if (showCart) {
    return <CartPage cart={cart} onBack={() => { setShowCart(false); setLastOrderId(null); }} onRemove={handleRemoveFromCart} onSubmit={handleSubmitOrder} lastOrderId={lastOrderId} />;
  }

  // Show surprise screen if a surprise is active
  if (surprise) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 24, lineHeight: 1.6, marginBottom: 24 }}>{surprise}</div>
          <button 
            onClick={() => {
              setSurprise(null);
              if (pendingNext) {
                setCurrentItem(getNextItem(currentItem));
                setPendingNext(false);
              }
            }} 
            style={{ width: '100%', fontSize: 22, padding: 14, borderRadius: 14, background: '#ff9500', color: '#fff', border: 'none' }}
          >
            繼續點餐
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return <div style={{textAlign:'center',marginTop:80,fontSize:24}}>載入菜單中...</div>;
  }

  const item = currentItem;
  const rotate = dragX / 18;
  const shadow = Math.min(Math.abs(dragX) / 10, 24);

  // 主畫面只顯示卡片
  if (!showMenu && !showCart && !surprise) {
    return (
      <>
        <style>{`
          @media (max-width: 600px) {
            .main-card {
              max-width: 92vw !important;
              padding: 3vw !important;
              border-radius: 18px !important;
              box-sizing: border-box !important;
            }
            .main-title {
              font-size: 14vw !important;
            }
            .main-price {
              font-size: 10vw !important;
            }
            .main-btn {
              font-size: 3.8vw !important;
              padding: 8px 0 !important;
              border-radius: 10px !important;
            }
            .main-cart-btn {
              max-width: 92vw !important;
              font-size: 4vw !important;
              padding: 10px 0 !important;
              border-radius: 10px !important;
            }
          }
        `}</style>
        <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', padding: 0 }}>
          <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <div
              className="main-card"
              style={{
                background: '#fff',
                borderRadius: 24,
                boxShadow: `0 8px ${shadow + 24}px rgba(0,0,0,0.12)`,
                padding: '40px 24px',
                marginBottom: 20,
                width: '100%',
                maxWidth: 420,
                minHeight: 420,
                position: 'relative',
                userSelect: 'none',
                touchAction: 'pan-y',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'box-shadow 0.2s',
                transform: `translateX(${dragX}px) rotate(${rotate}deg)`,
                boxSizing: 'border-box',
                justifyContent: 'flex-end',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div style={{ flex: 1 }} />
              <div className="main-title" style={{ fontSize: 96, fontWeight: 'bold', textAlign: 'center', width: '100%', marginBottom: 32, letterSpacing: 2 }}>{item.name}</div>
              <div className="main-price" style={{ fontSize: 80, color: '#ff4d30', textAlign: 'center', fontWeight: 'bold', width: '100%', marginBottom: 48 }}>{`NT$${item.price}`}</div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, width: '100%', marginTop: 'auto' }}>
                <button className="main-btn" onClick={handleDislike} style={{ flex: 1, fontSize: 18, padding: '18px 0', borderRadius: 14, background: '#fff', color: '#333', border: '2px solid #eee', marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <span style={{ fontSize: 32 }}>👎</span>
                  不喜歡
                </button>
                <button className="main-btn" onClick={handleShowMenu} style={{ flex: 1, fontSize: 18, padding: '18px 0', borderRadius: 14, background: '#fff', color: '#333', border: '2px solid #eee', marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <span style={{ fontSize: 32 }}>≡</span>
                  菜單
                </button>
                <button className="main-btn" onClick={handleLike} style={{ flex: 1, fontSize: 18, padding: '18px 0', borderRadius: 14, background: '#007aff', color: '#fff', border: 'none', marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <span style={{ fontSize: 32 }}>👍</span>
                  喜歡
                </button>
              </div>
            </div>
            <button className="main-cart-btn" onClick={handleShowCart} style={{ width: '100%', maxWidth: 420, fontSize: 18, padding: 12, borderRadius: 14, background: '#007aff', color: '#fff', border: 'none', marginTop: 8, fontWeight: 600, letterSpacing: 2 }}>
              購物車（{cart.length}）
            </button>
          </div>
        </div>
      </>
    );
  }

  // 如果沒有匹配任何條件，返回 null（這不應該發生）
  return null;
} 