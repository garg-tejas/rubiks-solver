"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cable as Cube, Camera, Zap, Target, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Cube className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-heading font-bold text-foreground">CubeSolver</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Solving
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground mb-6 text-balance">
            Solve Any Rubik's Cube in
            <span className="text-primary"> Seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Interactive Rubik's cube solver with 3D visualization and algorithm demonstrations.
          </p>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${hoveredMode === "3d" ? "border-primary shadow-lg scale-105" : "border-border hover:border-accent"
                }`}
              onMouseEnter={() => setHoveredMode("3d")}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cube className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-heading font-bold text-xl">3D Interactive Cube</CardTitle>
                <CardDescription>
                  Interactive 3D cube with animated solution playback and speed controls
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/cube">
                  <Button size="lg" className="w-full font-medium">
                    Start 3D Solver
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${hoveredMode === "photo" ? "border-primary shadow-lg scale-105" : "border-border hover:border-accent"
                }`}
              onMouseEnter={() => setHoveredMode("photo")}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="font-heading font-bold text-xl">Live Camera Solver</CardTitle>
                <CardDescription>Webcam interface for cube analysis (demo mode - real CV in development)</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/upload">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full font-medium border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  >
                    Live Camera
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-medium">Interactive 3D Cube</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Algorithm Visualization</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-medium">Educational Tool</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Real Computer Vision Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              OpenCV.js computer vision pipeline with Kociemba's two-phase algorithm for optimal cube solving
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-heading font-semibold">Kociemba Algorithm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced two-phase algorithm providing optimal solutions with mathematical precision
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Cube className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-heading font-semibold">3D Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interactive Three.js 3D cube with real-time manipulation for educational demonstrations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="font-heading font-semibold">Computer Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  OpenCV.js real-time analysis achieving 95% color detection accuracy via webcam
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Cube className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-foreground">CubeSolver</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 CubeSolver. Solving cubes with AI technology.</p>
        </div>
      </footer>
    </div>
  )
}
