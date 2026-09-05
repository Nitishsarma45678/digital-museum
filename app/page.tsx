'use client';

import { useState } from 'react';

import Gallery from '@/components/Gallery';
import CustomCursor from '@/components/CustomCursor';
import Atmosphere from '@/components/Atmosphere';
import Preloader from '@/components/Preloader';
import ArtifactWorld from '@/components/ArtifactWorld';

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  const handleReturnToCollection = () => {
    const gallery = document.getElementById('collection');

    if (gallery) {
      gallery.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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

        <div
          id="collection"
          className="relative z-20"
        >
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
            z-[100]

            -mt-[18vh]

            min-h-screen
            h-screen

            flex
            items-center
            justify-center

            overflow-hidden

            bg-[#050505]

            text-white

            border-t
            border-yellow-500/10
          "
        >
          {/* =================================================
              BACKGROUND GRID
              ================================================== */}

          <div
            className="
              absolute
              inset-0

              pointer-events-none

              opacity-30

              bg-[linear-gradient(to_right,#27272a14_1px,transparent_1px),linear-gradient(to_bottom,#27272a14_1px,transparent_1px)]

              bg-[size:4rem_4rem]
            "
          />

          {/* =================================================
              CENTRAL AMBIENT GLOW
              ================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-1/2

              h-[32rem]
              w-[32rem]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              bg-yellow-500/[0.025]

              blur-[100px]

              pointer-events-none
            "
          />

          {/* =================================================
              TOP ARCHIVE MARK
              ================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-10

              flex
              -translate-x-1/2
              items-center
              gap-4

              font-mono
              text-[9px]

              uppercase
              tracking-[0.3em]

              text-zinc-700

              whitespace-nowrap
            "
          >
            <span className="h-px w-10 bg-zinc-800" />

            EXHIBITION COMPLETE

            <span className="h-px w-10 bg-zinc-800" />
          </div>

          {/* =================================================
              MAIN CONTENT
              ================================================== */}

          <div
            className="
              relative
              z-10

              flex
              w-full
              max-w-3xl

              flex-col
              items-center
              justify-center

              px-6
              py-24

              text-center
            "
          >
            {/* Eyebrow */}

            <p
              className="
                mb-5

                font-mono
                text-[10px]

                uppercase
                tracking-[0.35em]

                text-yellow-500
              "
            >
              THE ARCHIVE CONTINUES
            </p>

            {/* Main title */}

            <h2
              className="
                text-5xl
                md:text-7xl
                lg:text-8xl

                font-black

                leading-[0.88]

                tracking-tight

                text-white
              "
            >
              The End
              <br />

              <span className="text-white/35">
                of the Exhibit
              </span>
            </h2>

            {/* Divider */}

            <div
              className="
                mx-auto
                my-9

                flex
                items-center
                justify-center
                gap-3
              "
            >
              <span className="h-px w-16 bg-zinc-800" />

              <span
                className="
                  h-1.5
                  w-1.5

                  rounded-full

                  bg-yellow-500

                  shadow-[0_0_12px_rgba(234,179,8,0.8)]
                "
              />

              <span className="h-px w-16 bg-zinc-800" />
            </div>

            {/* Closing statement */}

            <p
              className="
                mx-auto

                max-w-lg

                text-base
                md:text-lg

                leading-relaxed

                text-zinc-400
              "
            >
              Eight objects.
              Eight stories.
              One living archive.
            </p>

            <p
              className="
                mx-auto
                mt-3

                max-w-md

                text-xs

                leading-relaxed

                text-zinc-600
              "
            >
              The exhibit ends here.
              The stories do not.
            </p>

            {/* =================================================
                ACTIONS
                ================================================== */}

            <div
              className="
                mt-11

                flex
                flex-col
                items-center
                justify-center

                gap-4

                sm:flex-row
              "
            >
              {/* Primary CTA */}

              <button
                type="button"
                onClick={handleReturnToCollection}
                className="
                  group

                  flex
                  items-center
                  gap-3

                  rounded-full

                  border
                  border-yellow-500/40

                  bg-yellow-500

                  px-6
                  py-3

                  font-mono
                  text-[10px]

                  font-bold

                  uppercase
                  tracking-[0.18em]

                  text-black

                  transition-all
                  duration-300

                  hover:bg-yellow-400

                  hover:shadow-[0_0_30px_rgba(234,179,8,0.18)]

                  active:scale-95

                  cursor-pointer
                "
              >
                <span>
                  Return to Collection
                </span>

                <span
                  className="
                    text-sm

                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </button>

              {/* Secondary CTA */}

              <button
                type="button"
                onClick={handleBackToTop}
                className="
                  rounded-full

                  border
                  border-zinc-800

                  bg-zinc-950/60

                  px-6
                  py-3

                  font-mono
                  text-[10px]

                  uppercase
                  tracking-[0.18em]

                  text-zinc-500

                  transition-all
                  duration-300

                  hover:border-zinc-600
                  hover:text-white

                  active:scale-95

                  cursor-pointer
                "
              >
                Back to Beginning
              </button>
            </div>
          </div>

          {/* =================================================
              BOTTOM ARCHIVE MARK
              ================================================== */}

          <div
            className="
              absolute
              bottom-7
              left-0
              right-0

              text-center

              font-mono
              text-[8px]

              uppercase
              tracking-[0.3em]

              text-zinc-800
            "
          >
            ROOTS & ART

            <span className="mx-2 text-zinc-700">
              •
            </span>

            DIGITAL MUSEUM

            <span className="mx-2 text-zinc-700">
              •
            </span>

            ASSAM
          </div>
        </section>
      </div>
    </main>
  );
}