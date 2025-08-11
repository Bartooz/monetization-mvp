// pages/_app.js
import '../styles/globals.css'
import Link from 'next/link'
import { useState } from 'react'

export default function App({ Component, pageProps }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo / Brand */}
            <Link href="/" className="font-semibold text-gray-900">
              🕹️ Monetize
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900">🏠 Home</Link>
              <Link href="/calendar" className="text-gray-700 hover:text-gray-900">📅 Calendar</Link>
              <Link href="/segmentation" className="text-gray-700 hover:text-gray-900">🧠 Segmentation</Link>
              <Link href="/configurations" className="text-gray-700 hover:text-gray-900">⚙️ Configuration</Link>
              <Link href="/templates" className="text-gray-700 hover:text-gray-900">📄 Templates</Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Toggle main menu</span>
              {/* Hamburger icon */}
              <svg className={`h-6 w-6 ${open ? 'hidden' : 'block'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg className={`h-6 w-6 ${open ? 'block' : 'hidden'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div id="mobile-menu" className="md:hidden pb-3">
              <div className="space-y-1 rounded-lg border bg-white p-3 shadow-sm">
                <Link href="/" onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-gray-800 hover:bg-gray-50">🏠 Home</Link>
                <Link href="/calendar" onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-gray-800 hover:bg-gray-50">📅 Calendar</Link>
                <Link href="/segmentation" onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-gray-800 hover:bg-gray-50">🧠 Segmentation</Link>
                <Link href="/configurations" onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-gray-800 hover:bg-gray-50">⚙️ Configuration</Link>
                <Link href="/templates" onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-gray-800 hover:bg-gray-50">📄 Templates</Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <Component {...pageProps} />
    </>
  )
}
