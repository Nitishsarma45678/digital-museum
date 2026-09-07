'use client';

import { useEffect, useRef, useState } from 'react';

const EXHIBIT_SOUNDS = {
  1: {
    file: '/sounds/riversound.mp3',
    label: 'River Ambience',
  },

  2: {
    file: '/sounds/kaziranga.wav',
    label: 'Kaziranga Wilderness',
  },

  3: {
    file: '/sounds/satriya.mp3',
    label: 'Sattriya Atmosphere',
  },

  4: {
    file: null,
    label: 'Silent Exhibit',
  },

  5: {
    file: null,
    label: 'Silent Exhibit',
  },

  6: {
    file: '/sounds/moonsoonCanopies.wav',
    label: 'Rain and Thunder',
  },

  7: {
    file: null,
    label: 'Silent Exhibit',
  },

  8: {
    file: '/sounds/Bihu.mp3',
    label: 'Bihu Festivities',
  },
};

export default function Atmosphere() {
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [monsoonIntensity, setMonsoonIntensity] = useState(0.6);

  const audioRef = useRef(null);
  const currentExhibitRef = useRef(1);

  /*
   * =========================================================
   * 1. ORGANIC FIREFLY CANVAS ENGINE
   * =========================================================
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

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

    const fireflyCount = Math.floor(
      (width * height) / 15000
    );

    const fireflies = [];

    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,

        radius: Math.random() * 2 + 1,

        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,

        angle: Math.random() * Math.PI * 2,

        pulseSpeed:
          Math.random() * 0.03 + 0.01,

        baseAlpha:
          Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      fireflies.forEach((f) => {
        f.angle += f.pulseSpeed;

        f.x +=
          f.vx +
          Math.sin(f.angle) * 0.3;

        f.y +=
          f.vy +
          Math.cos(f.angle) * 0.3;

        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;

        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        const dx = mouse.x - f.x;
        const dy = mouse.y - f.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        let currentAlpha =
          f.baseAlpha +
          Math.sin(f.angle) * 0.3;

        if (
          distance < mouse.radius &&
          distance > 0
        ) {
          const force =
            (mouse.radius - distance) /
            mouse.radius;

          f.x -=
            (dx / distance) *
            force *
            4;

          f.y -=
            (dy / distance) *
            force *
            4;

          currentAlpha = Math.min(
            1,
            currentAlpha + force * 0.6
          );
        }

        /*
         * Outer glow
         */

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
          ${Math.max(
            0,
            currentAlpha * 0.3
          )}
        )`;

        ctx.fill();

        ctx.closePath();

        /*
         * Core glow
         */

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
          ${Math.max(
            0,
            currentAlpha
          )}
        )`;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
          'rgba(234, 179, 8, 0.9)';

        ctx.fill();

        ctx.closePath();
      });

      animationFrameId =
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, []);

  /*
   * =========================================================
   * 2. CREATE AUDIO
   * =========================================================
   */

  const createAudio = (file) => {
    if (!file) return null;

    const audio = new Audio(file);

    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = monsoonIntensity;

    audio.addEventListener('error', () => {
      console.error(
        `Unable to load exhibit audio: ${file}`
      );
    });

    return audio;
  };

  /*
   * =========================================================
   * 3. CHANGE EXHIBIT SOUND
   * =========================================================
   */

  const changeExhibitSound = async (
    exhibitId
  ) => {
    const sound =
      EXHIBIT_SOUNDS[exhibitId];

    currentExhibitRef.current =
      exhibitId;

    /*
     * If the visitor hasn't enabled
     * soundscape yet, just remember
     * the correct track.
     */

    if (!isPlaying) {
      return;
    }

    /*
     * Silent exhibit
     */

    if (!sound?.file) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      return;
    }

    /*
     * Don't recreate the same sound
     */

    if (
      audioRef.current?.dataset
        ?.exhibitId ===
      String(exhibitId)
    ) {
      return;
    }

    /*
     * Stop old exhibit sound
     */

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    /*
     * Start new exhibit sound
     */

    const nextAudio =
      createAudio(sound.file);

    if (!nextAudio) return;

    nextAudio.dataset.exhibitId =
      String(exhibitId);

    audioRef.current = nextAudio;

    try {
      await nextAudio.play();
    } catch (error) {
      console.error(
        'Unable to switch exhibit audio:',
        error
      );
    }
  };

  /*
   * =========================================================
   * 4. LISTEN FOR EXHIBIT CHANGES
   * =========================================================
   */

  useEffect(() => {
    const handleExhibitChange = (
      event
    ) => {
      const exhibitId =
        Number(event.detail?.exhibitId);

      if (!exhibitId) return;

      changeExhibitSound(
        exhibitId
      );
    };

    window.addEventListener(
      'museum-exhibit-change',
      handleExhibitChange
    );

    return () => {
      window.removeEventListener(
        'museum-exhibit-change',
        handleExhibitChange
      );
    };
  }, [isPlaying]);

  /*
   * =========================================================
   * 5. MAIN SOUND TOGGLE
   * =========================================================
   */

  const toggleAudio = async () => {
    /*
     * TURN SOUND ON
     */

    if (!isPlaying) {
      const exhibitId =
        currentExhibitRef.current;

      const sound =
        EXHIBIT_SOUNDS[exhibitId];

      /*
       * This exhibit intentionally
       * has no sound.
       */

      if (!sound?.file) {
        setIsPlaying(true);
        return;
      }

      try {
        const audio =
          createAudio(sound.file);

        if (!audio) return;

        audio.dataset.exhibitId =
          String(exhibitId);

        audio.volume =
          monsoonIntensity;

        audioRef.current = audio;

        await audio.play();

        setIsPlaying(true);
      } catch (error) {
        console.error(
          'Unable to play exhibit sound:',
          error
        );
      }

      return;
    }

    /*
     * TURN SOUND OFF
     */

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current = null;
    }

    setIsPlaying(false);
  };

  /*
   * =========================================================
   * 6. VOLUME
   * =========================================================
   */

  const handleMonsoonChange = (e) => {
    const value = parseFloat(
      e.target.value
    );

    setMonsoonIntensity(value);

    if (audioRef.current) {
      audioRef.current.volume =
        value;
    }
  };

  /*
   * =========================================================
   * 7. CLEANUP
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /*
   * =========================================================
   * 8. UI
   * =========================================================
   */

  const currentSound =
    EXHIBIT_SOUNDS[
      currentExhibitRef.current
    ];

  return (
    <>
      <canvas
        ref={canvasRef}
        className="
          fixed
          inset-0
          pointer-events-none
          z-10
        "
      />

      {/* =====================================================
          AUDIO HUD
          ===================================================== */}

      <div
        className="
          fixed
          bottom-6
          right-6
          z-40

          flex
          items-center
          gap-3

          rounded-full

          border
          border-yellow-500/30

          bg-zinc-950/80

          p-2

          backdrop-blur-md

          shadow-[0_0_25px_rgba(234,179,8,0.2)]
        "
      >

        {isPlaying && (
          <div
            className="
              flex
              items-center
              gap-2

              border-r
              border-zinc-800

              px-3
            "
          >
            <span
              className="
                font-mono
                text-[10px]

                uppercase
                tracking-widest

                text-yellow-500
              "
            >
              Atmosphere:
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={monsoonIntensity}
              onChange={
                handleMonsoonChange
              }
              className="
                w-20
                accent-yellow-500
                cursor-pointer
              "
            />
          </div>
        )}

        <button
          onClick={toggleAudio}
          className="
            flex
            items-center
            gap-2

            rounded-full

            bg-zinc-900

            px-4
            py-2

            font-mono
            text-xs
            font-bold

            uppercase
            tracking-widest

            text-yellow-500

            transition-all
            duration-300

            hover:bg-yellow-500
            hover:text-black

            cursor-pointer
          "
        >
          <span
            className={`
              h-2
              w-2
              rounded-full

              ${
                isPlaying
                  ? 'bg-yellow-400 animate-ping'
                  : 'bg-zinc-600'
              }
            `}
          />

          {isPlaying
            ? currentSound?.file
              ? 'Soundscape: Active'
              : 'Soundscape: Silent'
            : 'Enable Soundscape'}
        </button>
      </div>
    </>
  );
}