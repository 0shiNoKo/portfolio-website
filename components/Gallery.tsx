'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Tab = 'thumbnails' | 'videos' | 'banners'

const TABS: { id: Tab; label: string }[] = [
  { id: 'thumbnails', label: 'Thumbnails' },
  { id: 'videos', label: 'Videos' },
  { id: 'banners', label: 'Banners' },
]

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

// "LunamcCartHT3.png" → "Lunamc Cart HT3"
function fileToName(file: string): string {
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cardBaseStyle(isLeft: boolean): React.CSSProperties {
  return {
    width: '60%',
    transformOrigin: isLeft ? 'left bottom' : 'right bottom',
    boxShadow: '0 6px 24px rgba(189,60,109,0.1)',
    transition: 'transform 0.75s cubic-bezier(0.22,1,0.36,1), opacity 0.75s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
    borderRadius: '0.75rem',
    overflow: 'hidden',
  }
}

function ImageCard({
  src, name, label, isLeft, refFn,
}: {
  src: string; name: string; label: string; isLeft: boolean
  refFn: (el: HTMLDivElement | null) => void
}) {
  return (
    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div
        ref={refFn}
        className="relative cursor-pointer group"
        style={cardBaseStyle(isLeft)}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.transform = isLeft ? 'rotateX(-2deg) rotateY(-4deg) scale(1.02)' : 'rotateX(-2deg) rotateY(4deg) scale(1.02)'
          el.style.boxShadow = '0 20px 48px rgba(189,60,109,0.28)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.transform = 'rotateX(0) rotateY(0) scale(1)'
          el.style.boxShadow = '0 6px 24px rgba(189,60,109,0.1)'
        }}
      >
        <Image
          src={src}
          alt={name}
          width={1280}
          height={720}
          className="w-full block"
          style={{ aspectRatio: '16/9', objectFit: 'cover' }}
        />
        <div
          className="absolute inset-0 flex items-end justify-between px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'linear-gradient(transparent, rgba(10,0,5,0.72))' }}
        >
          <span className="font-inter text-xs font-bold" style={{ color: '#fff9eb' }}>{name}</span>
          <span className="font-inter text-xs px-2 py-0.5 rounded-full" style={{ color: '#ff78b3', background: 'rgba(123,0,39,0.4)' }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

export default function Gallery({ thumbnailFiles, bannerFiles }: { thumbnailFiles: string[]; bannerFiles: string[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('thumbnails')
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const itemCount =
    activeTab === 'videos' ? VIDEOS.length :
    activeTab === 'thumbnails' ? thumbnailFiles.length :
    bannerFiles.length

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    cardRefs.current = cardRefs.current.slice(0, itemCount)

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const isLeft = i % 2 === 0
      const hidden = isLeft
        ? `rotateX(${CARD_TILT_X}deg) rotateY(${CARD_TILT_Y}deg) translateX(-${CARD_TRANSLATE}px) scale(${CARD_SCALE_HIDDEN})`
        : `rotateX(${CARD_TILT_X}deg) rotateY(-${CARD_TILT_Y}deg) translateX(${CARD_TRANSLATE}px) scale(${CARD_SCALE_HIDDEN})`

      card.style.opacity = '0'
      card.style.transform = hidden

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.style.opacity = '1'
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateX(0) scale(1)'
          } else {
            card.style.opacity = '0'
            card.style.transform = hidden
          }
        },
        { threshold: [0, CARD_INTERSECT_THRESHOLD] }
      )
      observer.observe(card)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [activeTab, itemCount])

  return (
    <section id="work" className="py-24 px-8" style={{ position: 'relative', zIndex: 10 }}>
      <h2 className="font-inter font-bold text-center text-3xl text-dark-amaranth mb-8 tracking-wide">
        My Work
      </h2>

      <div className="flex justify-center gap-2 mb-14">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="font-inter font-semibold text-sm tracking-widest uppercase px-6 py-2 rounded-full transition-all duration-200"
            style={
              activeTab === tab.id
                ? { background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))', color: 'var(--bg)', boxShadow: '0 4px 16px var(--shadow)' }
                : { background: 'var(--bg-card)', color: 'var(--accent-primary)', border: '1.5px solid var(--border)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div key={activeTab} className="gallery-perspective flex flex-col gap-2 max-w-5xl mx-auto">

        {/* Videos */}
        {activeTab === 'videos' && VIDEOS.map((v, i) => {
          const isLeft = i % 2 === 0
          return (
            <div key={v.id} className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
              <div ref={el => { cardRefs.current[i] = el }} style={cardBaseStyle(isLeft)}>
                <div style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
            </div>
          )
        })}

        {/* Thumbnails */}
        {activeTab === 'thumbnails' && thumbnailFiles.length === 0 && (
          <p className="text-center font-inter text-sm text-berry-crush opacity-50 py-12">Coming soon</p>
        )}
        {activeTab === 'thumbnails' && thumbnailFiles.map((file, i) => (
          <ImageCard
            key={file}
            src={`/thumbnails/${file}`}
            name={fileToName(file)}
            label="Thumbnail"
            isLeft={i % 2 === 0}
            refFn={el => { cardRefs.current[i] = el }}
          />
        ))}

        {/* Banners */}
        {activeTab === 'banners' && bannerFiles.length === 0 && (
          <p className="text-center font-inter text-sm text-berry-crush opacity-50 py-12">Coming soon</p>
        )}
        {activeTab === 'banners' && bannerFiles.map((file, i) => (
          <ImageCard
            key={file}
            src={`/banners/${file}`}
            name={fileToName(file)}
            label="Banner"
            isLeft={i % 2 === 0}
            refFn={el => { cardRefs.current[i] = el }}
          />
        ))}

      </div>
    </section>
  )
}
