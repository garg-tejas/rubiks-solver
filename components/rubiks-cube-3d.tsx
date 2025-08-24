"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from "lucide-react"
import type { SolutionResult } from "@/lib/cube-solver"

interface RubiksCube3DProps {
    className?: string
    solution?: SolutionResult | null
    onMoveComplete?: (move: string) => void
    onCubeStateChange?: (newState: CubeState) => void
}

// Complete cube state representing all 54 squares (6 faces × 9 squares)
interface CubeState {
    front: string[]   // 9 squares
    back: string[]    // 9 squares  
    top: string[]     // 9 squares
    bottom: string[]  // 9 squares
    left: string[]    // 9 squares
    right: string[]   // 9 squares
}

// Standard Rubik's cube colors
const COLORS = {
    W: '#ffffff', // White
    Y: '#ffff00', // Yellow
    R: '#ff0000', // Red
    O: '#ff8000', // Orange
    G: '#00ff00', // Green
    B: '#0000ff', // Blue
}

// Solved cube state
const SOLVED_CUBE: CubeState = {
    front: Array(9).fill('G'),  // Green front
    back: Array(9).fill('B'),   // Blue back
    top: Array(9).fill('W'),    // White top
    bottom: Array(9).fill('Y'), // Yellow bottom
    left: Array(9).fill('O'),   // Orange left
    right: Array(9).fill('R'),  // Red right
}

