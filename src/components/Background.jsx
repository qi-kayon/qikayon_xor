import { useState, useEffect, useRef } from 'react';

const Background = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const fontSize = 14;
    const columns = Math.floor(dimensions.width / fontSize);
    
    let drops = new Array(columns).fill(1);
    let frameCount = 0;
    let lastDraw = 0;
    const frameDelay = 33;

    ctx.font = `${fontSize}px monospace`;

    const draw = (timestamp) => {
      if (timestamp - lastDraw < frameDelay) {
        requestAnimationFrame(draw);
        return;
      }
      
      lastDraw = timestamp;
      
      ctx.fillStyle = 'rgba(0, 0, 80, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      ctx.fillStyle = '#00FFFF';
      frameCount++;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const opacity = Math.sin((frameCount + i * 5) / 40) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > dimensions.height && Math.random() > 0.9875) {
          drops[i] = 0;
        }

        if (frameCount % 2 === 0) {
          drops[i] += 0.5;
        }
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    };
  }, [dimensions]);

  return (
    <div className="fixed inset-0 bg-[#000033]">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.5
        }}
      />
    </div>
  );
};

export default Background;