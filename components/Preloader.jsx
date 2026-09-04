'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const ASSAMESE_CHARS = 'অআকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযৰলশষসহক্ষ';
const TARGET_TEXT = 'ROOTS & ART';

export default function Preloader({ onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    // 1. Buttery smooth GSAP progress bar (3.5 seconds)
    let tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.5,
          ease: "expo.inOut",
          delay: 0.4, // Slight pause at 100% before sliding up
          onComplete: onComplete 
        });
      }
    });

    tl.to(progressRef.current, {
      width: "100%",
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: function() {
        // Update the percentage number directly to avoid React state re-render lag
        if(percentRef.current) {
          percentRef.current.innerText = Math.floor(this.progress() * 100) + '%';
        }
      }
    });

    // 2. Cinematic Matrix Decrypt Effect
    let iterations = 0;
    const totalIterations = 45; // Higher = takes longer to lock in
    const intervalDuration = 75; // Slower scramble frame rate

    const scrambleInterval = setInterval(() => {
      setDisplayText(() => {
        return TARGET_TEXT.split('').map((char, index) => {
          if (char === ' ') return ' ';
          
          // Lock characters from left to right based on progress
          if (index < (iterations / totalIterations) * TARGET_TEXT.length) {
            return TARGET_TEXT[index];
          }
          // Scramble the rest
          return ASSAMESE_CHARS[Math.floor(Math.random() * ASSAMESE_CHARS.length)];
        }).join('');
      });

      iterations++;
      
      if (iterations >= totalIterations) {
        clearInterval(scrambleInterval);
        setDisplayText(TARGET_TEXT);
      }
    }, intervalDuration);

    return () => clearInterval(scrambleInterval);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      {/* Added a glowing drop-shadow to the text */}
      <h1 className="text-4xl md:text-7xl font-black text-yellow-500 tracking-[0.3em] mb-8 w-full text-center drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
        {displayText}
      </h1>
      
      <div className="flex items-center gap-6">
        <div className="w-64 h-[2px] bg-gray-900 overflow-hidden relative">
          <div 
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] w-0" 
          />
        </div>
        <span ref={percentRef} className="text-yellow-600 font-mono text-sm tracking-widest w-8 text-right">
          0%
        </span>
      </div>
    </div>
  );
}