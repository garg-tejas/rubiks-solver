"use client"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { CubeStateManager } from "@/lib/cube-state-manager"

// Dynamically import Three.js components to avoid SSR issues
const useFrame = dynamic(() => import("@react-three/fiber").then(mod => ({ default: mod.useFrame })), { ssr: false })
const Mesh = dynamic(() => import("three").then(mod => ({ default: mod.Mesh })), { ssr: false })

// Rubik's cube colors
const COLORS = {
  white: "#ffffff",
  yellow: "#ffff00",
  red: "#ff0000",
  orange: "#ff8c00",
  blue: "#0000ff",
  green: "#00ff00",
}

// Individual cube piece component
function CubePiece({
  position,
  colors,
  onClick,
}: {
  position: [number, number, number]
  colors: string[]
  onClick?: () => void
}) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? 1.05 : 1}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {colors.map((color, index) => (
        <meshStandardMaterial key={index} attach={`material-${index}`} color={color} roughness={0.3} metalness={0.1} />
      ))}
    </mesh>
  )
}

interface RubiksCubeProps {
  cubeManager?: CubeStateManager
}

export function RubiksCube({ cubeManager }: RubiksCubeProps) {
  const groupRef = useRef<any>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [cubePieces, setCubePieces] = useState<any[]>([])

  useEffect(() => {
    if (cubeManager) {
      const pieces = cubeManager.getCubePieces()
      setCubePieces(pieces)
    }
  }, [cubeManager])

  // Auto-rotate the cube slowly (only in browser)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const interval = setInterval(() => {
      if (groupRef.current && autoRotate) {
        groupRef.current.rotation.y += 0.01
        groupRef.current.rotation.x += 0.005
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [autoRotate])

  const handlePieceClick = (pieceId: string) => {
    console.log("[v0] Cube piece clicked:", pieceId)
    setAutoRotate(!autoRotate)

    // In a full implementation, this would determine the move based on the clicked piece
    // For now, we'll just apply a random move for demonstration
    if (cubeManager) {
      const randomMoves = ["R", "U", "F", "L", "D", "B"]
      const randomMove = randomMoves[Math.floor(Math.random() * randomMoves.length)]
      cubeManager.applyMove(randomMove)

      // Update pieces
      const pieces = cubeManager.getCubePieces()
      setCubePieces(pieces)
    }
  }

  // Generate cube pieces with proper colors
  const generateCubePieces = () => {
    if (cubeManager && cubePieces.length > 0) {
      return cubePieces.map((piece) => (
        <CubePiece
          key={piece.id}
          position={[piece.position.x * 1.02, piece.position.y * 1.02, piece.position.z * 1.02]}
          colors={piece.colors}
          onClick={() => handlePieceClick(piece.id)}
        />
      ))
    }

    const pieces = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue

          const colors = [
            x === 1 ? COLORS.red : x === -1 ? COLORS.orange : "#333333",
            x === 1 ? COLORS.red : x === -1 ? COLORS.orange : "#333333",
            y === 1 ? COLORS.white : y === -1 ? COLORS.yellow : "#333333",
            y === 1 ? COLORS.white : y === -1 ? COLORS.yellow : "#333333",
            z === 1 ? COLORS.blue : z === -1 ? COLORS.green : "#333333",
            z === 1 ? COLORS.blue : z === -1 ? COLORS.green : "#333333",
          ]

          pieces.push(
            <CubePiece
              key={`${x}-${y}-${z}`}
              position={[x * 1.02, y * 1.02, z * 1.02]}
              colors={colors}
              onClick={() => handlePieceClick(`${x}-${y}-${z}`)}
            />,
          )
        }
      }
    }

    return pieces
  }

  return (
    <group ref={groupRef} onClick={() => setAutoRotate(!autoRotate)}>
      {generateCubePieces()}
    </group>
  )
}
