'use client'

import { useEffect, useRef } from 'react'

export function GradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      time += 0.002

      const width = canvas.width
      const height = canvas.height

      // Create gradient
      const gradient = ctx.createRadialGradient(
        width * (0.5 + Math.sin(time) * 0.2),
        height * (0.5 + Math.cos(time * 0.7) * 0.2),
        0,
        width * 0.5,
        height * 0.5,
        width * 0.8
      )

      // Suno-like colors: orange -> pink -> purple
      gradient.addColorStop(0, `hsla(${30 + Math.sin(time) * 10}, 80%, 50%, 0.8)`)
      gradient.addColorStop(0.3, `hsla(${350 + Math.cos(time * 0.5) * 20}, 70%, 45%, 0.7)`)
      gradient.addColorStop(0.6, `hsla(${320 + Math.sin(time * 0.3) * 15}, 60%, 35%, 0.6)`)
      gradient.addColorStop(1, 'hsla(280, 50%, 15%, 0.4)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add noise texture
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
      }
      ctx.putImageData(imageData, 0, 0)

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#0a0a0a' }}
    />
  )
}
