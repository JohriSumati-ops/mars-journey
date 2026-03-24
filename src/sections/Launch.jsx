import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LAUNCH_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

function useCountdown() {
  const [time, setTime] = useState({})
  useEffect(() => {
    const update = () => {
      const diff = LAUNCH_DATE - new Date()
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

const placards = [
  {
    num: '01',
    phase: 'T — 06:00:00',
    title: 'PRE-LAUNCH\nCHECKS',
    highlight: 'CHECKS',
    desc: 'All systems verified. Propellant loading complete. Launch Vehicle Mission Ready Review cleared by ISRO mission control.',
    detail: 'Fuel: 100% • Range: Clear • Weather: GO',
    image: 'https://www.isro.gov.in/media_isro/image/media/Missions/PSLV/more/PSLVC25/gallery/picture2.jpg.webp',
    imageLabel: 'PSLV-C25 — Courtesy ISRO',
    accent: '#e05a1e',
  },
  {
    num: '02',
    phase: 'T — 00:00:00',
    title: 'ENGINE\nIGNITION',
    highlight: 'IGNITION',
    desc: 'PSLV-C25 core stage ignites. 4 liquid strap-on engines fire simultaneously. 320 tonnes of thrust tears through the atmosphere.',
    detail: 'Thrust: 320T • Temp: 3,100°C • Altitude: 0km',
    image: 'https://i.pinimg.com/736x/ba/f8/9c/baf89c76f4a6323e8f2b00a2407140a3.jpg',
    imageLabel: 'PSLV Ignition — Courtesy ISRO',
    accent: '#ff4500',
  },
  {
    num: '03',
    phase: 'T + 01:22',
    title: 'STAGE\nSEPARATION',
    highlight: 'SEPARATION',
    desc: 'Strap-on boosters jettisoned at 45km. Vehicle accelerates through Max-Q. The sky turns black at the edge of space.',
    detail: 'Alt: 45km • Speed: 1.8 km/s • Stage: 1 → 2',
    image: 'https://i.pinimg.com/1200x/f8/d4/ae/f8d4ae756d8e075f6ce5615a24006f18.jpg',
    imageLabel: 'PSLV-C25 Ascent — Courtesy ISRO',
    accent: '#c0392b',
  },
  {
    num: '04',
    phase: 'T + 44:00',
    title: 'EARTH ORBIT\nINSERTION',
    highlight: 'ORBIT',
    desc: 'Spacecraft inserted into 248km parking orbit. Systems check nominal. Mars Transfer Trajectory calculations confirmed.',
    detail: 'Orbit: 248km • Period: 88 min • Status: Nominal',
    image: 'https://i.pinimg.com/1200x/13/8f/c1/138fc1de85f0b20bfd788710f65ef3ec.jpg',
    imageLabel: 'Earth from MOM — Courtesy ISRO',
    accent: '#2980b9',
  },
  {
    num: '05',
    phase: 'T + 298 DAYS',
    title: 'TRANS-MARS\nINJECTION',
    highlight: 'MARS',
    desc: 'Final burn escapes Earth gravity forever. Mangalyaan accelerates to 11.2 km/s. The Red Planet awaits 225 million km away.',
    detail: 'Velocity: 11.2 km/s • Distance: 225M km • ETA: 298 days',
    image: 'https://i.pinimg.com/736x/49/9f/c8/499fc825c8e754c2dd9d31405baaa57a.jpg',
    imageLabel: 'Mars — Courtesy ISRO/MOM',
    accent: '#e05a1e',
  },
]

function HighlightText({ children, highlight, color = '#e05a1e', active }) {
  const parts = children.split(highlight)
  return (
    <span>
      {parts[0]}
      <span style={{ position: 'relative', display: 'inline-block', color: active ? '#04060f' : color, transition: 'color 0.6s ease' }}>
        <span style={{
          position: 'absolute', inset: '-2px -6px', background: color,
          transformOrigin: 'left center',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.6s cubic-bezier(0.77,0,0.175,1)', zIndex: 0,
        }} />
        <span style={{ position: 'relative', zIndex: 1 }}>{highlight}</span>
      </span>
      {parts[1]}
    </span>
  )
}

/* ─────────────────────────────────────────────
   COUNTDOWN DIGIT CARD — glassmorphism tile
───────────────────────────────────────────── */
function CountDigit({ val, label, sub, isLive, accent }) {
  const [prev, setPrev] = useState(val)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (val !== prev) {
      setFlip(true)
      const t = setTimeout(() => { setFlip(false); setPrev(val) }, 350)
      return () => clearTimeout(t)
    }
  }, [val])

  const display = isLive ? String(val ?? '00').padStart(2, '0') : val

  return (
    <div
      className="shrink-0 relative flex flex-col justify-between overflow-hidden"
      style={{
        minWidth: 150,
        padding: '120px 22px',
        borderRight: '1px solid rgba(224,90,30,0.12)',
        borderTop: '1px solid rgba(224,90,30,0.12)',
        borderBottom: '1px solid rgba(224,90,30,0.12)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        background: isLive
          ? 'linear-gradient(160deg, rgba(224,90,30,0.10) 0%, rgba(10,4,2,0.85) 100%)'
          : 'rgba(8,4,2,0.65)',
        transition: 'background 0.4s',
      }}
    >
      {/* Inner glow on live tiles */}
      {isLive && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${accent}18 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(224,90,30,0.02) 3px, rgba(224,90,30,0.02) 4px)',
        }}
      />

      {/* Label */}
      <span className="relative font-mono text-[9px] tracking-[0.45em] uppercase"
        style={{ color: isLive ? `${accent}cc` : 'rgba(224,90,30,0.3)' }}>
        {label}
      </span>

      {/* Number */}
      <div
        className="relative font-['Bebas_Neue'] leading-none"
        style={{
          fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
          background: isLive
            ? `linear-gradient(160deg, #fff8f0 0%, ${accent} 60%, #b83a00 100%)`
            : 'linear-gradient(160deg, rgba(245,213,176,0.35) 0%, rgba(200,120,60,0.2) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          transform: flip ? 'translateY(-6px)' : 'translateY(0)',
          opacity: flip ? 0.4 : 1,
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          textShadow: 'none',
          filter: isLive ? 'drop-shadow(0 0 12px rgba(224,90,30,0.5))' : 'none',
        }}
      >
        {display}
      </div>

      {/* Sub */}
      <span className="relative font-mono text-[8px] tracking-[0.3em] uppercase"
        style={{ color: 'rgba(245,213,176,0.18)' }}>
        {sub}
      </span>
    </div>
  )
}

