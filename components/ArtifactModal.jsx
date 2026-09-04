'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';

export default function ArtifactModal({
  asset,
  originRect,
  onClose,
}) {
  const modalRef = useRef(null);
  const panelRef = useRef(null);
  const stageRef = useRef(null);
  const artifactRef = useRef(null);
  const flyingImageRef = useRef(null);
  const scanLineRef = useRef(null);
  const hudRef = useRef(null);
  const metadataRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [rotation, setRotation] = useState({
    x: 15,
    y: -25,
  });

  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });

  /*
   * -------------------------------------------------------
   * 3D DRAGGING
   * -------------------------------------------------------
   */

  const handleMouseDown = (e) => {
    setIsDragging(true);

    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation((prev) => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));

    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /*
   * -------------------------------------------------------
   * BODY SCROLL + ESCAPE KEY
   * -------------------------------------------------------
   */

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isClosing) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isClosing]);

  /*
   * -------------------------------------------------------
   * CINEMATIC OPEN
   * -------------------------------------------------------
   */

  useLayoutEffect(() => {
    if (!originRect) return;
    if (!modalRef.current) return;
    if (!stageRef.current) return;

    const modal = modalRef.current;
    const panel = panelRef.current;
    const stage = stageRef.current;
    const artifact = artifactRef.current;
    const flyingImage = flyingImageRef.current;
    const scanLine = scanLineRef.current;
    const hud = hudRef.current;
    const metadata = metadataRef.current;

    if (!artifact || !flyingImage) return;

    const targetRect = stage.getBoundingClientRect();

    gsap.set(modal, {
      opacity: 1,
    });

    gsap.set(panel, {
      opacity: 0,
      scale: 0.94,
      y: 25,
    });

    /*
     * Start the temporary image at the exact
     * position of the gallery card.
     */
    gsap.set(flyingImage, {
      position: 'fixed',

      top: originRect.top,
      left: originRect.left,

      width: originRect.width,
      height: originRect.height,

      opacity: 1,

      rotateX: 0,
      rotateY: 0,

      scale: 1,

      borderRadius: 12,

      zIndex: 300,

      transformPerspective: 1200,
    });

    gsap.set(artifact, {
      opacity: 0,
      scale: 0.88,
    });

    gsap.set(scanLine, {
      scaleX: 0,
      opacity: 1,
      transformOrigin: 'left center',
    });

    gsap.set(hud, {
      opacity: 0,
    });

    gsap.set(metadata, {
      opacity: 0,
      y: 20,
    });

    const timeline = gsap.timeline();

    /*
     * 1. Darken background.
     */

    timeline.to(modal, {
      backgroundColor: 'rgba(0,0,0,0.96)',
      duration: 0.25,
      ease: 'power2.out',
    });

    /*
     * 2. Reveal modal structure.
     */

    timeline.to(
      panel,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.65,
        ease: 'expo.out',
      },
      '-=0.05'
    );

    /*
     * 3. Fly artwork into inspector.
     */

    timeline.to(
      flyingImage,
      {
        top: targetRect.top,
        left: targetRect.left,

        width: targetRect.width,
        height: targetRect.height,

        rotateX: 15,
        rotateY: -25,

        duration: 1.1,

        ease: 'expo.inOut',

        filter:
          'brightness(1.08) contrast(1.08)',
      },
      '-=0.3'
    );

    /*
     * 4. Reveal real artifact.
     */

    timeline.to(
      artifact,
      {
        opacity: 1,
        scale: 1,

        duration: 0.45,

        ease: 'back.out(1.5)',
      },
      '-=0.35'
    );

    /*
     * 5. Remove temporary flying image.
     */

    timeline.to(
      flyingImage,
      {
        opacity: 0,
        duration: 0.15,
      },
      '-=0.15'
    );

    /*
     * 6. Activate HUD.
     */

    timeline.to(
      hud,
      {
        opacity: 1,
        duration: 0.25,
      },
      '-=0.05'
    );

    /*
     * 7. Scan the artifact.
     */

    timeline.to(
      scanLine,
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.05'
    );

    timeline.to(scanLine, {
      opacity: 0,
      duration: 0.15,
    });

    /*
     * 8. Reveal metadata.
     */

    timeline.to(
      metadata,
      {
        opacity: 1,
        y: 0,

        duration: 0.5,

        ease: 'power3.out',
      },
      '-=0.25'
    );

    /*
     * Small final glow.
     */

    timeline.fromTo(
      stage,
      {
        filter: 'brightness(1.5)',
      },
      {
        filter:
          'brightness(1) drop-shadow(0 0 30px rgba(234,179,8,0.18))',

        duration: 0.45,
      },
      '-=0.45'
    );

    return () => {
      timeline.kill();
    };
  }, [originRect]);

  /*
   * -------------------------------------------------------
   * CINEMATIC CLOSE
   * -------------------------------------------------------
   */

  const handleClose = () => {
    if (isClosing) return;

    setIsClosing(true);

    const modal = modalRef.current;
    const panel = panelRef.current;
    const artifact = artifactRef.current;
    const flyingImage = flyingImageRef.current;

    if (
      !modal ||
      !panel ||
      !artifact ||
      !flyingImage ||
      !originRect
    ) {
      onClose();
      return;
    }

    const currentRect =
      artifact.getBoundingClientRect();

    /*
     * Put temporary image on top of real artifact.
     */

    gsap.set(flyingImage, {
      position: 'fixed',

      top: currentRect.top,
      left: currentRect.left,

      width: currentRect.width,
      height: currentRect.height,

      opacity: 1,

      rotateX: rotation.x,
      rotateY: rotation.y,

      scale: 1,

      borderRadius: 12,

      zIndex: 500,
    });

    gsap.set(artifact, {
      opacity: 0,
    });

    const timeline = gsap.timeline({
      onComplete: onClose,
    });

    /*
     * Fade interface away.
     */

    timeline.to(panel, {
      opacity: 0,
      scale: 0.96,
      duration: 0.35,
      ease: 'power2.in',
    });

    /*
     * Fly artwork back to original card.
     */

    timeline.to(
      flyingImage,
      {
        top: originRect.top,
        left: originRect.left,

        width: originRect.width,
        height: originRect.height,

        rotateX: 0,
        rotateY: 0,

        duration: 0.75,

        ease: 'expo.inOut',
      },
      '-=0.1'
    );

    /*
     * Fade entire modal.
     */

    timeline.to(
      modal,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.2'
    );
  };

  /*
   * -------------------------------------------------------
   * AUDIO
   * -------------------------------------------------------
   */

  const toggleSoundbite = () => {
    setIsPlayingAudio((previous) => !previous);
  };

  /*
   * -------------------------------------------------------
   * UI
   * -------------------------------------------------------
   */

  return (
    <div
      ref={modalRef}
      className="
        fixed
        inset-0
        z-[150]
        flex
        items-center
        justify-center
        p-4
        md:p-12
        bg-black/95
        backdrop-blur-xl
        opacity-0
      "
    >

      {/* Flying image used for the cinematic transition */}

      <img
        ref={flyingImageRef}
        src={asset.image}
        alt=""
        className="
          pointer-events-none
          fixed
          object-cover
          border
          border-yellow-500/40
          shadow-[0_0_60px_rgba(234,179,8,0.15)]
        "
      />

      {/* Main modal */}

      <div
        ref={panelRef}
        className="
          relative
          w-full
          max-w-6xl
          h-[85vh]

          grid
          grid-cols-1
          lg:grid-cols-12

          gap-8

          items-center

          bg-zinc-950/70

          border
          border-zinc-800/80

          rounded-2xl

          p-6
          md:p-10

          pt-20
          md:pt-20

          shadow-[0_0_80px_rgba(0,0,0,0.95)]

          overflow-y-auto
          lg:overflow-hidden
        "
      >

        {/* =================================================
            CLOSE
            ================================================= */}

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close artifact"
          className="
            absolute
            top-4
            right-4
            z-[400]

            group

            flex
            items-center
            gap-2

            rounded-full

            border
            border-zinc-800

            bg-zinc-950/90

            px-2
            py-2

            backdrop-blur-md

            transition-all
            duration-300

            hover:border-yellow-500/40
            hover:bg-zinc-900

            cursor-pointer
          "
        >

          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center

              rounded-full

              border
              border-zinc-700

              text-base
              leading-none

              text-zinc-500

              transition-all
              duration-300

              group-hover:border-yellow-500/50
              group-hover:text-yellow-400
              group-hover:rotate-90
            "
          >
            ×
          </span>

          <span
            className="
              pr-2

              font-mono
              text-[9px]
              tracking-[0.2em]

              text-zinc-600

              transition-colors

              group-hover:text-zinc-300
            "
          >
            ESC / RETURN
          </span>

        </button>

        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <div
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="
            relative

            lg:col-span-7

            h-[400px]
            lg:h-full

            flex
            items-center
            justify-center

            overflow-hidden

            rounded-xl

            border
            border-zinc-800/50

            bg-zinc-900/40

            cursor-grab
            active:cursor-grabbing

            select-none
          "
        >

          {/* Grid */}

          <div
            className="
              absolute
              inset-0

              pointer-events-none

              bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)]

              bg-[size:2rem_2rem]
            "
          />

          {/* Vignette */}

          <div
            className="
              absolute
              inset-0
              z-10
              pointer-events-none

              bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.5)_100%)]
            "
          />

          {/* Inspector label */}

          <div
            className="
              absolute
              top-4
              left-4
              z-40

              pointer-events-none

              font-mono
              text-[10px]

              uppercase
              tracking-widest

              text-yellow-500/60
            "
          >
            [3D_AXIS_INSPECTOR]
          </div>

          {/* Object ID */}

          <div
            className="
              absolute
              top-4
              right-4
              z-40

              pointer-events-none

              font-mono
              text-[9px]

              uppercase
              tracking-widest

              text-zinc-700
            "
          >
            OBJECT // 00{asset.id}
          </div>

          {/* HUD */}

          <div
            ref={hudRef}
            className="
              absolute
              inset-5
              z-30

              pointer-events-none

              opacity-0
            "
          >

            <div
              className="
                absolute
                top-0
                left-0

                w-8
                h-8

                border-t
                border-l
                border-yellow-500/50
              "
            />

            <div
              className="
                absolute
                top-0
                right-0

                w-8
                h-8

                border-t
                border-r
                border-yellow-500/50
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-0

                w-8
                h-8

                border-b
                border-l
                border-yellow-500/50
              "
            />

            <div
              className="
                absolute
                bottom-0
                right-0

                w-8
                h-8

                border-b
                border-r
                border-yellow-500/50
              "
            />

          </div>

          {/* Scan line */}

          <div
            ref={scanLineRef}
            className="
              absolute
              top-0
              left-0

              z-50

              w-full
              h-px

              bg-yellow-400

              shadow-[0_0_15px_rgba(234,179,8,0.9)]

              pointer-events-none

              opacity-0
            "
          />

          {/* =================================================
              ARTIFACT
              ================================================= */}

          <div
            ref={artifactRef}
            className="
              relative

              w-72
              h-96

              md:w-80
              md:h-[28rem]

              opacity-0
            "
            style={{
              transformStyle: 'preserve-3d',

              transform: `
                perspective(1000px)
                rotateX(${rotation.x}deg)
                rotateY(${rotation.y}deg)
              `,
            }}
          >

            <div
              className="
                absolute
                inset-0

                overflow-hidden

                rounded-lg

                border
                border-yellow-500/30

                bg-zinc-900

                shadow-[0_0_40px_rgba(0,0,0,0.9)]
              "
            >

              <img
                src={asset.image}
                alt={asset.title}
                className="
                  w-full
                  h-full
                  object-cover

                  pointer-events-none
                "
              />

              {/* Artifact lighting */}

              <div
                className="
                  absolute
                  inset-0
                  pointer-events-none

                  bg-gradient-to-br
                  from-white/10
                  via-transparent
                  to-black/50
                "
              />

              {/* Artifact label */}

              <div
                className="
                  absolute
                  inset-0

                  flex
                  items-end

                  p-6

                  bg-gradient-to-t
                  from-black/90
                  via-transparent
                  to-transparent
                "
              >

                <span
                  className="
                    font-mono
                    text-xs

                    tracking-wider

                    text-yellow-400
                  "
                >
                  AXIS_Z // FRONT
                </span>

              </div>

            </div>

          </div>

          {/* Bottom readout */}

          <div
            className="
              absolute
              bottom-4
              left-4

              pointer-events-none

              font-mono
              text-[9px]

              uppercase
              tracking-widest

              text-zinc-700
            "
          >
            DRAG OBJECT // ROTATION ENABLED
          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div
          className="
            lg:col-span-5

            flex
            h-full
            flex-col
            justify-between

            space-y-6
          "
        >

          {/* Metadata */}

          <div ref={metadataRef}>

            <span
              className="
                mb-2
                block

                font-mono
                text-xs

                uppercase
                tracking-[0.3em]

                text-yellow-500
              "
            >
              Catalog ID: #ARCH_0{asset.id}
            </span>

            <h2
              className="
                mb-4

                text-3xl
                md:text-4xl

                font-black

                tracking-tight

                text-white
              "
            >
              {asset.title}
            </h2>

            <p
              className="
                mb-6

                text-sm
                md:text-base

                leading-relaxed

                text-zinc-400
              "
            >
              {asset.description}

              {' '}

              Detailed historical context reflects centuries of
              localized tradition, material craftsmanship, and
              structural evolution preserved across generations.
            </p>

            {/* Metadata grid */}

            <div
              className="
                my-4
                grid
                grid-cols-2
                gap-4

                border-t
                border-b
                border-zinc-800

                py-4

                font-mono
                text-xs
              "
            >

              <div>

                <span
                  className="
                    mb-1
                    block
                    text-zinc-600
                  "
                >
                  ORIGIN REGION
                </span>

                <span className="text-zinc-300">
                  Brahmaputra Valley
                </span>

              </div>

              <div>

                <span
                  className="
                    mb-1
                    block
                    text-zinc-600
                  "
                >
                  TIMELINE ERA
                </span>

                <span className="text-zinc-300">
                  Classical / Pre-Colonial
                </span>

              </div>

            </div>

            {/* Verification */}

            <div
              className="
                mt-8

                flex
                items-center
                gap-2

                font-mono
                text-[10px]

                uppercase
                tracking-[0.2em]

                text-zinc-600
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5

                  rounded-full

                  bg-yellow-500

                  shadow-[0_0_8px_rgba(234,179,8,0.8)]
                "
              />

              SYSTEM // OBJECT VERIFIED

            </div>

          </div>

          {/* =================================================
              AUDIO
              ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between

              rounded-xl

              border
              border-zinc-800

              bg-zinc-900/80

              p-4

              transition-all
              duration-300

              hover:border-yellow-500/20
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className={`
                  h-3
                  w-3
                  rounded-full

                  ${
                    isPlayingAudio
                      ? 'bg-yellow-400 animate-ping'
                      : 'bg-zinc-600'
                  }
                `}
              />

              <div>

                <h4
                  className="
                    font-mono
                    text-xs

                    uppercase
                    tracking-wider

                    text-white
                  "
                >
                  Curator Audio Commentary
                </h4>

                <p
                  className="
                    font-mono
                    text-[10px]

                    text-zinc-500
                  "
                >
                  Duration: 0:45 min
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={toggleSoundbite}
              className="
                rounded-lg

                bg-yellow-500

                px-4
                py-2

                font-mono
                text-xs
                font-bold

                uppercase

                text-black

                transition-all

                hover:bg-yellow-400
                hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]

                cursor-pointer
              "
            >
              {isPlayingAudio ? 'Pause' : 'Play Audio'}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}