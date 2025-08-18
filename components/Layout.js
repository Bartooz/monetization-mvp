// components/Layout.js
import Link from "next/link";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0b1120] dark:text-gray-100">
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
