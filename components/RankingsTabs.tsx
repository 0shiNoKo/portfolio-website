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
        style={{ background: 'var(--kit-bg)', minWidth: 40 }}
      >
        <Image src={svg} alt={label} width={22} height={22} />
      </div>
      {/* Tier half */}
      <div
        className="flex items-center justify-center font-inter font-bold text-xs flex-1 px-2"
        style={{
          background: 'linear-gradient(135deg, var(--grad-start), var(--grad-end))',
          color: 'var(--bg)',
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
                ? { background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))', color: 'var(--bg)', boxShadow: '0 4px 12px var(--shadow)' }
                : { background: 'var(--bg-card)', color: 'var(--accent-primary)', border: '1.5px solid var(--border)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {profile && (
        // Extra top margin so the overflowing skin circle has space above the card
        <div className="tab-content-enter" style={{ marginTop: 86 }}>
          <div
            className="rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              boxShadow: '0 8px 40px var(--shadow)',
              position: 'relative',
            }}
          >
            {/* Skin circle — overflows above the card */}
            <div
              style={{
                position: 'absolute',
                top: -80,
                left: 20,
                width: 130,
                height: 130,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid var(--border)',
                background: 'var(--kit-bg)',
                boxShadow: '0 4px 20px var(--shadow)',
                cursor: 'grab',
              }}
            >
              {/* Canvas is taller than circle so body gets cut off at the bottom */}
              <MinecraftSkin width={130} height={220} zoom={0.85} targetY={0.2} />
            </div>

            {/* Card body */}
            <div className="p-5" style={{ paddingTop: 58 }}>
              {/* Header */}
              <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="font-inter font-bold text-xl text-dark-amaranth">{profile.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span
                    className="font-inter font-bold text-sm"
                    style={{
                      background: 'linear-gradient(90deg, var(--grad-start), var(--grad-end))',
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
