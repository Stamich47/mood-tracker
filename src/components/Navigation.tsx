"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BarChart2,
  LogOut,
  Settings,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Navigation() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Daily Check-in";
      case "/chart":
        return "Yearly Progress";
      case "/insights":
        return "Insights";
      default:
        return "";
    }
  };

  return (
    <nav className="fixed bottom-4 md:bottom-auto md:top-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-[calc(100%-2rem)] md:w-full max-w-lg md:max-w-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/50 md:border-b px-2 md:px-6 py-2 md:py-4 z-40 rounded-2xl md:rounded-none shadow-premium md:shadow-none">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              pathname === "/"
                ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <LayoutDashboard
              size={16}
              strokeWidth={pathname === "/" ? 2.5 : 2}
            />
            <span className="text-xs font-black uppercase tracking-widest">
              Tracker
            </span>
          </Link>
          <Link
            href="/chart"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              pathname === "/chart"
                ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <Calendar size={16} strokeWidth={pathname === "/chart" ? 2.5 : 2} />
            <span className="text-xs font-black uppercase tracking-widest">
              History
            </span>
          </Link>
          <Link
            href="/insights"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              pathname === "/insights"
                ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <BarChart2
              size={16}
              strokeWidth={pathname === "/insights" ? 2.5 : 2}
            />
            <span className="text-xs font-black uppercase tracking-widest">
              Insights
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-between items-center gap-0.5">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 ${
            pathname === "/"
              ? "text-brand-600 dark:text-brand-400"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          }`}
        >
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              pathname === "/" ? "bg-brand-50 dark:bg-brand-900/30" : ""
            }`}
          >
            <LayoutDashboard
              size={18}
              strokeWidth={pathname === "/" ? 2.5 : 2}
            />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            Tracker
          </span>
        </Link>

        <Link
          href="/chart"
          className={`flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 ${
            pathname === "/chart"
              ? "text-brand-600 dark:text-brand-400"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          }`}
        >
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              pathname === "/chart" ? "bg-brand-50 dark:bg-brand-900/30" : ""
            }`}
          >
            <Calendar size={18} strokeWidth={pathname === "/chart" ? 2.5 : 2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            History
          </span>
        </Link>

        <Link
          href="/insights"
          className={`flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 ${
            pathname === "/insights"
              ? "text-brand-600 dark:text-brand-400"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          }`}
        >
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              pathname === "/insights" ? "bg-brand-50 dark:bg-brand-900/30" : ""
            }`}
          >
            <BarChart2
              size={18}
              strokeWidth={pathname === "/insights" ? 2.5 : 2}
            />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            Insights
          </span>
        </Link>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        <button className="flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <div className="p-1.5 rounded-lg">
            <Settings size={18} strokeWidth={2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            Settings
          </span>
        </button>

        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 text-zinc-400 hover:text-red-500"
        >
          <div className="p-1.5 rounded-lg">
            <LogOut size={18} strokeWidth={2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            Exit
          </span>
        </button>
      </div>
    </nav>
  );
}
