import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Item = {
  src: string;
  bg: string;
  subtitle: string;
  description: string;
};

const ITEMS: Item[] = [
  {
    src: '/cars/4.png',
    bg: '#C0392B',
    subtitle: 'THE ROAD TRIPPER',
    description:
      'A legendary classic reborn for modern wanderers. With its iconic silhouette and joyful spirit, it turns every road into an unforgettable adventure. Your story starts at the wheel.',
  },
  {
    src: '/cars/3.png',
    bg: '#1A237E',
    subtitle: 'THE NIGHT HUNTER',
    description:
      'Obsidian body, golden soul. Built for those who command the dark with precision and power. Zero to thrill in under three seconds — the road bows before it.',
  },
  {
    src: '/cars/1.png',
    bg: '#1B5E20',
    subtitle: 'THE ROYAL RIDE',
    description:
      "Where timeless prestige meets golden artistry. Every curve, every embellishment speaks of royalty — because some cars aren't just driven, they're inherited.",
  },
  {
    src: '/cars/2.png',
    bg: '#4A148C',
    subtitle: 'THE NEON GHOST',
    description:
      'Forged in neon and shadow, built for the future. Its glowing soul lights up the night while its raw power defines the very edge of tomorrow\'s racing.',
  },
];

type Role = 'center' | 'left' | 'right' | 'back';

function getRole(idx: number, active: number): Role {
  if (idx === active) return 'center';
  if (idx === (active + 3) % 4) return 'left';
  if (idx === (active + 1) % 4) return 'right';
  return 'back';
}

function getRoleStyle(role: Role, isMobile: boolean): React.CSSProperties {
  const transition = 'all 650ms cubic-bezier(0.4, 0, 0.2, 1)';
  const base: React.CSSProperties = {
    position: 'absolute',
    aspectRatio: '0.6 / 1',
    transition,
    willChange: 'transform, filter, opacity',
    transformOrigin: 'bottom center',
  };

  switch (role) {
    case 'center':
      return {
        ...base,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : '0',
        zIndex: 20,
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'none',
        opacity: 1,
      };
    case 'left':
      return {
        ...base,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        zIndex: 10,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
      };
    case 'right':
      return {
        ...base,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        zIndex: 10,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
      };
    case 'back':
      return {
        ...base,
        left: '50%',
        height: isMobile ? '13%' : '22%',
        bottom: isMobile ? '32%' : '12%',
        zIndex: 5,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 1,
      };
  }
}

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [hoveredBtn, setHoveredBtn] = useState<'prev' | 'next' | null>(null);
  const [textKey, setTextKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload images
  useEffect(() => {
    ITEMS.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Resize listener
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTextKey((k) => k + 1);
    setActiveIndex((prev) => (dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsAnimating(false), 650);
  };

  const current = ITEMS[activeIndex];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: current.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── GRAIN OVERLAY ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
          opacity: 0.4,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ── GHOST TEXT ── */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          right: 0,
          zIndex: 2,
          fontFamily: 'Anton, sans-serif',
          fontSize: 'clamp(72px, 22vw, 300px)',
          color: 'white',
          opacity: 1,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        JTL CAR
      </div>

      {/* ── BRAND LABEL ── */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 60,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          color: 'white',
          letterSpacing: '0.18em',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
        }}
      >
        JTL CAR
      </div>

      {/* ── CAROUSEL ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
        {ITEMS.map((item, idx) => {
          const role = getRole(idx, activeIndex);
          return (
            <div key={idx} style={getRoleStyle(role, isMobile)}>
              <img
                src={item.src}
                alt={item.subtitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  display: 'block',
                }}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM-LEFT UI ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          zIndex: 60,
          maxWidth: '300px',
        }}
      >
        <h2
          key={`title-${textKey}`}
          style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'white',
            fontSize: '22px',
            margin: '0 0 0.5rem 0',
            animation: 'fadeUp 400ms ease forwards',
          }}
        >
          {current.subtitle}
        </h2>

        {!isMobile && (
          <p
            key={`desc-${textKey}`}
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
              margin: '0 0 1.25rem 0',
              animation: 'fadeUp 500ms 60ms ease forwards',
              opacity: 0,
            }}
          >
            {current.description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: isMobile ? '0.75rem' : 0,
          }}
        >
          {(['prev', 'next'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => navigate(dir)}
              onMouseEnter={() => setHoveredBtn(dir)}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                width: '4rem',
                height: '4rem',
                border: '2px solid white',
                borderRadius: '50%',
                background:
                  hoveredBtn === dir
                    ? 'rgba(255,255,255,0.12)'
                    : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transform: hoveredBtn === dir ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
              aria-label={dir === 'prev' ? 'Previous' : 'Next'}
            >
              {dir === 'prev' ? (
                <ArrowLeft size={20} strokeWidth={2} />
              ) : (
                <ArrowRight size={20} strokeWidth={2} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── BOTTOM-RIGHT CTA ── */}
      <CtaButton isMobile={isMobile} />

      {/* ── SLIDE DOTS ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        {ITEMS.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === activeIndex ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: 'white',
              opacity: idx === activeIndex ? 1 : 0.35,
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function CtaButton({ isMobile }: { isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        zIndex: 60,
        fontFamily: 'Anton, sans-serif',
        fontSize: 'clamp(16px, 3vw, 44px)',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '-0.02em',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4em',
        opacity: hovered ? 1 : 0.8,
        transition: 'opacity 150ms ease',
      }}
    >
      EXPLORE THE FLEET
      <ArrowRight size={isMobile ? 16 : 28} strokeWidth={2} />
    </button>
  );
}
