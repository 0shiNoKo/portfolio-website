import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const greatVibes = localFont({
  src: './fonts/GreatVibes-Regular.ttf',
  variable: '--font-great-vibes',
})

const inter = localFont({
  src: './fonts/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Oshinoko',
  description: 'Minecraft editor, thumbnail maker, and banner maker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${inter.variable}`}>
      <body className="font-inter">{children}</body>
    </html>
  )
}
