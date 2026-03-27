'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { thumbnails } from '@/lib/thumbnails'

type Tab = 'thumbnails' | 'videos' | 'banners'

const TABS: { id: Tab; label: string }[] = [
  { id: 'thumbnails', label: 'Thumbnails' },
  { id: 'videos', label: 'Videos' },
  { id: 'banners', label: 'Banners' },
]

const CATEGORY_MAP: Record<Tab, string> = {
  thumbnails: 'Thumbnail',
  videos: 'Video',
  banners: 'Banner',
}

const VIDEOS = [
  { id: 'Cmk_TiH8cao', title: 'Video 1' },
  { id: 'Lwq00Ac38NI', title: 'Video 2' },
  { id: 'RdnKSRVD6L8', title: 'Video 3' },
]

const CARD_TILT_X = 28
const CARD_TILT_Y = 16
const CARD_TRANSLATE = 30
const CARD_SCALE_HIDDEN = 0.94
const CARD_INTERSECT_THRESHOLD = 0.1

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<Tab>('thumbnails')
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const filtered = thumbnails.filter(
    (t) => t.category === CATEGORY_MAP[activeTab]
  )

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    // Trim stale refs from previous tab
    cardRefs.current = cardRefs.current.slice(0, filtered.length)

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const isLeft = i % 2 === 0
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.style.opacity = '1'
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateX(0) scale(1)'
          } else {
            card.style.opacity = '0'
            card.style.transform = isLeft
              ? `rotateX(${CARD_TILT_X}deg) rotateY(${CARD_TILT_Y}deg) translateX(-${CARD_TRANSLATE}px) scale(${CARD_SCALE_HIDDEN})`
              : `rotateX(${CARD_TILT_X}deg) rotateY(-${CARD_TILT_Y}deg) translateX(${CARD_TRANSLATE}px) scale(${CARD_SCALE_HIDDEN})`
          }
        },
        { threshold: [0, CARD_INTERSECT_THRESHOLD] }
      )
      card.style.opacity = '0'
      card.style.transform = isLeft
        ? `rotateX(${CARD_TILT_X}deg) rotateY(${CARD_TILT_Y}deg) translateX(-${CARD_TRANSLATE}px) scale(${CARD_SCALE_HIDDEN})`
        : `rotateX(${CARD_TILT_X}deg) rotateY(-${CARD_TILT_Y}deg) translateX(${CARD_TRANSLATE}px) scale(${CARD_SCALE_HIDDEN})`
      observer.observe(card)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [activeTab])

  return (
    <section id="work" className="py-24 px-8" style={{ position: 'relative', zIndex: 10 }}>
      <h2 className="font-inter font-bold text-center text-3xl text-dark-amaranth mb-8 tracking-wide">
        My Work
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-14">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="font-inter font-semibold text-sm tracking-widest uppercase px-6 py-2 rounded-full transition-all duration-200"
            style={
              activeTab === tab.id
                ? {
                    background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))',
                    color: 'var(--bg)',
                    boxShadow: '0 4px 16px var(--shadow)',
                  }
                : {
                    background: 'var(--bg-card)',
                    color: 'var(--accent-primary)',
                    border: '1.5px solid var(--border)',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'videos' ? (
        <div key="videos" className="tab-content-enter max-w-4xl mx-auto flex flex-col gap-6">
          {VIDEOS.map((v, i) => (
            <div
              key={i}
              className="w-full rounded-xl overflow-hidden"
              style={{ boxShadow: '0 6px 24px rgba(189,60,109,0.15)', aspectRatio: '16/9' }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p key={activeTab} className="tab-content-enter text-center font-inter text-sm text-berry-crush opacity-50 py-12">
          Coming soon
        </p>
      ) : (
        <div key={activeTab} className="gallery-perspective flex flex-col gap-2 max-w-5xl mx-auto">
          {filtered.map((thumb, i) => {
            const isLeft = i % 2 === 0
            return (
              <div
                key={thumb.file}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  ref={(el) => { cardRefs.current[i] = el }}
                  className="relative overflow-hidden rounded-xl cursor-pointer group"
                  style={{
                    width: '60%',
                    transformOrigin: isLeft ? 'left bottom' : 'right bottom',
                    boxShadow: '0 6px 24px rgba(189,60,109,0.1)',
                    transition: `transform 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.75s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.transform = isLeft
                      ? `rotateX(-2deg) rotateY(-4deg) scale(1.02)`
                      : `rotateX(-2deg) rotateY(4deg) scale(1.02)`
                    el.style.boxShadow = '0 20px 48px rgba(189,60,109,0.28)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.transform = 'rotateX(0) rotateY(0) scale(1)'
                    el.style.boxShadow = '0 6px 24px rgba(189,60,109,0.1)'
                  }}
                >
                  <Image
                    src={`/thumbnails/${thumb.file}`}
                    alt={thumb.name}
                    width={1280}
                    height={720}
                    className="w-full block"
                    style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                  />
                  <div
                    className="absolute inset-0 flex items-end justify-between px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(transparent, rgba(10,0,5,0.72))' }}
                  >
                    <span className="font-inter text-xs font-bold" style={{ color: '#fff9eb' }}>{thumb.name}</span>
                    <span className="font-inter text-xs px-2 py-0.5 rounded-full" style={{ color: '#ff78b3', background: 'rgba(123,0,39,0.4)' }}>
                      {thumb.category}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
