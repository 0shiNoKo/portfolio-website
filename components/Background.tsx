'use client'

import { useEffect } from 'react'

const PETAL_COUNT_DESKTOP = 35
const PETAL_COUNT_MOBILE  = 10
const COLORS = ['#ffb9cf', '#ff99c1', '#ff89ba', '#ff78b3', '#fde8f0', '#ffd0e0']
const COLORS_DARK = ['#3d0060', '#6600aa', '#4d0080', '#220044', '#1a003a', '#550090']
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

const BLOB_CONFIGS_DARK = [
  { width: 520, height: 420, color: '#4d0080', opacity: 0.22 },
  { width: 380, height: 380, color: '#2d0060', opacity: 0.28 },
  { width: 300, height: 260, color: '#800040', opacity: 0.18 },
  { width: 240, height: 200, color: '#cc00ff', opacity: 0.12 },
  { width: 200, height: 180, color: '#ff0066', opacity: 0.15 },
]

const BLOB_INFLUENCE = 300
const BLOB_REPULSION = 4
const BLOB_RETURN = 0.004
const BLOB_DAMPING = 0.90
const BLOB_AMP = 28
const BLOB_SPEED = 0.00025

// Fixed-position style string — inline to bypass any CSS cascade
const FIXED_LAYER = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;overflow:hidden;'

export default function Background() {
  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight
    const isMobile = W < 768
    const PETAL_COUNT = isMobile ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP

    const isDark = document.documentElement.classList.contains('dark')
    const activeBlobs = isDark ? BLOB_CONFIGS_DARK : BLOB_CONFIGS
    const activeColors = isDark ? COLORS_DARK : COLORS

    // ── Create blob layer ──
    const blobLayer = document.createElement('div')
    blobLayer.style.cssText = FIXED_LAYER + 'z-index:0;'
    document.body.appendChild(blobLayer)

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

    const blobEls = activeBlobs.map((b, i) => {
      const el = document.createElement('div')
      el.style.cssText = `position:absolute;border-radius:50%;width:${b.width}px;height:${b.height}px;background:${b.color};filter:blur(80px);opacity:${b.opacity};left:${blobPos[i].x}px;top:${blobPos[i].y}px;`
      blobLayer.appendChild(el)
      return el
    })

    // ── Create petal layer (z-index 5: over hero z=1, under sections z=10) ──
    const petalLayer = document.createElement('div')
    petalLayer.style.cssText = FIXED_LAYER + 'z-index:5;'
    document.body.appendChild(petalLayer)

    interface Petal {
      el: HTMLDivElement
      x: number; y: number
      vx: number; vy: number
      rot: number; rotSpeed: number
      scale: number; opacity: number
    }
    const petals: Petal[] = []

    for (let i = 0; i < PETAL_COUNT; i++) {
      const el = document.createElement('div')
      el.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;'
      const color = activeColors[Math.floor(Math.random() * activeColors.length)]
      el.innerHTML = SHAPES[Math.floor(Math.random() * SHAPES.length)](color)
      petalLayer.appendChild(el)
      petals.push({
        el,
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.4 + Math.random() * 1.2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2.5,
        scale: 0.6 + Math.random() * 1.2,
        opacity: 0.65 + Math.random() * 0.35,
      })
    }

    // ── Mouse ──
    const mouse = { x: -9999, y: -9999 }
    const handleMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', handleMouse)

    // ── Scroll influence ──
    // Positive = scroll down (fall faster), negative = scroll up (fall slower)
    let scrollBoost = 0
    const handleWheel = (e: WheelEvent) => {
      scrollBoost = Math.max(-1.2, Math.min(2.5, e.deltaY * 0.04))
    }
    window.addEventListener('wheel', handleWheel, { passive: true })

    // ── Animation loop ──
    let frame = 0
    let rafId: number

    const animate = () => {
      frame++
      const t = frame * BLOB_SPEED

      blobEls.forEach((el, i) => {
        const cfg = activeBlobs[i]
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
          v.vx += (base.x + Math.sin(t + ph) * BLOB_AMP - p.x) * BLOB_RETURN
          v.vy += (base.y + Math.cos(t * 0.7 + ph) * BLOB_AMP * 0.6 - p.y) * BLOB_RETURN
        }

        v.vx *= BLOB_DAMPING
        v.vy *= BLOB_DAMPING
        p.x += v.vx
        p.y += v.vy
        el.style.left = `${p.x}px`
        el.style.top = `${p.y}px`
      })

      scrollBoost *= scrollBoost < 0 ? 0.72 : 0.88  // recover faster when slowed

      petals.forEach(p => {
        p.vy += 0.018
        p.vy += scrollBoost * 0.12  // scroll influence
        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotSpeed

        if (p.y > H + 60) { p.y = -30; p.x = Math.random() * W; p.vy = 0.4 + Math.random() * 1.2; p.vx = (Math.random() - 0.5) * 0.6 }
        if (p.x < -40) p.x = W + 40
        if (p.x > W + 40) p.x = -40

        const speed  = Math.abs(p.vy) + Math.abs(p.vx) * 0.5
        const blur   = Math.max(0, speed * 0.55 - 0.4)
        const stretch = 1 + Math.max(0, p.vy * 0.06)
        p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.rot}deg) scaleX(${p.scale}) scaleY(${p.scale * stretch})`
        p.el.style.filter  = blur > 0 ? `blur(${blur.toFixed(2)}px)` : ''
        p.el.style.opacity = String(p.opacity)
      })

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('wheel', handleWheel)
      cancelAnimationFrame(rafId)
      document.body.removeChild(blobLayer)
      document.body.removeChild(petalLayer)
    }
  }, [])

  // Renders nothing into the React tree — all DOM is imperative
  return null
}
