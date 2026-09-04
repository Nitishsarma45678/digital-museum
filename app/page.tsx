'use client';

import { useState } from 'react';

import Gallery from '@/components/Gallery';
import CustomCursor from '@/components/CustomCursor';
import Atmosphere from '@/components/Atmosphere';
import Preloader from '@/components/Preloader';
import ArtifactWorld from '@/components/ArtifactWorld';

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  return (
    <main
      className="
        relative
        min-h-screen
        bg-[#0a0a0a]
        selection:bg-gray-800
        selection:text-white
      "
    >

      {/* =====================================================
          PRELOADER
          ===================================================== */}

      {!isReady && (
        <Preloader
          onComplete={() => setIsReady(true)}
        />
      )}

      {/* =====================================================
          MAIN EXPERIENCE
          ===================================================== */}

      <div
        className={
          isReady
            ? 'opacity-100 transition-opacity duration-1000'
            : 'opacity-0 h-screen overflow-hidden'
        }
      >

        <CustomCursor />

        <Atmosphere />

        {/* ===================================================
            HERO
            =================================================== */}

        <section
          className="
            relative
            z-20

            h-screen

            flex
            flex-col
            items-center
            justify-center

            px-6

            text-center
            text-white
          "
        >

          <h1
            className="
              mb-6

              text-7xl
              md:text-9xl

              font-black

              uppercase

              tracking-tighter
            "
          >
            Roots & Art
          </h1>

          <p
            className="
              max-w-xl

              text-xl

              font-light

              text-gray-400
            "
          >
            A digital immersion into history,
            literature, and nature.
            Scroll down to experience the gallery.
          </p>

          <div
            className="
              mt-16

              animate-bounce

              text-2xl

              text-gray-500
            "
          >
            ↓
          </div>

        </section>

        {/* ===================================================
            MAIN GALLERY
            =================================================== */}

        <div className="relative z-20">
          <Gallery />
        </div>

        {/* ===================================================
            IMMERSIVE ARTIFACT WORLDS

            8 artifacts
            8 worlds
            one continuous scroll journey
            =================================================== */}

        <ArtifactWorld />

        {/* ===================================================
            END OF EXHIBIT
            =================================================== */}

        <section
          className="
            relative
            z-10

            flex
            h-[70vh]

            items-center
            justify-center

            bg-[#050505]

            text-white
          "
        >

          <div className="px-6 text-center">

            <p
              className="
                mb-4

                font-mono
                text-[10px]

                uppercase
                tracking-[0.3em]

                text-yellow-500/50
              "
            >
              THE ARCHIVE CONTINUES
            </p>

            <h2
              className="
                text-3xl
                md:text-5xl

                font-black

                tracking-tight

                text-white/90
              "
            >
              The End of the Exhibit
            </h2>

            <p
              className="
                mx-auto
                mt-5

                max-w-md

                text-sm
                leading-relaxed

                text-white/30
              "
            >
              Eight objects.
              Eight stories.
              One living archive.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}