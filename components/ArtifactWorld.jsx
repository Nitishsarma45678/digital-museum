'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { museumAssets } from '../data';

gsap.registerPlugin(ScrollTrigger);

/*
|--------------------------------------------------------------------------
| CONTENT FOR EACH EXHIBIT
|--------------------------------------------------------------------------
*/

const WORLD_CONTENT = {
  1: {
    eyebrow: 'NATURE // THE RIVER',
    worldLabel: 'WATER // MEMORY',
    prompt: 'FOLLOW THE CURRENT',
    description:
      'A river that does not simply pass through the valley. It shapes it.',
  },

  2: {
    eyebrow: 'WILDLIFE // THE GRASSLAND',
    worldLabel: 'LAND // WILDLIFE',
    prompt: 'WATCH THE LAND MOVE',
    description:
      'Mist, grass, rain and the slow movement of creatures beneath the trees.',
  },

  3: {
    eyebrow: 'HERITAGE // THE STAGE',
    worldLabel: 'BODY // RHYTHM',
    prompt: 'LISTEN TO THE MOVEMENT',
    description:
      'Movement becomes memory when a tradition survives long enough to become ritual.',
  },

  4: {
    eyebrow: 'ARTISTRY // THE THREAD',
    worldLabel: 'CRAFT // MEMORY',
    prompt: 'LOOK CLOSER',
    description:
      'A material transformed into something that carries generations of identity.',
  },

  5: {
    eyebrow: 'CRAFTSMANSHIP // THE MASK',
    worldLabel: 'ISLAND // STORY',
    prompt: 'ENTER THE STORY',
    description:
      'The object was never meant to exist alone. It belongs to a living world of performance.',
  },

  6: {
    eyebrow: 'NATURE // THE MONSOON',
    worldLabel: 'RAIN // LAND',
    prompt: 'FEEL THE WEATHER',
    description:
      'Cloud, rain and forest form one continuous living system.',
  },

  7: {
    eyebrow: 'HISTORY // THE STONE',
    worldLabel: 'STONE // HISTORY',
    prompt: 'READ THE STRUCTURE',
    description:
      'Brick, geometry and monumental structures preserving fragments of an older world.',
  },

  8: {
    eyebrow: 'CULTURE // THE FESTIVAL',
    worldLabel: 'PEOPLE // CELEBRATION',
    prompt: 'FEEL THE PULSE',
    description:
      'Music, movement, harvest and community become one pulse.',
  },
};

/*
|--------------------------------------------------------------------------
| HOTSPOTS
|--------------------------------------------------------------------------
*/

