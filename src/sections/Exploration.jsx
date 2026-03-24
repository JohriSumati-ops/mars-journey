import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

const missions = [
  {
    id: '01',
    title: 'BASE CAMP\nSETUP',
    shortTitle: 'BASE CAMP',
    desc: 'Deploy habitat modules, solar arrays, and life support systems.',
    detail:
      'The first 72 hours on Mars are critical. Crew deploys the inflatable habitat, connects it to the pre-landed power unit, and runs full life support diagnostics before removing helmets inside.',
    stat: '72',
    statUnit: 'HRS',
    statLabel: 'Setup Window',
    tag: 'PHASE 04 — A',
    accent: '#e05a1e',
    glow: 'rgba(224,90,30,0.55)',
    bg: 'linear-gradient(135deg, #0d0200 0%, #2a0a00 40%, #3d1500 70%, #1a0800 100%)',
    stripe: 'rgba(224,90,30,0.08)',
    icon: '🏕',
  },
  {
    id: '02',
    title: 'SOIL\nANALYSIS',
    shortTitle: 'SOIL ANALYSIS',
    desc: 'Drill 2 meters into Martian regolith searching for biosignatures.',
    detail:
      'Using the MOXIE drill system, scientists extract core samples from 2m depth where liquid water may have once flowed. Each gram of soil is analyzed for organic compounds and microbial signatures.',
    stat: '2',
    statUnit: 'M',
    statLabel: 'Drill Depth',
    tag: 'PHASE 04 — B',
    accent: '#c0522a',
    glow: 'rgba(192,82,42,0.55)',
    bg: 'linear-gradient(135deg, #0a0000 0%, #200800 40%, #3a1200 70%, #150500 100%)',
    stripe: 'rgba(192,82,42,0.08)',
    icon: '🔬',
  },
  {
    id: '03',
    title: 'OLYMPUS\nMONS',
    shortTitle: 'OLYMPUS MONS',
    desc: 'Remote rover expedition to the largest volcano in the solar system.',
    detail:
      'The Perseverance II rover begins its 800km autonomous journey toward Olympus Mons. At 22km high and 600km wide, it dwarfs anything on Earth. Camera arrays transmit 4K panoramas across 225M km.',
    stat: '22',
    statUnit: 'KM',
    statLabel: 'Summit Height',
    tag: 'PHASE 04 — C',
    accent: '#ff4500',
    glow: 'rgba(255,69,0,0.55)',
    bg: 'linear-gradient(135deg, #150300 0%, #350a00 40%, #5c1500 70%, #1f0600 100%)',
    stripe: 'rgba(255,69,0,0.08)',
    icon: '🌋',
  },
  {
    id: '04',
    title: 'FIRST\nSUNRISE',
    shortTitle: 'FIRST SUNRISE',
    desc: 'Document the first Martian sunrise witnessed by human eyes.',
    detail:
      "At 24 hours 37 minutes, the Martian day is slightly longer than Earth's. The sunrise appears distinctly blue near the sun due to fine dust scattering — a phenomenon no human eye has ever witnessed live." ,
    stat: '24H',
    statUnit: '37M',
    statLabel: 'Martian Day',
    tag: 'PHASE 04 — D',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.55)',
    bg: 'linear-gradient(135deg, #120400 0%, #2d0d00 40%, #4a1800 70%, #1a0800 100%)',
    stripe: 'rgba(249,115,22,0.08)',
    icon: '🌅',
  },
]

/* ─────────────────────────────────────────────
   PARTICLE FIELD — floating dust motes
───────────────────────────────────────────── */
function DustParticles({ accent }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: accent,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -60 - Math.random() * 40],
            x: [0, (Math.random() - 0.5) * 30],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   HORIZONTAL MISSION CARD