export function RubiksCube3D({ className, solution, onMoveComplete, onCubeStateChange }: RubiksCube3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()

    // Cube state and interaction
    const [cubeState, setCubeState] = useState<CubeState>(SOLVED_CUBE)
    const [rotation, setRotation] = useState({ x: -15, y: 25 })
    const [isDragging, setIsDragging] = useState(false)
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
    const [hoveredFace, setHoveredFace] = useState<string | null>(null)

    // Solution animation
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [animationSpeed, setAnimationSpeed] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)

    // Cube move functions
    const rotateFaceClockwise = useCallback((face: string[]) => {
        // Rotate 3x3 array clockwise: [0,1,2,3,4,5,6,7,8] -> [6,3,0,7,4,1,8,5,2]
        return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]]
    }, [])

    const rotateFaceCounterClockwise = useCallback((face: string[]) => {
        // Rotate 3x3 array counter-clockwise
        return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]]
    }, [])

    const applyMove = useCallback((move: string, state = cubeState): CubeState => {
        const newState = JSON.parse(JSON.stringify(state)) as CubeState

        switch (move) {
            case 'R': {
                // Rotate right face clockwise
                newState.right = rotateFaceClockwise(newState.right)
                // Rotate adjacent edges
                const temp = [newState.front[2], newState.front[5], newState.front[8]]
                newState.front[2] = newState.bottom[2]
                newState.front[5] = newState.bottom[5]
                newState.front[8] = newState.bottom[8]
                newState.bottom[2] = newState.back[6]
                newState.bottom[5] = newState.back[3]
                newState.bottom[8] = newState.back[0]
                newState.back[6] = newState.top[2]
                newState.back[3] = newState.top[5]
                newState.back[0] = newState.top[8]
                newState.top[2] = temp[0]
                newState.top[5] = temp[1]
                newState.top[8] = temp[2]
                break
            }
            case "R'": {
                // Rotate right face counter-clockwise (3 clockwise rotations)
                for (let i = 0; i < 3; i++) {
                    newState.right = rotateFaceClockwise(newState.right)
                }
                // Rotate adjacent edges in reverse
                const temp = [newState.front[2], newState.front[5], newState.front[8]]
                newState.front[2] = newState.top[2]
                newState.front[5] = newState.top[5]
                newState.front[8] = newState.top[8]
                newState.top[2] = newState.back[6]
                newState.top[5] = newState.back[3]
                newState.top[8] = newState.back[0]
                newState.back[6] = newState.bottom[2]
                newState.back[3] = newState.bottom[5]
                newState.back[0] = newState.bottom[8]
                newState.bottom[2] = temp[0]
                newState.bottom[5] = temp[1]
                newState.bottom[8] = temp[2]
                break
            }
            case 'L': {
                newState.left = rotateFaceClockwise(newState.left)
                const temp = [newState.front[0], newState.front[3], newState.front[6]]
                newState.front[0] = newState.top[0]
                newState.front[3] = newState.top[3]
                newState.front[6] = newState.top[6]
                newState.top[0] = newState.back[8]
                newState.top[3] = newState.back[5]
                newState.top[6] = newState.back[2]
                newState.back[8] = newState.bottom[0]
                newState.back[5] = newState.bottom[3]
                newState.back[2] = newState.bottom[6]
                newState.bottom[0] = temp[0]
                newState.bottom[3] = temp[1]
                newState.bottom[6] = temp[2]
                break
            }
            case "L'": {
                for (let i = 0; i < 3; i++) {
                    newState.left = rotateFaceClockwise(newState.left)
                }
                const temp = [newState.front[0], newState.front[3], newState.front[6]]
                newState.front[0] = newState.bottom[0]
                newState.front[3] = newState.bottom[3]
                newState.front[6] = newState.bottom[6]
                newState.bottom[0] = newState.back[8]
                newState.bottom[3] = newState.back[5]
                newState.bottom[6] = newState.back[2]
                newState.back[8] = newState.top[0]
                newState.back[5] = newState.top[3]
                newState.back[2] = newState.top[6]
                newState.top[0] = temp[0]
                newState.top[3] = temp[1]
                newState.top[6] = temp[2]
                break
            }
            case 'U': {
                newState.top = rotateFaceClockwise(newState.top)
                const temp = [newState.front[0], newState.front[1], newState.front[2]]
                newState.front[0] = newState.right[0]
                newState.front[1] = newState.right[1]
                newState.front[2] = newState.right[2]
                newState.right[0] = newState.back[0]
                newState.right[1] = newState.back[1]
                newState.right[2] = newState.back[2]
                newState.back[0] = newState.left[0]
                newState.back[1] = newState.left[1]
                newState.back[2] = newState.left[2]
                newState.left[0] = temp[0]
                newState.left[1] = temp[1]
                newState.left[2] = temp[2]
                break
            }
            case "U'": {
                for (let i = 0; i < 3; i++) {
                    newState.top = rotateFaceClockwise(newState.top)
                }
                const temp = [newState.front[0], newState.front[1], newState.front[2]]
                newState.front[0] = newState.left[0]
                newState.front[1] = newState.left[1]
                newState.front[2] = newState.left[2]
                newState.left[0] = newState.back[0]
                newState.left[1] = newState.back[1]
                newState.left[2] = newState.back[2]
                newState.back[0] = newState.right[0]
                newState.back[1] = newState.right[1]
                newState.back[2] = newState.right[2]
                newState.right[0] = temp[0]
                newState.right[1] = temp[1]
                newState.right[2] = temp[2]
                break
            }
            case 'D': {
                newState.bottom = rotateFaceClockwise(newState.bottom)
                const temp = [newState.front[6], newState.front[7], newState.front[8]]
                newState.front[6] = newState.left[6]
                newState.front[7] = newState.left[7]
                newState.front[8] = newState.left[8]
                newState.left[6] = newState.back[6]
                newState.left[7] = newState.back[7]
                newState.left[8] = newState.back[8]
                newState.back[6] = newState.right[6]
                newState.back[7] = newState.right[7]
                newState.back[8] = newState.right[8]
                newState.right[6] = temp[0]
                newState.right[7] = temp[1]
                newState.right[8] = temp[2]
                break
            }
            case "D'": {
                for (let i = 0; i < 3; i++) {
                    newState.bottom = rotateFaceClockwise(newState.bottom)
                }
                const temp = [newState.front[6], newState.front[7], newState.front[8]]
                newState.front[6] = newState.right[6]
                newState.front[7] = newState.right[7]
                newState.front[8] = newState.right[8]
                newState.right[6] = newState.back[6]
                newState.right[7] = newState.back[7]
                newState.right[8] = newState.back[8]
                newState.back[6] = newState.left[6]
                newState.back[7] = newState.left[7]
                newState.back[8] = newState.left[8]
                newState.left[6] = temp[0]
                newState.left[7] = temp[1]
                newState.left[8] = temp[2]
                break
            }
            case 'F': {
                newState.front = rotateFaceClockwise(newState.front)
                const temp = [newState.top[6], newState.top[7], newState.top[8]]
                newState.top[6] = newState.left[8]
                newState.top[7] = newState.left[5]
                newState.top[8] = newState.left[2]
                newState.left[8] = newState.bottom[2]
                newState.left[5] = newState.bottom[1]
                newState.left[2] = newState.bottom[0]
                newState.bottom[2] = newState.right[0]
                newState.bottom[1] = newState.right[3]
                newState.bottom[0] = newState.right[6]
                newState.right[0] = temp[0]
                newState.right[3] = temp[1]
                newState.right[6] = temp[2]
                break
            }
            case "F'": {
                for (let i = 0; i < 3; i++) {
                    newState.front = rotateFaceClockwise(newState.front)
                }
                const temp = [newState.top[6], newState.top[7], newState.top[8]]
                newState.top[6] = newState.right[0]
                newState.top[7] = newState.right[3]
                newState.top[8] = newState.right[6]
                newState.right[0] = newState.bottom[2]
                newState.right[3] = newState.bottom[1]
                newState.right[6] = newState.bottom[0]
                newState.bottom[2] = newState.left[8]
                newState.bottom[1] = newState.left[5]
                newState.bottom[0] = newState.left[2]
                newState.left[8] = temp[0]
                newState.left[5] = temp[1]
                newState.left[2] = temp[2]
                break
            }
            case 'B': {
                newState.back = rotateFaceClockwise(newState.back)
                const temp = [newState.top[0], newState.top[1], newState.top[2]]
                newState.top[0] = newState.right[2]
                newState.top[1] = newState.right[5]
                newState.top[2] = newState.right[8]
                newState.right[2] = newState.bottom[8]
                newState.right[5] = newState.bottom[7]
                newState.right[8] = newState.bottom[6]
                newState.bottom[8] = newState.left[6]
                newState.bottom[7] = newState.left[3]
                newState.bottom[6] = newState.left[0]
                newState.left[6] = temp[0]
                newState.left[3] = temp[1]
                newState.left[0] = temp[2]
                break
            }
            case "B'": {
                for (let i = 0; i < 3; i++) {
                    newState.back = rotateFaceClockwise(newState.back)
                }
                const temp = [newState.top[0], newState.top[1], newState.top[2]]
                newState.top[0] = newState.left[6]
                newState.top[1] = newState.left[3]
                newState.top[2] = newState.left[0]
                newState.left[6] = newState.bottom[8]
                newState.left[3] = newState.bottom[7]
                newState.left[0] = newState.bottom[6]
                newState.bottom[8] = newState.right[2]
                newState.bottom[7] = newState.right[5]
                newState.bottom[6] = newState.right[8]
                newState.right[2] = temp[0]
                newState.right[5] = temp[1]
                newState.right[8] = temp[2]
                break
            }
        }

        return newState
    }, [cubeState, rotateFaceClockwise])

    // Scramble function
    const scrambleCube = useCallback(() => {
        const moves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"]
        let newState = JSON.parse(JSON.stringify(SOLVED_CUBE)) as CubeState

        // Apply random moves for a proper scramble (15-30 moves for good variety)
        const numMoves = Math.floor(Math.random() * 16) + 15 // 15-30 moves
        for (let i = 0; i < numMoves; i++) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)]
            newState = applyMove(randomMove, newState)
        }

        setCubeState(newState)
        onCubeStateChange?.(newState)
        setCurrentStep(0)
        setIsPlaying(false)
        console.log(`[3D] Cube scrambled with ${numMoves} random moves`)
    }, [applyMove, onCubeStateChange])

    // Manual move function
    const makeMove = useCallback((move: string) => {
        const newState = applyMove(move, cubeState)
        setCubeState(newState)
        onCubeStateChange?.(newState)
        onMoveComplete?.(move)
    }, [cubeState, applyMove, onCubeStateChange, onMoveComplete])

    // Reset to solved
    const resetCube = useCallback(() => {
        setCubeState(SOLVED_CUBE)
        onCubeStateChange?.(SOLVED_CUBE)
        setCurrentStep(0)
        setIsPlaying(false)
        console.log('[v0] Cube reset to solved state')
    }, [onCubeStateChange])

    // Solution animation
    const playNextStep = useCallback(() => {
        if (!solution || currentStep >= solution.steps.length) {
            setIsPlaying(false)
            return
        }

        setIsAnimating(true)
        const move = solution.steps[currentStep].move
        makeMove(move)

        setTimeout(() => {
            setCurrentStep(prev => prev + 1)
            setIsAnimating(false)
        }, 1000 / animationSpeed)
    }, [solution, currentStep, makeMove, animationSpeed])

    // Auto-play effect
    useEffect(() => {
        if (isPlaying && !isAnimating) {
            const timer = setTimeout(playNextStep, 100)
            return () => clearTimeout(timer)
        }
    }, [isPlaying, isAnimating, playNextStep])

    // Canvas drawing
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const size = Math.min(600, window.innerWidth * 0.8)
        canvas.width = size
        canvas.height = size

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const cubeSize = 100

        const drawCube = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 3D math functions
            const toRadians = (deg: number) => deg * (Math.PI / 180)

            const rotateX = (point: number[], angle: number) => {
                const cos = Math.cos(toRadians(angle))
                const sin = Math.sin(toRadians(angle))
                return [point[0], point[1] * cos - point[2] * sin, point[1] * sin + point[2] * cos]
            }

            const rotateY = (point: number[], angle: number) => {
                const cos = Math.cos(toRadians(angle))
                const sin = Math.sin(toRadians(angle))
                return [point[0] * cos + point[2] * sin, point[1], -point[0] * sin + point[2] * cos]
            }

            const project = (point: number[]) => {
                const distance = 400
                const scale = distance / (distance + point[2])
                return [centerX + point[0] * scale, centerY - point[1] * scale]
            }

            // Define all 6 faces with proper 3D positioning
            const faces = [
                {
                    name: 'front',
                    colors: cubeState.front,
                    vertices: [
                        [-cubeSize, -cubeSize, cubeSize], [cubeSize, -cubeSize, cubeSize],
                        [cubeSize, cubeSize, cubeSize], [-cubeSize, cubeSize, cubeSize]
                    ],
                    normal: [0, 0, 1]
                },
                {
                    name: 'back',
                    colors: cubeState.back,
                    vertices: [
                        [cubeSize, -cubeSize, -cubeSize], [-cubeSize, -cubeSize, -cubeSize],
                        [-cubeSize, cubeSize, -cubeSize], [cubeSize, cubeSize, -cubeSize]
                    ],
                    normal: [0, 0, -1]
                },
                {
                    name: 'top',
                    colors: cubeState.top,
                    vertices: [
                        [-cubeSize, -cubeSize, -cubeSize], [cubeSize, -cubeSize, -cubeSize],
                        [cubeSize, -cubeSize, cubeSize], [-cubeSize, -cubeSize, cubeSize]
                    ],
                    normal: [0, -1, 0]
                },
                {
                    name: 'bottom',
                    colors: cubeState.bottom,
                    vertices: [
                        [-cubeSize, cubeSize, cubeSize], [cubeSize, cubeSize, cubeSize],
                        [cubeSize, cubeSize, -cubeSize], [-cubeSize, cubeSize, -cubeSize]
                    ],
                    normal: [0, 1, 0]
                },
                {
                    name: 'left',
                    colors: cubeState.left,
                    vertices: [
                        [-cubeSize, -cubeSize, -cubeSize], [-cubeSize, -cubeSize, cubeSize],
                        [-cubeSize, cubeSize, cubeSize], [-cubeSize, cubeSize, -cubeSize]
                    ],
                    normal: [-1, 0, 0]
                },
                {
                    name: 'right',
                    colors: cubeState.right,
                    vertices: [
                        [cubeSize, -cubeSize, cubeSize], [cubeSize, -cubeSize, -cubeSize],
                        [cubeSize, cubeSize, -cubeSize], [cubeSize, cubeSize, cubeSize]
                    ],
                    normal: [1, 0, 0]
                }
            ]

            // Transform faces and calculate visibility
            const transformedFaces = faces.map(face => {
                const transformedVertices = face.vertices.map(vertex => {
                    let point = rotateX(vertex, rotation.x)
                    point = rotateY(point, rotation.y)
                    return { world: point, screen: project(point) }
                })

                // Calculate face normal after rotation
                let normal = rotateX(face.normal, rotation.x)
                normal = rotateY(normal, rotation.y)

                // Calculate center for depth sorting
                const center = transformedVertices.reduce((sum, v) =>
                    [sum[0] + v.world[0], sum[1] + v.world[1], sum[2] + v.world[2]], [0, 0, 0]
                ).map(coord => coord / 4)

                return {
                    ...face,
                    vertices: transformedVertices,
                    normal,
                    depth: center[2],
                    visible: normal[2] > 0 // Face towards camera
                }
            })

            // Sort by depth (furthest first) and only draw visible faces
            transformedFaces
                .filter(face => face.visible)
                .sort((a, b) => a.depth - b.depth)
                .forEach(face => {
                    const squareSize = (cubeSize * 2) / 3

                    // Draw each 3x3 square
                    for (let row = 0; row < 3; row++) {
                        for (let col = 0; col < 3; col++) {
                            const index = row * 3 + col
                            const color = COLORS[face.colors[index] as keyof typeof COLORS] || '#cccccc'

                            // Calculate square corners within the face
                            const u1 = (col / 3) * 2 - 1
                            const u2 = ((col + 1) / 3) * 2 - 1
                            const v1 = (row / 3) * 2 - 1
                            const v2 = ((row + 1) / 3) * 2 - 1

                            // Interpolate within face vertices
                            const corners = [
                                interpolateQuad(face.vertices, u1, v1),
                                interpolateQuad(face.vertices, u2, v1),
                                interpolateQuad(face.vertices, u2, v2),
                                interpolateQuad(face.vertices, u1, v2)
                            ]

                            // Draw square
                            ctx.beginPath()
                            ctx.moveTo(corners[0][0], corners[0][1])
                            corners.slice(1).forEach(corner => ctx.lineTo(corner[0], corner[1]))
                            ctx.closePath()

                            // Fill with color
                            ctx.fillStyle = color
                            ctx.fill()

                            // Draw border
                            ctx.strokeStyle = '#000000'
                            ctx.lineWidth = 2
                            ctx.stroke()

                            // Highlight if hovered
                            if (hoveredFace === face.name) {
                                ctx.strokeStyle = '#ffff00'
                                ctx.lineWidth = 4
                                ctx.stroke()
                            }
                        }
                    }
                })

            // Draw move indicator
            if (solution && currentStep < solution.steps.length) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
                ctx.fillRect(10, 10, 200, 40)
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 16px Arial'
                ctx.fillText(`Next: ${solution.steps[currentStep].move}`, 20, 35)
            }
        }

        // Helper function to interpolate within a quad
        function interpolateQuad(vertices: any[], u: number, v: number) {
            const [v0, v1, v2, v3] = vertices.map(v => v.screen)

            // Bilinear interpolation
            const top = [
                v0[0] + (v1[0] - v0[0]) * (u + 1) / 2,
                v0[1] + (v1[1] - v0[1]) * (u + 1) / 2
            ]
            const bottom = [
                v3[0] + (v2[0] - v3[0]) * (u + 1) / 2,
                v3[1] + (v2[1] - v3[1]) * (u + 1) / 2
            ]

            return [
                top[0] + (bottom[0] - top[0]) * (v + 1) / 2,
                top[1] + (bottom[1] - top[1]) * (v + 1) / 2
            ]
        }

        drawCube()
    }, [cubeState, rotation, hoveredFace, solution, currentStep])

    // Mouse handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        const rect = canvasRef.current!.getBoundingClientRect()
        setLastMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const rect = canvasRef.current!.getBoundingClientRect()
            const currentX = e.clientX - rect.left
            const currentY = e.clientY - rect.top

            const deltaX = currentX - lastMousePos.x
            const deltaY = currentY - lastMousePos.y

            setRotation(prev => ({
                x: Math.max(-60, Math.min(60, prev.x + deltaY * 0.5)),
                y: prev.y + deltaX * 0.5
            }))

            setLastMousePos({ x: currentX, y: currentY })
        }
    }

    const handleMouseUp = () => setIsDragging(false)

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) return

        // Get click position relative to canvas center
        const rect = canvasRef.current!.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        // Determine most prominent face based on current rotation
        // This is a simplified but more accurate mapping than before
        let move = ''

        // Calculate which face is most visible based on rotation
        const rotX = rotation.x * Math.PI / 180
        const rotY = rotation.y * Math.PI / 180

        // Determine primary direction based on rotation and click position
        if (Math.abs(Math.sin(rotY)) > 0.5) {
            // Left/Right faces are prominent
            move = Math.sin(rotY) > 0 ? 'R' : 'L'
        } else if (Math.abs(Math.sin(rotX)) > 0.3) {
            // Top/Bottom faces are prominent  
            move = Math.sin(rotX) > 0 ? 'D' : 'U'
        } else {
            // Front face is prominent, use click position
            if (Math.abs(x) > Math.abs(y)) {
                move = x > 0 ? 'R' : 'L'
            } else {
                move = y < 0 ? 'U' : 'D'
            }
        }

        console.log(`[3D] Click at (${x.toFixed(0)}, ${y.toFixed(0)}) -> Move: ${move}`)
        makeMove(move)
    }

    const totalSteps = solution?.steps.length || 0

    return (
        <div className={`flex flex-col space-y-4 ${className}`}>
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="border border-border rounded-lg cursor-grab active:cursor-grabbing shadow-lg mx-auto"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleClick}
                style={{ maxWidth: '100%', height: 'auto' }}
            />

            {/* Manual Controls */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"].map(move => (
                    <Button
                        key={move}
                        variant="outline"
                        size="sm"
                        onClick={() => makeMove(move)}
                        className="font-mono"
                    >
                        {move}
                    </Button>
                ))}
            </div>

            {/* Cube Controls */}
            <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={scrambleCube} className="flex items-center gap-2">
                    <Shuffle className="w-4 h-4" />
                    Scramble
                </Button>
                <Button variant="outline" onClick={resetCube} className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </Button>
            </div>

            {/* Solution Animation Controls */}
            {solution && (
                <div className="space-y-4 p-4 bg-card/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Solution Animation</h4>
                        <span className="text-sm text-muted-foreground">
                            Step {currentStep} / {totalSteps}
                        </span>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                        >
                            <SkipBack className="w-4 h-4" />
                        </Button>

                        <Button
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={isAnimating || currentStep >= totalSteps}
                            className="px-6"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {isPlaying ? 'Pause' : 'Play'}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                            disabled={currentStep >= totalSteps}
                        >
                            <SkipForward className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Speed Control */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Speed: {animationSpeed}x</label>
                        <div className="flex space-x-2">
                            {[0.5, 1, 2, 4].map(speed => (
                                <Button
                                    key={speed}
                                    variant={animationSpeed === speed ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAnimationSpeed(speed)}
                                    className="text-xs"
                                >
                                    {speed}x
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Current Move */}
                    {currentStep < totalSteps && (
                        <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-mono text-lg font-bold">
                                {solution.steps[currentStep].move}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {solution.steps[currentStep].description}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
