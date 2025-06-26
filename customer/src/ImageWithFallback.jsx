import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(''); // 失敗就不顯示圖
  };

  return imgSrc
    ? <img src={imgSrc} alt={alt} onError={handleError} {...props} />
    : <div style={{ width: props.style?.width || 80, height: props.style?.height || 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: 18 }}>{alt}</div>;
};

export default ImageWithFallback; 