export default function Launch({ scrollerRef }) {
  const { days, hours, mins, secs } = useCountdown()
  const [activeStep, setActiveStep] = useState(0)
  const [initiated, setInitiated] = useState(false)
  const [scrollX, setScrollX] = useState(0)
  const stepRefs = useRef([])
  const horizontalRef = useRef(null)
  const rocketRef = useRef(null)

  useEffect(() => {
    const el = horizontalRef.current
    if (!el) return
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        el.scrollLeft += e.deltaY * 1.2
        setScrollX(el.scrollLeft)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    // Resolve the scroller — use the panel div when available, fall back to window
    const scroller = scrollerRef?.current ?? window

    const triggers = []

    stepRefs.current.forEach((el, i) => {
      if (!el) return
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          scroller,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        })
      )
    })

    if (rocketRef.current) {
      gsap.to(rocketRef.current, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: '#launch',
          scroller,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
    }

    // Clean up all triggers created in this effect when the component unmounts
    // or when the scroller changes (panel ref becomes available)
    return () => {
      triggers.forEach(t => t.kill())
      ScrollTrigger.getAll()
        .filter(t => t.vars?.scroller === scroller)
        .forEach(t => t.kill())
    }
  }, [scrollerRef])

  const countItems = [
    { val: days,    label: 'DAYS',  sub: 'until departure',   isLive: true  },
    { val: hours,   label: 'HRS',   sub: 'mission time',       isLive: true  },
    { val: mins,    label: 'MIN',   sub: 'elapsed',            isLive: true  },
    { val: secs,    label: 'SEC',   sub: 'live',               isLive: true  },
    { val: '∞',     label: 'KM',    sub: 'to infinity',        isLive: false },
    { val: '225M',  label: 'KM',    sub: 'distance to Mars',   isLive: false },
    { val: '11.2',  label: 'KM/S',  sub: 'escape velocity',    isLive: false },
    { val: '298',   label: 'DAYS',  sub: 'travel time',        isLive: false },
  ]

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes scanDown {
          from { transform: translateY(-100%); }
          to   { transform: translateY(200%); }
        }
        .countdown-heading-wrap {
          position: relative;
          display: inline-block;
        }
        /* Animated gradient text */
        .gradient-heading {
          background: linear-gradient(
            110deg,
            #fff5ee 0%,
            #f5d5b0 18%,
            #e05a1e 35%,
            #ff8040 48%,
            #c03010 62%,
            #6b1a00 75%,
            #e05a1e 88%,
            #f5d5b0 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }
        .outline-heading {
          -webkit-text-stroke: 1.5px rgba(224,90,30,0.55);
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        /* Glass card wrapping the heading */
        .heading-glass-card {
          backdrop-filter: blur(24px) saturate(1.6) brightness(1.05);
          -webkit-backdrop-filter: blur(24px) saturate(1.6) brightness(1.05);
          background: linear-gradient(
            135deg,
            rgba(224,90,30,0.09) 0%,
            rgba(10,4,2,0.78) 40%,
            rgba(30,8,0,0.82) 100%
          );
          border: 1px solid rgba(224,90,30,0.18);
          border-radius: 4px;
          box-shadow:
            0 0 0 1px rgba(255,120,40,0.06) inset,
            0 20px 80px rgba(0,0,0,0.7),
            0 0 80px rgba(224,90,30,0.08),
            inset 0 1px 0 rgba(255,180,80,0.08);
          position: relative;
          overflow: visible;
        }
        /* Scan beam — clipped via inner wrapper, not the card */
        .heading-glass-card .scan-beam-inner {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 4px;
          pointer-events: none;
        }
        /* Scan beam across glass */
        .heading-glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,150,60,0.06),
            transparent
          );
          animation: scanBeam 6s linear infinite;
          pointer-events: none;
        }
        @keyframes scanBeam {
          from { left: -50%; }
          to   { left: 110%; }
        }
        /* Corner accent marks */
        .corner-tl, .corner-br {
          position: absolute;
          width: 16px; height: 16px;
          border-color: rgba(224,90,30,0.5);
          border-style: solid;
          pointer-events: none;
        }
        .corner-tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

        /* Live indicator blink */
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        .live-dot { animation: blink 1.2s ease infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════
          SECTION A — GRAND COUNTDOWN
      ═══════════════════════════════════════════ */}
      <section
        id="launch"
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: '#020408' }}
      >
        {/* PSLV rocket — full height right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 z-0 pointer-events-none overflow-hidden">
          <img
            ref={rocketRef}
            src="https://upload.wikimedia.org/wikipedia/commons/e/e9/PSLV-C37_launching_104_satellites.jpg"
            alt="PSLV-C37 Rocket"
            onError={e => {
              e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/PSLV-C37_launching_104_satellites.jpg/800px-PSLV-C37_launching_104_satellites.jpg'
            }}
            className="w-full h-full object-cover"
            style={{
              objectPosition: 'center top',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              filter: 'brightness(0.5) sepia(0.2)',
              opacity: 0.8,
            }}
          />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(224,90,30,0.3) 0%, transparent 60%)'
          }} />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(224,90,30,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(224,90,30,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        {/* Top bar */}
        <div className="relative z-10 flex justify-between items-center px-8 md:px-16 pt-10 pb-6 border-b"
          style={{ borderColor: 'rgba(224,90,30,0.15)' }}>
          <span className="font-mono text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(224,90,30,0.6)' }}>
            ISRO — MOM II Mission Control
          </span>
          <span className="font-mono text-xs tracking-[0.3em]"
            style={{ color: 'rgba(245,213,176,0.3)' }}>
            PHASE 01 / LAUNCH INITIATION
          </span>
          <span className="font-mono text-xs tracking-[0.3em]"
            style={{ color: 'rgba(224,90,30,0.4)' }}>
            STATUS: GO FOR LAUNCH
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 py-12">

          {/* ─────────────────────────────────────
              GLASSMORPHISM + SPACE GRADIENT HEADING
          ───────────────────────────────────── */}
          <div className="mb-10" style={{ maxWidth: 'min(72%, 700px)' }}>

            {/* Eyebrow label with live dot */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="live-dot w-[6px] h-[6px] rounded-full"
                style={{ background: '#e05a1e', boxShadow: '0 0 8px #e05a1e' }}
              />
              <p className="font-mono text-[10px] tracking-[0.55em] uppercase"
                style={{ color: 'rgba(224,90,30,0.65)' }}>
                T — MINUS · LIVE FEED
              </p>
            </div>

            {/* Glass card wrapping the heading block */}
            <div
              className="heading-glass-card"
              style={{ padding: 'clamp(24px, 3vw, 36px) clamp(28px, 4vw, 48px) clamp(24px, 3vw, 36px) clamp(28px, 4vw, 48px)' }}
            >
              {/* Scan beam clipped inside its own overflow-hidden wrapper */}
              <div className="scan-beam-inner" />
              <div className="corner-tl" />
              <div className="corner-br" />

              {/* LAUNCH — gradient fill */}
              <h2
                className="gradient-heading font-['Bebas_Neue']"
                style={{
                  fontSize: 'clamp(4rem, 9.5vw, 9rem)',
                  letterSpacing: '0.01em',
                  lineHeight: 0.9,
                  display: 'block',
                  marginBottom: '0.06em',
                  paddingRight: '0.12em',
                }}
              >
                LAUNCH
              </h2>

              {/* COUNTDOWN — outline stroke style */}
              <h2
                className="outline-heading font-['Bebas_Neue']"
                style={{
                  fontSize: 'clamp(4rem, 9.5vw, 9rem)',
                  letterSpacing: '0.01em',
                  lineHeight: 0.9,
                  display: 'block',
                  paddingRight: '0.12em',
                }}
              >
                COUNTDOWN
              </h2>

              {/* Horizontal divider with glow */}
              <div style={{
                height: 1,
                marginTop: 'clamp(16px, 2vw, 24px)',
                background: 'linear-gradient(90deg, rgba(224,90,30,0.6), rgba(224,90,30,0.1) 60%, transparent)',
              }} />

              {/* Sub caption row */}
              <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase"
                  style={{ color: 'rgba(245,213,176,0.3)' }}>
                  ISRO · Mangalyaan II · 2047
                </p>
                <div className="flex items-center gap-2">
                  <div className="live-dot w-[5px] h-[5px] rounded-full"
                    style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  <span className="font-mono text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: '#10b98199' }}>
                    ALL SYSTEMS GO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              HORIZONTAL SCROLL COUNTDOWN STRIP
          ───────────────────────────────────── */}
          <div className="mb-10">
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase mb-3"
              style={{ color: 'rgba(245,213,176,0.2)' }}>
              ← Scroll horizontally →
            </p>
            <div
              ref={horizontalRef}
              className="flex gap-0 overflow-x-auto cursor-ew-resize"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maxWidth: 'min(72%, 700px)',
                borderLeft: '1px solid rgba(224,90,30,0.12)',
              }}
            >
              {countItems.map(({ val, label, sub, isLive }, i) => (
                <CountDigit
                  key={i}
                  val={val}
                  label={label}
                  sub={sub}
                  isLive={isLive}
                  accent="#e05a1e"
                />
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────
              BOTTOM ACTIONS ROW — unchanged
          ───────────────────────────────────── */}
          <div className="flex items-center gap-8 flex-wrap" style={{ maxWidth: 'min(72%, 700px)' }}>
            <button
              onClick={() => setInitiated(!initiated)}
              className="font-mono text-xs tracking-[0.4em] uppercase
              px-10 py-4 transition-all duration-500 relative overflow-hidden group"
              style={initiated ? {
                background: '#e05a1e',
                border: '1px solid #e05a1e',
                color: 'white',
              } : {
                background: 'transparent',
                border: '1px solid rgba(224,90,30,0.4)',
                color: 'rgba(245,180,100,0.7)',
              }}
              onMouseEnter={e => {
                if (!initiated) {
                  e.currentTarget.style.borderColor = '#e05a1e'
                  e.currentTarget.style.color = '#e05a1e'
                }
              }}
              onMouseLeave={e => {
                if (!initiated) {
                  e.currentTarget.style.borderColor = 'rgba(224,90,30,0.4)'
                  e.currentTarget.style.color = 'rgba(245,180,100,0.7)'
                }
              }}
            >
              {initiated ? '✓ SEQUENCE INITIATED' : 'INITIATE LAUNCH SEQUENCE'}
            </button>

            <div className="relative h-16 flex items-center">
              <div className={`text-5xl transition-all duration-1000
              ${initiated ? '-translate-y-20 opacity-0' : 'animate-[float_4s_ease-in-out_infinite]'}`}>
                🚀
              </div>
              {initiated && (
                <span className="font-['Bebas_Neue'] text-2xl tracking-widest animate-pulse"
                  style={{ color: '#e05a1e' }}>
                  WE HAVE LIFTOFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom courtesy */}
        <div className="relative z-10 px-8 md:px-16 pb-6 border-t pt-4 flex justify-between items-center"
          style={{ borderColor: 'rgba(224,90,30,0.1)' }}>
          <p className="font-mono text-xs tracking-widest"
            style={{ color: 'rgba(255,255,255,0.12)' }}>
            Rocket: PSLV-C25 — Courtesy ISRO
          </p>
          <p className="font-mono text-xs tracking-[0.3em] uppercase animate-bounce"
            style={{ color: 'rgba(245,180,100,0.25)' }}>
            Scroll down for mission timeline ↓
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION B — PLACARD TIMELINE (unchanged)
      ═══════════════════════════════════════════ */}
      <section id="launch-steps" className="relative" style={{ background: '#020408' }}>
        <div className="px-8 md:px-16 py-16 border-b"
          style={{ borderColor: 'rgba(224,90,30,0.1)' }}>
          <p className="font-mono text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: 'rgba(224,90,30,0.5)' }}>
            Mission Timeline
          </p>
          <h3 className="font-['Bebas_Neue'] text-5xl md:text-7xl"
            style={{ color: '#f5d5b0' }}>
            LAUNCH SEQUENCE<br />
            <span style={{ color: 'rgba(245,213,176,0.2)' }}>PHASE BY PHASE</span>
          </h3>
        </div>

        {placards.map((s, i) => (
          <div
            key={s.num}
            ref={el => stepRefs.current[i] = el}
            className="relative grid grid-cols-1 md:grid-cols-2 border-b overflow-hidden"
            style={{ borderColor: 'rgba(224,90,30,0.08)', minHeight: '100vh' }}
          >
            {/* IMAGE SIDE */}
            <div
              className={`relative overflow-hidden ${i % 2 === 0 ? 'order-1' : 'order-1 md:order-2'}`}
              style={{ minHeight: '55vh' }}
            >
              <img
                src={s.image}
                alt={s.title}
                onError={e => { e.currentTarget.src = `https://picsum.photos/seed/${i + 10}/900/700` }}
                className="w-full h-full object-cover transition-all duration-1000"
                style={{
                  filter: activeStep === i ? 'brightness(0.9) saturate(1.2) contrast(1.05)' : 'brightness(0.2) saturate(0.3)',
                  transform: activeStep === i ? 'scale(1.04)' : 'scale(1)',
                }}
              />
              <div className="absolute inset-0" style={{
                background: i % 2 === 0
                  ? 'linear-gradient(to right, transparent 50%, #020408 100%)'
                  : 'linear-gradient(to left, transparent 50%, #020408 100%)'
              }} />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, #020408 0%, transparent 15%, transparent 85%, #020408 100%)'
              }} />
              <div
                className="absolute top-8 left-8 font-mono text-xs tracking-[0.4em] uppercase transition-all duration-500"
                style={{ color: activeStep === i ? s.accent : 'rgba(255,255,255,0.15)' }}
              >
                {s.phase}
              </div>
              <p className="absolute bottom-6 right-6 font-mono text-xs"
                style={{ color: 'rgba(255,255,255,0.15)' }}>
                {s.imageLabel}
              </p>
            </div>

            {/* TEXT SIDE */}
            <div
              className={`flex flex-col justify-center px-10 md:px-16 py-16 transition-all duration-700
              ${i % 2 === 0 ? 'order-2' : 'order-2 md:order-1'}`}
              style={{
                opacity: activeStep === i ? 1 : 0.2,
                transform: activeStep === i ? 'translateY(0px)' : 'translateY(24px)',
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 transition-all duration-500" style={{
                  background: activeStep === i ? s.accent : 'transparent',
                  border: `1px solid ${s.accent}`,
                  transform: activeStep === i ? 'rotate(45deg)' : 'rotate(0deg)',
                }} />
                <span className="font-mono text-xs tracking-[0.4em]"
                  style={{ color: 'rgba(224,90,30,0.5)' }}>
                  {s.num} / {String(placards.length).padStart(2, '0')}
                </span>
                <div className="flex gap-1 ml-auto">
                  {placards.map((_, j) => (
                    <div key={j} className="h-px transition-all duration-400"
                      style={{
                        width: activeStep === j ? '28px' : '10px',
                        background: activeStep === j ? s.accent : 'rgba(224,90,30,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-['Bebas_Neue'] mb-6 whitespace-pre-line"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1, color: '#f5d5b0' }}>
                <HighlightText highlight={s.highlight} color={s.accent} active={activeStep === i}>
                  {s.title.replace('\n', ' ')}
                </HighlightText>
              </h3>

              <div className="font-['Bebas_Neue'] text-6xl mb-6 transition-colors duration-500"
                style={{ color: activeStep === i ? s.accent : 'rgba(224,90,30,0.15)' }}>
                {s.phase}
              </div>

              <p className="text-sm leading-relaxed mb-6 max-w-sm transition-colors duration-500"
                style={{ color: activeStep === i ? 'rgba(245,213,176,0.65)' : 'rgba(245,213,176,0.15)' }}>
                {s.desc}
              </p>

              <div className="overflow-hidden transition-all duration-600"
                style={{ maxHeight: activeStep === i ? '60px' : '0px', opacity: activeStep === i ? 1 : 0 }}>
                <div className="flex flex-wrap gap-2">
                  {s.detail.split(' • ').map((tag, t) => (
                    <span key={t} className="font-mono text-xs px-3 py-1 tracking-wider"
                      style={{ border: `1px solid ${s.accent}40`, color: s.accent, background: `${s.accent}10` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vertical step line */}
            <div className="absolute left-0 top-0 bottom-0 w-px hidden md:block transition-all duration-700"
              style={{
                background: activeStep === i
                  ? `linear-gradient(to bottom, transparent, ${s.accent}, transparent)`
                  : 'transparent',
              }}
            />
          </div>
        ))}
      </section>
    </>
  )
}