const HOTSPOTS = {
  1: [
    {
      id: 'flow',
      label: 'FLOW',
      title: 'The Lifeline',
      text:
        'The river is not background scenery. It is one of the forces that defines the valley.',
      x: 29,
      y: 39,
    },
    {
      id: 'valley',
      label: 'VALLEY',
      title: 'Landscape',
      text:
        'Water, soil, settlement and movement remain connected through the river.',
      x: 72,
      y: 31,
    },
  ],

  2: [
    {
      id: 'grass',
      label: 'GRASSLAND',
      title: 'Open Territory',
      text:
        'The landscape itself becomes the habitat, with grass and water shaping animal movement.',
      x: 28,
      y: 36,
    },
    {
      id: 'wildlife',
      label: 'WILDLIFE',
      title: 'Heavy Footsteps',
      text:
        'The landscape is alive even when nothing appears to move.',
      x: 70,
      y: 64,
    },
  ],

  3: [
    {
      id: 'movement',
      label: 'MOVEMENT',
      title: 'Gesture',
      text:
        'Every movement carries rhythm, discipline and inherited vocabulary.',
      x: 30,
      y: 35,
    },
    {
      id: 'tradition',
      label: 'TRADITION',
      title: 'Living Heritage',
      text:
        'The performance survives because it continues to be practiced, performed and remembered.',
      x: 70,
      y: 65,
    },
  ],

  4: [
    {
      id: 'thread',
      label: 'THREAD',
      title: 'Muga Silk',
      text:
        'The thread itself becomes part of the identity of the object.',
      x: 29,
      y: 40,
    },
    {
      id: 'craft',
      label: 'CRAFT',
      title: 'Handmade',
      text:
        'Time, technique and repetition are embedded directly into the material.',
      x: 71,
      y: 31,
    },
  ],

  5: [
    {
      id: 'material',
      label: 'MATERIAL',
      title: 'Bamboo + Clay',
      text:
        'Built by hand, layered with local materials and shaped for performance.',
      x: 30,
      y: 39,
    },
    {
      id: 'ritual',
      label: 'RITUAL',
      title: 'A Living Tradition',
      text:
        'The object becomes a character when the story is performed.',
      x: 70,
      y: 32,
    },
  ],

  6: [
    {
      id: 'rain',
      label: 'RAIN',
      title: 'Monsoon',
      text:
        'The seasonal cycle feeds the landscape and changes the mood of the entire valley.',
      x: 30,
      y: 30,
    },
    {
      id: 'canopy',
      label: 'CANOPY',
      title: 'Green Horizon',
      text:
        'Forest, rain and cultivation exist as one continuous visual landscape.',
      x: 71,
      y: 65,
    },
  ],

  7: [
    {
      id: 'brick',
      label: 'BRICK',
      title: 'Material Memory',
      text:
        'The architecture preserves history through material rather than through text alone.',
      x: 30,
      y: 40,
    },
    {
      id: 'geometry',
      label: 'FORM',
      title: 'Structure',
      text:
        'Proportion, repetition and geometry transform construction into cultural memory.',
      x: 71,
      y: 31,
    },
  ],

  8: [
    {
      id: 'rhythm',
      label: 'RHYTHM',
      title: 'The Dhol',
      text:
        'Rhythm gives the festival its physical pulse.',
      x: 30,
      y: 37,
    },
    {
      id: 'community',
      label: 'COMMUNITY',
      title: 'Together',
      text:
        'The festival is not simply observed. It is collectively experienced.',
      x: 71,
      y: 65,
    },
  ],
};

/*
|--------------------------------------------------------------------------
| ONE EXHIBIT
|--------------------------------------------------------------------------
|
| Every exhibit is completely independent.
|
*/

