'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="font-inter font-semibold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full transition-all duration-300"
      style={{
        background: dark
          ? 'linear-gradient(90deg, #ff0066, #cc00ff)'
          : 'linear-gradient(90deg, #9c1e4a, #bd3c6d)',
        color: '#fff9eb',
        boxShadow: dark
          ? '0 0 12px rgba(204,0,255,0.5)'
          : '0 4px 12px rgba(189,60,109,0.25)',
        letterSpacing: '3px',
      }}
    >
      {dark ? '☀ light' : '◐ dark'}
    </button>
  )
}
