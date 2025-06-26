import React from 'react';
import ImageWithFallback from './ImageWithFallback';

const ScrollableMenuView = ({ title, items, onAddToCart, getImageSrc }) => {
  // 模擬點擊音效
  const clickAudio = typeof window !== 'undefined' ? new Audio(import.meta.env.BASE_URL + 'sounds/like.mp3') : null;

  const handleItemClick = (e, item) => {
    e.preventDefault(); // Prevent default browser action
    e.stopPropagation(); // Stop event from bubbling up
    if (clickAudio) {
      clickAudio.currentTime = 0;
      clickAudio.play();
    }
    onAddToCart(item);
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, marginLeft: 24 }}>{title}</h2>
      <div className="scrollable-container" style={{
        display: 'flex',
        overflowX: 'auto',
        gap: 16,
        padding: '0 24px 24px 24px', // Add padding to bottom to make scrollbar not overlap content
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', /* Firefox */
      }}>
        <style>{`
          .scrollable-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {items.map(item => (
          <div key={item.id} style={{
            flex: '0 0 160px',
            width: 160,
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: 16,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onClick={(e) => handleItemClick(e, item)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ImageWithFallback
              src={getImageSrc ? getImageSrc(item.category) : `${import.meta.env.BASE_URL}images/${item.category}.png`}
              alt={item.name}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 18, marginBottom: 12 }}
            />
            <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.name}</div>
            <div style={{ fontSize: 18, color: '#ff4d30', fontWeight: 'bold' }}>NT${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableMenuView; 