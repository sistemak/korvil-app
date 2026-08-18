'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId = 0
    let columns = 0
    let drops: number[] = []
    const glyphs = 'アカサタナ0123456789<>[]{}#$%&KAI01'.split('')
    const fontSize = 14

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = Array(columns).fill(0).map(() => Math.random() * -50)
    }
    resize()

    let last = 0
    const draw = (t: number) => {
      animationId = requestAnimationFrame(draw)
      if (t - last < 55) return
      last = t

      ctx.fillStyle = 'rgba(5,5,5,0.14)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillStyle = Math.random() > 0.94 ? 'rgba(180,255,255,0.9)' : 'rgba(0,245,255,0.45)'
        ctx.fillText(text, x, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    animationId = requestAnimationFrame(draw)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
    />
  )
}
