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

    const isMobile = w < 768;
    // FIX: Reduced star count to lower O(n²) complexity cost
    // Desktop: 60 stars → 1770 distance checks/frame (was 80 → 3160)
    // Mobile: 25 stars → 300 checks/frame (was 40 → 780)
    const count = isMobile ? 25 : 60;
    // FIX: Shorter connection distance reduces pairs checked
    const distLimit = isMobile ? 80 : 120;

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * (isMobile ? 1 : 1.5),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random(),
    }));

    // FIX: Precompute squared distance limit to avoid sqrt in hot loop
    const distLimitSq = distLimit * distLimit;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < count; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > w) s.vx *= -1;
        if (s.y < 0 || s.y > h) s.vy *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 180, 254, ${s.a * 0.5})`;
        ctx.fill();

        // FIX: Use squared distance check (no Math.sqrt) in inner loop
        for (let j = i + 1; j < count; j++) {
          const other = stars[j];
          const dx = s.x - other.x;
          const dy = s.y - other.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < distLimitSq) {
            const alpha = (1 - Math.sqrt(dSq) / distLimit) * 0.15;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#020205' }}
      aria-hidden="true"
    />
  );
};

export default StarField;