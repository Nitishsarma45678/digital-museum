'use client';

import { useEffect, useRef, useState } from 'react';

export default function Atmosphere() {
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [monsoonIntensity, setMonsoonIntensity] = useState(0.6);

  const audioRef = useRef(null);

  // =========================================================
  // 1. ORGANIC FIREFLY CANVAS ENGINE
  // =========================================================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const fireflyCount = Math.floor((width * height) / 15000);
    const fireflies = [];

    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        angle: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        baseAlpha: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      fireflies.forEach((f) => {
        f.angle += f.pulseSpeed;

        f.x += f.vx + Math.sin(f.angle) * 0.3;
        f.y += f.vy + Math.cos(f.angle) * 0.3;

        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;

        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        const dx = mouse.x - f.x;
        const dy = mouse.y - f.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let currentAlpha =
          f.baseAlpha + Math.sin(f.angle) * 0.3;

        if (distance < mouse.radius && distance > 0) {
          const force =
            (mouse.radius - distance) / mouse.radius;

          f.x -= (dx / distance) * force * 4;
          f.y -= (dy / distance) * force * 4;

          currentAlpha = Math.min(
            1,
            currentAlpha + force * 0.6
          );
        }

        // Outer glow
        ctx.beginPath();
        ctx.arc(
          f.x,
          f.y,
          f.radius * 1.8,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          190,
          242,
          100,
          ${Math.max(0, currentAlpha * 0.3)}
        )`;

        ctx.fill();
        ctx.closePath();

        // Core glow
        ctx.beginPath();
        ctx.arc(
          f.x,
          f.y,
          f.radius * 0.8,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          234,
          179,
          8,
          ${Math.max(0, currentAlpha)}
        )`;

        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(234, 179, 8, 0.9)';

        ctx.fill();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // =========================================================
  // 2. REAL MONSOON AUDIO
  // =========================================================

  const toggleAudio = async () => {
    // -------------------------------------------------------
    // TURN SOUND ON
    // -------------------------------------------------------

    if (!isPlaying) {
      try {
        if (!audioRef.current) {
          const audio = new Audio('/sounds/monsoon.mp3');

          audio.loop = true;
          audio.preload = 'auto';
          audio.volume = monsoonIntensity;

          audioRef.current = audio;
        }

        // Make sure volume is current
        audioRef.current.volume = monsoonIntensity;

        await audioRef.current.play();

        setIsPlaying(true);
      } catch (error) {
        console.error('Unable to play monsoon sound:', error);
      }

      return;
    }

    // -------------------------------------------------------
    // TURN SOUND OFF
    // -------------------------------------------------------

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
  };

  // =========================================================
  // 3. UPDATE MONSOON VOLUME
  // =========================================================

  const handleMonsoonChange = (e) => {
    const value = parseFloat(e.target.value);

    setMonsoonIntensity(value);

    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  // =========================================================
  // 4. CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Audio & Monsoon Control HUD */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-zinc-950/80 border border-yellow-500/30 p-2 rounded-full backdrop-blur-md shadow-[0_0_25px_rgba(234,179,8,0.2)]">

        {isPlaying && (
          <div className="flex items-center gap-2 px-3 border-r border-zinc-800">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest">
              Monsoon:
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={monsoonIntensity}
              onChange={handleMonsoonChange}
              className="w-20 accent-yellow-500 cursor-pointer"
            />
          </div>
        )}

        <button
          onClick={toggleAudio}
          className="bg-zinc-900 text-yellow-500 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer font-bold"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying
                ? 'bg-yellow-400 animate-ping'
                : 'bg-zinc-600'
            }`}
          />

          {isPlaying
            ? 'Soundscape: Active'
            : 'Enable Soundscape'}
        </button>
      </div>
    </>
  );
}