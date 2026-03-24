import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────
   HORIZONTAL SCROLL PANELS DATA
───────────────────────────────────────────── */
const horizPanels = [
  {
    num: '01',
    label: 'DAY 1',
    title: 'LIFTOFF',
    body: 'PSLV-C25 breaks free of Earth\'s atmosphere at 11.2 km/s. Gravity shrinks to nothing. The mission truly begins.',
    stat: '11.2', unit: 'KM/S',
    bg: 'linear-gradient(135deg, #1a0800 0%, #3d1200 60%, #5c1a00 100%)',
    accent: '#f97316',
    icon: '🚀',
  },
  {
    num: '02',
    label: 'DAY 14',
    title: 'SOLAR STORM',
    body: 'An X-class coronal mass ejection at 900 km/s hammers the hull. Radiation shielding hits maximum capacity.',
    stat: '900', unit: 'KM/S CME',
    bg: 'linear-gradient(135deg, #1a0000 0%, #4a0800 60%, #7a0f00 100%)',
    accent: '#ff4500',
    icon: '☀️',
  },
  {
    num: '03',
    label: 'DAY 60',
    title: 'HIBERNATION',
    body: 'Core body temperature drops to −34°C. Metabolism at 10% normal. AI holds vigil while humanity sleeps between worlds.',
    stat: '−34', unit: '°C CORE',
    bg: 'linear-gradient(135deg, #000d1a 0%, #001830 60%, #002040 100%)',
    accent: '#22d3ee',
    icon: '🧊',
  },
  {
    num: '04',
    label: 'DAY 127',
    title: 'RADIATION BELT',
    body: 'Galactic cosmic rays penetrate at 12× Earth-surface levels. The water wall absorbs 40%. Every day is a calculated risk.',
    stat: '12×', unit: 'RADIATION',
    bg: 'linear-gradient(135deg, #0a001a 0%, #1e0045 60%, #2d0060 100%)',
    accent: '#a78bfa',
    icon: '⚡',
  },
  {
    num: '05',
    label: 'DAY 298',
    title: 'MARS APPROACH',
    body: 'The Red Planet swells from a pinprick to a world. Retrograde burn begins. Seven minutes of terror awaits.',
    stat: '225M', unit: 'KM CROSSED',
    bg: 'linear-gradient(135deg, #1a0800 0%, #3d1500 60%, #6b2200 100%)',
    accent: '#e05a1e',
    icon: '🔴',
  },
]

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const telemetry = [
  { label: 'ELAPSED TIME', value: '127', unit: 'DAYS', sub: 'of 298 total', icon: '⏱' },
  { label: 'FROM EARTH', value: '96.4', unit: 'M KM', sub: 'and increasing', icon: '🌍' },
  { label: 'VELOCITY', value: '24.1', unit: 'KM/S', sub: 'heliocentric', icon: '⚡' },
  { label: 'RADIATION', value: '⚠ HIGH', unit: 'ALERT', sub: 'CME detected', icon: '☢' },
  { label: 'CREW TEMP', value: '−34', unit: '°C', sub: 'hibernation', icon: '🧊' },
  { label: 'SIGNAL DELAY', value: '5.3', unit: 'MIN', sub: 'one way', icon: '📡' },
  { label: 'HULL', value: '100', unit: '%', sub: 'integrity', icon: '🛡' },
  { label: 'FUEL', value: '71.4', unit: '%', sub: 'trans-Mars burn', icon: '🔥' },
]

