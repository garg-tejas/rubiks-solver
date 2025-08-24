// Cube State Management for 3D Interactive Cube
import { type CubeState, type Move, RubiksCubeSolver } from "./cube-solver"

export interface CubePosition {
  x: number
  y: number
  z: number
}

export interface CubePiece {
  id: string
  position: CubePosition
  colors: string[]
  type: "corner" | "edge" | "center"
}

export class CubeStateManager {
  private currentState: CubeState
  private moveHistory: Move[] = []
  private scrambleSequence: Move[] = []

  constructor() {
    this.currentState = RubiksCubeSolver.createSolvedCube()
  }

  getCurrentState(): CubeState {
    return JSON.parse(JSON.stringify(this.currentState))
  }

  applyMove(move: Move): void {
    console.log(`[v0] Applying move: ${move}`)
    this.currentState = RubiksCubeSolver.applyMove(this.currentState, move)
    this.moveHistory.push(move)
  }

  scramble(moves = 25): Move[] {
    console.log(`[v0] Scrambling cube with ${moves} moves`)
    const { state, scramble } = RubiksCubeSolver.scrambleCube(moves)
    this.currentState = state
    this.scrambleSequence = scramble
    this.moveHistory = [...scramble]
    return scramble
  }

  reset(): void {
    console.log("[v0] Resetting cube to solved state")
    this.currentState = RubiksCubeSolver.createSolvedCube()
    this.moveHistory = []
    this.scrambleSequence = []
  }

  isSolved(): boolean {
    // Check if current state matches solved state
    const solvedState = RubiksCubeSolver.createSolvedCube()
    return JSON.stringify(this.currentState) === JSON.stringify(solvedState)
  }

  getMoveHistory(): Move[] {
    return [...this.moveHistory]
  }

  getScrambleSequence(): Move[] {
    return [...this.scrambleSequence]
  }

  getMoveCount(): number {
    return this.moveHistory.length
  }

  undoLastMove(): boolean {
    if (this.moveHistory.length === 0) return false

    const lastMove = this.moveHistory.pop()!
    const inverseMove = this.getInverseMove(lastMove)

    // Apply inverse move without adding to history
    this.currentState = RubiksCubeSolver.applyMove(this.currentState, inverseMove)
    console.log(`[v0] Undid move: ${lastMove} with ${inverseMove}`)

    return true
  }

  private getInverseMove(move: Move): Move {
    const face = move.charAt(0)
    const modifier = move.slice(1)

    if (modifier === "'") return face
    if (modifier === "2") return move // 180° moves are their own inverse
    return face + "'"
  }

  async getSolution(): Promise<import("./cube-solver").SolutionResult> {
    console.log("[v0] Generating solution using Kociemba's algorithm")
    
    // Use local Kociemba implementation for optimal performance
    return RubiksCubeSolver.solveCube(this.currentState)
  }

  // Convert cube state to 3D piece positions for rendering
  getCubePieces(): CubePiece[] {
    const pieces: CubePiece[] = []

    // Generate pieces based on current state
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip center piece
          if (x === 0 && y === 0 && z === 0) continue

          const piece: CubePiece = {
            id: `${x}-${y}-${z}`,
            position: { x, y, z },
            colors: this.getPieceColors(x, y, z),
            type: this.getPieceType(x, y, z),
          }

          pieces.push(piece)
        }
      }
    }

    return pieces
  }

  private getPieceColors(x: number, y: number, z: number): string[] {
    const colors = ["#333333", "#333333", "#333333", "#333333", "#333333", "#333333"]

    // Map cube state to piece colors based on position
    if (x === 1) colors[0] = this.getColorFromState("R", x, y, z) // Right face
    if (x === -1) colors[1] = this.getColorFromState("L", x, y, z) // Left face
    if (y === 1) colors[2] = this.getColorFromState("U", x, y, z) // Top face
    if (y === -1) colors[3] = this.getColorFromState("D", x, y, z) // Bottom face
    if (z === 1) colors[4] = this.getColorFromState("F", x, y, z) // Front face
    if (z === -1) colors[5] = this.getColorFromState("B", x, y, z) // Back face

    return colors
  }

  private getColorFromState(face: string, x: number, y: number, z: number): string {
    // Map 3D position to 2D face coordinates
    const faceMatrix = this.currentState.faces[face as keyof CubeState["faces"]]

    // Convert position to face coordinates (simplified mapping)
    let row = 1,
      col = 1

    switch (face) {
      case "U":
        row = z + 1
        col = x + 1
        break
      case "D":
        row = -z + 1
        col = x + 1
        break
      case "R":
        row = -y + 1
        col = z + 1
        break
      case "L":
        row = -y + 1
        col = -z + 1
        break
      case "F":
        row = -y + 1
        col = x + 1
        break
      case "B":
        row = -y + 1
        col = -x + 1
        break
    }

    const colorName = faceMatrix[row]?.[col] || "white"
    return this.colorNameToHex(colorName)
  }

  private colorNameToHex(colorName: string): string {
    const colorMap: Record<string, string> = {
      white: "#ffffff",
      yellow: "#ffff00",
      red: "#ff0000",
      orange: "#ff8c00",
      blue: "#0000ff",
      green: "#00ff00",
    }
    return colorMap[colorName] || "#333333"
  }

  private getPieceType(x: number, y: number, z: number): "corner" | "edge" | "center" {
    const nonZeroCount = [x, y, z].filter((coord) => coord !== 0).length

    if (nonZeroCount === 3) return "corner"
    if (nonZeroCount === 2) return "edge"
    return "center"
  }
}