function ExhibitChapter({ asset, index }) {
  const chapterRef = useRef(null);

  const sceneRef = useRef(null);

  const artifactRef = useRef(null);

  const artifactImageRef = useRef(null);

  const worldRef = useRef(null);

  const worldImageRef = useRef(null);

  const titleRef = useRef(null);

  const descriptionRef = useRef(null);

  const worldTitleRef = useRef(null);

  const worldDescriptionRef = useRef(null);

  const spotlightRef = useRef(null);

  const progressRef = useRef(null);

  const [activeHotspot, setActiveHotspot] = useState(null);

  const content =
    WORLD_CONTENT[asset.id] ??
    WORLD_CONTENT[1];

  const hotspots =
    HOTSPOTS[asset.id] ??
    HOTSPOTS[1];

  /*
  |--------------------------------------------------------------------------
  | CURSOR LIGHT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleMouseMove = (event) => {
      const spotlight = spotlightRef.current;

      if (!spotlight) return;

      spotlight.style.setProperty(
        '--mouse-x',
        `${event.clientX}px`
      );

      spotlight.style.setProperty(
        '--mouse-y',
        `${event.clientY}px`
      );
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SCROLL ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const chapter = chapterRef.current;

    if (!chapter) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: chapter,

        start: 'top top',
        end: 'bottom bottom',

        onUpdate: (self) => {
          const progress = self.progress;

          /*
           * ======================================================
           * PHASES
           * ======================================================
           *
           * 0.00 - 0.16
           * Artifact enters
           *
           * 0.16 - 0.52
           * Artifact remains dominant
           *
           * 0.52 - 0.74
           * World starts to reveal
           *
           * 0.74 - 0.84
           * Artifact leaves completely
           *
           * 0.84 - 1.00
           * FULL SCENERY
           *
           */

          /*
           * ======================================================
           * ARTIFACT ENTRY
           * ======================================================
           */

          const entryProgress = Math.min(
            progress / 0.16,
            1
          );

          /*
           * ======================================================
           * WORLD REVEAL
           * ======================================================
           */

          let revealProgress = 0;

          if (progress > 0.52) {
            revealProgress =
              (progress - 0.52) /
              (0.74 - 0.52);
          }

          revealProgress = Math.max(
            0,
            Math.min(1, revealProgress)
          );

          /*
           * ======================================================
           * ARTIFACT EXIT
           * ======================================================
           */

          let exitProgress = 0;

          if (progress > 0.74) {
            exitProgress =
              (progress - 0.74) /
              (0.84 - 0.74);
          }

          exitProgress = Math.max(
            0,
            Math.min(1, exitProgress)
          );

          /*
           * ======================================================
           * ARTIFACT
           * ======================================================
           */

          if (artifactRef.current) {
            let opacity = 1;

            if (progress < 0.16) {
              opacity = entryProgress;
            }

            if (progress >= 0.52) {
              opacity =
                1 -
                revealProgress * 0.35;
            }

            if (progress >= 0.74) {
              opacity =
                0.65 *
                (1 - exitProgress);
            }

            /*
             * At 84% the artifact is GUARANTEED gone.
             */

            if (progress >= 0.84) {
              opacity = 0;
            }

            const scale =
              0.92 +
              entryProgress * 0.08 -
              revealProgress * 0.38 -
              exitProgress * 0.12;

            const y =
              35 -
              entryProgress * 35 -
              revealProgress * 35 -
              exitProgress * 20;

            gsap.set(
              artifactRef.current,
              {
                opacity,
                scale,
                y,
              }
            );
          }

          /*
           * ======================================================
           * WORLD
           * ======================================================
           */

          if (worldRef.current) {
            gsap.set(
              worldRef.current,
              {
                opacity: revealProgress,
              }
            );
          }

          /*
           * Slow world movement.
           */

          if (worldImageRef.current) {
            gsap.set(
              worldImageRef.current,
              {
                scale:
                  1.08 -
                  revealProgress * 0.08,
              }
            );
          }

          /*
           * ======================================================
           * INTRO TITLE
           * ======================================================
           */

          if (titleRef.current) {
            let opacity = 1;

            if (progress < 0.08) {
              opacity =
                entryProgress;
            }

            if (progress >= 0.52) {
              opacity =
                1 -
                Math.min(
                  1,
                  (progress - 0.52) / 0.18
                );
            }

            gsap.set(
              titleRef.current,
              {
                opacity,

                x:
                  -revealProgress * 60,
              }
            );
          }

          /*
           * ======================================================
           * DESCRIPTION
           * ======================================================
           */

          if (descriptionRef.current) {
            let opacity = 1;

            if (progress >= 0.52) {
              opacity =
                1 -
                Math.min(
                  1,
                  (progress - 0.52) / 0.16
                );
            }

            gsap.set(
              descriptionRef.current,
              {
                opacity,

                x:
                  -revealProgress * 35,
              }
            );
          }

          /*
           * ======================================================
           * WORLD TITLE
           * ======================================================
           */

          if (worldTitleRef.current) {
            gsap.set(
              worldTitleRef.current,
              {
                opacity: revealProgress,

                y:
                  35 -
                  revealProgress * 35,
              }
            );
          }

          /*
           * ======================================================
           * WORLD DESCRIPTION
           * ======================================================
           */

          if (worldDescriptionRef.current) {
            gsap.set(
              worldDescriptionRef.current,
              {
                opacity: revealProgress,

                y:
                  20 -
                  revealProgress * 20,
              }
            );
          }

          /*
           * ======================================================
           * SPOTLIGHT
           * ======================================================
           */

          if (spotlightRef.current) {
            gsap.set(
              spotlightRef.current,
              {
                opacity:
                  0.35 +
                  revealProgress * 0.4,

                scale:
                  1 +
                  revealProgress * 0.12,
              }
            );
          }

          /*
           * ======================================================
           * GLOBAL PROGRESS
           * ======================================================
           */

          if (progressRef.current) {
            gsap.set(
              progressRef.current,
              {
                scaleX: progress,
              }
            );
          }
        },
      });

      return () => {
        trigger.kill();
      };
    }, chapterRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={chapterRef}
      className="
        relative
        h-[220vh]
        bg-[#010101]
      "
    >

      {/* ========================================================
          STICKY SCENE
          ======================================================== */}

      <div
        ref={sceneRef}
        className="
          sticky
          top-0

          h-screen
          w-full

          overflow-hidden

          bg-[#010101]
        "
      >

        {/* ======================================================
            BASE ATMOSPHERE
            ====================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.07),transparent_38%)]
          "
        />

        {/* ======================================================
            WORLD
            ====================================================== */}

        <div
          ref={worldRef}
          className="
            absolute
            inset-0
            z-10

            opacity-0
            pointer-events-none
          "
        >

          <img
            ref={worldImageRef}
            src={asset.image}
            alt=""
            className="
              absolute
              inset-0

              h-full
              w-full

              object-cover
            "
          />

          {/* Main darkness */}

          <div
            className="
              absolute
              inset-0

              bg-black/55
            "
          />

          {/* Top/bottom cinematic gradient */}

          <div
            className="
              absolute
              inset-0

              bg-gradient-to-b
              from-black/40
              via-transparent
              to-black
            "
          />

          {/* Side gradient */}

          <div
            className="
              absolute
              inset-0

              bg-gradient-to-r
              from-black/60
              via-transparent
              to-black/30
            "
          />

          {/* ==================================================
              WORLD TITLE
              ================================================== */}

          <div
            ref={worldTitleRef}
            className="
              absolute

              left-[7vw]
              top-[19vh]

              max-w-3xl

              opacity-0
            "
          >

            <p
              className="
                font-mono

                text-[10px]

                uppercase
                tracking-[0.35em]

                text-yellow-400
              "
            >
              {content.worldLabel}
            </p>

            <h3
  className="
    mt-4

    text-6xl
    md:text-8xl

    font-black

    uppercase

    leading-[0.9]

    tracking-tight

    text-white

    drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]
  "
>
  {asset.title}
</h3>

          </div>

          {/* ==================================================
              WORLD DESCRIPTION
              ================================================== */}

          <div
            ref={worldDescriptionRef}
            className="
              absolute

              left-[7vw]
              top-[52vh]

              max-w-lg

              opacity-0
            "
          >

            <p
              className="
                text-sm
                md:text-lg

                leading-relaxed

                text-white/65
              "
            >
              {content.description}
            </p>

          </div>

          <div
            className="
              absolute

              bottom-10
              right-8

              font-mono
              text-[9px]

              uppercase
              tracking-[0.25em]

              text-white/30

              md:right-12
            "
          >
            EXHIBIT {String(asset.id).padStart(2, '0')}
            {' // WORLD REVEALED'}
          </div>

        </div>

        {/* ======================================================
            CURSOR LIGHT
            ====================================================== */}

        <div
          ref={spotlightRef}
          className="
            pointer-events-none

            absolute
            inset-0

            z-20
          "
          style={{
            '--mouse-x': '50vw',
            '--mouse-y': '50vh',

            background: `
              radial-gradient(
                circle 240px at var(--mouse-x) var(--mouse-y),
                rgba(255,255,255,0.14),
                rgba(234,179,8,0.04) 32%,
                transparent 70%
              )
            `,

            opacity: 0.35,
          }}
        />

        {/* ======================================================
            HEADER
            ====================================================== */}

        <div
          className="
            absolute

            left-6
            right-6
            top-6

            z-50

            flex
            items-start
            justify-between

            md:left-10
            md:right-10
            md:top-8
          "
        >

          <div>

            <p
              className="
                font-mono
                text-[10px]

                uppercase
                tracking-[0.35em]

                text-yellow-500/80
              "
            >
              EXHIBIT {String(asset.id).padStart(2, '0')}
            </p>

            <p
              className="
                mt-1

                font-mono
                text-[8px]

                uppercase
                tracking-[0.25em]

                text-white/25
              "
            >
              {content.eyebrow}
            </p>

          </div>

          <div
            className="
              font-mono
              text-[9px]

              uppercase
              tracking-[0.25em]

              text-white/25
            "
          >
            {String(asset.id).padStart(2, '0')}
            {' / '}
            08
          </div>

        </div>

        {/* ======================================================
            INTRO TITLE
            ====================================================== */}

        <div
          ref={titleRef}
          className="
            absolute

            left-[7vw]
            top-[29vh]

            z-30

            max-w-[560px]

            pointer-events-none
          "
        >

          <p
            className="
              font-mono

              text-[10px]

              uppercase
              tracking-[0.4em]

              text-white/35
            "
          >
            LOOK CLOSER
          </p>

          <h2
            className="
              mt-4

              text-5xl
              md:text-7xl

              font-black

              uppercase

              leading-[0.92]

              tracking-tight
            "
          >
            {content.prompt}
          </h2>

        </div>

        {/* ======================================================
            INTRO DESCRIPTION
            ====================================================== */}

        <div
          ref={descriptionRef}
          className="
            absolute

            left-[7vw]
            top-[54vh]

            z-30

            max-w-[380px]

            pointer-events-none
          "
        >

          <p
            className="
              text-sm

              leading-relaxed

              text-white/40
            "
          >
            Move across the artifact.
            Find the points of light.
            Then keep scrolling.
          </p>

        </div>

        {/* ======================================================
            CENTER ARTIFACT
            ====================================================== */}

        <div
          ref={artifactRef}
          className="
            absolute

            left-1/2
            top-1/2

            z-40

            w-[min(44vw,430px)]

            -translate-x-1/2
            -translate-y-1/2

            opacity-0
          "
        >

          <div
            className="
              relative

              overflow-hidden

              rounded-[18px]

              border
              border-yellow-500/35

              bg-zinc-950

              shadow-[0_0_110px_rgba(234,179,8,0.12)]
            "
          >

            <img
              ref={artifactImageRef}
              src={asset.image}
              alt={asset.title}
              draggable="false"
              className="
                block

                h-[60vh]
                w-full

                object-cover
              "
            />

            {/* Artifact gradient */}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-t
                from-black/95
                via-transparent
                to-white/5

                pointer-events-none
              "
            />

            {/* Inner frame */}

            <div
              className="
                absolute
                inset-0

                rounded-[18px]

                border
                border-white/5

                pointer-events-none
              "
            />

            {/* Artifact text */}

            <div
              className="
                absolute

                bottom-5
                left-5
                right-5
              "
            >

              <p
                className="
                  font-mono
                  text-[9px]

                  uppercase
                  tracking-[0.3em]

                  text-yellow-400
                "
              >
                {asset.category}
              </p>

              <h3
                className="
                  mt-1

                  text-2xl
                  md:text-3xl

                  font-black

                  tracking-tight
                "
              >
                {asset.title}
              </h3>

            </div>

          </div>

          {/* ==================================================
              HOTSPOTS
              ================================================== */}

          {hotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => {
                setActiveHotspot((current) =>
                  current === spot.id
                    ? null
                    : spot.id
                );
              }}
              aria-label={`Explore ${spot.label}`}
              className="
                group

                absolute

                z-50

                -translate-x-1/2
                -translate-y-1/2

                cursor-pointer
              "
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
              }}
            >

              <span
                className="
                  block

                  h-3
                  w-3

                  rounded-full

                  border
                  border-yellow-100

                  bg-yellow-400

                  shadow-[0_0_18px_rgba(234,179,8,0.95)]

                  transition-transform

                  group-hover:scale-150
                "
              />

              <span
                className="
                  absolute

                  left-5
                  top-1/2

                  -translate-y-1/2

                  whitespace-nowrap

                  font-mono
                  text-[8px]

                  uppercase
                  tracking-[0.2em]

                  text-yellow-200

                  opacity-0

                  transition-opacity

                  group-hover:opacity-100
                "
              >
                {spot.label}
              </span>

            </button>
          ))}

        </div>

        {/* ======================================================
            HOTSPOT PANEL
            ====================================================== */}

       {activeHotspot && (
  <div
    className="
      absolute

      bottom-24
      left-6

      z-[100]

      w-[min(88vw,390px)]

      rounded-xl
      border
      border-yellow-500/20
      bg-black/85

      p-4

      backdrop-blur-xl

      md:left-10
    "
  >
            {(() => {
              const spot = hotspots.find(
                (item) =>
                  item.id === activeHotspot
              );

              if (!spot) return null;

              return (
                <>
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          font-mono
                          text-[9px]

                          uppercase
                          tracking-[0.3em]

                          text-yellow-400
                        "
                      >
                        {spot.label}
                      </p>

                      <h4
                        className="
                          mt-1

                          text-lg

                          font-bold

                          text-white
                        "
                      >
                        {spot.title}
                      </h4>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveHotspot(null)
                      }
                      aria-label="Close hotspot"
                      className="
                        font-mono
                        text-sm

                        text-white/30

                        hover:text-white

                        cursor-pointer
                      "
                    >
                      ×
                    </button>

                  </div>

                  <p
                    className="
                      mt-3

                      text-xs

                      leading-relaxed

                      text-white/55
                    "
                  >
                    {spot.text}
                  </p>
                </>
              );
            })()}

          </div>
        )}

        {/* ======================================================
            BOTTOM
            ====================================================== */}

        <div
          className="
            pointer-events-none

            absolute

            bottom-7
            left-6
            right-6

            z-50

            flex
            items-end
            justify-between

            md:left-10
            md:right-10
          "
        >

          <div>

            <p
              className="
                font-mono
                text-[8px]

                uppercase
                tracking-[0.28em]

                text-white/25
              "
            >
              KEEP SCROLLING
            </p>

            <p
              className="
                mt-1

                font-mono
                text-[9px]

                uppercase
                tracking-[0.2em]

                text-white/40
              "
            >
              THE OBJECT BECOMES A WORLD
            </p>

          </div>

          <span
            className="
              font-mono
              text-[8px]

              uppercase
              tracking-[0.2em]

              text-white/25
            "
          >
            {asset.era}
          </span>

        </div>

        {/* ======================================================
            PROGRESS
            ====================================================== */}

        <div
          className="
            absolute

            bottom-0
            left-0
            right-0

            z-[100]

            h-[2px]

            bg-white/5
          "
        >

          <div
            ref={progressRef}
            className="
              h-full
              w-full

              origin-left

              scale-x-0

              bg-yellow-500

              shadow-[0_0_12px_rgba(234,179,8,0.85)]
            "
          />

        </div>

      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function ArtifactWorld() {
  return (
    <div className="relative z-30 bg-[#010101]">

      {museumAssets.map((asset, index) => (
        <ExhibitChapter
          key={asset.id}
          asset={asset}
          index={index}
        />
      ))}

    </div>
  );
}