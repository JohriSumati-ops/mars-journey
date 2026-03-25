import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Stars from './components/Stars'
import Hero from './sections/Hero'
import Launch from './sections/Launch'
import SpaceTravel from './sections/SpaceTravel'
import MarsLanding from './sections/MarsLanding'
import Exploration from './sections/Exploration'
import ThankYou from './sections/Thankyou'


gsap.registerPlugin(ScrollTrigger)

const PAGES = [
  { id: 'hero',        label: 'HOME',    roman: 'I'   },
  { id: 'launch',      label: 'LAUNCH',  roman: 'II'  },
  { id: 'travel',      label: 'TRANSIT', roman: 'III' },
  { id: 'landing',     label: 'LANDING', roman: 'IV'  },
  { id: 'exploration', label: 'EXPLORE', roman: 'V'   },
]

// ── Cinematic cursor ──────────────────────────────
function CinematicCursor() {
  const dotRef  = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const move = (e) => {
      gsap.to(dotRef.current,  { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none' })
      gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power2.out' })
    }
    const over = (e) => {
      setHovered(!!e.target.closest('button, a, [data-hover]'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 6, height: 6,
        background: '#e05a1e', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed',
        width: hovered ? 50 : 32,
        height: hovered ? 50 : 32,
        border: `1px solid ${hovered ? '#e05a1e' : 'rgba(224,90,30,0.4)'}`,
        borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        transition: 'width 0.3s, height 0.3s, border-color 0.3s',
        mixBlendMode: 'difference',
      }} />
    </>
  )
}

// ── Music Player ──────────────────────────────────
function MusicPlayer() {
  const audioRef = useRef()
  const [playing, setPlaying] = useState(false)
  const [volume,  setVolume]  = useState(0.4)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play().catch(() => {}); setPlaying(true) }
  }

  return (
    <>
      <audio ref={audioRef} src="/music/track.mp3" loop />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3"
        style={{
          background: 'rgba(2,4,8,0.9)',
          border: '1px solid rgba(224,90,30,0.2)',
          backdropFilter: 'blur(16px)',
          padding: '10px 16px',
        }}
      >
        <button onClick={toggle}
          className="flex items-center gap-2 font-mono text-xs
          tracking-widest uppercase transition-colors duration-300"
          style={{ color: playing ? '#e05a1e' : 'rgba(245,213,176,0.4)' }}
          data-hover
        >
          <span>{playing ? '▐▐' : '▶'}</span>
          <span>{playing ? 'PLAYING' : 'MISSION AUDIO'}</span>
        </button>
        <div className="w-px h-4" style={{ background: 'rgba(224,90,30,0.15)' }} />
        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e => {
            setVolume(+e.target.value)
            if (audioRef.current) audioRef.current.volume = +e.target.value
          }}
          className="w-14 accent-orange-600" style={{ cursor: 'pointer' }}
        />
        {playing && (
          <div className="flex items-end gap-px" style={{ height: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                width: 3, background: '#e05a1e', borderRadius: 1,
                animation: `mbar${i} ${0.35 + i*0.08}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}
      </motion.div>
      <style>{`
        @keyframes mbar1{from{height:3px}to{height:13px}}
        @keyframes mbar2{from{height:7px}to{height:9px}}
        @keyframes mbar3{from{height:5px}to{height:15px}}
        @keyframes mbar4{from{height:9px}to{height:5px}}
      `}</style>
    </>
  )
}

// ── Page transition overlay ───────────────────────
// fromPage: which page we are leaving
function PageTransition({ active, direction, fromPage }) {
  const isLaunchToTransit = fromPage === 1 && direction === 1

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="pt"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 900,
            background: '#020408',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(224,90,30,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(224,90,30,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          {/* Wipe bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.6, ease: [0.77,0,0.175,1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #0d0400, #020408)',
              transformOrigin: direction === 1 ? 'left' : 'right',
            }}
          />

          {/* ── SATELLITE SCENE — only Launch→Transit ── */}
          {isLaunchToTransit && (
            <div style={{
              position: 'relative', zIndex: 10,
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>

              {/* Stars burst */}
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: 0.2 + i * 0.04,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    borderRadius: '50%',
                    background: 'white',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}

              {/* Speed lines */}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + i * 0.06,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    height: 1,
                    width: `${20 + Math.random() * 40}%`,
                    left: `${Math.random() * 30}%`,
                    top: `${8 + i * 5.5}%`,
                    background: `linear-gradient(to right, transparent,
                      rgba(100,150,255,${0.2 + Math.random() * 0.3}), transparent)`,
                    transformOrigin: 'left center',
                  }}
                />
              ))}

              {/* Satellite SVG — flying across */}
              <motion.div
                initial={{ x: '-30vw', y: '10vh', rotate: -15, opacity: 0 }}
                animate={{ x: '60vw', y: '-15vh', rotate: -15, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, delay: 0.3, ease: 'easeInOut' }}
                style={{ position: 'absolute', zIndex: 20 }}
              >
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
                  {/* Body */}
                  <rect x="40" y="22" width="40" height="16" rx="3"
                    fill="#1a1a2e" stroke="rgba(100,150,255,0.6)" strokeWidth="1" />
                  {/* Solar panel left */}
                  <rect x="4" y="18" width="32" height="24" rx="2"
                    fill="rgba(30,60,120,0.8)" stroke="rgba(100,150,255,0.5)" strokeWidth="1" />
                  {/* Solar panel right */}
                  <rect x="84" y="18" width="32" height="24" rx="2"
                    fill="rgba(30,60,120,0.8)" stroke="rgba(100,150,255,0.5)" strokeWidth="1" />
                  {/* Panel grid lines left */}
                  <line x1="14" y1="18" x2="14" y2="42" stroke="rgba(100,150,255,0.3)" strokeWidth="0.5"/>
                  <line x1="24" y1="18" x2="24" y2="42" stroke="rgba(100,150,255,0.3)" strokeWidth="0.5"/>
                  <line x1="4"  y1="30" x2="36" y2="30" stroke="rgba(100,150,255,0.3)" strokeWidth="0.5"/>
                  {/* Panel grid lines right */}
                  <line x1="94" y1="18" x2="94" y2="42" stroke="rgba(100,150,255,0.3)" strokeWidth="0.5"/>
                  <line x1="104" y1="18" x2="104" y2="42" stroke="rgba(100,150,255,0.3)" strokeWidth="0.5"/>
                  <line x1="84" y1="30" x2="116" y2="30" stroke="rgba(100,150,255,0.3)" strokeWidth="0.5"/>
                  {/* Connector arms */}
                  <rect x="36" y="28" width="8" height="4" fill="rgba(100,150,255,0.4)"/>
                  <rect x="76" y="28" width="8" height="4" fill="rgba(100,150,255,0.4)"/>
                  {/* Antenna */}
                  <line x1="60" y1="22" x2="60" y2="8" stroke="rgba(224,90,30,0.8)" strokeWidth="1.5"/>
                  <circle cx="60" cy="7" r="3" fill="none" stroke="rgba(224,90,30,0.8)" strokeWidth="1"/>
                  {/* Thruster glow */}
                  <ellipse cx="40" cy="30" rx="4" ry="6"
                    fill="rgba(224,90,30,0.6)"
                    style={{ filter: 'blur(2px)' }}
                  />
                </svg>
                {/* Engine exhaust trail */}
                <motion.div
                  animate={{ scaleX: [0.5, 1.2, 0.8], opacity: [0.6, 1, 0.4] }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    left: -60, top: 24,
                    width: 60, height: 12,
                    background: 'linear-gradient(to left, rgba(224,90,30,0.8), transparent)',
                    transformOrigin: 'right center',
                    borderRadius: 6,
                  }}
                />
              </motion.div>

              {/* Solar storm particle burst */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 3, 6], opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.8, delay: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 200, height: 200,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,100,30,0.4)',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                }}
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 4], opacity: [0, 0.3, 0] }}
                transition={{ duration: 1.5, delay: 1.0, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 120, height: 120,
                  borderRadius: '50%',
                  border: '1px solid rgba(100,150,255,0.3)',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                }}
              />

              {/* Text overlay */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -20] }}
                transition={{ duration: 2.4, times: [0, 0.2, 0.7, 1], delay: 0.4 }}
                style={{
                  position: 'absolute', bottom: '15%', textAlign: 'center',
                  zIndex: 30,
                }}
              >
                <p style={{
                  fontFamily: 'monospace', fontSize: 10,
                  letterSpacing: '0.5em', textTransform: 'uppercase',
                  color: 'rgba(100,150,255,0.6)', marginBottom: 8,
                }}>
                  ENTERING DEEP SPACE
                </p>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  letterSpacing: '0.3em', color: '#f5d5b0',
                }}>
                  TRANSIT PHASE INITIATED
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, delay: 0.6, ease: 'linear' }}
                  style={{
                    height: 1, marginTop: 10,
                    background: 'linear-gradient(to right, transparent, rgba(100,150,255,0.6), transparent)',
                  }}
                />
              </motion.div>
            </div>
          )}

          {/* ── STANDARD transitions for all other pages ── */}
          {!isLaunchToTransit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0,1,1,0], y: [20,0,0,-10] }}
              transition={{ duration: 1.2, times: [0,0.15,0.75,1] }}
              style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}
            >
              <p style={{
                fontFamily: 'monospace', fontSize: 9,
                letterSpacing: '0.5em', textTransform: 'uppercase',
                color: 'rgba(224,90,30,0.4)', marginBottom: 12,
              }}>
                {direction === 1 ? 'PROCEEDING TO' : 'RETURNING TO'}
              </p>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                letterSpacing: '0.2em', color: '#f5d5b0',
              }}>
                {direction === 1
                  ? PAGES[Math.min(fromPage + 1, PAGES.length - 1)].label
                  : PAGES[Math.max(fromPage - 1, 0)].label
                }
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  height: 1, marginTop: 12,
                  background: 'linear-gradient(to right, transparent, #e05a1e, transparent)',
                  transformOrigin: 'center',
                }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Side dot nav ──────────────────────────────────
function DotNav({ current, goTo }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50
      flex flex-col items-center gap-4"
    >
      {PAGES.map((p, i) => (
        <button key={p.id} onClick={() => goTo(i)} data-hover title={p.label}
          className="flex items-center gap-2"
        >
          {current === i && (
            <span style={{
              fontFamily: 'monospace', fontSize: 9,
              letterSpacing: '0.3em', color: 'rgba(224,90,30,0.5)',
            }}>
              {p.roman}
            </span>
          )}
          <div style={{
            width:  current === i ? 10 : 5,
            height: current === i ? 10 : 5,
            borderRadius: '50%',
            background: current === i ? '#e05a1e' : 'rgba(245,213,176,0.15)',
            boxShadow: current === i ? '0 0 12px rgba(224,90,30,0.7)' : 'none',
            transition: 'all 0.4s',
          }} />
        </button>
      ))}
    </motion.div>
  )
}

// ── Main App ──────────────────────────────────────
export default function App() {
  const [loading,       setLoading]       = useState(true)
  const [currentPage,   setCurrentPage]   = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [transDir,      setTransDir]      = useState(1)
  const [fromPage,      setFromPage]      = useState(0)

  const panelRefs    = useRef([])
  const scrollerRefs = useRef(Array.from({ length: 5 }, () => ({ current: null })))
  const isAnimating  = useRef(false)
  const wheelBuf     = useRef(0)
  const wheelTimer   = useRef(null)

  // ── Navigate with lag ───────────────────────────
  const goTo = useCallback((index) => {
    const target = Math.max(0, Math.min(index, PAGES.length - 1))
    if (target === currentPage || isAnimating.current) return

    const dir = target > currentPage ? 1 : -1
    isAnimating.current = true
    setTransDir(dir)
    setFromPage(currentPage)
    setTransitioning(true)

    // Satellite scene needs longer display time
    const isSpecial = currentPage === 1 && dir === 1
    const lag = isSpecial ? 2800 : 1000

    setTimeout(() => {
      setCurrentPage(target)
      if (panelRefs.current[target]) {
        panelRefs.current[target].scrollTop = 0
      }
    }, lag - 300)

    setTimeout(() => {
      setTransitioning(false)
      isAnimating.current = false
    }, lag)

  }, [currentPage])

  const goNext = useCallback(() => goTo(currentPage + 1), [currentPage, goTo])
  const goPrev = useCallback(() => goTo(currentPage - 1), [currentPage, goTo])

  // ── Loading ─────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(t)
  }, [])

  // ── ScrollTrigger scroller fix ──────────────────
  useEffect(() => {
    const panel = panelRefs.current[currentPage]
    if (!panel) return
    const id = setTimeout(() => {
      ScrollTrigger.defaults({ scroller: panel })
      ScrollTrigger.refresh()
    }, 750)
    return () => clearTimeout(id)
  }, [currentPage])

  // ── Wheel ────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      const panel = panelRefs.current[currentPage]
      if (!panel) return

      const atTop    = panel.scrollTop <= 2
      const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2
      const goingDown = e.deltaY > 0

      if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
        panel.scrollTop += e.deltaY
        wheelBuf.current = 0
        return
      }

      wheelBuf.current += e.deltaY
      clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => { wheelBuf.current = 0 }, 400)

      if (Math.abs(wheelBuf.current) > 150) {
        wheelBuf.current = 0
        goingDown ? goNext() : goPrev()
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [currentPage, goNext, goPrev])

  // ── Touch ────────────────────────────────────────
  useEffect(() => {
    let sx = 0, sy = 0
    const ts = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const te = (e) => {
      const dx = sx - e.changedTouches[0].clientX
      const dy = sy - e.changedTouches[0].clientY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
        dx > 0 ? goNext() : goPrev()
      }
    }
    window.addEventListener('touchstart', ts, { passive: true })
    window.addEventListener('touchend',   te, { passive: true })
    return () => {
      window.removeEventListener('touchstart', ts)
      window.removeEventListener('touchend',   te)
    }
  }, [goNext, goPrev])

  // ── Keyboard ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  return (
    <>
      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: '#020408',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 24,
            }}
          >
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ width: 80, height: 80,
                border: '1px solid rgba(224,90,30,0.15)',
                borderTop: '1px solid #e05a1e',
                borderRadius: '50%', position: 'absolute' }}
            />
            <motion.div animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ width: 50, height: 50,
                border: '1px solid rgba(224,90,30,0.1)',
                borderBottom: '1px solid rgba(224,90,30,0.6)',
                borderRadius: '50%', position: 'absolute' }}
            />
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                color: '#f5d5b0', marginTop: 60 }}
            >
              JOURNEY TO MARS
            </motion.h1>
            <motion.div
              initial={{ width: 0 }} animate={{ width: 200 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              style={{ height: 1, background: 'linear-gradient(to right, transparent, #e05a1e, transparent)' }}
            />
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ fontFamily: 'monospace', fontSize: 11,
                letterSpacing: '0.4em', color: 'rgba(245,213,176,0.35)',
                textTransform: 'uppercase' }}
            >
              Initializing Mission Systems...
            </motion.p>
            {['NAVIGATION SYSTEM... OK','LIFE SUPPORT... OK','PROPULSION... OK','COMMS ARRAY... OK'].map((line, i) => (
              <motion.p key={line}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.3 }}
                style={{ fontFamily: 'monospace', fontSize: 9,
                  letterSpacing: '0.2em', color: 'rgba(224,90,30,0.4)',
                  textTransform: 'uppercase' }}
              >{line}</motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CinematicCursor />
      <Stars />
      <MusicPlayer />

      <PageTransition
        active={transitioning}
        direction={transDir}
        fromPage={fromPage}
      />

      {!loading && <DotNav current={currentPage} goTo={goTo} />}

      {/* Top progress bar */}
      {!loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, zIndex: 50, height: 2,
          background: 'linear-gradient(to right, #e05a1e, #ff4500)',
          width: `${((currentPage + 1) / PAGES.length) * 100}%`,
          transition: 'width 0.7s cubic-bezier(0.77,0,0.175,1)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Bottom nav */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2 }}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            display: 'flex', justifyContent: 'center', padding: '12px 24px',
            background: 'linear-gradient(to top, rgba(2,4,8,0.95), transparent)',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            border: '1px solid rgba(224,90,30,0.1)',
            background: 'rgba(2,4,8,0.8)',
            backdropFilter: 'blur(20px)',
            pointerEvents: 'all', overflow: 'hidden',
            maxWidth: '100vw',
          }}>
            <button onClick={goPrev} disabled={currentPage === 0} data-hover
              style={{
                fontFamily: 'monospace', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '10px 12px',
                color: currentPage === 0 ? 'rgba(245,213,176,0.1)' : 'rgba(245,213,176,0.5)',
                background: 'transparent', border: 'none',
                borderRight: '1px solid rgba(224,90,30,0.1)',
                cursor: currentPage === 0 ? 'default' : 'pointer',
                transition: 'color 0.3s', whiteSpace: 'nowrap',
              }}
            >← </button>

            {PAGES.map((p, i) => (
              <button key={p.id} onClick={() => goTo(i)} data-hover
                style={{
                  fontFamily: 'monospace', fontSize: 8,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '10px 10px',
                  color: currentPage === i ? '#e05a1e' : 'rgba(245,213,176,0.2)',
                  background: currentPage === i ? 'rgba(224,90,30,0.08)' : 'transparent',
                  border: 'none',
                  borderRight: '1px solid rgba(224,90,30,0.1)',
                  cursor: 'pointer', transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                }}
              >{p.label}</button>
            ))}

            <button onClick={goNext} disabled={currentPage === PAGES.length - 1} data-hover
              style={{
                fontFamily: 'monospace', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '10px 12px',
                color: currentPage === PAGES.length - 1 ? 'rgba(245,213,176,0.1)' : 'white',
                background: currentPage === PAGES.length - 1 ? 'transparent' : '#e05a1e',
                border: 'none',
                cursor: currentPage === PAGES.length - 1 ? 'default' : 'pointer',
                transition: 'all 0.3s', whiteSpace: 'nowrap',
              }}
            > →</button>
          </div>
        </motion.div>
      )}

      {/* Page counter top-left */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          style={{
            position: 'fixed', top: 20, left: 24, zIndex: 50,
            fontFamily: 'monospace', fontSize: 10,
            letterSpacing: '0.3em', color: 'rgba(245,213,176,0.25)',
            textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span style={{ color: '#e05a1e' }}>{String(currentPage + 1).padStart(2, '0')}</span>
          <span style={{ width: 30, height: 1, background: 'rgba(245,213,176,0.15)', display: 'inline-block' }} />
          <span>{String(PAGES.length).padStart(2, '0')}</span>
          <span style={{ marginLeft: 8 }}>{PAGES[currentPage].label}</span>
        </motion.div>
      )}

      {/* Panel pages */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
        {[
          <Hero        key="hero"        onNext={goNext} />,
          <Launch      key="launch"      onNext={goNext} scrollerRef={scrollerRefs.current[1]} />,
          <SpaceTravel key="travel"      onNext={goNext} scrollerRef={scrollerRefs.current[2]} />,
          <MarsLanding key="landing"     onNext={goNext} scrollerRef={scrollerRefs.current[3]} />,
          <Exploration key="exploration"                 scrollerRef={scrollerRefs.current[4]} />,
        ].map((section, i) => {
          const offset     = i - currentPage
          const isActive   = i === currentPage
          const isAdjacent = Math.abs(offset) === 1

          return (
            <motion.div
              key={i}
              ref={el => {
                panelRefs.current[i] = el
                scrollerRefs.current[i].current = el
              }}
              animate={{
                x:       `${offset * 100}%`,
                scale:   isActive ? 1 : 0.92,
                opacity: isActive ? 1 : isAdjacent ? 0 : 0,
                filter:  isActive ? 'brightness(1)' : 'brightness(0.3)',
              }}
              transition={{
                x:       { duration: 0.7, ease: [0.77,0,0.175,1] },
                scale:   { duration: 0.7, ease: [0.77,0,0.175,1] },
                opacity: { duration: 0.4 },
                filter:  { duration: 0.5 },
              }}
              style={{
                position: 'absolute', inset: 0,
                overflowY: isActive ? 'auto' : 'hidden',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                isolation: 'isolate',
              }}
            >
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : transDir * 30,
                }}
                transition={{ duration: 0.6, delay: isActive ? 0.3 : 0 }}
                style={{ minHeight: '100%' }}
              >
                {section}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <style>{`
        * { cursor: none !important; }
        ::-webkit-scrollbar { display: none; }
        body { overflow: hidden; background: #020408; }
      `}</style>
    </>
  )
}