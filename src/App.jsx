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

// ── Minimal fixed music player ────────────────────
function MusicPlayer() {
  const audioRef = useRef()
  const [playing, setPlaying] = useState(false)
  const [volume,  setVolume]  = useState(0.4)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
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
        <button
          onClick={toggle}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors duration-300"
          style={{ color: playing ? '#e05a1e' : 'rgba(245,213,176,0.4)' }}
          data-hover
        >
          <span>{playing ? '▐▐' : '▶'}</span>
          <span>{playing ? 'PLAYING' : 'MISSION AUDIO'}</span>
        </button>
        <div className="w-px h-4" style={{ background: 'rgba(224,90,30,0.15)' }} />
        <input
          type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e => {
            setVolume(+e.target.value)
            if (audioRef.current) audioRef.current.volume = +e.target.value
          }}
          className="w-14 accent-orange-600"
          style={{ cursor: 'pointer' }}
        />
        {playing && (
          <div className="flex items-end gap-px" style={{ height: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                width: 3, background: '#e05a1e', borderRadius: 1,
                animation: `mbar${i} ${0.35 + i * 0.08}s ease-in-out infinite alternate`,
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
function PageTransition({ active, direction }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="transition"
          initial={{ scaleX: 0, originX: direction === 1 ? 0 : 1 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0, originX: direction === 1 ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 900,
            background: 'linear-gradient(135deg, #0d0400, #1c0905)',
            transformOrigin: direction === 1 ? 'left' : 'right',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(224,90,30,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(224,90,30,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
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
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4"
    >
      {PAGES.map((p, i) => (
        <button key={p.id} onClick={() => goTo(i)} data-hover title={p.label}
          className="flex items-center gap-2 group"
        >
          {current === i && (
            <span className="font-mono text-xs tracking-widest"
              style={{ color: 'rgba(224,90,30,0.5)', fontSize: 9 }}>
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

  // panelRefs[i] = the scrollable <div> for page i
  const panelRefs    = useRef([])
  // Stable ref objects passed as scrollerRef prop to each section.
  // Using a ref-of-refs means sections always read the live DOM node
  // even though the objects themselves are created once.
  const scrollerRefs = useRef(Array.from({ length: 5 }, () => ({ current: null })))
  const isAnimating = useRef(false)
  const wheelBuf    = useRef(0)
  const wheelTimer  = useRef(null)

  // ── Navigate ────────────────────────────────────
  const goTo = useCallback((index) => {
    const target = Math.max(0, Math.min(index, PAGES.length - 1))
    if (target === currentPage || isAnimating.current) return

    const dir = target > currentPage ? 1 : -1
    isAnimating.current = true
    setTransDir(dir)
    setTransitioning(true)

    setTimeout(() => {
      setCurrentPage(target)
      if (panelRefs.current[target]) {
        panelRefs.current[target].scrollTop = 0
      }
    }, 250)

    setTimeout(() => {
      setTransitioning(false)
      isAnimating.current = false
    }, 700)
  }, [currentPage])

  const goNext = useCallback(() => goTo(currentPage + 1), [currentPage, goTo])
  const goPrev = useCallback(() => goTo(currentPage - 1), [currentPage, goTo])

  // ── Loading ─────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(t)
  }, [])

  // ── KEY FIX: point ScrollTrigger at the active panel ──────────
  // Launch, SpaceTravel, MarsLanding all use GSAP ScrollTrigger.
  // By default ScrollTrigger watches window.scrollY — but inside
  // this app the window never scrolls; each page panel scrolls
  // internally. We redirect ScrollTrigger's scroller every time
  // the page changes so triggers fire on the correct element.
  // We also pass a stable scrollerRef to each section so their
  // own ScrollTrigger.create() calls use the right DOM node.
  useEffect(() => {
    const panel = panelRefs.current[currentPage]
    if (!panel) return

    // Wait for the 700ms panel entrance transition to finish before
    // refreshing so ScrollTrigger measures the correct dimensions.
    const id = setTimeout(() => {
      ScrollTrigger.defaults({ scroller: panel })
      ScrollTrigger.refresh()
    }, 750)
    return () => clearTimeout(id)
  }, [currentPage])

  // ── Wheel — drives panel scroll; flips page at edges ──────────
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      const panel = panelRefs.current[currentPage]
      if (!panel) return

      const atTop    = panel.scrollTop <= 2
      const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2
      const goingDown = e.deltaY > 0

      // Panel can still scroll in that direction — drive it manually
      if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
        panel.scrollTop += e.deltaY
        wheelBuf.current = 0
        return
      }

      // At edge — accumulate delta for intentional page flip
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

  // ── Touch swipe ─────────────────────────────────
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

  // ── Keyboard ────────────────────────────────────
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
      {/* ── Loading splash ── */}
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
              style={{ width: 80, height: 80, border: '1px solid rgba(224,90,30,0.15)',
                borderTop: '1px solid #e05a1e', borderRadius: '50%', position: 'absolute' }}
            />
            <motion.div animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ width: 50, height: 50, border: '1px solid rgba(224,90,30,0.1)',
                borderBottom: '1px solid rgba(224,90,30,0.6)', borderRadius: '50%', position: 'absolute' }}
            />
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#f5d5b0', marginTop: 60 }}
            >
              JOURNEY TO MARS
            </motion.h1>
            <motion.div
              initial={{ width: 0 }} animate={{ width: 200 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              style={{ height: 1, background: 'linear-gradient(to right, transparent, #e05a1e, transparent)' }}
            />
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.4em',
                color: 'rgba(245,213,176,0.35)', textTransform: 'uppercase' }}
            >
              Initializing Mission Systems...
            </motion.p>
            {['NAVIGATION SYSTEM... OK','LIFE SUPPORT... OK','PROPULSION... OK','COMMS ARRAY... OK'].map((line, i) => (
              <motion.p key={line}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.3 }}
                style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.2em',
                  color: 'rgba(224,90,30,0.4)', textTransform: 'uppercase' }}
              >{line}</motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CinematicCursor />
      <Stars />
      <MusicPlayer />
      <PageTransition active={transitioning} direction={transDir} />

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

      {/* Bottom nav bar */}
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
            display: 'flex', border: '1px solid rgba(224,90,30,0.1)',
            background: 'rgba(2,4,8,0.8)', backdropFilter: 'blur(20px)',
            pointerEvents: 'all', overflow: 'hidden',
          }}>
            <button onClick={goPrev} disabled={currentPage === 0} data-hover
              style={{
                fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em',
                textTransform: 'uppercase', padding: '10px 20px',
                color: currentPage === 0 ? 'rgba(245,213,176,0.1)' : 'rgba(245,213,176,0.5)',
                background: 'transparent', border: 'none',
                borderRight: '1px solid rgba(224,90,30,0.1)',
                cursor: currentPage === 0 ? 'default' : 'pointer', transition: 'color 0.3s',
              }}
            >← PREV</button>

            {PAGES.map((p, i) => (
              <button key={p.id} onClick={() => goTo(i)} data-hover
                style={{
                  fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.25em',
                  textTransform: 'uppercase', padding: '10px 16px',
                  color: currentPage === i ? '#e05a1e' : 'rgba(245,213,176,0.2)',
                  background: currentPage === i ? 'rgba(224,90,30,0.08)' : 'transparent',
                  border: 'none', borderRight: '1px solid rgba(224,90,30,0.1)',
                  cursor: 'pointer', transition: 'all 0.3s',
                }}
              >{p.label}</button>
            ))}

            <button onClick={goNext} disabled={currentPage === PAGES.length - 1} data-hover
              style={{
                fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em',
                textTransform: 'uppercase', padding: '10px 20px',
                color: currentPage === PAGES.length - 1 ? 'rgba(245,213,176,0.1)' : 'white',
                background: currentPage === PAGES.length - 1 ? 'transparent' : '#e05a1e',
                border: 'none',
                cursor: currentPage === PAGES.length - 1 ? 'default' : 'pointer',
                transition: 'all 0.3s',
              }}
            >NEXT →</button>
          </div>
        </motion.div>
      )}

      {/* Page counter top-left */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
          style={{
            position: 'fixed', top: 20, left: 24, zIndex: 50,
            fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.3em',
            color: 'rgba(245,213,176,0.25)', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span style={{ color: '#e05a1e' }}>{String(currentPage + 1).padStart(2, '0')}</span>
          <span style={{ width: 30, height: 1, background: 'rgba(245,213,176,0.15)', display: 'inline-block' }} />
          <span>{String(PAGES.length).padStart(2, '0')}</span>
          <span style={{ marginLeft: 8 }}>{PAGES[currentPage].label}</span>
        </motion.div>
      )}

      {/* ── PANEL PAGES ─────────────────────────────── */}
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
                x:      `${offset * 100}%`,
                scale:  isActive ? 1 : 0.92,
                opacity: isActive ? 1 : isAdjacent ? 0 : 0,
                filter: isActive ? 'brightness(1)' : 'brightness(0.3)',
              }}
              transition={{
                x:       { duration: 0.7, ease: [0.77, 0, 0.175, 1] },
                scale:   { duration: 0.7, ease: [0.77, 0, 0.175, 1] },
                opacity: { duration: 0.4 },
                filter:  { duration: 0.5 },
              }}
              style={{
                position: 'absolute', inset: 0,
                overflowY: isActive ? 'auto' : 'hidden',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                // Isolate each panel's stacking context so
                // fixed children of sections don't bleed through
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