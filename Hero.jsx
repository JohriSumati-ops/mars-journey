import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { label: 'Launch', id: 'launch' },
  { label: 'Transit', id: 'travel' },
  { label: 'Landing', id: 'landing' },
  { label: 'Explore', id: 'exploration' },
]

// ── Earth → Mars orbit path ───────────────────────
function OrbitPath() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(100,150,255,0)" />
          <stop offset="40%" stopColor="rgba(100,150,255,0.3)" />
          <stop offset="100%" stopColor="rgba(224,90,30,0.4)" />
        </linearGradient>
      </defs>
      <ellipse
        cx="50%" cy="60%"
        rx="38%" ry="22%"
        fill="none"
        stroke="url(#orbitGrad)"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.5"
      />
    </svg>
  )
}

// ── Rocket launch animation ────────────────────────
function RocketTrail({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: '20%', bottom: '15%', zIndex: 25 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Rocket */}
          <motion.div
            initial={{ y: 0, x: 0, rotate: -45, scale: 1 }}
            animate={{ y: -500, x: 300, rotate: -45, scale: 0.3 }}
            transition={{ duration: 2.2, ease: [0.2, 0, 0.8, 1] }}
            style={{ fontSize: '3rem' }}
          >
            🚀
          </motion.div>
          {/* Trail */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, delay: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 40, left: 24,
              width: 3,
              background: 'linear-gradient(to top, rgba(224,90,30,0.8), transparent)',
              transformOrigin: 'bottom',
              borderRadius: 2,
              transform: 'rotate(-45deg)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Hero({ onNext }) {
  const [launching, setLaunching] = useState(false)
  const [rocketFired, setRocketFired] = useState(false)
  const [showEarthMars, setShowEarthMars] = useState(false)
  const audioCtxRef = useRef(null)

  // ── Auto-play music on first interaction ──────────
  useEffect(() => {
    // Try silent autoplay trick — create audio context on load
    const tryAutoPlay = () => {
      // Dispatch a synthetic user gesture to unlock audio
      const audio = document.querySelector('audio')
      if (audio && audio.paused) {
        audio.volume = 0.4
        audio.play().catch(() => {})
      }
    }

    // Try immediately
    tryAutoPlay()

    // Also try after first any interaction
    const unlock = () => {
      tryAutoPlay()
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('click', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })

    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])

  // ── Show Earth-Mars path after load ───────────────
  useEffect(() => {
    const t = setTimeout(() => setShowEarthMars(true), 3600)
    return () => clearTimeout(t)
  }, [])

  const handleBeginMission = () => {
    if (launching) return
    setLaunching(true)
    setRocketFired(true)
    setTimeout(() => {
      onNext?.()
      setLaunching(false)
      setRocketFired(false)
    }, 2500)
  }

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col justify-between
      pb-16 px-6 md:px-12 bg-black overflow-hidden"
    >

      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/mars.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,_rgba(80,10,5,0.4)_0%,_transparent_70%)]" />
      </div>

      {/* ── Orbit path ── */}
      <AnimatePresence>
        {showEarthMars && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ zIndex: 5 }}
          >
            <OrbitPath />

            {/* Earth — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute"
              style={{ bottom: '18%', left: '8%' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #4a9eff, #1a5cb0 50%, #0a2d60)',
                boxShadow: '0 0 20px rgba(74,158,255,0.4)',
                position: 'relative',
              }}>
                {/* Earth cloud wisps */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.15), transparent 40%)',
                }} />
              </div>
              <p style={{
                fontFamily: 'monospace', fontSize: 8,
                letterSpacing: '0.3em', color: 'rgba(74,158,255,0.6)',
                marginTop: 6, textAlign: 'center',
                textTransform: 'uppercase',
              }}>EARTH</p>
            </motion.div>

            {/* Mars — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute"
              style={{ top: '20%', right: '12%' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #d4623a, #8a2c10 50%, #3d0f04)',
                boxShadow: '0 0 16px rgba(212,98,58,0.5)',
              }} />
              <p style={{
                fontFamily: 'monospace', fontSize: 8,
                letterSpacing: '0.3em', color: 'rgba(224,90,30,0.6)',
                marginTop: 6, textAlign: 'center',
                textTransform: 'uppercase',
              }}>MARS</p>
            </motion.div>

            {/* Spacecraft dot on orbit */}
            <motion.div
              className="absolute"
              style={{ zIndex: 10 }}
              animate={{
                left: ['12%', '30%', '55%', '78%', '85%'],
                top: ['70%', '55%', '42%', '32%', '25%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
                delay: 1,
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#e05a1e',
                boxShadow: '0 0 8px rgba(224,90,30,0.8)',
              }} />
            </motion.div>

            {/* Distance label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute"
              style={{ bottom: '32%', left: '38%' }}
            >
              <p style={{
                fontFamily: 'monospace', fontSize: 8,
                letterSpacing: '0.3em', color: 'rgba(245,213,176,0.25)',
                textTransform: 'uppercase',
              }}>225M KM</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rocket trail on launch ── */}
      <RocketTrail active={rocketFired} />

      {/* ── Cinematic launch overlay ── */}
      <AnimatePresence>
        {launching && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-20"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.95) 100%)' }}
            />
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div key={i}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', height: 1,
                    width: `${30 + Math.random() * 60}%`,
                    left: `${Math.random() * 40}%`,
                    top: `${5 + i * 4.5}%`,
                    background: `linear-gradient(to right, transparent, rgba(224,90,30,${0.3 + Math.random() * 0.4}), transparent)`,
                    transformOrigin: 'left center',
                  }}
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 8], opacity: [0, 1, 0] }}
              transition={{ duration: 2, ease: 'easeIn', delay: 0.2 }}
              className="absolute z-20 pointer-events-none"
              style={{
                width: 300, height: 300, borderRadius: '50%',
                border: '1px solid rgba(224,90,30,0.6)',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 6], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2, ease: 'easeIn', delay: 0.4 }}
              className="absolute z-20 pointer-events-none"
              style={{
                width: 200, height: 200, borderRadius: '50%',
                border: '1px solid rgba(224,90,30,0.4)',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.2] }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.7, 1] }}
              className="absolute z-30 pointer-events-none"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}
            >
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                letterSpacing: '0.4em', color: '#f5d5b0',
              }}>
                INITIATING MISSION
              </p>
              <motion.div
                initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
                style={{
                  height: 1,
                  background: 'linear-gradient(to right, transparent, #e05a1e, transparent)',
                  marginTop: 12,
                }}
              />
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'monospace', fontSize: 10,
                  letterSpacing: '0.4em', color: 'rgba(224,90,30,0.6)',
                  marginTop: 8, textTransform: 'uppercase',
                }}
              >
                Preparing launch sequence...
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, times: [0, 0.6, 0.8, 1] }}
              className="absolute inset-0 z-40 pointer-events-none"
              style={{ background: '#020408' }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.8 }}
        className="relative z-10 flex justify-between items-center pt-8"
      >
        <ul className="hidden md:flex gap-10">
          {navItems.slice(0, 2).map(({ label, id }) => (
            <li key={id}>
              <button className="font-mono text-xs tracking-[0.2em] uppercase
              text-stone-300 hover:text-white transition-colors duration-300">
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="font-['Bebas_Neue'] text-xl tracking-[0.4em] text-stone-200 text-center">
          MARS<br />
          <span className="text-xs font-mono tracking-[0.3em] text-stone-400">2047</span>
        </div>
        <ul className="hidden md:flex gap-10">
          {navItems.slice(2).map(({ label, id }) => (
            <li key={id}>
              <button className="font-mono text-xs tracking-[0.2em] uppercase
              text-stone-300 hover:text-white transition-colors duration-300">
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="md:hidden font-['Bebas_Neue'] text-lg tracking-[0.3em] text-stone-400">
          MARS — 2047
        </div>
      </motion.nav>

      {/* ── Mars Planet ── */}
      <motion.img
        src="https://space-facts.com/wp-content/uploads/mars-v2.jpg"
        alt="Mars"
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 2.8, ease: 'easeOut' }}
        className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2
        w-80 h-80 lg:w-[420px] lg:h-[420px] object-cover z-10
        animate-[float_8s_ease-in-out_infinite]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ── Bottom Content ── */}
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="font-mono text-xs tracking-[0.4em] text-red-500 uppercase mb-4"
        >
          Mission — 2047
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.0 }}
          className="font-['Bebas_Neue'] text-[5rem] md:text-[8rem]
          lg:text-[10rem] leading-none tracking-wide text-stone-100"
        >
          JOURNEY<br />
          <span className="text-red-600">TO MARS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="mt-6 text-stone-400 text-sm md:text-base font-light max-w-md leading-relaxed"
        >
          A 7-month odyssey through the void.
          The most ambitious mission in human history begins now.
        </motion.p>

        {/* ── KILLER INTERACTION: Begin Mission button ── */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: launching ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: launching ? 0 : 3.4 }}
          whileHover={!launching ? {
            scale: 1.06,
            boxShadow: '0 0 40px rgba(224,90,30,0.5)',
          } : {}}
          whileTap={!launching ? { scale: 0.97 } : {}}
          onClick={handleBeginMission}
          disabled={launching}
          data-hover
          className="mt-8 md:mt-10 px-8 md:px-10 py-3 md:py-4
          font-mono text-xs tracking-widest uppercase relative overflow-hidden"
          style={{
            background: launching ? 'transparent' : '#b91c1c',
            color: 'white',
            border: launching ? '1px solid rgba(224,90,30,0.3)' : 'none',
          }}
        >
          {/* Button shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              pointerEvents: 'none',
            }}
          />
          {launching ? 'LAUNCHING...' : 'BEGIN MISSION'}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          className="mt-4 font-mono text-xs text-stone-600 tracking-widest"
        >
          Video courtesy: ISRO — Mangalyaan Mars Orbiter Mission
        </motion.p>
      </div>
    </section>
  )
}