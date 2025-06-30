import React from 'react';

const ScrollableMenuView = ({ title, items, onAddToCart }) => {
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 160,
          }}
          onClick={(e) => handleItemClick(e, item)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold', width: '100%', marginBottom: 18, lineHeight: 1.1, wordBreak: 'break-all' }}>{item.name}</div>
            <div style={{ fontSize: 28, color: '#ff4d30', fontWeight: 'bold', width: '100%' }}>NT${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableMenuView; 