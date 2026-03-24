import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const phases = [
  {
    id: '01',
    time: 'T+00:00',
    title: 'ATMOSPHERIC\nENTRY',
    sub: 'Entry Interface at 125km altitude',
    body: 'The spacecraft slams into the Martian atmosphere at 5.4 km/s. A plasma sheath of 1,600°C envelops the heat shield. All comms go dark. Mission Control holds its breath.',
    stat: '5.4 KM/S', statLabel: 'Entry Velocity',
    stat2: '1,600°C', stat2Label: 'Heat Shield Temp',
    color: '#ff4500',
  },
  {
    id: '02',
    time: 'T+03:30',
    title: 'PARACHUTE\nDEPLOYMENT',
    sub: 'Supersonic chute opens at Mach 2.5',
    body: 'At Mach 2.5 and 10km altitude, a 21-metre supersonic parachute violently inflates. The g-force spike jolts the satellite to 9Gs. Velocity drops from 600 m/s to 100 m/s in seconds.',
    stat: 'MACH 2.5', statLabel: 'Deployment Speed',
    stat2: '21M', stat2Label: 'Parachute Diameter',
    color: '#f97316',
  },
  {
    id: '03',
    time: 'T+06:45',
    title: 'HEAT SHIELD\nSEPARATION',
    sub: 'Jettisoned at 8km above the surface',
    body: 'The scorched heat shield is jettisoned. Radar locks onto the Martian surface below. The onboard AI begins autonomous terrain-relative navigation — selecting a safe touchdown site in real time.',
    stat: '8 KM', statLabel: 'Altitude',
    stat2: 'AI-GUIDED', stat2Label: 'Navigation Mode',
    color: '#e05a1e',
  },
  {
    id: '04',
    time: 'T+06:58',
    title: 'RETROROCKET\nIGNITION',
    sub: 'Eight throttleable engines fire at 100m',
    body: 'Parachute severed. Eight methane retrorockets ignite, decelerating from 80 m/s to near-zero. The satellite hovers on a column of fire as dust billows across the Hellas Planitia basin.',
    stat: '100M', statLabel: 'Ignition Altitude',
    stat2: '8 × ENG', stat2Label: 'Retrorockets',
    color: '#c0522a',
  },
  {
    id: '05',
    time: 'T+07:00',
    title: 'TOUCHDOWN\nCONFIRMED',
    sub: 'Contact sensors signal: We have landed',
    body: 'Contact. The landing legs absorb 3Gs of impact force. Dust settles. The AI satellite\'s first photograph of the Martian surface is transmitted across 225 million km. Humanity weeps.',
    stat: '0 M/S', statLabel: 'Final Velocity',
    stat2: '225M KM', stat2Label: 'Signal Distance',
    color: '#10b981',
  },
]

