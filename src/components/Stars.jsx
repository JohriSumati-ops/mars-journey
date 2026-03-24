import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function StarField() {
  const mesh = useRef()

  const [positions, sizes] = useMemo(() => {
    const count = 3000
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100
      siz[i] = Math.random() * 0.15 + 0.05
    }
    return [pos, siz]
  }, [])

  useFrame((state) => {
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
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <StarField />
      </Canvas>
    </div>
  )
}