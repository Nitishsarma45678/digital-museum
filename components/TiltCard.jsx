'use client';

import { useState, useRef } from 'react';

export default function TiltCard({ asset, index, total, onSelect }) {
  const cardRef = useRef(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = -((y - centerY) / centerY) * 15;
    const rY = ((x - centerX) / centerX) * 15;

    setRotateX(rX);
    setRotateY(rY);

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.4,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);

    setGlare({
      x: 50,
      y: 50,
      opacity: 0,
    });
  };

  const handleClick = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    onSelect(asset, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  return (
    <div className="gallery-item w-screen h-full flex flex-col justify-center items-center px-10 relative">

      {/* Gallery Counter */}
      <div className="absolute top-20 left-20 text-gray-600 font-mono text-2xl tracking-widest hidden md:block">
        0{index + 1}{' '}
        <span className="text-gray-800">
          / 0{total}
        </span>
      </div>

      <div
        style={{ perspective: '1000px' }}
        className="w-full max-w-4xl"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            transform: `
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
              scale3d(1.02, 1.02, 1.02)
            `,
            transition:
              rotateX === 0 && rotateY === 0
                ? 'transform 0.5s ease-out'
                : 'none',
            transformStyle: 'preserve-3d',
          }}
          className="
            relative
            h-[55vh]
            overflow-hidden
            rounded-xl
            shadow-2xl
            border
            border-gray-800
            bg-gray-900
            cursor-pointer
            group
          "
        >

          {/* Glare */}
          <div
            className="
              absolute
              inset-0
              pointer-events-none
              z-20
              transition-opacity
              duration-300
            "
            style={{
              opacity: glare.opacity,
              background: `
                radial-gradient(
                  circle at ${glare.x}% ${glare.y}%,
                  rgba(255,255,255,0.3) 0%,
                  transparent 60%
                )
              `,
            }}
          />

          {/* Image */}
          <img
            src={asset.image}
            alt={asset.title}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-700
              ease-out
            "
          />

          {/* Bottom Gradient */}
          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/90
            via-transparent
            to-transparent
            flex
            items-end
            p-8
            z-10
          ">
            <div>

              <span className="
                uppercase
                tracking-[0.3em]
                text-xs
                text-yellow-500
                font-bold
                block
                mb-1
              ">
                {asset.category} // Click to Inspect 3D
              </span>

              <h3 className="
                text-3xl
                font-bold
                text-white
                tracking-tight
              ">
                {asset.title}
              </h3>

            </div>
          </div>

          {/* Hover Scan Line */}
          <div className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-yellow-400/0
            group-hover:bg-yellow-400/60
            group-hover:shadow-[0_0_15px_rgba(234,179,8,0.8)]
            group-hover:animate-[scan_2s_linear_infinite]
            z-30
            pointer-events-none
          " />

        </div>
      </div>

      {/* Description */}
      <div className="mt-6 text-center max-w-xl">
        <p className="
          text-gray-400
          text-sm
          md:text-base
          leading-relaxed
        ">
          {asset.description}
        </p>
      </div>

    </div>
  );
}