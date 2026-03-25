import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Planet() {
  const mesh = useRef()

  // Guard against undefined ref on first render frame
  useFrame(() => {
    if (!mesh.current) return
    mesh.current.rotation.y += 0.002
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        color="#c0522a"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}

export default function MarsGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        frameloop="always"
        // Prevent canvas from hijacking page scroll/wheel events
        events={(store) => ({
          ...store,
          connect: () => {},
          disconnect: () => {},
        })}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[-5, 3, 5]} intensity={1.5} color="#ff6030" />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#ff3010" />
        <Planet />
      </Canvas>
    </div>
  )
}