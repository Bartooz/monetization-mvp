// components/Layout.js
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import clsx from "clsx"; // if you don't have it, you can inline the ternaries instead

export default function Layout({ children }) {
  const { pathname } = useRouter();
  const isLanding = pathname === "/";

  return (
    <div
      className={clsx(
        "min-h-screen",
        isLanding ? "bg-[#0b1120] text-gray-100" : "bg-white text-gray-900"
      )}
    >
      <Navbar />
      <main className={clsx("min-h-[calc(100vh-4rem)]", isLanding ? "" : "bg-white")}>
        {children}
      </main>
    </div>
  );
}

