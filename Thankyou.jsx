import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const crew = [
  { role: 'Mission Commander',   name: 'DR. AANYA SINGH',     stat: '3rd Mission' },
  { role: 'Flight Engineer',     name: 'LT. ROHAN MEHTA',     stat: 'Structural AI' },
  { role: 'Science Officer',     name: 'DR. PRIYA NAIR',      stat: 'Exobiology' },
  { role: 'Systems Engineer',    name: 'CAPT. ARJUN SHARMA',  stat: 'Propulsion' },
]

const milestones = [
  { label: 'Launch',    value: 'NOV 2047',  sub: 'Sriharikota' },
  { label: 'Transit',   value: '298 DAYS',  sub: 'Deep space' },
  { label: 'Landing',   value: '7 MINUTES', sub: 'Terror' },
  { label: 'Surface',   value: '500+ DAYS', sub: 'Exploration' },
  { label: 'Distance',  value: '225M KM',   sub: 'From Earth' },
]

/* tiny Mars SVG dot that twinkles */
function MarsDot({ style }) {
  return (
    <motion.div
      animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
      transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
      className="absolute rounded-full pointer-events-none"
      style={{ width: 2, height: 2, background: '#e05a1e', ...style }}
    />
  )
}

export default function ThankYou() {
  const sectionRef   = useRef()
  const bigTextRef   = useRef()
  const lineRef      = useRef()
  const crewRef      = useRef([])
  const milesRef     = useRef([])
  const [signalSent, setSignalSent] = useState(false)
  const [dots]       = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top:  `${Math.random() * 100}%`,
    }))
  )

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── giant THANK YOU char stagger ── */
      const chars = bigTextRef.current?.querySelectorAll('.ty-char')
      if (chars?.length) {
        gsap.fromTo(chars,
          { opacity: 0, y: 120, skewY: 10, rotateX: -80 },
          {
            opacity: 1, y: 0, skewY: 0, rotateX: 0,
            duration: 1.4,
            stagger: 0.055,
            ease: 'power4.out',
            scrollTrigger: { trigger: bigTextRef.current, start: 'top 78%' },
          }
        )
      }

      /* ── horizontal line grow ── */
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: lineRef.current, start: 'top 85%' },
          }
        )
      }

      /* ── crew rows ── */
      crewRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, x: -60, filter: 'blur(8px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
          }
        )
      })

      /* ── milestone pills ── */
      milesRef.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, y: 50, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.9,
            delay: i * 0.08,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="thankyou"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #080200 35%, #120400 65%, #000000 100%)',
        color: '#f0e8df',
      }}
    >

      {/* ── glowing Mars-dust dots ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dots.map(d => <MarsDot key={d.id} style={{ left: d.left, top: d.top }} />)}

        {/* Atmosphere arc */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {[0,1,2,3].map(i => (
            <ellipse key={i}
              cx="600" cy="1100"
              rx={500 + i * 140} ry={280 + i * 80}
              fill="none"
              stroke={`rgba(200,70,15,${0.07 - i * 0.014})`}
              strokeWidth="1"
            />
          ))}
          {/* single Mars "sun" glow in top-right */}
          <radialGradient id="marsGlow" cx="80%" cy="12%" r="25%">
            <stop offset="0%"   stopColor="rgba(200,70,15,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <rect x="0" y="0" width="1200" height="800" fill="url(#marsGlow)" />
        </svg>

        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(180,55,10,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,55,10,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* ════════════════════════════════════
          BLOCK 1 — MISSION COMPLETE BANNER
      ════════════════════════════════════ */}
      <div className="relative z-10 px-8 md:px-16 pt-28 pb-12 border-b"
        style={{ borderColor: 'rgba(224,90,30,0.1)' }}>
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: '#e05a1e', boxShadow: '0 0 8px #e05a1e' }}
            />
            <span className="font-mono text-xs tracking-[0.5em] uppercase"
              style={{ color: 'rgba(224,90,30,0.85)' }}>
              Mission Complete · 2047 · Mangalyaan II
            </span>
          </motion.div>

          {/* BIG THANK YOU — char split */}
          <div ref={bigTextRef} style={{ perspective: '1000px', overflow: 'hidden' }}>
            {['THANK', 'YOU'].map((word, wi) => (
              <div key={wi} className="block overflow-hidden">
                {word.split('').map((ch, ci) => (
                  <span
                    key={ci}
                    className="ty-char inline-block"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(5.5rem, 14vw, 13rem)',
                      lineHeight: 0.86,
                      letterSpacing: '0.03em',
                      color: wi === 0 ? '#fff5ee' : '#e05a1e',
                      textShadow: wi === 1 ? '0 0 80px rgba(224,90,30,0.45)' : 'none',
                      opacity: 0,
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Divider line — animated grow */}
          <div
            ref={lineRef}
            className="mt-10 h-px origin-left"
            style={{
              transform: 'scaleX(0)',
              background: 'linear-gradient(90deg, #e05a1e, rgba(224,90,30,0.3) 60%, transparent)',
              maxWidth: 600,
              boxShadow: '0 0 12px rgba(224,90,30,0.4)',
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 text-base md:text-xl leading-relaxed max-w-2xl"
            style={{ color: 'rgba(240,232,218,0.78)' }}
          >
            For every engineer, scientist, and dreamer who dared to
            look up at the red star and say — <em>we will go there.</em>{' '}
            This mission belongs to all of humanity.
          </motion.p>

        </div>
      </div>

      {/* ════════════════════════════════════
          BLOCK 2 — MISSION MILESTONES
      ════════════════════════════════════ */}
      <div className="relative z-10 px-8 md:px-16 py-20 border-b"
        style={{ borderColor: 'rgba(224,90,30,0.07)' }}>
        <div className="max-w-7xl mx-auto">

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-12"
            style={{ color: 'rgba(224,90,30,0.7)' }}
          >
            Mission at a Glance
          </motion.p>

          <div className="flex flex-wrap gap-4">
            {milestones.map((m, i) => (
              <div
                key={i}
                ref={el => milesRef.current[i] = el}
                className="rounded-3xl px-7 py-6 relative overflow-hidden group"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(224,90,30,0.18)',
                  minWidth: 150,
                  opacity: 0,
                }}
              >
                {/* hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(224,90,30,0.12), transparent 70%)' }}
                />
                <div className="relative">
                  <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2"
                    style={{ color: 'rgba(224,90,30,0.7)' }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2rem', lineHeight: 1,
                    color: '#fff5ee',
                  }}>
                    {m.value}
                  </div>
                  <div className="font-mono text-[9px] mt-1 tracking-wider"
                    style={{ color: 'rgba(240,232,218,0.45)' }}>
                    {m.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          BLOCK 3 — CREW ROLL
      ════════════════════════════════════ */}
      <div className="relative z-10 px-8 md:px-16 py-20 border-b"
        style={{ borderColor: 'rgba(224,90,30,0.07)' }}>
        <div className="max-w-7xl mx-auto">

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-12"
            style={{ color: 'rgba(224,90,30,0.7)' }}
          >
            The Crew — Mangalyaan II
          </motion.p>

          <div className="flex flex-col gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {crew.map((c, i) => (
              <div
                key={i}
                ref={el => crewRef.current[i] = el}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-5 group cursor-default"
                style={{
                  background: '#000',
                  borderLeft: '2px solid transparent',
                  transition: 'border-color 0.3s, background 0.3s',
                  opacity: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderLeftColor = '#e05a1e'
                  e.currentTarget.style.background = 'rgba(224,90,30,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.background = '#000'
                }}
              >
                {/* Number */}
                <div
                  className="hidden md:block font-['Bebas_Neue'] text-4xl select-none"
                  style={{ color: 'rgba(255,255,255,0.04)', minWidth: 48, lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Name + role */}
                <div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    lineHeight: 1, color: '#fff5ee',
                  }}>
                    {c.name}
                  </div>
                  <div className="font-mono text-xs tracking-[0.3em] uppercase mt-1"
                    style={{ color: 'rgba(224,90,30,0.65)' }}>
                    {c.role}
                  </div>
                </div>

                {/* Stat badge */}
                <div
                  className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(224,90,30,0.08)',
                    border: '1px solid rgba(224,90,30,0.22)',
                    color: 'rgba(224,90,30,0.8)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          BLOCK 4 — SIGNAL BUTTON + CLOSING
      ════════════════════════════════════ */}
      <div className="relative z-10 px-8 md:px-16 py-28">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">

          {/* Large faded MARS watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(10rem, 30vw, 26rem)',
              lineHeight: 1,
              color: 'rgba(224,90,30,0.03)',
              letterSpacing: '0.1em',
            }}>
              MARS
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase relative z-10"
            style={{ color: 'rgba(224,90,30,0.65)' }}
          >
            End Transmission · ISRO · 2047
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              lineHeight: 1,
              color: '#fff5ee',
              letterSpacing: '0.04em',
            }}>
              THE MISSION IS ONLY<br />
              <span style={{ color: '#e05a1e' }}>THE BEGINNING.</span>
            </div>
          </motion.div>

          {/* Signal button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <button
              onClick={() => { setSignalSent(true); setTimeout(() => setSignalSent(false), 3500) }}
              className="relative font-mono text-xs tracking-[0.5em] uppercase px-12 py-5 overflow-hidden group"
              style={{
                background: signalSent ? '#e05a1e' : 'transparent',
                border: '1px solid rgba(224,90,30,0.5)',
                color: signalSent ? '#fff' : 'rgba(245,180,100,0.85)',
                transition: 'all 0.5s ease',
              }}
              onMouseEnter={e => {
                if (!signalSent) {
                  e.currentTarget.style.borderColor = '#e05a1e'
                  e.currentTarget.style.color = '#e05a1e'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(224,90,30,0.2)'
                }
              }}
              onMouseLeave={e => {
                if (!signalSent) {
                  e.currentTarget.style.borderColor = 'rgba(224,90,30,0.5)'
                  e.currentTarget.style.color = 'rgba(245,180,100,0.85)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {/* Scan shimmer */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(224,90,30,0.08), transparent)' }}
              />
              <AnimatePresence mode="wait">
                {signalSent ? (
                  <motion.span key="sent"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="relative flex items-center gap-3"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >●</motion.span>
                    SIGNAL TRANSMITTED · 225M KM
                  </motion.span>
                ) : (
                  <motion.span key="idle"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="relative"
                  >
                    SEND SIGNAL TO MARS
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Footer wordmark */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="relative z-10 mt-16 pt-8 w-full border-t flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.8rem', letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.06)',
            }}>
              JOURNEY TO MARS
            </div>

            <div className="font-mono text-xs tracking-widest text-center"
              style={{ color: 'rgba(255,255,255,0.15)' }}>
              Built for IIT Patna Hackathon · 2047
            </div>

            <div className="font-mono text-xs tracking-widest"
              style={{ color: 'rgba(224,90,30,0.35)' }}>
              MISSION — 2047
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  )
}