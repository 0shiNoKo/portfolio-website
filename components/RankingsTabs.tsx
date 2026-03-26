'use client'

import { useState } from 'react'
import Image from 'next/image'
import MinecraftSkin from './MinecraftSkin'

type RankTab = 'subtiers' | 'mctiers'

const TABS: { id: RankTab; label: string }[] = [
  { id: 'subtiers', label: 'Subtiers' },
  { id: 'mctiers', label: 'MCTiers' },
]

interface KitEntry {
  key: string
  label: string
  svg: string
  tier: number
  pos: number
}

interface ProfileData {
  name: string
  region: string
  points: number
  overall: number
  kits: KitEntry[]
}

function tierLabel(tier: number, pos: number) {
  return `${pos === 0 ? 'HT' : 'LT'}${tier}`
}

// Icon + tier pill, joined together
function KitPill({ svg, label, tier, pos }: { svg: string; label: string; tier: number; pos: number }) {
  return (
    <div className="flex rounded-xl overflow-hidden" title={label}>
      {/* Icon half */}
      <div
        className="flex items-center justify-center p-2 flex-shrink-0"
        style={{ background: 'rgba(255,185,207,0.25)', minWidth: 40 }}
      >
        <Image src={svg} alt={label} width={22} height={22} />
      </div>
      {/* Tier half */}
      <div
        className="flex items-center justify-center font-inter font-bold text-xs flex-1 px-2"
        style={{
          background: 'linear-gradient(135deg, #9c1e4a, #bd3c6d)',
          color: '#fff9eb',
          minWidth: 36,
        }}
      >
        {tierLabel(tier, pos)}
      </div>
    </div>
  )
}

export default function RankingsTabs({
  subtiers,
  mctiers,
}: {
  subtiers: ProfileData | null
  mctiers: ProfileData | null
}) {
  const [active, setActive] = useState<RankTab>('subtiers')

  const profile = active === 'subtiers' ? subtiers : mctiers
  const source = active === 'subtiers' ? 'subtiers.net' : 'mctiers.com'

  if (!subtiers && !mctiers) return null

  const availableTabs = TABS.filter(t => (t.id === 'subtiers' ? subtiers : mctiers) !== null)

  return (
    <div>
      <p className="font-inter text-xs font-bold tracking-widest uppercase text-berry-crush mb-3">Rankings</p>
      <h2 className="font-great-vibes text-dark-amaranth leading-none mb-5" style={{ fontSize: '3rem' }}>
        Competitive
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {availableTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="font-inter font-semibold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full transition-all duration-200"
            style={
              active === tab.id
                ? { background: 'linear-gradient(90deg, #9c1e4a, #bd3c6d)', color: '#fff9eb', boxShadow: '0 4px 12px rgba(189,60,109,0.3)' }
                : { background: '#fff9eb', color: '#bd3c6d', border: '1.5px solid rgba(255,185,207,0.6)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {profile && (
        // Extra top margin so the overflowing skin circle has space above the card
        <div className="tab-content-enter" style={{ marginTop: 68 }}>
          <div
            className="rounded-2xl"
            style={{
              background: '#fff9eb',
              border: '1.5px solid rgba(255,185,207,0.5)',
              boxShadow: '0 8px 40px rgba(189,60,109,0.12)',
              position: 'relative',
            }}
          >
            {/* Skin circle — overflows above the card */}
            <div
              style={{
                position: 'absolute',
                top: -68,
                left: 20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid rgba(255,185,207,0.7)',
                background: 'rgba(255,230,240,0.4)',
                boxShadow: '0 4px 20px rgba(189,60,109,0.18)',
                cursor: 'grab',
              }}
            >
              {/* Canvas is taller than circle so body gets cut off at the bottom */}
              <MinecraftSkin width={100} height={170} zoom={1.45} targetY={0.7} />
            </div>

            {/* Card body */}
            <div className="p-5" style={{ paddingTop: 44 }}>
              {/* Header */}
              <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,185,207,0.4)' }}>
                <h3 className="font-inter font-bold text-xl text-dark-amaranth">{profile.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span
                    className="font-inter font-bold text-sm"
                    style={{
                      background: 'linear-gradient(90deg, #9c1e4a, #bd3c6d)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    #{profile.overall} Overall
                  </span>
                  <span className="font-inter text-xs text-berry-crush">({profile.points} Points)</span>
                  <span className="font-inter text-xs opacity-50 text-berry-crush">
                    Region: {profile.region === 'NA' ? 'North America' : profile.region}
                  </span>
                </div>
              </div>

              {/* Kit grid — 3 columns of connected pills */}
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {profile.kits.map(kit => (
                  <KitPill key={kit.key} svg={kit.svg} label={kit.label} tier={kit.tier} pos={kit.pos} />
                ))}
              </div>

              <p className="font-inter text-xs text-center mt-4 opacity-40 text-berry-crush tracking-wide">
                via {source}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
