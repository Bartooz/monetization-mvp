// components/Navbar.js
import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, children }) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-md text-sm font-medium transition",
        isActive
          ? "text-white bg-blue-600/80 hover:bg-blue-600"
          : "text-gray-300 hover:text-white hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 dark:bg-[#0b1220]/70 border-b border-black/5 dark:border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Monetize
          </span>
        </Link>

        {/* Right side links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/calendar">Calendar</NavLink>
          <NavLink href="/segmentation">Segmentation</NavLink>
          <NavLink href="/configurations">Configuration</NavLink>
          <NavLink href="/templates">Templates</NavLink>
          <Link
            href="/demo"
            className="ml-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
          >
            Book a Demo
          </Link>
        </div>

        {/* Mobile menu (simple) */}
        <details className="md:hidden">
          <summary className="cursor-pointer text-gray-700 dark:text-gray-200 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
            Menu
          </summary>
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#0b1220] border-t border-black/5 dark:border-white/10 p-2 space-y-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/calendar">Calendar</NavLink>
            <NavLink href="/segmentation">Segmentation</NavLink>
            <NavLink href="/configurations">Configuration</NavLink>
            <NavLink href="/templates">Templates</NavLink>
            <Link
              href="/demo"
              className="block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              Book a Demo
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
