'use client'

import { useEffect, useRef } from 'react'

const SKIN_URL = 'https://mc-heads.net/skin/8f89fe006abb4b4d8ccfd511f8e2df61'
const INITIAL_ANGLE = -0.55 // ~31° left-facing (opposite direction, more angled)

export default function MinecraftSkin({
  width = 130,
  height = 240,
  zoom = 0.9,
  targetY = 0,
}: {
  width?: number
  height?: number
  zoom?: number
  targetY?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let viewer: any
    let revertTimer: ReturnType<typeof setTimeout>
    let revertRaf: number

    import('skinview3d').then((mod) => {
      if (!canvasRef.current) return
      const { SkinViewer } = mod

      viewer = new SkinViewer({ canvas: canvasRef.current, width, height, skin: SKIN_URL })
      viewer.autoRotate = false
      viewer.animation = null
      viewer.zoom = zoom
      viewer.controls.enableZoom = false
      viewer.controls.enablePan = false

      // Shift camera target up to focus on head/upper body
      viewer.controls.target.set(0, targetY, 0)

      // Set initial slight angle
      const dist = viewer.camera.position.length()
      viewer.camera.position.set(
        Math.sin(INITIAL_ANGLE) * dist,
        viewer.camera.position.y,
        Math.cos(INITIAL_ANGLE) * dist
      )
      viewer.camera.lookAt(0, targetY, 0)
      viewer.controls.update()

      const initialPos = viewer.camera.position.clone()
      const initialTarget = viewer.controls.target.clone()

      viewer.controls.addEventListener('end', () => {
        clearTimeout(revertTimer)
        cancelAnimationFrame(revertRaf)
        revertTimer = setTimeout(() => {
          const startPos = viewer.camera.position.clone()
          const startTarget = viewer.controls.target.clone()
          const startTime = performance.now()
          const tick = () => {
            if (!viewer) return
            const t = Math.min((performance.now() - startTime) / 650, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            viewer.camera.position.lerpVectors(startPos, initialPos, ease)
            viewer.controls.target.lerpVectors(startTarget, initialTarget, ease)
            viewer.controls.update()
            if (t < 1) revertRaf = requestAnimationFrame(tick)
          }
          revertRaf = requestAnimationFrame(tick)
        }, 1500)
      })
    })

    return () => {
      clearTimeout(revertTimer)
      cancelAnimationFrame(revertRaf)
      viewer?.dispose()
    }
  }, [width, height, zoom, targetY])

  return <canvas ref={canvasRef} style={{ background: 'transparent', display: 'block', cursor: 'grab' }} />
}
