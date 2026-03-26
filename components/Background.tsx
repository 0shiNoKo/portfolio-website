'use client'

import { useEffect, useRef } from 'react'

const PETAL_COUNT = 75
const COLORS = ['#ffb9cf', '#ff99c1', '#ff89ba', '#ff78b3', '#fde8f0', '#ffd0e0']
const SHAPES = [
  (c: string) => `<svg width="18" height="22" viewBox="0 0 18 22"><ellipse cx="9" cy="11" rx="7" ry="10" fill="${c}"/></svg>`,
  (c: string) => `<svg width="14" height="20" viewBox="0 0 14 20"><path d="M7 0 C12 6 12 14 7 20 C2 14 2 6 7 0Z" fill="${c}"/></svg>`,
  (c: string) => `<svg width="22" height="14" viewBox="0 0 22 14"><ellipse cx="11" cy="7" rx="10" ry="6" fill="${c}"/></svg>`,
]

const BLOB_CONFIGS = [
  { width: 520, height: 420, color: '#ff89ba', opacity: 0.18 },
  { width: 380, height: 380, color: '#ffb9cf', opacity: 0.22 },
  { width: 300, height: 260, color: '#bd3c6d', opacity: 0.12 },
  { width: 240, height: 200, color: '#ff78b3', opacity: 0.14 },
  { width: 200, height: 180, color: '#ffb9cf', opacity: 0.20 },
]

const BLOB_INFLUENCE = 300
const BLOB_REPULSION = 4
const BLOB_RETURN = 0.004
const BLOB_DAMPING = 0.90
const BLOB_AMP = 28
const BLOB_SPEED = 0.00025

export default function Background() {
  const petalRef = useRef<HTMLDivElement>(null)
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight

    // ── Blob setup ──
    const basePos = [
      { x: -80,      y: -100     },
      { x: W - 320,  y: H * 0.3  },
      { x: W * 0.2,  y: H * 0.7  },
      { x: W * 0.1,  y: H * 0.55 },
      { x: W * 0.75, y: H * 0.8  },
    ]
    const blobPos = basePos.map(p => ({ ...p }))
    const blobVel = basePos.map(() => ({ vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 }))
    const blobPhase = basePos.map((_, i) => i * 1.3)

    blobRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.left = `${blobPos[i].x}px`
      el.style.top = `${blobPos[i].y}px`
    })

    // ── Petal setup ──
    const container = petalRef.current
    interface Petal {
      el: HTMLDivElement
      x: number; y: number
      vx: number; vy: number
      rot: number; rotSpeed: number
      scale: number; opacity: number
    }
    const petals: Petal[] = []

    if (container) {
      for (let i = 0; i < PETAL_COUNT; i++) {
        const el = document.createElement('div')
        el.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;'
        const color = COLORS[Math.floor(Math.random() * COLORS.length)]
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
        el.innerHTML = shape(color)
        container.appendChild(el)

        petals.push({
          el,
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.4 + Math.random() * 1.2,
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 2.5,
          scale: 0.6 + Math.random() * 1.2,
          opacity: 0.65 + Math.random() * 0.35,
        })
      }
    }

    // ── Mouse ──
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)

    // ── Animation loop ──
    let frame = 0
    const animate = () => {
      frame++
      const t = frame * BLOB_SPEED
      const mouse = mouseRef.current

      // Blobs
      blobRefs.current.forEach((el, i) => {
        if (!el) return
        const cfg = BLOB_CONFIGS[i]
        const p = blobPos[i]
        const v = blobVel[i]
        const base = basePos[i]
        const ph = blobPhase[i]

        const cx = p.x + cfg.width / 2
        const cy = p.y + cfg.height / 2
        const dx = mouse.x - cx
        const dy = mouse.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < BLOB_INFLUENCE && dist > 1) {
          const force = (1 - dist / BLOB_INFLUENCE) * BLOB_REPULSION
          v.vx -= (dx / dist) * force
          v.vy -= (dy / dist) * force
        } else {
          const targetX = base.x + Math.sin(t + ph) * BLOB_AMP
          const targetY = base.y + Math.cos(t * 0.7 + ph) * BLOB_AMP * 0.6
          v.vx += (targetX - p.x) * BLOB_RETURN
          v.vy += (targetY - p.y) * BLOB_RETURN
        }

        v.vx *= BLOB_DAMPING
        v.vy *= BLOB_DAMPING
        p.x += v.vx
        p.y += v.vy
        el.style.left = `${p.x}px`
        el.style.top = `${p.y}px`
      })

      // Petals
      petals.forEach(p => {
        p.vy += 0.018  // gravity
        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotSpeed

        // Wrap
        if (p.y > H + 60) {
          p.y = -30
          p.x = Math.random() * W
          p.vy = 0.4 + Math.random() * 1.2
          p.vx = (Math.random() - 0.5) * 0.6
        }
        if (p.x < -40) p.x = W + 40
        if (p.x > W + 40) p.x = -40

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`
        p.el.style.opacity = String(p.opacity)
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      if (container) container.innerHTML = ''
    }
  }, [])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {BLOB_CONFIGS.map((b, i) => (
          <div
            key={i}
            ref={(el) => { blobRefs.current[i] = el }}
            className="absolute rounded-full"
            style={{
              width: b.width,
              height: b.height,
              background: b.color,
              filter: 'blur(80px)',
              opacity: b.opacity,
              left: 0,
              top: 0,
            }}
          />
        ))}
      </div>
      {/* z-index 5: over hero (z-index 1), below gallery+ (z-index 10) */}
      <div ref={petalRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }} />
    </>
  )
}
