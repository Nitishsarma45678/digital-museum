// components/Atmosphere.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function Atmosphere() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [monsoonIntensity, setMonsoonIntensity] = useState(0); // 0 to 1 slider
  
  const audioCtxRef = useRef(null);
  const droneGainRef = useRef(null);
  const rainGainRef = useRef(null);
  const oscillatorRef = useRef(null);
  const rainSourceRef = useRef(null);

  // 1. Organic Firefly Canvas Engine
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

    const mouse = { x: -1000, y: -1000, radius: 180 };
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
        baseAlpha: Math.random() * 0.5 + 0.2
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
        
        let currentAlpha = f.baseAlpha + Math.sin(f.angle) * 0.3;
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          f.x -= (dx / distance) * force * 4;
          f.y -= (dy / distance) * force * 4;
          currentAlpha = Math.min(1, currentAlpha + force * 0.6);
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 242, 100, ${Math.max(0, currentAlpha * 0.3)})`;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 179, 8, ${Math.max(0, currentAlpha)})`;
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

  // 2. Web Audio API Ambient Drone & Procedural Rain Synthesizer
  const toggleAudio = () => {
    if (!isPlaying) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // --- Ambient Drone Setup ---
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const droneFilter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, ctx.currentTime);

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(400, ctx.currentTime);

      droneGain.gain.setValueAtTime(0, ctx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      oscillatorRef.current = [osc1, osc2];
      droneGainRef.current = droneGain;

      // --- Procedural White Noise Rain Setup ---
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // Generate white noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Pass white noise through a bandpass filter to turn it into soft rain cascading
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(1000, ctx.currentTime);
      rainFilter.Q.setValueAtTime(1.2, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0, ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(ctx.destination);

      whiteNoise.start();
      rainSourceRef.current = whiteNoise;
      rainGainRef.current = rainGain;

      setIsPlaying(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        setIsPlaying(false);
        setMonsoonIntensity(0);
      }
    }
  };

  // Update Rain Volume live when slider changes
  const handleMonsoonChange = (e) => {
    const val = parseFloat(e.target.value);
    setMonsoonIntensity(val);
    if (rainGainRef.current && audioCtxRef.current) {
      rainGainRef.current.gain.linearRampToValueAtTime(val * 0.25, audioCtxRef.current.currentTime + 0.1);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
      
      {/* Audio & Monsoon Control HUD */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-zinc-950/80 border border-yellow-500/30 p-2 rounded-full backdrop-blur-md shadow-[0_0_25px_rgba(234,179,8,0.2)]">
        {isPlaying && (
          <div className="flex items-center gap-2 px-3 border-r border-zinc-800">
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest">Monsoon:</span>
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
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-yellow-400 animate-ping' : 'bg-zinc-600'}`} />
          {isPlaying ? 'Soundscape: Active' : 'Enable Soundscape'}
        </button>
      </div>
    </>
  );
}