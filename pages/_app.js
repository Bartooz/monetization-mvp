// pages/_app.js
import '../styles/globals.css'
import Link from 'next/link'

export default function App({ Component, pageProps }) {
  return (
    <>
      <nav style={{ backgroundColor: '#333', padding: '10px' }}>
        <Link href="/" style={{ color: 'white', marginRight: '15px' }}>🏠 Home</Link>
        <Link href="/calendar" style={{ color: 'white', marginRight: '15px' }}>📅 Calendar</Link>
        <Link href="/segmentation" style={{ color: 'white', marginRight: '15px' }}>🧠 Segmentation</Link>
        <Link href="/configurations" style={{ color: 'white', marginRight: '15px' }}>⚙️ Configuration</Link>
        <Link href="/templates" style={{ color: 'white', marginRight: '15px' }}>📄 Templates</Link>
      </nav>
      <Component {...pageProps} />
    </>
  )
}
