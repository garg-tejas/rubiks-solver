"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Shuffle, Lightbulb, Play, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { RubiksCube3D } from "@/components/rubiks-cube-3d"
import { CubeStateManager } from "@/lib/cube-state-manager"
import type { SolutionResult } from "@/lib/cube-solver"

export default function CubePage() {
  const [cubeManager] = useState(() => new CubeStateManager())
  const [moveCount, setMoveCount] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [solutionsUsed, setSolutionsUsed] = useState(0)
  const [isScrambling, setIsScrambling] = useState(false)
  const [isGettingSolution, setIsGettingSolution] = useState(false)
  const [currentSolution, setCurrentSolution] = useState<SolutionResult | null>(null)
  const [isSolved, setIsSolved] = useState(true)
  const [isScrambled, setIsScrambled] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!isSolved && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    } else if (isSolved && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isSolved])

  const handleScramble = async () => {
    setIsScrambling(true)
    setCurrentSolution(null)

    // The scrambling is now handled by the RubiksCube3D component
    setIsSolved(false)
    setTimeElapsed(0)
    setMoveCount(0)

    console.log("[Cube] Scrambling cube...")

    // No artificial delay needed - scrambling happens instantly
    setIsScrambling(false)
  }

  const handleReset = () => {
    // Reset is now handled by the RubiksCube3D component
    setMoveCount(0)
    setTimeElapsed(0)
    setCurrentSolution(null)
    setIsSolved(true)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }

    console.log("[Cube] Reset cube to solved state")
  }

  const handleGetSolution = async () => {
    setIsGettingSolution(true)

    try {
      const solution = await cubeManager.getSolution()
      setCurrentSolution(solution)
      setSolutionsUsed((prev) => prev + 1)
      console.log("[Cube] Generated solution:", solution)
    } catch (error) {
      console.error("[Cube] Error generating solution:", error)
    } finally {
      setIsGettingSolution(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-heading font-bold text-foreground">3D Interactive Cube</h1>
          </div>
          <Badge variant="secondary">
            <Play className="w-3 h-3 mr-1" />
            Interactive Mode
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Cube Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="font-heading font-semibold flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSolved ? "bg-primary animate-pulse" : "bg-accent"}`} />
                  Interactive Rubik's Cube
                  {isSolved && (
                    <Badge variant="outline" className="ml-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Solved
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <RubiksCube3D
                  className="w-full"
                  solution={currentSolution}
                  onMoveComplete={(move) => {
                    console.log('[Cube] Move completed:', move)
                    setMoveCount(prev => prev + 1)
                  }}
                  onCubeStateChange={(newState) => {
                    console.log('[Cube] Cube state changed:', newState)
                    // Check if cube is solved (all faces uniform color)
                    const solved = Object.values(newState).every(face =>
                      face.every(square => square === face[0])
                    )
                    setIsSolved(solved)
                    setIsScrambled(!solved)
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Cube Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-lg">Cube Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>🎮 Quick Start:</strong></p>
                  <p>1. Click Scramble button below</p>
                  <p>2. Use Get Solution when ready</p>
                  <p>3. Click faces or buttons to move</p>
                  <p>4. Watch animated solutions!</p>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  onClick={handleGetSolution}
                  disabled={isGettingSolution || !isScrambled}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {isGettingSolution ? "Generating..." : isScrambled ? "Get Solution" : "Scramble First"}
                </Button>
              </CardContent>
            </Card>

            {/* Solution Display */}
            {currentSolution && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Solution Ready
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">{currentSolution.totalMoves}</p>
                      <p className="text-sm text-muted-foreground">Total Moves</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold text-foreground">{currentSolution.difficulty}</p>
                      <p className="text-sm text-muted-foreground">Difficulty</p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <h4 className="font-medium text-foreground">Solution Steps:</h4>
                    {currentSolution.steps.slice(0, 5).map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded text-sm">
                        <Badge
                          variant="outline"
                          className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <div className="flex-1">
                          <code className="font-mono text-foreground">{step.move}</code>
                          <p className="text-muted-foreground text-xs">{step.description}</p>
                        </div>
                      </div>
                    ))}
                    {currentSolution.steps.length > 5 && (
                      <p className="text-center text-muted-foreground text-sm">
                        +{currentSolution.steps.length - 5} more steps...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Click faces</strong> to rotate layers (R, L, U, D, F, B)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Manual buttons</strong> for precise move control</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Drag</strong> to rotate view and see all 6 faces</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Scramble/Reset</strong> for practice sessions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Solution animation</strong> with speed controls</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Real cube physics</strong> - every move is accurate</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Moves Made</span>
                  <Badge variant="outline">{moveCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time Elapsed</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(timeElapsed)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Solutions Used</span>
                  <Badge variant="outline">{solutionsUsed}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
