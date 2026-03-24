import { useState, useRef, useEffect } from 'react'

/* ─────────────────────────────────────────────
   Ambient space tracks from free/CC sources
───────────────────────────────────────────── */
const TRACKS = [
  {
    title: 'INTERSTELLAR DRIFT',
    artist: 'Ambient Space',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    color: '#e05a1e',
  },
  {
    title: 'VOID SIGNAL',
    artist: 'Deep Cosmos',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#c0522a',
  },
  {
    title: 'MARTIAN WIND',
    artist: 'Red Planet',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    color: '#ff6030',
  },
]

/* Animated waveform bars */
function WaveBars({ playing, color }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {[0.4, 0.8, 0.55, 1, 0.65, 0.9, 0.45, 0.75, 0.5, 0.85].map((h, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: playing ? `${h * 16}px` : '3px',
            background: color,
            borderRadius: 1,
            transition: 'height 0.15s ease',
            animation: playing
              ? `wavebar ${0.5 + i * 0.08}s ease-in-out ${i * 0.05}s infinite alternate`
              : 'none',
            opacity: playing ? 0.85 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)

  const track = TRACKS[trackIdx]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
    audio.src = track.url
    if (playing) audio.play().catch(() => {})
  }, [trackIdx])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime / (audio.duration || 1))
    const onDur = () => setDuration(audio.duration)
    const onEnd = () => changeTrack(1)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDur)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDur)
      audio.removeEventListener('ended', onEnd)
    }
  }, [trackIdx])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const changeTrack = (dir) => {
    setTrackIdx((i) => (i + dir + TRACKS.length) % TRACKS.length)
    setProgress(0)
  }

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    if (audioRef.current) {
      audioRef.current.currentTime = pct * (audioRef.current.duration || 0)
    }
  }

  const fmtTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  return (
    <>
      <audio ref={audioRef} preload="none" />

      <style>{`
        @keyframes wavebar {
          from { height: 3px; }
          to   { height: var(--h, 12px); }
        }
        .music-player-outer {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          font-family: 'Courier New', monospace;
        }
        .glass-pill {
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          background: rgba(6, 3, 2, 0.72);
          border: 1px solid rgba(224,90,30,0.22);
          box-shadow:
            0 0 0 1px rgba(224,90,30,0.06) inset,
            0 8px 40px rgba(0,0,0,0.7),
            0 0 60px rgba(224,90,30,0.07);
          border-radius: 16px;
          overflow: hidden;
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1),
                      height 0.4s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.3s;
        }
        .glass-pill:hover {
          border-color: rgba(224,90,30,0.38);
        }
        .mp-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.15s;
        }
        .mp-btn:hover { opacity: 0.7; transform: scale(1.12); }
        .mp-btn:active { transform: scale(0.92); }
        .seek-bar {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .seek-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.25s linear;
          position: relative;
        }
        .seek-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          opacity: 0.9;
        }
        .vol-slider {
          -webkit-appearance: none;
          width: 64px;
          height: 2px;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          outline: none;
          cursor: pointer;
        }
        .vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e05a1e;
          cursor: pointer;
        }
      `}</style>

      <div className="music-player-outer">
        <div className="glass-pill" style={{ width: expanded ? 300 : 52, height: expanded ? 'auto' : 52 }}>

          {/* ── COLLAPSED: just icon ── */}
          {!expanded && (
            <button
              className="mp-btn"
              style={{ width: 52, height: 52 }}
              onClick={() => setExpanded(true)}
              title="Open music player"
            >
              {playing
                ? <WaveBars playing color={track.color} />
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18V5l12-2v13" stroke={track.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="18" r="3" stroke={track.color} strokeWidth="1.5"/>
                    <circle cx="18" cy="16" r="3" stroke={track.color} strokeWidth="1.5"/>
                  </svg>
              }
            </button>
          )}

          {/* ── EXPANDED panel ── */}
          {expanded && (
            <div style={{ padding: '14px 16px' }}>

              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <WaveBars playing={playing} color={track.color} />
                  <span style={{ fontSize: 9, letterSpacing: '0.3em', color: `${track.color}cc`, textTransform: 'uppercase' }}>
                    AMBIENT
                  </span>
                </div>
                <button
                  className="mp-btn"
                  onClick={() => setExpanded(false)}
                  style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              {/* Track info */}
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.2rem',
                  letterSpacing: '0.05em',
                  color: '#f5e0d0',
                  lineHeight: 1.1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}>
                  {track.title}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', marginTop: 3, textTransform: 'uppercase' }}>
                  {track.artist} · {trackIdx + 1}/{TRACKS.length}
                </div>
              </div>

              {/* Seek bar */}
              <div className="seek-bar" onClick={seek} style={{ marginBottom: 4 }}>
                <div
                  className="seek-fill"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(90deg, ${track.color}99, ${track.color})`,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>
                  {fmtTime((audioRef.current?.currentTime) || 0)}
                </span>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>
                  {fmtTime(duration)}
                </span>
              </div>

              {/* Controls row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                {/* Prev */}
                <button className="mp-btn" onClick={() => changeTrack(-1)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 20L9 12l10-8v16zM5 4v16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Play/Pause — main button */}
                <button
                  className="mp-btn"
                  onClick={toggle}
                  style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`,
                    boxShadow: `0 0 20px ${track.color}55`,
                  }}
                >
                  {playing
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                  }
                </button>

                {/* Next */}
                <button className="mp-btn" onClick={() => changeTrack(1)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4l10 8-10 8V4zM19 4v16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Volume row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="mp-btn"
                  onClick={() => setMuted(m => !m)}
                >
                  {muted
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={track.color} strokeWidth="1.5" strokeLinecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={`${track.color}70`} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  }
                </button>
                <input
                  type="range"
                  className="vol-slider"
                  min={0} max={1} step={0.01}
                  value={muted ? 0 : volume}
                  onChange={e => { setVolume(+e.target.value); setMuted(false) }}
                />
                <span style={{ fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', minWidth: 24 }}>
                  {Math.round((muted ? 0 : volume) * 100)}
                </span>
              </div>

              {/* Divider + track switcher dots */}
              <div style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'center',
                gap: 6,
              }}>
                {TRACKS.map((t, i) => (
                  <button
                    key={i}
                    className="mp-btn"
                    onClick={() => { setTrackIdx(i); setProgress(0) }}
                    style={{
                      width: trackIdx === i ? 20 : 6,
                      height: 4,
                      borderRadius: 2,
                      background: trackIdx === i ? t.color : 'rgba(255,255,255,0.12)',
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
