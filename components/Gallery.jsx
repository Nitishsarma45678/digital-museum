'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { museumAssets } from '../data';
import TiltCard from './TiltCard';
import ArtifactModal from './ArtifactModal';

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const progressRef = useRef(null);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [originRect, setOriginRect] = useState(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.gallery-item');

      if (!scrollRef.current || !sections.length) return;

      const totalWidth = scrollRef.current.offsetWidth;

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',

        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => '+=' + totalWidth,
        },
      });

      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',

        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + totalWidth,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (asset, rect) => {
    setOriginRect(rect);
    setSelectedAsset(asset);
  };

  const handleClose = () => {
    setSelectedAsset(null);
    setOriginRect(null);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="
          relative
          overflow-hidden
          h-screen
          bg-[#0a0a0a]
          text-[#f4f4f5]
        "
      >

        <div
          ref={scrollRef}
          className="
            flex
            h-full
            items-center
          "
          style={{
            width: `${museumAssets.length * 100}vw`,
          }}
        >

          {museumAssets.map((asset, index) => (
            <TiltCard
              key={asset.id}
              asset={asset}
              index={index}
              total={museumAssets.length}
              onSelect={handleSelect}
            />
          ))}

        </div>

        {/* Progress Bar */}
        <div className="
          absolute
          bottom-0
          left-0
          w-full
          h-1.5
          bg-gray-900
          z-30
        ">
          <div
            ref={progressRef}
            className="
              h-full
              w-full
              bg-yellow-500
              scale-x-0
            "
          />
        </div>
      </div>

      {/* Cinematic Artifact Modal */}
      {selectedAsset && originRect && (
        <ArtifactModal
          asset={selectedAsset}
          originRect={originRect}
          onClose={handleClose}
        />
      )}
    </>
  );
}