// Round placard data for horizontal carousel
const transitCards = [
  {
    id: '01',
    phase: 'DAY 1–14',
    title: 'EARTH DEPARTURE',
    subtitle: 'Escaping the cradle',
    desc: 'Breaking free of Earth\'s gravity well at 11.2 km/s. The planet shrinks behind us — a blue marble then a point of light.',
    stat: '11.2 KM/S',
    statSub: 'Escape Velocity',
    gradient: 'from-[#1a0a00] via-[#3d1200] to-[#5c1a00]',
    glow: '#c0522a',
    border: '#e05a1e',
    emoji: '🚀',
  },
  {
    id: '02',
    phase: 'DAY 14–60',
    title: 'SOLAR STORM',
    subtitle: 'X-class flare impact',
    desc: 'A coronal mass ejection at 900 km/s strikes the hull. Radiation shields max out. Crew sleeps through the most violent moment of the mission.',
    stat: '900 KM/S',
    statSub: 'CME Speed',
    gradient: 'from-[#1a0000] via-[#3d0500] to-[#6b0d00]',
    glow: '#ff4500',
    border: '#ff6030',
    emoji: '☀',
  },
  {
    id: '03',
    phase: 'DAY 60–127',
    title: 'DEEP HIBERNATION',
    subtitle: 'Crew suspended at −34°C',
    desc: 'The crew enters cryosleep. Metabolism slows to 10% normal. AI systems maintain all critical functions for 200+ days of silence.',
    stat: '−34 °C',
    statSub: 'Core Temperature',
    gradient: 'from-[#000d1a] via-[#001a2e] to-[#00243d]',
    glow: '#0891b2',
    border: '#22d3ee',
    emoji: '🧊',
  },
  {
    id: '04',
    phase: 'DAY 127–200',
    title: 'COSMIC RADIATION',
    subtitle: '12× Earth surface levels',
    desc: 'Beyond Earth\'s magnetic shield, galactic cosmic rays penetrate at 12× surface levels. Water wall shielding absorbs 40% of the particle barrage.',
    stat: '12×',
    statSub: 'Radiation vs Earth',
    gradient: 'from-[#0a001a] via-[#1a0040] to-[#2d0060]',
    glow: '#7c3aed',
    border: '#a78bfa',
    emoji: '⚡',
  },
  {
    id: '05',
    phase: 'DAY 200–298',
    title: 'MARS APPROACH',
    subtitle: 'The Red Planet swells',
    desc: 'Mars fills the viewport. Retrograde burn begins. The 7 minutes of terror awaits. Every system is primed for the most dangerous manoeuvre in history.',
    stat: '298 DAYS',
    statSub: 'Total Transit',
    gradient: 'from-[#1a0800] via-[#3d1500] to-[#6b2200]',
    glow: '#e05a1e',
    border: '#f97316',
    emoji: '🔴',
  },
]

const hazards = [
  {
    id: '01',
    title: 'SOLAR STORM',
    intensity: 'X-CLASS FLARE',
    desc: 'A coronal mass ejection traveling at 900 km/s strikes the hull. Radiation shields at maximum. Crew remains in deep hibernation.',
    stat: '900 KM/S',
    statLabel: 'CME Speed',
    color: '#ff4500',
    bar: 92,
  },
  {
    id: '02',
    title: 'COSMIC RADIATION',
    intensity: 'SUSTAINED EXPOSURE',
    desc: 'Beyond the heliosphere, galactic cosmic rays penetrate hull plating at 12× Earth-surface levels. Water wall shielding absorbs 40%.',
    stat: '12×',
    statLabel: 'Radiation Level',
    color: '#7c3aed',
    bar: 75,
  },
  {
    id: '03',
    title: 'MICROGRAVITY',
    intensity: 'CONTINUOUS EFFECT',
    desc: 'Zero-g muscle atrophy at 1-2% per week. Automated resistance training runs 2-hour protocols during brief waking cycles.',
    stat: '0.00G',
    statLabel: 'Gravitational Force',
    color: '#0891b2',
    bar: 60,
  },
  {
    id: '04',
    title: 'PSYCHOLOGICAL VOID',
    intensity: 'ISOLATION PROTOCOL',
    desc: 'Earth has shrunk to a pale blue point. 18-minute communication delay makes real-time conversation with Earth impossible.',
    stat: '18 MIN',
    statLabel: 'Comms Delay',
    color: '#059669',
    bar: 48,
  },
]

