// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div>
      <nav
        style={{
          background: "#111",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>🏠 Home</Link>
        <Link href="/calendar" style={{ color: "white", textDecoration: "none" }}>📅 Calendar</Link>
        <Link href="/segmentation" style={{ color: "white", textDecoration: "none" }}>🧩 Segmentation</Link>
        <Link href="/configurations" style={{ color: "white", textDecoration: "none" }}>⚙️ Configuration</Link>
        <Link href="/templates" style={{ color: "white", textDecoration: "none" }}>🗂️ Templates</Link>
      </nav>

      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
