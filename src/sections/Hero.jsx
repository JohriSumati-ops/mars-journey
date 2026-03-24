import { motion } from 'framer-motion'

const navItems = [
  { label: 'Launch', id: 'launch' },
  { label: 'Transit', id: 'travel' },
  { label: 'Landing', id: 'landing' },
  { label: 'Explore', id: 'exploration' },
]

export default function Hero({ onNext }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative h-screen flex flex-col
    justify-between pb-16 px-6 md:px-12 bg-black overflow-hidden">

      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/mars.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0
        bg-[radial-gradient(ellipse_at_70%_40%,_rgba(80,10,5,0.4)_0%,_transparent_70%)]" />
      </div>

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
              <button
                onClick={() => scrollTo(id)}
                className="font-mono text-xs tracking-[0.2em] uppercase
                text-stone-300 hover:text-white transition-colors duration-300"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="font-['Bebas_Neue'] text-xl tracking-[0.4em]
        text-stone-200 text-center">
          MARS<br />
          <span className="text-xs font-mono tracking-[0.3em]
          text-stone-400">2047</span>
        </div>

        <ul className="hidden md:flex gap-10">
          {navItems.slice(2).map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="font-mono text-xs tracking-[0.2em] uppercase
                text-stone-300 hover:text-white transition-colors duration-300"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="md:hidden font-['Bebas_Neue'] text-lg
        tracking-[0.3em] text-stone-400">
          MARS — 2047
        </div>
      </motion.nav>

      {/* ── Mars Planet Image ── */}
      <motion.img
  src="https://space-facts.com/wp-content/uploads/mars-v2.jpg"
  alt="Mars"
  initial={{ opacity: 0, scale: 0.8, x: 100 }}
  animate={{ opacity: 1, scale: 1, x: 0 }}
  transition={{ duration: 1.5, delay: 2.8, ease: 'easeOut' }}
  className="hidden md:block absolute right-10 top-1/2
  -translate-y-1/2 w-80 h-80 lg:w-[420px] lg:h-[420px]
  object-cover z-10
  mix-blend-mode-screen
  animate-[float_8s_ease-in-out_infinite]"
  style={{ mixBlendMode: 'screen' }}
/>

      {/* ── Bottom Content ── */}
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="font-mono text-xs tracking-[0.4em]
          text-red-500 uppercase mb-4"
        >
          Mission — 2047
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.0 }}
          className="font-['Bebas_Neue'] text-[5rem] md:text-[8rem]
          lg:text-[10rem] leading-none tracking-wide text-stone-100"
        >
          JOURNEY<br />
          <span className="text-red-600">TO MARS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="mt-6 text-stone-400 text-sm md:text-base
          font-light max-w-md leading-relaxed"
        >
          A 7-month odyssey through the void.
          The most ambitious mission in human history begins now.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => scrollTo('launch')}
          className="mt-8 md:mt-10 px-8 md:px-10 py-3 md:py-4
          bg-red-700 hover:bg-red-600 text-white font-mono
          text-xs tracking-widest uppercase transition-colors duration-300"
        >
          Begin Mission
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          className="mt-4 font-mono text-xs text-stone-600
          tracking-widest"
        >
          Video courtesy: ISRO — Mangalyaan Mars Orbiter Mission
        </motion.p>
      </div>
    </section>
  )
}