/* ─────────────────────────────────────────────
   COUNT-UP HOOK
───────────────────────────────────────────── */
function CountUp({ target, duration = 2500 }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef()
  const started = useRef(false)

  useEffect(() => {
    const isNumeric = !isNaN(parseFloat(target))
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        if (!isNumeric) { setDisplay(target); return }
        const num = parseFloat(target)
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          const val = num * ease
          setDisplay(Number.isInteger(num) ? Math.floor(val) : val.toFixed(1))
          if (p < 1) requestAnimationFrame(tick)
          else setDisplay(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{display}</span>
}

/* ─────────────────────────────────────────────
   ROUND PLACARD (for horizontal carousel)
───────────────────────────────────────────── */
function RoundPlacard({ card, index, activeIndex }) {
  const isActive = index === activeIndex
  const isAdjacent = Math.abs(index - activeIndex) === 1

  return (
    <motion.div
      animate={{
        scale: isActive ? 1 : isAdjacent ? 0.88 : 0.75,
        opacity: isActive ? 1 : isAdjacent ? 0.65 : 0.35,
        y: isActive ? -20 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="shrink-0 relative cursor-pointer"
      style={{ width: 320, height: 380 }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-[40px] transition-all duration-700"
        style={{
          boxShadow: isActive
            ? `0 0 60px ${card.glow}60, 0 0 120px ${card.glow}20, inset 0 0 40px ${card.glow}10`
            : '0 0 20px rgba(0,0,0,0.5)',
          border: `1px solid ${isActive ? card.border : 'rgba(255,255,255,0.12)'}`,
        }}
      />

      {/* Card body */}
      <div
        className={`absolute inset-0 rounded-[40px] bg-gradient-to-br ${card.gradient} overflow-hidden`}
      >
        {/* Radial glow inside */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${card.glow}30 0%, transparent 70%)`,
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8">
          {/* Top row */}
          <div className="flex justify-between items-start">
            <div>
              <div
                className="font-mono text-xs tracking-[0.4em] uppercase mb-1"
                style={{ color: `${card.border}aa` }}
              >
                {card.phase}
              </div>
              <div
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Phase {card.id} / 05
              </div>
            </div>
            <div className="text-3xl">{card.emoji}</div>
          </div>

          {/* Title */}
          <div>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2.2rem',
                lineHeight: 1,
                color: '#f5d5b0',
                marginBottom: '0.5rem',
              }}
            >
              {card.title}
            </h3>
            <div
              className="font-mono text-xs tracking-wider mb-4"
              style={{ color: `${card.border}cc` }}
            >
              — {card.subtitle}
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'rgba(232,221,208,0.85)' }}
            >
              {card.desc}
            </p>
          </div>

          {/* Stat pill */}
          <div
            className="rounded-full px-5 py-3 self-start"
            style={{
              background: `${card.glow}20`,
              border: `1px solid ${card.border}40`,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.6rem',
                lineHeight: 1,
                color: card.border,
              }}
            >
              {card.stat}
            </div>
            <div
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {card.statSub}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   HAZARD ROW with Mars glow bar
───────────────────────────────────────────── */
function HazardRow({ h, index }) {
  const ref = useRef()
  const [barWidth, setBarWidth] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        setTimeout(() => setBarWidth(h.bar), 200 + index * 150)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [h.bar, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden p-7 md:p-9"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid rgba(255,255,255,0.12)`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
        style={{ background: `linear-gradient(to bottom, transparent, ${h.color}, transparent)` }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-center">
        {/* Title block */}
        <div>
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: h.color + 'aa' }}
          >
            {h.id} — {h.intensity}
          </p>
          <h4
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.8rem',
              color: '#f5d5b0',
              lineHeight: 1,
            }}
          >
            {h.title}
          </h4>
        </div>

        {/* Desc + Bar */}
        <div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(232,221,208,0.8)' }}>
            {h.desc}
          </p>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1500"
              style={{
                width: `${barWidth}%`,
                background: `linear-gradient(to right, ${h.color}60, ${h.color})`,
                transitionDuration: '1.5s',
                boxShadow: `0 0 12px ${h.color}80`,
              }}
            />
          </div>
          <div
            className="flex justify-between font-mono text-[10px] tracking-widest uppercase mt-1"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <span>THREAT LEVEL</span>
            <span>{h.bar}%</span>
          </div>
        </div>

        {/* Stat */}
        <div className="text-center md:text-right">
          <div
            className="inline-block rounded-full px-5 py-4"
            style={{
              background: `${h.color}12`,
              border: `1px solid ${h.color}30`,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                color: h.color,
                lineHeight: 1,
              }}
            >
              {h.stat}
            </div>
            <div
              className="font-mono text-[10px] tracking-widest uppercase mt-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {h.statLabel}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   TELEMETRY ORBS
───────────────────────────────────────────── */
function TelemetryOrb({ t, index }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold: 0.2 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isAlert = t.label.includes('RADIATION')
  const accentColor = isAlert ? '#ff4500' : '#c0522a'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 40 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Orb */}
      <div
        className="relative flex flex-col items-center justify-center mb-3"
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 100%)`,
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 24px ${accentColor}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* Glow pulse for alerts */}
        {isAlert && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: `${accentColor}15`,
              animationDuration: '2s',
            }}
          />
        )}

        <div className="text-xl mb-1">{t.icon}</div>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.4rem',
            lineHeight: 1,
            color: isAlert ? '#ff4500' : '#f5d5b0',
          }}
        >
          <CountUp target={t.value} />
        </div>
        <div
          className="font-mono text-[9px] tracking-widest"
          style={{ color: accentColor + 'cc' }}
        >
          {t.unit}
        </div>
      </div>

      {/* Label below orb */}
      <div
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{ color: 'rgba(255,255,255,0.6)' }}
      >
        {t.label}
      </div>
      <div
        className="font-mono text-[9px] mt-0.5"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        {t.sub}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SpaceTravel({ scrollerRef }) {
  const sectionRef = useRef()
  const headingRef = useRef()
  const videoRef = useRef()
  const carouselRef = useRef()
  const horizWrapRef = useRef()
  const horizTrackRef = useRef()
  const [activeCard, setActiveCard] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const scrollStart = useRef(0)

  // Parallax for heading section — scoped to the panel scroller
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    container: scrollerRef,
    offset: ['start end', 'end start'],
  })
  const headingY = useTransform(sectionProgress, [0, 1], [60, -60])
  const headingYSpring = useSpring(headingY, { stiffness: 60, damping: 20 })

  // Character animation on heading
  useEffect(() => {
    const scroller = scrollerRef?.current ?? window

    const ctx = gsap.context(() => {
      const chars = headingRef.current?.querySelectorAll('.char')
      if (chars?.length) {
        gsap.fromTo(chars,
          { opacity: 0, y: 80, rotateX: -90 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 1.4,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              scroller,
              start: 'top 75%',
            }
          }
        )
      }

      // Video parallax
      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { scale: 1.12, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: videoRef.current, scroller, start: 'top 80%' }
          }
        )
      }

      // ── HORIZONTAL SCROLL SECTION ──
      if (horizWrapRef.current && horizTrackRef.current) {
        const panels = horizTrackRef.current.querySelectorAll('.horiz-panel')
        const totalWidth = horizTrackRef.current.scrollWidth
        const viewportWidth = window.innerWidth

        gsap.to(horizTrackRef.current, {
          x: -(totalWidth - viewportWidth),
          ease: 'none',
          scrollTrigger: {
            id: 'horiz-scroll',
            trigger: horizWrapRef.current,
            scroller,
            start: 'top top',
            end: () => `+=${totalWidth - viewportWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        })

        // Stagger reveal each panel's content as it slides in.
        // Deferred so the 'horiz-scroll' trigger is fully registered
        // before we call ScrollTrigger.getById() on it.
        setTimeout(() => {
          const horizST = ScrollTrigger.getById('horiz-scroll')
          if (!horizST) return
          panels.forEach((panel, i) => {
            const content = panel.querySelector('.panel-content')
            if (!content) return
            gsap.fromTo(content,
              { opacity: 0, y: 40 },
              {
                opacity: 1, y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: horizWrapRef.current,
                  scroller,
                  start: () => `top top+=${i * (totalWidth - viewportWidth) / (horizPanels.length - 1) * 0.7}`,
                  toggleActions: 'play none none reverse',
                  containerAnimation: horizST,
                }
              }
            )
          })
        }, 100)
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [scrollerRef])

  // Carousel scroll sync
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return
    const el = carouselRef.current
    const cardWidth = 320 + 28 // card width + gap
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveCard(Math.max(0, Math.min(index, transitCards.length - 1)))
  }

  // Wheel → horizontal scroll on carousel section
  const handleWheel = (e) => {
    if (!carouselRef.current) return
    e.preventDefault()
    carouselRef.current.scrollLeft += e.deltaY * 1.2
  }

  // Drag to scroll
  const handleMouseDown = (e) => {
    setIsDragging(true)
    dragStart.current = e.clientX
    scrollStart.current = carouselRef.current?.scrollLeft ?? 0
  }
  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return
    const delta = dragStart.current - e.clientX
    carouselRef.current.scrollLeft = scrollStart.current + delta
  }
  const handleMouseUp = () => setIsDragging(false)

  return (
    <section
      id="travel"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #020408 0%, #0d0400 30%, #1a0800 60%, #020408 100%)',
        color: '#e8ddd0',
      }}
    >

      {/* ══════════════════════════════════════
          PART 1 — CINEMATIC HEADING
      ══════════════════════════════════════ */}
      <div className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 py-24 overflow-hidden">

        {/* Mars dust background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, rgba(140,40,10,0.18) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(200,80,20,0.10) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 90%, rgba(100,20,5,0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* Subtle Mars-tone grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(180,60,20,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(180,60,20,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Floating dust particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${180 + Math.random() * 60},${40 + Math.random() * 40},${10 + Math.random() * 20},${0.3 + Math.random() * 0.4})`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Phase label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs tracking-[0.6em] uppercase mb-10"
          style={{ color: 'rgba(230,120,60,0.9)' }}
        >
          Phase 02 / Deep Space Transit / Day 127 of 298
        </motion.p>

        {/* Character-split heading with parallax */}
        <motion.div style={{ y: headingYSpring }}>
          <div ref={headingRef} style={{ perspective: '1000px' }}>
            {[
              { text: 'DEEP SPACE', color: '#f5d5b0' },
              { text: 'TRANSIT', color: '#e05a1e' },
            ].map((line, li) => (
              <div key={li}>
                {line.text.split('').map((char, ci) => (
                  <span
                    key={ci}
                    className="char inline-block"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(4rem, 11vw, 10rem)',
                      lineHeight: 0.9,
                      color: line.color,
                      opacity: 0,
                      display: char === ' ' ? 'inline' : 'inline-block',
                      textShadow: li === 1 ? '0 0 40px rgba(224,90,30,0.4)' : 'none',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 text-sm leading-relaxed max-w-md font-light"
          style={{ color: 'rgba(232,221,208,0.78)' }}
        >
          Seven months. 225 million kilometres. Beyond the reach of Earth.
          The void is not empty — it is alive with radiation, particle storms,
          and the silence between worlds.
        </motion.p>

        {/* Stats pill row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {['225M KM', '298 DAYS', '24.1 KM/S', '0G'].map((stat) => (
            <div
              key={stat}
              className="rounded-full px-5 py-2 font-mono text-xs tracking-widest"
              style={{
                background: 'rgba(200,80,30,0.1)',
                border: '1px solid rgba(200,80,30,0.25)',
                color: '#e05a1e',
              }}
            >
              {stat}
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
          className="mt-14 flex items-center gap-4"
        >
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-px w-10"
            style={{ background: 'rgba(200,80,30,0.5)' }}
          />
          <p
            className="font-mono text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(220,110,60,0.85)' }}
          >
            Scroll to traverse the void
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          PART 1.5 — PINNED HORIZONTAL SCROLL
      ══════════════════════════════════════ */}
      <div
        ref={horizWrapRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Progress bar at top */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-20"
          style={{ background: 'rgba(224,90,30,0.12)' }}
        />

        {/* Scrolling track */}
        <div
          ref={horizTrackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${horizPanels.length * 100}vw` }}
        >
          {horizPanels.map((p, i) => (
            <div
              key={p.num}
              className="horiz-panel relative flex-shrink-0 h-full flex items-center justify-center overflow-hidden"
              style={{ width: '100vw', background: p.bg }}
            >
              {/* Panel background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, ${p.accent}18 0%, transparent 65%)`,
                }}
              />

              {/* Grid lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(${p.accent}06 1px, transparent 1px), linear-gradient(90deg, ${p.accent}06 1px, transparent 1px)`,
                  backgroundSize: '80px 80px',
                }}
              />

              {/* Large faded number */}
              <div
                className="absolute right-12 bottom-0 select-none pointer-events-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(12rem, 22vw, 22rem)',
                  lineHeight: 0.85,
                  color: `${p.accent}08`,
                  letterSpacing: '-0.02em',
                }}
              >
                {p.num}
              </div>

              {/* Content */}
              <div className="panel-content relative z-10 max-w-3xl px-12 md:px-20">
                {/* Top label */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-2 h-2 rounded-sm rotate-45"
                    style={{ background: p.accent }}
                  />
                  <span
                    className="font-mono text-xs tracking-[0.5em] uppercase"
                    style={{ color: `${p.accent}cc` }}
                  >
                    Phase {p.num} · {p.label}
                  </span>
                  <div
                    className="h-px flex-1 max-w-[80px]"
                    style={{ background: `${p.accent}30` }}
                  />
                </div>

                {/* Emoji */}
                <div className="text-6xl mb-6">{p.icon}</div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(4rem, 9vw, 8rem)',
                    lineHeight: 0.9,
                    color: '#fff5ee',
                    marginBottom: '1.5rem',
                    textShadow: `0 0 60px ${p.accent}30`,
                  }}
                >
                  {p.title}
                </h3>

                {/* Body */}
                <p
                  className="text-base md:text-lg leading-relaxed mb-10 max-w-lg"
                  style={{ color: 'rgba(255,240,225,0.82)' }}
                >
                  {p.body}
                </p>

                {/* Stat pill */}
                <div className="flex items-center gap-6">
                  <div
                    className="rounded-2xl px-7 py-4"
                    style={{
                      background: `${p.accent}18`,
                      border: `1px solid ${p.accent}45`,
                      boxShadow: `0 0 30px ${p.accent}20`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '2.4rem',
                        lineHeight: 1,
                        color: p.accent,
                      }}
                    >
                      {p.stat}
                    </div>
                    <div
                      className="font-mono text-xs tracking-widest uppercase mt-1"
                      style={{ color: 'rgba(255,240,225,0.75)' }}
                    >
                      {p.unit}
                    </div>
                  </div>

                  {/* Step dots */}
                  <div className="flex gap-2">
                    {horizPanels.map((_, j) => (
                      <div
                        key={j}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === j ? 24 : 8,
                          height: 8,
                          background: i === j ? p.accent : 'rgba(255,255,255,0.2)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right-edge hint arrow (except last) */}
              {i < horizPanels.length - 1 && (
                <div
                  className="absolute right-8 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest"
                  style={{ color: `${p.accent}50`, writingMode: 'vertical-rl' }}
                >
                  SCROLL ↓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom panel counter */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.4em] uppercase z-20"
          style={{ color: 'rgba(255,200,150,0.7)' }}
        >
          Scroll to advance mission →
        </div>
      </div>

      {/* ══════════════════════════════════════
          PART 2 — HORIZONTAL ROUND PLACARDS
      ══════════════════════════════════════ */}
      <div
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d0400 0%, #1a0800 50%, #0d0400 100%)',
          borderTop: '1px solid rgba(200,80,30,0.08)',
          borderBottom: '1px solid rgba(200,80,30,0.08)',
        }}
      >
        {/* Background Mars glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(140,40,10,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Section header */}
        <div className="px-8 md:px-16 mb-12">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-3"
            style={{ color: 'rgba(220,110,60,0.85)' }}
          >
            Transit Phases — Swipe or Scroll →
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: '#f5d5b0',
              lineHeight: 0.95,
            }}
          >
            THE JOURNEY<br />
            <span style={{ color: 'rgba(245,213,176,0.5)' }}>PHASE BY PHASE</span>
          </motion.h3>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-7 overflow-x-auto px-8 md:px-16 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onScroll={handleCarouselScroll}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Left padding sentinel */}
          <div className="shrink-0 w-0" />

          {transitCards.map((card, i) => (
            <div
              key={card.id}
              style={{ scrollSnapAlign: 'center' }}
              onClick={() => {
                setActiveCard(i)
                const el = carouselRef.current
                if (el) {
                  const cardWidth = 320 + 28
                  el.scrollTo({ left: i * cardWidth, behavior: 'smooth' })
                }
              }}
            >
              <RoundPlacard card={card} index={i} activeIndex={activeCard} />
            </div>
          ))}

          {/* Right padding */}
          <div className="shrink-0 w-16" />
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 justify-center mt-8">
          {transitCards.map((card, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveCard(i)
                if (carouselRef.current) {
                  carouselRef.current.scrollTo({
                    left: i * (320 + 28),
                    behavior: 'smooth',
                  })
                }
              }}
              className="transition-all duration-400 rounded-full"
              style={{
                width: activeCard === i ? 28 : 8,
                height: 8,
                background: activeCard === i ? '#e05a1e' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* Active card detail strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mx-8 md:mx-16 mt-10 rounded-3xl p-6 md:p-8"
            style={{
              background: `linear-gradient(to right, ${transitCards[activeCard].glow}12, transparent)`,
              border: `1px solid ${transitCards[activeCard].border}25`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <p
                  className="font-mono text-xs tracking-widest uppercase mb-1"
                  style={{ color: `${transitCards[activeCard].border}aa` }}
                >
                  {transitCards[activeCard].phase}
                </p>
                <h4
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2rem',
                    color: '#f5d5b0',
                    lineHeight: 1,
                  }}
                >
                  {transitCards[activeCard].title}
                </h4>
              </div>
              <p
                className="text-sm leading-relaxed col-span-1"
                style={{ color: 'rgba(232,221,208,0.85)' }}
              >
                {transitCards[activeCard].desc}
              </p>
              <div className="flex gap-4 flex-wrap">
                {transitCards.map((_, i) => (
                  <div
                    key={i}
                    className="font-mono text-xs rounded-full px-3 py-1 transition-all duration-300"
                    style={{
                      background: activeCard === i ? `${transitCards[i].glow}30` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${activeCard === i ? transitCards[i].border + '60' : 'rgba(255,255,255,0.12)'}`,
                      color: activeCard === i ? transitCards[i].border : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════
          PART 3 — SOLAR STORM VIDEO
      ══════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <div ref={videoRef} className="absolute inset-0 z-0">
          {!videoLoaded && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, #2d0a00 0%, #020408 70%)',
              }}
            >
              <p
                className="font-mono text-xs tracking-[0.4em] uppercase animate-pulse"
                style={{ color: 'rgba(255,69,0,0.5)' }}
              >
                Loading Solar Storm Feed...
              </p>
            </div>
          )}
          <video
            autoPlay muted loop playsInline preload="auto"
            onCanPlay={() => setVideoLoaded(true)}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.45) saturate(1.8) hue-rotate(5deg)' }}
          >
            <source src="/solar.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, #0d0400 0%, transparent 12%, transparent 85%, #0d0400 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(13,4,0,0.8) 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)' }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 py-24 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ boxShadow: ['0 0 10px rgba(255,69,0,0.3)', '0 0 25px rgba(255,69,0,0.5)', '0 0 10px rgba(255,69,0,0.3)'] }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity }, opacity: { duration: 0.8 } }}
            className="font-mono text-xs tracking-[0.4em] uppercase px-5 py-2.5 rounded-full"
            style={{
              color: '#ff4500',
              border: '1px solid rgba(255,69,0,0.4)',
              background: 'rgba(255,69,0,0.08)',
            }}
          >
            ⚠ SOLAR STORM DETECTED — X2.4 CLASS FLARE
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              lineHeight: 0.9,
              color: '#f5d5b0',
              textShadow: '0 0 80px rgba(255,69,0,0.5)',
            }}
          >
            COMBATING<br />
            <span style={{ color: '#ff4500' }}>THE STORM</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-sm leading-relaxed max-w-lg font-light"
            style={{ color: 'rgba(232,221,208,0.85)' }}
          >
            A coronal mass ejection traveling at 900 km/s strikes the spacecraft hull.
            Automated deflector shields engage. The crew sleeps through the most violent
            event of the mission.
          </motion.p>

          {/* Round data cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-4"
          >
            {[
              { l: 'SHIELD STATUS', v: 'ACTIVE', color: '#10b981' },
              { l: 'PARTICLE FLUX', v: '4.2×10⁴', color: '#ff4500' },
              { l: 'CME SPEED', v: '900 KM/S', color: '#f97316' },
              { l: 'ETA IMPACT', v: '00:04:22', color: '#ef4444' },
            ].map(({ l, v, color }) => (
              <div
                key={l}
                className="rounded-2xl px-6 py-4 text-center min-w-[130px]"
                style={{
                  background: 'rgba(2,4,8,0.85)',
                  border: `1px solid ${color}30`,
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 0 20px ${color}15`,
                }}
              >
                <div className="font-mono text-[10px] mb-1.5 tracking-widest uppercase" style={{ color: `${color}80` }}>
                  {l}
                </div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.5rem',
                    color,
                    lineHeight: 1,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </motion.div>

          <p className="font-mono text-xs mt-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Video: NASA Solar Dynamics Observatory (Public Domain)
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PART 4 — TELEMETRY ORBS
      ══════════════════════════════════════ */}
      <div
        className="relative px-8 md:px-16 py-24"
        style={{
          background: 'linear-gradient(180deg, #0d0400 0%, #1a0900 100%)',
          borderTop: '1px solid rgba(200,80,30,0.08)',
        }}
      >
        {/* Mars atmosphere glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(150,50,15,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: 'rgba(220,110,60,0.85)' }}
          >
            Live Mission Telemetry
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-16"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: '#f5d5b0',
              lineHeight: 0.95,
            }}
          >
            ONBOARD<br />
            <span style={{ color: 'rgba(245,213,176,0.45)' }}>SYSTEMS STATUS</span>
          </motion.h3>

          {/* Orbs grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 md:gap-8">
            {telemetry.map((t, i) => (
              <TelemetryOrb key={t.label} t={t} index={i} />
            ))}
          </div>

          {/* Horizontal scroll ticker */}
          <div
            className="mt-16 overflow-hidden relative"
            style={{ borderTop: '1px solid rgba(200,80,30,0.08)', paddingTop: '24px' }}
          >
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="flex gap-12 whitespace-nowrap"
            >
              {[...telemetry, ...telemetry].map((t, i) => (
                <span
                  key={i}
                  className="font-mono text-xs tracking-[0.3em] uppercase shrink-0"
                  style={{ color: 'rgba(200,80,30,0.3)' }}
                >
                  {t.label}: {t.value} {t.unit} ·
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PART 5 — HAZARD ROWS (ROUND CARDS)
      ══════════════════════════════════════ */}
      <div
        className="relative px-8 md:px-16 py-24"
        style={{
          background: 'linear-gradient(180deg, #1a0900 0%, #0d0400 100%)',
          borderTop: '1px solid rgba(200,80,30,0.06)',
        }}
      >
        {/* Scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,80,30,0.015) 3px, rgba(200,80,30,0.015) 4px)',
          }}
        />

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: 'rgba(220,110,60,0.75)' }}
          >
            Known Hazards En Route
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-16"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: '#f5d5b0',
              lineHeight: 0.95,
            }}
          >
            THREATS IN<br />
            <span style={{ color: 'rgba(245,213,176,0.45)' }}>THE VOID</span>
          </motion.h3>

          <div className="flex flex-col gap-4">
            {hazards.map((h, i) => (
              <HazardRow key={h.id} h={h} index={i} />
            ))}
          </div>

          {/* Bottom summary — round info pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { label: 'Next Milestone', title: 'MARS ORBIT INSERTION', sub: '171 days remaining', color: '#e05a1e' },
              { label: 'Mission Control', title: 'ISRO TELEMETRY', sub: 'Bengaluru, India', color: '#c0522a' },
              { label: 'Crew Status', title: 'DEEP HIBERNATION', sub: 'All vitals nominal', color: '#0891b2' },
            ].map(({ label, title, sub, color }) => (
              <div
                key={label}
                className="rounded-3xl p-7"
                style={{
                  background: `linear-gradient(135deg, ${color}10, transparent)`,
                  border: `1px solid ${color}20`,
                }}
              >
                <p
                  className="font-mono text-xs tracking-widest uppercase mb-3"
                  style={{ color: `${color}80` }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.6rem',
                    color: '#f5d5b0',
                    lineHeight: 1,
                  }}
                >
                  {title}
                </p>
                <p className="font-mono text-xs mt-2" style={{ color: 'rgba(232,221,208,0.55)' }}>
                  {sub}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}