───────────────────────────────────────────── */
function MissionCard({ m, index, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, x: 120, rotateY: 15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{
        width: 'clamp(340px, 28vw, 420px)',
        height: 'clamp(480px, 55vh, 580px)',
        borderRadius: 2,
        background: m.bg,
        border: `1px solid ${isActive ? m.accent : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isActive
          ? `0 0 0 1px ${m.accent}50, 0 30px 80px ${m.glow}, inset 0 1px 0 ${m.accent}30`
          : '0 20px 60px rgba(0,0,0,0.6)',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        overflow: 'hidden',
      }}
    >
      {/* Animated scan stripe */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${m.stripe} 3px, ${m.stripe} 4px)`,
        }}
      />

      {/* Active glow top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        animate={{ opacity: isActive ? 1 : 0.2 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(90deg, transparent, ${m.accent}, transparent)` }}
      />

      {/* Dust particles when active */}
      {isActive && <DustParticles accent={m.accent} />}

      {/* Corner number */}
      <div
        className="absolute top-6 right-6 font-mono"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '5rem',
          lineHeight: 1,
          color: isActive ? `${m.accent}25` : 'rgba(255,255,255,0.04)',
          transition: 'color 0.5s',
          letterSpacing: '-0.02em',
        }}
      >
        {m.id}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-8 md:p-10">
        {/* Tag */}
        <div
          className="font-mono text-[10px] tracking-[0.45em] uppercase mb-6"
          style={{ color: `${m.accent}90` }}
        >
          {m.tag}
        </div>

        {/* Icon */}
        <motion.div
          animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
          className="text-4xl mb-6"
        >
          {m.icon}
        </motion.div>

        {/* Title */}
        <h3
          className="whitespace-pre-line mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2.4rem, 3.5vw, 3.2rem)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
            color: '#f5e8d8',
          }}
        >
          {m.title}
        </h3>

        {/* Desc */}
        <p
          className="text-sm leading-relaxed mb-auto"
          style={{ color: 'rgba(245,232,216,0.5)', maxWidth: 300 }}
        >
          {m.desc}
        </p>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: isActive ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-8 left-8 font-mono text-lg"
          style={{ color: isActive ? m.accent : 'rgba(255,255,255,0.15)' }}
        >
          +
        </motion.div>

        {/* Bottom stat block */}
        <div
          className="mt-8 pt-6"
          style={{ borderTop: `1px solid ${isActive ? m.accent + '40' : 'rgba(255,255,255,0.07)'}` }}
        >
          <div className="flex items-end gap-3">
            <div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '3.5rem',
                  lineHeight: 0.9,
                  color: isActive ? m.accent : 'rgba(255,255,255,0.1)',
                  transition: 'color 0.4s',
                  textShadow: isActive ? `0 0 30px ${m.glow}` : 'none',
                }}
              >
                {m.stat}
                <span style={{ fontSize: '1.6rem', marginLeft: 4 }}>{m.statUnit}</span>
              </div>
              <div
                className="font-mono text-[10px] tracking-[0.35em] uppercase mt-1"
                style={{ color: 'rgba(245,232,216,0.3)' }}
              >
                {m.statLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   EXPANDED DETAIL PANEL
───────────────────────────────────────────── */
function DetailPanel({ mission }) {
  return (
    <AnimatePresence mode="wait">
      {mission && (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          style={{ borderTop: `1px solid ${mission.accent}20` }}
        >
          <div
            className="relative px-8 md:px-12 py-10 overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${mission.accent}08 0%, transparent 100%)`,
            }}
          >
            {/* Background number watermark */}
            <div
              className="absolute right-0 bottom-0 font-mono select-none pointer-events-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(8rem, 15vw, 18rem)',
                lineHeight: 0.85,
                color: `${mission.accent}06`,
                letterSpacing: '-0.05em',
              }}
            >
              {mission.id}
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
              {/* Detail text */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4"
                  style={{ color: `${mission.accent}80` }}
                >
                  Mission Brief — {mission.shortTitle}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="text-sm leading-[1.9] max-w-md"
                  style={{ color: 'rgba(245,228,208,0.75)' }}
                >
                  {mission.detail}
                </motion.p>
              </div>

              {/* Stat display */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="flex flex-col justify-center"
              >
                <div className="inline-flex flex-col">
                  <div
                    className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                  >
                    Key Metric
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(4rem, 8vw, 7rem)',
                      lineHeight: 0.85,
                      color: mission.accent,
                      textShadow: `0 0 60px ${mission.glow}`,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {mission.stat}
                    <span
                      style={{
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        marginLeft: 8,
                        color: `${mission.accent}80`,
                      }}
                    >
                      {mission.statUnit}
                    </span>
                  </div>
                  <div
                    className="font-mono text-xs tracking-[0.4em] uppercase mt-3"
                    style={{ color: 'rgba(245,228,208,0.35)' }}
                  >
                    {mission.statLabel}
                  </div>
                </div>

                {/* Mars gradient bar */}
                <div className="mt-6 h-px w-full max-w-xs" style={{ background: `linear-gradient(90deg, ${mission.accent}, transparent)` }} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
function Exploration() {
  const [active, setActive] = useState(null)
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [dragStartX, setDragStartX] = useState(null)
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0)

  // Convert vertical scroll to horizontal inside the scroller
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = (e) => {
      // Only hijack wheel if user is hovering the scroll track
      e.preventDefault()
      el.scrollLeft += e.deltaY * 1.3
      updateScrollState()
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  // Drag to scroll
  const onMouseDown = (e) => {
    setDragStartX(e.pageX)
    setDragStartScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e) => {
    if (dragStartX === null) return
    const dx = e.pageX - dragStartX
    scrollRef.current.scrollLeft = dragStartScrollLeft - dx
    updateScrollState()
  }
  const onMouseUp = () => {
    setDragStartX(null)
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  const activeMission = missions.find((m) => m.id === active)

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: 'smooth' })
    setTimeout(updateScrollState, 400)
  }

  return (
    <section
      id="exploration"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020100 0%, #0a0300 30%, #050100 100%)',
      }}
    >
      {/* ── Ambient Mars radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(180,50,10,0.12) 0%, transparent 70%)',
        }}
      />

      {/* ── Grain texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: '160px 160px',
        }}
      />

      {/* ─────────────────
          SECTION HEADER
      ───────────────── */}
      <div className="relative z-10 px-6 md:px-14 pt-24 pb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] tracking-[0.55em] uppercase mb-4"
              style={{ color: 'rgba(224,90,30,0.7)' }}
            >
              Phase 04 — Surface Operations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(4rem, 9vw, 9rem)',
                lineHeight: 0.9,
                letterSpacing: '0.01em',
                color: '#f5e8d8',
              }}
            >
              SURFACE<br />
              <span
                style={{
                  WebkitTextStroke: '1px rgba(224,90,30,0.5)',
                  color: 'transparent',
                }}
              >
                EXPLORATION
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-end gap-3"
          >
            {/* Scroll controls */}
            <div className="flex gap-2">
              {[
                { dir: -1, label: '←', enabled: canScrollLeft },
                { dir: 1, label: '→', enabled: canScrollRight },
              ].map(({ dir, label, enabled }) => (
                <button
                  key={dir}
                  onClick={() => scrollBy(dir)}
                  className="font-mono text-sm w-10 h-10 flex items-center justify-center transition-all duration-300"
                  style={{
                    border: `1px solid ${enabled ? 'rgba(224,90,30,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: enabled ? '#e05a1e' : 'rgba(255,255,255,0.15)',
                    background: enabled ? 'rgba(224,90,30,0.06)' : 'transparent',
                    cursor: enabled ? 'pointer' : 'default',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
              Drag or scroll to explore
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─────────────────────────
          HORIZONTAL SCROLL TRACK
      ───────────────────────── */}
      <div className="relative z-10">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to right, #020100, transparent)',
            opacity: canScrollLeft ? 1 : 0,
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #020100, transparent)' }}
        />

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto overflow-y-visible pb-4"
          style={{
            cursor: 'grab',
            paddingLeft: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            paddingRight: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {missions.map((m, i) => (
            <MissionCard
              key={m.id}
              m={m}
              index={i}
              isActive={active === m.id}
              onClick={() => setActive(active === m.id ? null : m.id)}
            />
          ))}

          {/* Terminal end card */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 180 }}
          >
            <div className="text-center">
              <div
                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
                style={{ color: 'rgba(255,255,255,0.1)' }}
              >
                Mission
              </div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2.5rem',
                  color: 'rgba(224,90,30,0.12)',
                  lineHeight: 1,
                }}
              >
                2047
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────
          EXPANDED DETAIL PANEL
      ───────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 mt-2">
        <DetailPanel mission={activeMission} />
      </div>

      {/* ─────────────────────────
          PROGRESS INDICATOR ROW
      ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 mt-10 pb-10 flex items-center gap-6"
      >
        <div className="flex gap-2">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(active === m.id ? null : m.id)}
              className="transition-all duration-400"
              style={{
                height: 2,
                width: active === m.id ? 40 : 16,
                background: active === m.id ? m.accent : 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
          {active ? `Mission ${active} Selected` : 'Select a mission'}
        </span>

        {/* Right watermark */}
        <div className="ml-auto font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.06)' }}>
          JOURNEY TO MARS — 2047
        </div>
      </motion.div>

      {/* ─────────────────────────
          BOTTOM DIVIDER GLOW
      ───────────────────────── */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(224,90,30,0.3) 30%, rgba(224,90,30,0.3) 70%, transparent)',
        }}
      />

      <style>{`
        #exploration ::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}

export default Exploration