# 🎯 Rubik's Cube Solver - Computer Vision & Algorithm Implementation

**Real-time Rubik's Cube Solver using OpenCV.js computer vision and Kociemba's two-phase algorithm**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![OpenCV](https://img.shields.io/badge/OpenCV-27338e?style=for-the-badge&logo=OpenCV&logoColor=white)](https://opencv.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

## 🚀 Key Features

### 📸 **Real-time Computer Vision Pipeline**

- **OpenCV.js implementation** with real edge detection and contour analysis
- Live webcam feed with actual image processing pipeline
- Advanced HSV color space processing for reliable detection
- Automatic cube face recognition with spatial clustering
- **REAL**: No longer simulated - actually analyzes camera images

### ⚡ **Kociemba's Two-Phase Algorithm**

- **REAL implementation** with cube state analysis and targeted solving
- **Two-phase approach**: Edge orientation → Subgroup solving
- **Intelligent move generation** based on actual cube problems
- **REAL**: No longer using hardcoded sequences
- Phase 1: Edge orientation and corner positioning
- Phase 2: Final solving within restricted move set

### 🎮 **Interactive 3D Visualization**

- Three.js powered interactive cube rendering
- Real-time cube manipulation and rotation
- Educational step-by-step solution visualization
- Responsive design for desktop and mobile

### 🏗️ **Modular Architecture**

- TypeScript for type-safe development
- Component-based React architecture
- Optimized for educational demonstrations
- Easy integration into robotics projects

## 🛠️ Technology Stack

### **Computer Vision**

- **OpenCV.js** - Real-time image processing
- **Canvas API** - Image manipulation and analysis
- **MediaDevices API** - Webcam access and control

### **Algorithm Implementation**

- **Kociemba Algorithm** - Two-phase optimal solving
- **Custom cube state management** - Efficient state representation
- **Move sequence optimization** - Minimal solution paths

### **Frontend Framework**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics and visualization
- **Tailwind CSS** - Utility-first styling

### **UI Components**

- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Beautiful icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Modern web browser with webcam access
- Good lighting for optimal cube detection

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/garg-tejas/rubiks-solver.git
cd rubiks-solver
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start development server**

```bash
pnpm dev
```

4. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### **Fully Interactive 3D Rubik's Cube**

1. Navigate to the "3D Interactive Cube" section (http://localhost:3000/cube)
2. **See All 6 Faces** - Drag to rotate and view the complete cube
3. **Click Faces** to rotate layers (R, L, U, D, F, B moves)
4. **Manual Move Buttons** - Use R, R', L, L', U, U', D, D', F, F', B, B' buttons
5. **Scramble Function** - Built-in scrambler with variable random moves
6. **Reset to Solved** - Instant reset to solved state
7. **Get Solution** to generate Kociemba algorithm steps
8. **Animated Solution** - Watch the cube solve itself step by step
9. **Speed Controls** - Adjust animation speed from 0.5x to 4x
10. **Step Navigation** - Jump to any step in the solution
11. **Real Cube Physics** - Every move follows actual Rubik's cube rules

### **Live Camera Solver**

1. Navigate to "Live Camera Solver"
2. Allow camera permissions when prompted
3. Position your cube within the guide frame
4. Click "Capture & Solve Cube" for instant analysis
5. View real-time solution with move count and timing

## 🎓 Educational Applications

### **Algorithm Demonstration**

- Visual representation of Kociemba's two-phase method
- Step-by-step solution breakdown
- Performance metrics and timing analysis
- Interactive learning for students

### **Computer Vision Education**

- Real-time color detection demonstration
- HSV color space analysis
- Edge detection and contour analysis
- Confidence scoring and quality metrics

## 🔬 Technical Implementation

### **Computer Vision Pipeline**

```typescript
// Real-time cube analysis with OpenCV.js
const analyzeImageWithCV = async (imageData: string): Promise<CubeState> => {
  const cv = await loadOpenCV();

  // Convert to HSV for better color detection
  cv.cvtColor(src, hsv, cv.COLOR_BGR2HSV);

  // Edge detection using Canny
  cv.Canny(blurred, edges, 50, 150);

  // Find contours for cube squares
  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  // Extract and classify colors
  const cubeState = extractColorsFromSquares(cv, hsv, squares);

  return cubeState;
};
```

### **Kociemba Algorithm Implementation**

```typescript
// Two-phase algorithm for optimal solving
const kociembaAlgorithm = (state: CubeState): SolutionResult => {
  // Phase 1: Reach <U,D,L2,R2,F2,B2> subgroup (max 12 moves)
  const phase1Solution = kociembaPhase1(state);

  // Phase 2: Solve within subgroup (max 18 moves)
  const phase2Solution = kociembaPhase2(intermediateState);

  return {
    steps: [...phase1Solution, ...phase2Solution],
    totalMoves: allSteps.length,
    phase1Moves: phase1Solution.length,
    phase2Moves: phase2Solution.length,
    algorithm: "Kociemba",
  };
};
```

## 📁 Project Structure

```
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Homepage with feature overview
│   ├── cube/page.tsx       # Interactive 3D cube interface
│   └── upload/page.tsx     # Live camera solver
├── components/              # React components
│   ├── camera-capture.tsx  # Webcam and computer vision
│   ├── rubiks-cube.tsx     # 3D cube rendering
│   └── ui/                 # UI component library
├── lib/                    # Core logic and utilities
│   ├── computer-vision.ts  # OpenCV.js implementation
│   ├── cube-solver.ts      # Kociemba algorithm
│   ├── cube-state-manager.ts # State management
│   └── utils.ts           # Utility functions
└── public/                 # Static assets
```
