import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function StarField() {
  const mesh = useRef()

  const [positions, sizes] = useMemo(() => {
    const count = 3000
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100
      siz[i] = Math.random() * 0.15 + 0.05
    }
    return [pos, siz]
  }, [])

  // Fix: guard mesh.current before accessing — prevents the
  // "Cannot read properties of undefined" crash on first frame
  useFrame((state) => {
    if (!mesh.current) return
    // Use state.clock.elapsedTime — this is the correct R3F API
    // (THREE.Clock deprecation warning comes from fiber internals;
    //  accessing via state.clock is safe and warning-free)
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}

export default function Stars() {
  return (
    // pointer-events-none stops the Canvas from swallowing scroll/wheel
    // events that belong to the page — eliminates the passive listener conflict
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        // 'always' keeps the animation running; avoids R3F demand-mode
        // creating its own Clock instance that triggers the deprecation warning
        frameloop="always"
        // Prevent R3F from registering its own wheel/touch listeners on the
        // canvas — this is the root cause of "Unable to preventDefault inside
        // passive event listener" when combined with GSAP ScrollTrigger
        events={(store) => ({
          ...store,
          connect: (target) => {
            // no-op: don't attach pointer/wheel events since canvas is decorative
          },
          disconnect: () => {},
        })}
      >
        <StarField />
      </Canvas>
    </div>
  )
}