/* ─────────────────────────────────────────────
   AI SATELLITE SVG — fully custom illustration
───────────────────────────────────────────── */
function AISatellite({ phase = 0, descended = false }) {
  const flameOpacity = phase >= 3 ? 1 : 0
  const chuteDeploy = phase === 1 || phase === 2
  const shieldAttached = phase <= 2
  const legsExtended = phase >= 3

  return (
    <svg
      viewBox="0 0 340 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 40px rgba(224,90,30,0.35))' }}
    >
      <defs>
        {/* Flame gradient */}
        <radialGradient id="flame1" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#fff7aa" />
          <stop offset="30%" stopColor="#ff9500" />
          <stop offset="70%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="flame2" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#ffeeaa" />
          <stop offset="50%" stopColor="#ff6000" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Body gradient */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4ccc4" />
          <stop offset="50%" stopColor="#9a9088" />
          <stop offset="100%" stopColor="#5a5248" />
        </linearGradient>
        <linearGradient id="goldFoil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8a44a" />
          <stop offset="30%" stopColor="#f0d080" />
          <stop offset="60%" stopColor="#b88030" />
          <stop offset="100%" stopColor="#e0b850" />
        </linearGradient>
        <linearGradient id="solarPanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2a4a" />
          <stop offset="50%" stopColor="#0d1a33" />
          <stop offset="100%" stopColor="#0a1228" />
        </linearGradient>
        <linearGradient id="heatShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b4513" />
          <stop offset="50%" stopColor="#6b2a00" />
          <stop offset="100%" stopColor="#3d1500" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="strongGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── PARACHUTE ── */}
      {chuteDeploy && (
        <g style={{ transform: 'translateX(170px) translateY(10px)' }}>
          {/* Chute canopy */}
          <path
            d="M-80,0 Q-90,-60 -60,-80 Q-20,-110 0,-110 Q20,-110 60,-80 Q90,-60 80,0 Z"
            fill="none"
            stroke="rgba(220,200,160,0.9)"
            strokeWidth="1.5"
          />
          {/* Chute panels */}
          {[-60,-30,0,30,60].map((x,i) => (
            <path key={i}
              d={`M${x},0 Q${x*0.9},-55 ${x*0.6},-95`}
              stroke="rgba(200,180,140,0.5)"
              strokeWidth="0.8"
              fill="none"
            />
          ))}
          {/* Suspension lines */}
          {[-60,-30,0,30,60].map((x,i) => (
            <line key={i} x1={x} y1="0" x2={x*0.15} y2="90"
              stroke="rgba(180,160,120,0.6)" strokeWidth="0.7"
            />
          ))}
          {/* Chute fill */}
          <path
            d="M-80,0 Q-90,-60 -60,-80 Q-20,-110 0,-110 Q20,-110 60,-80 Q90,-60 80,0 Z"
            fill="rgba(200,180,150,0.12)"
          />
        </g>
      )}

      {/* ── RETROROCKET FLAMES ── */}
      {flameOpacity > 0 && (
        <g opacity={flameOpacity}>
          {/* Left engine */}
          <g transform="translate(120, 330)">
            <ellipse cx="0" cy="0" rx="10" ry="5" fill="url(#flame1)" />
            <path d="M-8,0 Q-4,30 0,50 Q4,30 8,0 Z" fill="url(#flame1)" opacity="0.9">
              <animateTransform attributeName="transform" type="scale"
                values="1 1;1.1 1.15;0.95 1.05;1 1" dur="0.15s" repeatCount="indefinite"/>
            </path>
            <path d="M-5,0 Q-2,20 0,35 Q2,20 5,0 Z" fill="#fffacc" opacity="0.7" />
          </g>
          {/* Center engine */}
          <g transform="translate(170, 345)">
            <ellipse cx="0" cy="0" rx="14" ry="7" fill="url(#flame1)" />
            <path d="M-12,0 Q-5,45 0,70 Q5,45 12,0 Z" fill="url(#flame1)" opacity="0.95">
              <animateTransform attributeName="transform" type="scale"
                values="1 1;1.15 1.2;0.9 1.05;1 1" dur="0.12s" repeatCount="indefinite"/>
            </path>
            <path d="M-7,0 Q-3,30 0,50 Q3,30 7,0 Z" fill="#fffacc" opacity="0.8" />
          </g>
          {/* Right engine */}
          <g transform="translate(220, 330)">
            <ellipse cx="0" cy="0" rx="10" ry="5" fill="url(#flame1)" />
            <path d="M-8,0 Q-4,30 0,50 Q4,30 8,0 Z" fill="url(#flame1)" opacity="0.9">
              <animateTransform attributeName="transform" type="scale"
                values="1 1;1.1 1.1;0.95 1.2;1 1" dur="0.18s" repeatCount="indefinite"/>
            </path>
            <path d="M-5,0 Q-2,20 0,35 Q2,20 5,0 Z" fill="#fffacc" opacity="0.7" />
          </g>
          {/* Engine glow on ground */}
          <ellipse cx="170" cy="390" rx="60" ry="12"
            fill="#ff4500" opacity="0.2"
            style={{ filter: 'blur(8px)' }}
          />
        </g>
      )}

      {/* ── LANDING LEGS ── */}
      {legsExtended ? (
        <g opacity="0.95">
          {/* Left leg */}
          <line x1="130" y1="300" x2="90" y2="360" stroke="#8a7a6a" strokeWidth="5" strokeLinecap="round"/>
          <line x1="130" y1="310" x2="85" y2="355" stroke="#6a5a4a" strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="88" cy="363" rx="16" ry="5" fill="#7a6a5a" opacity="0.8"/>
          {/* Right leg */}
          <line x1="210" y1="300" x2="250" y2="360" stroke="#8a7a6a" strokeWidth="5" strokeLinecap="round"/>
          <line x1="210" y1="310" x2="255" y2="355" stroke="#6a5a4a" strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="252" cy="363" rx="16" ry="5" fill="#7a6a5a" opacity="0.8"/>
          {/* Center leg */}
          <line x1="170" y1="320" x2="170" y2="375" stroke="#8a7a6a" strokeWidth="5" strokeLinecap="round"/>
          <ellipse cx="170" cy="378" rx="18" ry="5" fill="#7a6a5a" opacity="0.8"/>
        </g>
      ) : (
        <g opacity="0.5">
          <line x1="130" y1="300" x2="120" y2="320" stroke="#6a5a4a" strokeWidth="3"/>
          <line x1="210" y1="300" x2="220" y2="320" stroke="#6a5a4a" strokeWidth="3"/>
        </g>
      )}

      {/* ── HEAT SHIELD ── */}
      {shieldAttached && (
        <ellipse cx="170" cy="315" rx="65" ry="22"
          fill="url(#heatShield)"
          stroke="#5a2a00"
          strokeWidth="1.5"
          opacity="0.95"
        />
      )}

      {/* ── MAIN BODY ── */}
      {/* Core cylinder */}
      <rect x="130" y="195" width="80" height="120" rx="8"
        fill="url(#bodyGrad)" stroke="#7a7060" strokeWidth="1.5"
      />

      {/* Thermal insulation strips (gold foil) */}
      {[210, 225, 240, 255].map((y, i) => (
        <rect key={i} x="130" y={y} width="80" height="8"
          fill="url(#goldFoil)" opacity="0.85"
        />
      ))}

      {/* Equipment bay - top */}
      <rect x="140" y="175" width="60" height="30" rx="5"
        fill="#b0a898" stroke="#8a8070" strokeWidth="1"
      />

      {/* Antenna dish */}
      <ellipse cx="170" cy="165" rx="25" ry="8"
        fill="none" stroke="#d0c8bc" strokeWidth="2"
      />
      <ellipse cx="170" cy="163" rx="25" ry="8"
        fill="rgba(200,190,175,0.15)"
        stroke="#c0b8a8" strokeWidth="1"
      />
      <line x1="170" y1="163" x2="170" y2="175" stroke="#c0b8a8" strokeWidth="2"/>

      {/* Top sensor dome */}
      <path d="M155,175 Q155,155 170,152 Q185,155 185,175 Z"
        fill="rgba(100,160,220,0.4)"
        stroke="#8ab8e0" strokeWidth="1.5"
      />
      {/* Dome inner glint */}
      <path d="M161,172 Q160,160 167,158"
        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"
      />

      {/* AI brain indicator — pulsing LED */}
      <circle cx="170" cy="220" r="6" fill="#00ff88" opacity="0.9" filter="url(#glow)">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite"/>
      </circle>

      {/* Status LEDs row */}
      {[0,1,2,3].map((i) => (
        <circle key={i} cx={148 + i*16} cy="238" r="3"
          fill={i === 0 ? '#00ff88' : i === 1 ? '#ffaa00' : i === 2 ? '#ff4444' : '#4488ff'}
          opacity="0.85"
        >
          <animate attributeName="opacity"
            values="0.85;0.3;0.85" dur={`${1.2 + i*0.3}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {/* Instrument panel lines */}
      {[250,260,270,280].map((y, i) => (
        <line key={i} x1="140" y1={y} x2={170 - i*2} y2={y}
          stroke="#5a5040" strokeWidth="1" opacity="0.6"
        />
      ))}
      {[250,260,270,280].map((y, i) => (
        <line key={i} x1="200" y1={y} x2={170 + i*2} y2={y}
          stroke="#5a5040" strokeWidth="1" opacity="0.6"
        />
      ))}

      {/* Side thruster nozzles */}
      <rect x="118" y="260" width="14" height="20" rx="3"
        fill="#6a6050" stroke="#4a4030" strokeWidth="1"
      />
      <rect x="208" y="260" width="14" height="20" rx="3"
        fill="#6a6050" stroke="#4a4030" strokeWidth="1"
      />

      {/* ── SOLAR PANELS ── */}
      {/* Left panel assembly */}
      <g>
        <rect x="40" y="200" width="82" height="36" rx="3"
          fill="url(#solarPanel)"
          stroke="#2a3a5a" strokeWidth="1.5"
        />
        {/* Solar cell grid */}
        {[0,1,2,3,4,5].map(col =>
          [0,1,2].map(row => (
            <rect key={`l${col}${row}`}
              x={42 + col*13} y={202 + row*11}
              width="11" height="9" rx="1"
              fill="none"
              stroke="#1a2a44" strokeWidth="0.8"
              opacity="0.8"
            />
          ))
        )}
        {/* Blue tint cells */}
        {[0,2,4].map(col =>
          [0,2].map(row => (
            <rect key={`lb${col}${row}`}
              x={43 + col*13} y={203 + row*11}
              width="9" height="7" rx="0.5"
              fill="rgba(40,90,180,0.25)"
            />
          ))
        )}
        {/* Panel arm */}
        <rect x="122" y="212" width="10" height="12" rx="2"
          fill="#5a5040"
        />
        {/* Solar glint */}
        <line x1="48" y1="204" x2="52" y2="208"
          stroke="rgba(180,220,255,0.5)" strokeWidth="1"
        />
      </g>

      {/* Right panel assembly */}
      <g>
        <rect x="218" y="200" width="82" height="36" rx="3"
          fill="url(#solarPanel)"
          stroke="#2a3a5a" strokeWidth="1.5"
        />
        {[0,1,2,3,4,5].map(col =>
          [0,1,2].map(row => (
            <rect key={`r${col}${row}`}
              x={220 + col*13} y={202 + row*11}
              width="11" height="9" rx="1"
              fill="none"
              stroke="#1a2a44" strokeWidth="0.8"
              opacity="0.8"
            />
          ))
        )}
        {[0,2,4].map(col =>
          [0,2].map(row => (
            <rect key={`rb${col}${row}`}
              x={221 + col*13} y={203 + row*11}
              width="9" height="7" rx="0.5"
              fill="rgba(40,90,180,0.25)"
            />
          ))
        )}
        <rect x="208" y="212" width="10" height="12" rx="2"
          fill="#5a5040"
        />
        <line x1="224" y1="204" x2="228" y2="208"
          stroke="rgba(180,220,255,0.5)" strokeWidth="1"
        />
      </g>

      {/* ── ENGINE NOZZLES (bottom) ── */}
      {[140, 162, 178, 200].map((x, i) => (
        <path key={i}
          d={`M${x},315 L${x-5},335 L${x+10},335 L${x+5},315 Z`}
          fill="#4a3a28" stroke="#3a2a18" strokeWidth="1"
        />
      ))}

      {/* ── RADAR / RANGE FINDER ── */}
      <rect x="155" y="190" width="30" height="8" rx="2"
        fill="#8a8070" stroke="#6a6050" strokeWidth="1"
      />
      {/* Radar beam when descending */}
      {descended && (
        <g>
          <line x1="170" y1="198" x2="150" y2="380"
            stroke="rgba(0,255,136,0.3)" strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line x1="170" y1="198" x2="190" y2="380"
            stroke="rgba(0,255,136,0.3)" strokeWidth="1"
            strokeDasharray="4 4"
          />
          <ellipse cx="170" cy="382" rx="20" ry="5"
            fill="none" stroke="rgba(0,255,136,0.4)" strokeWidth="1"
          />
        </g>
      )}

      {/* ── SIGNAL TRANSMISSION LINES ── */}
      <g opacity="0.4">
        {[0,1,2].map(i => (
          <circle key={i} cx="170" cy="155" r={12 + i*8}
            fill="none" stroke="#ff8844" strokeWidth="0.7"
            strokeDasharray="3 5"
            opacity={0.5 - i*0.15}
          >
            <animateTransform attributeName="transform" type="scale"
              values={`1;${1.3 + i*0.1};1`} dur={`${2 + i*0.5}s`}
              additive="sum"
              calcMode="spline"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────
   MARS SURFACE SVG
───────────────────────────────────────────── */
function MarsSurface({ dustActive }) {
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMax slice"
      className="w-full" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="craterGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4a1a08" />
          <stop offset="100%" stopColor="#2a0d04" />
        </radialGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b2200" />
          <stop offset="40%" stopColor="#4a1500" />
          <stop offset="100%" stopColor="#1a0800" />
        </linearGradient>
      </defs>

      {/* Ground base */}
      <path d="M0,60 Q100,45 200,58 Q300,70 400,52 Q500,38 600,55 Q700,68 800,50 L800,200 L0,200 Z"
        fill="url(#groundGrad)"
      />
      {/* Rock texture layer */}
      <path d="M0,70 Q150,60 300,72 Q450,82 600,65 Q700,58 800,68"
        fill="none" stroke="#7a2800" strokeWidth="2" opacity="0.4"
      />

      {/* Craters */}
      <ellipse cx="120" cy="64" rx="35" ry="10" fill="url(#craterGrad)" opacity="0.7"/>
      <ellipse cx="118" cy="62" rx="33" ry="8" fill="none" stroke="#8a3a10" strokeWidth="1" opacity="0.5"/>
      <ellipse cx="580" cy="58" rx="25" ry="7" fill="url(#craterGrad)" opacity="0.6"/>
      <ellipse cx="720" cy="70" rx="18" ry="5" fill="url(#craterGrad)" opacity="0.5"/>

      {/* Rocks */}
      {[
        [60, 62, 12, 8], [180, 68, 8, 6], [350, 55, 15, 10],
        [460, 62, 10, 7], [640, 60, 14, 9], [760, 66, 9, 6]
      ].map(([x, y, w, h], i) => (
        <ellipse key={i} cx={x} cy={y} rx={w} ry={h}
          fill="#6a2a0a" stroke="#4a1a06" strokeWidth="0.8" opacity="0.8"
        />
      ))}

      {/* Dust cloud when landing */}
      {dustActive && (
        <g>
          {[0,1,2,3,4].map(i => (
            <ellipse key={i}
              cx={340 + (i-2)*60} cy={58 - i*4}
              rx={40 + i*20} ry={12 + i*6}
              fill={`rgba(160,70,20,${0.15 - i*0.02})`}
              style={{ filter: 'blur(6px)' }}
            />
          ))}
        </g>
      )}

      {/* Horizon atmosphere glow */}
      <rect x="0" y="0" width="800" height="60"
        fill="url(#groundGrad)" opacity="0.3"
      />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   STAT PILL COMPONENT
───────────────────────────────────────────── */
function StatPill({ value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="rounded-2xl px-6 py-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 24px ${color}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: 'blur(12px)',
        minWidth: 130,
      }}
    >
      {/* Inner shimmer */}
      <div className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${color}30, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2rem',
          lineHeight: 1,
          color,
        }}>{value}</div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase mt-1"
          style={{ color: 'rgba(255,240,225,0.6)' }}
        >{label}</div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function MarsLanding({ scrollerRef }) {
  const sectionRef = useRef()
  const pinRef = useRef()
  const satelliteRef = useRef()
  const progressBarRef = useRef()
  const [activePhase, setActivePhase] = useState(0)
  const [dustActive, setDustActive] = useState(false)
  const [landed, setLanded] = useState(false)
  const phaseRefs = useRef([])

  // Scroll progress for satellite descent animation — scoped to the panel scroller
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollerRef,
    offset: ['start end', 'end start'],
  })
  const satelliteY = useTransform(scrollYProgress, [0, 0.7], [-80, 60])
  const satelliteYSpring = useSpring(satelliteY, { stiffness: 40, damping: 18 })
  const satelliteRotate = useTransform(scrollYProgress, [0, 0.4, 0.8], [-8, 2, 0])

  useEffect(() => {
    const scroller = scrollerRef?.current ?? window

    const ctx = gsap.context(() => {

      // ── Phase cards stagger in ──
      phaseRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, x: -80, filter: 'blur(10px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
              onEnter: () => {
                setActivePhase(i)
                if (i === 4) {
                  setLanded(true)
                  setDustActive(true)
                  setTimeout(() => setDustActive(false), 3000)
                } else {
                  setLanded(false)
                }
              },
            }
          }
        )
      })

      // ── Big title char reveal — scoped to sectionRef, not document ──
      const titleChars = sectionRef.current?.querySelectorAll('.title-char')
      if (titleChars?.length) {
        gsap.fromTo(titleChars,
          { opacity: 0, y: 100, skewY: 8 },
          {
            opacity: 1, y: 0, skewY: 0,
            duration: 1.2,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller,
              start: 'top 70%',
            }
          }
        )
      }

      // ── Satellite parallax scrub ──
      if (satelliteRef.current) {
        gsap.fromTo(satelliteRef.current,
          { y: -60, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              scroller,
              start: 'top 80%',
            }
          }
        )
      }

      // ── Progress bar ──
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          }
        })
      }

      // ── Counter stat numbers — scoped to sectionRef ──
      sectionRef.current?.querySelectorAll('.count-up').forEach(el => {
        const target = parseFloat(el.dataset.target)
        if (isNaN(target)) return
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: Number.isInteger(target) ? 1 : 0.1 },
          scrollTrigger: { trigger: el, scroller, start: 'top 80%' },
        })
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [scrollerRef])

  return (
    <section
      id="landing"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020408 0%, #0d0300 25%, #1a0500 50%, #2a0800 75%, #120300 100%)',
        color: '#f0e8df',
      }}
    >
      {/* ══════════════════════════════════════
          ATMOSPHERIC ENTRY — BIG CINEMATIC OPENER
      ══════════════════════════════════════ */}
      <div className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-16 py-28">

        {/* Background — Mars atmosphere gradient rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse at 65% 40%, rgba(200,60,10,0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 20% 70%, rgba(140,30,5,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(80,15,2,0.15) 0%, transparent 45%)
            `
          }}/>
          {/* Atmosphere arc */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="atmGrad" cx="50%" cy="100%" r="80%">
                <stop offset="0%" stopColor="rgba(200,70,20,0.0)"/>
                <stop offset="60%" stopColor="rgba(200,70,20,0.04)"/>
                <stop offset="80%" stopColor="rgba(200,70,20,0.08)"/>
                <stop offset="100%" stopColor="rgba(200,70,20,0.0)"/>
              </radialGradient>
            </defs>
            {[0,1,2,3].map(i => (
              <ellipse key={i}
                cx="600" cy="1000"
                rx={500 + i*120} ry={300 + i*80}
                fill="none"
                stroke={`rgba(200,80,20,${0.06 - i*0.012})`}
                strokeWidth="1.5"
              />
            ))}
          </svg>
          {/* Scan lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,60,10,0.015) 3px, rgba(200,60,10,0.015) 4px)',
          }}/>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto w-full">

          {/* ── LEFT: Text ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-2 h-2 rotate-45 bg-red-500"/>
              <span className="font-mono text-xs tracking-[0.5em] uppercase"
                style={{ color: 'rgba(220,100,50,0.9)' }}>
                Phase 03 · Entry, Descent & Landing
              </span>
            </motion.div>

            {/* Title — char split */}
            <div style={{ perspective: '800px', overflow: 'hidden' }}>
              {['MARS', 'LANDING'].map((word, wi) => (
                <div key={wi} className="overflow-hidden">
                  {word.split('').map((ch, ci) => (
                    <span
                      key={ci}
                      className="title-char inline-block"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 'clamp(5rem, 12vw, 11rem)',
                        lineHeight: 0.88,
                        opacity: 0,
                        color: wi === 0 ? '#fff5ee' : '#e05a1e',
                        textShadow: wi === 1 ? '0 0 60px rgba(224,90,30,0.5)' : 'none',
                        letterSpacing: '0.03em',
                        display: ch === ' ' ? 'inline' : 'inline-block',
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-8 text-base md:text-lg leading-relaxed max-w-lg"
              style={{ color: 'rgba(240,232,222,0.82)' }}
            >
              Seven minutes of terror. No human hand can guide it.
              An AI satellite navigates 125km of Martian atmosphere,
              fire, and silence — entirely alone.
            </motion.p>

            {/* Big stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <StatPill value="7 MIN" label="Entry Duration" color="#ff4500" delay={0.8}/>
              <StatPill value="5.4 KM/S" label="Entry Velocity" color="#e05a1e" delay={0.95}/>
              <StatPill value="100%" label="AI Controlled" color="#10b981" delay={1.1}/>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="mt-12"
            >
              <div className="flex justify-between font-mono text-xs tracking-widest uppercase mb-2"
                style={{ color: 'rgba(220,160,100,0.7)' }}>
                <span>Mission Progress</span>
                <span>Phase 3 / 4</span>
              </div>
              <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  ref={progressBarRef}
                  className="h-px origin-left"
                  style={{
                    background: 'linear-gradient(to right, #c0522a, #ff4500, #f97316)',
                    transform: 'scaleX(0)',
                    boxShadow: '0 0 8px rgba(255,69,0,0.6)',
                    width: '75%',
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Satellite ── */}
          <motion.div
            ref={satelliteRef}
            style={{ y: satelliteYSpring, rotate: satelliteRotate }}
            className="relative flex items-center justify-center order-first lg:order-last"
          >
            {/* Glow behind satellite */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 60%, rgba(224,90,30,0.25) 0%, transparent 65%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Altitude callout */}
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 right-4 font-mono text-xs tracking-widest"
              style={{ color: '#10b981' }}
            >
              ALT: 125 KM ↓
            </motion.div>

            {/* Velocity callout */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute top-1/3 -left-2 font-mono text-[10px] tracking-widest"
              style={{ color: '#ff4500', writingMode: 'vertical-rl' }}
            >
              5.4 KM/S
            </motion.div>

            <div className="w-72 h-96 md:w-80 md:h-[440px] relative">
              <AISatellite phase={activePhase} descended={activePhase >= 2} />
            </div>

            {/* Landing confirmed flash */}
            <AnimatePresence>
              {landed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.4em] uppercase px-5 py-2 rounded-full whitespace-nowrap"
                  style={{
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.5)',
                    color: '#10b981',
                    boxShadow: '0 0 20px rgba(16,185,129,0.25)',
                  }}
                >
                  ✓ TOUCHDOWN CONFIRMED
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(220,120,60,0.7)' }}>
            Follow the descent
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, rgba(224,90,30,0.8), transparent)' }}
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          PHASE TIMELINE — SCROLL REVEALS
      ══════════════════════════════════════ */}
      <div className="relative px-8 md:px-16 py-24" style={{
        background: 'linear-gradient(180deg, #1a0500 0%, #0d0300 100%)',
        borderTop: '1px solid rgba(200,60,10,0.1)',
      }}>

        {/* Section header */}
        <div className="max-w-7xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: 'rgba(220,100,50,0.85)' }}
          >
            Entry, Descent & Landing — 7 Minutes
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              lineHeight: 0.9,
              color: '#fff5ee',
            }}
          >
            SEVEN MINUTES<br/>
            <span style={{ color: 'rgba(255,245,238,0.3)' }}>OF TERROR</span>
          </motion.h3>
        </div>

        {/* Timeline vertical line */}
        <div className="max-w-7xl mx-auto relative">
          <div
            className="absolute left-[20px] md:left-[28px] top-0 bottom-0 w-px hidden md:block"
            style={{ background: 'linear-gradient(to bottom, rgba(224,90,30,0.4), rgba(224,90,30,0.05))' }}
          />

          <div className="flex flex-col gap-0">
            {phases.map((p, i) => (
              <div
                key={p.id}
                ref={el => phaseRefs.current[i] = el}
                className="relative grid grid-cols-1 md:grid-cols-[56px_1fr] gap-0"
                style={{ opacity: 0 }}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center pt-8">
                  <motion.div
                    animate={activePhase >= i ? {
                      scale: [1, 1.4, 1],
                      boxShadow: [`0 0 0px ${p.color}00`, `0 0 20px ${p.color}80`, `0 0 8px ${p.color}50`]
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className="w-3 h-3 rounded-full border-2 transition-all duration-500"
                    style={{
                      background: activePhase >= i ? p.color : 'transparent',
                      borderColor: p.color,
                    }}
                  />
                </div>

                {/* Phase card */}
                <div
                  className="rounded-3xl p-8 md:p-10 mb-4 relative overflow-hidden cursor-default group"
                  style={{
                    background: activePhase === i
                      ? `linear-gradient(135deg, ${p.color}12, rgba(255,255,255,0.02))`
                      : 'rgba(255,255,255,0.015)',
                    border: `1px solid ${activePhase >= i ? p.color + '35' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.6s ease',
                  }}
                >
                  {/* Active glow */}
                  {activePhase === i && (
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 0% 50%, ${p.color}10, transparent 60%)` }}
                    />
                  )}

                  {/* Left accent */}
                  <div
                    className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-500"
                    style={{
                      background: activePhase >= i
                        ? `linear-gradient(to bottom, transparent, ${p.color}, transparent)`
                        : 'transparent',
                    }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
                    {/* Text */}
                    <div>
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <span
                          className="font-mono text-xs tracking-[0.4em] uppercase px-3 py-1 rounded-full"
                          style={{
                            background: `${p.color}18`,
                            border: `1px solid ${p.color}40`,
                            color: p.color,
                          }}
                        >
                          {p.time}
                        </span>
                        <span className="font-mono text-xs tracking-widest uppercase"
                          style={{ color: `${p.color}99` }}>
                          {p.id} / 05
                        </span>
                      </div>

                      <h4
                        className="whitespace-pre-line mb-4"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                          lineHeight: 0.95,
                          color: '#fff5ee',
                        }}
                      >
                        {p.title}
                      </h4>

                      <p className="text-sm font-mono mb-4" style={{ color: `${p.color}cc` }}>
                        — {p.sub}
                      </p>

                      <p className="text-sm md:text-base leading-relaxed"
                        style={{ color: 'rgba(240,232,218,0.82)' }}>
                        {p.body}
                      </p>
                    </div>

                    {/* Stat pills */}
                    <div className="flex flex-row lg:flex-col gap-3 shrink-0">
                      <div
                        className="rounded-2xl px-5 py-4 text-center"
                        style={{
                          background: `${p.color}12`,
                          border: `1px solid ${p.color}35`,
                          minWidth: 110,
                        }}
                      >
                        <div style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '1.8rem', lineHeight: 1, color: p.color
                        }}>{p.stat}</div>
                        <div className="font-mono text-[9px] tracking-widest uppercase mt-1"
                          style={{ color: 'rgba(255,240,225,0.55)' }}>
                          {p.statLabel}
                        </div>
                      </div>
                      <div
                        className="rounded-2xl px-5 py-4 text-center"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          minWidth: 110,
                        }}
                      >
                        <div style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '1.8rem', lineHeight: 1, color: '#f5d5b0'
                        }}>{p.stat2}</div>
                        <div className="font-mono text-[9px] tracking-widest uppercase mt-1"
                          style={{ color: 'rgba(255,240,225,0.45)' }}>
                          {p.stat2Label}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SURFACE VIEW — MARS TERRAIN + FINAL NUMBERS
      ══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d0300 0%, #1a0700 60%, #0d0300 100%)' }}
      >
        {/* Floating data overlays */}
        <div className="relative px-8 md:px-16 pt-24 pb-0 max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.5em] uppercase mb-6"
            style={{ color: 'rgba(220,100,50,0.85)' }}
          >
            Surface Telemetry — Post-Landing
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { val: '7', unit: 'MINUTES', label: 'Entry Duration', color: '#ff4500' },
              { val: '100M', unit: 'ALTITUDE', label: 'Retrorocket Firing', color: '#e05a1e' },
              { val: '225M', unit: 'KM', label: 'Signal Distance', color: '#c0522a' },
              { val: '18', unit: 'MINUTES', label: 'Signal Delay', color: '#f97316' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${s.color}14, rgba(255,255,255,0.02))`,
                  border: `1px solid ${s.color}30`,
                  boxShadow: `0 0 30px ${s.color}10`,
                }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${s.color}15, transparent 60%)` }}
                />
                <div className="relative">
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: 1, color: s.color,
                    textShadow: `0 0 20px ${s.color}40`,
                  }}>{s.val}</div>
                  <div className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: `${s.color}cc` }}>
                    {s.unit}
                  </div>
                  <div className="font-mono text-[10px] mt-2 tracking-wider"
                    style={{ color: 'rgba(255,240,225,0.6)' }}>
                    {s.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mars Surface Illustration */}
        <div className="relative">
          {/* Satellite above surface */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-32 h-40 z-10 pointer-events-none">
            <AISatellite phase={4} descended={true} />
          </div>

          {/* Dust cloud glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '60%', height: 80,
              background: 'radial-gradient(ellipse at 50% 100%, rgba(200,70,20,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          <MarsSurface dustActive={dustActive} />
        </div>

        {/* AI system status strip */}
        <div
          className="px-8 md:px-16 py-10 border-t"
          style={{ borderColor: 'rgba(200,60,10,0.1)' }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'AI Navigation', status: 'NOMINAL', val: 'AUTONOMOUS', color: '#10b981' },
              { label: 'Signal Status', status: 'TRANSMITTING', val: '8 bit/s', color: '#e05a1e' },
              { label: 'Next Phase', status: 'INITIATED', val: 'EXPLORATION', color: '#f97316' },
            ].map(({ label, status, val, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl p-5 flex items-center gap-5"
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}25`,
                }}
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <div>
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: `${color}99` }}>
                    {label}
                  </div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.3rem', lineHeight: 1.1, color: '#fff5ee',
                  }}>{val}</div>
                  <div className="font-mono text-[10px] tracking-widest" style={{ color }}>
                    {status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  )
}