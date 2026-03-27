'use client'

import { useState } from 'react'

const LINKS = [
  { href: '#work',     label: 'Work'     },
  { href: '#about',    label: 'About'    },
  { href: '#services', label: 'Services' },
  { href: '#mods',     label: 'Mods'     },
  { href: '#contact',  label: 'Contact'  },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(8px)', transition: 'background 0.4s ease' }}
      >
        <a href="#" className="font-great-vibes text-3xl text-dark-amaranth leading-none">
          Oshinoko
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium tracking-widest uppercase text-berry-crush">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className="hover:text-dark-amaranth transition-colors">{l.label}</a>
          ))}
        </div>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-0.5 rounded-full transition-all duration-300 origin-center"
            style={{
              background: 'var(--accent-primary)',
              transform: open ? 'translateY(8px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-0.5 rounded-full transition-all duration-300"
            style={{
              background: 'var(--accent-primary)',
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-0.5 rounded-full transition-all duration-300 origin-center"
            style={{
              background: 'var(--accent-primary)',
              transform: open ? 'translateY(-8px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8 transition-all duration-300"
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(16px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-inter font-semibold text-2xl tracking-widest uppercase text-berry-crush hover:text-dark-amaranth transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  )
}
