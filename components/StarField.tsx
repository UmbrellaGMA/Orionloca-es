import React, { useEffect, useRef } from 'react';

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Mobile check for optimization
    const isMobile = w < 768;
    const count = isMobile ? 40 : 80;
    const distLimit = isMobile ? 100 : 150;

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * (isMobile ? 1 : 1.5),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random()
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s, i) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0 || s.x > w) s.vx *= -1;
        if (s.y < 0 || s.y > h) s.vy *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 180, 254, ${s.a * 0.5})`;
        ctx.fill();

        for (let j = i + 1; j < count; j++) {
          const other = stars[j];
          const dx = s.x - other.x, dy = s.y - other.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < distLimit) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - d / distLimit) * 0.15})`;
            ctx.stroke();
          }
        }
      });
      frame = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: '#020205' }} />;
};

export default StarField;