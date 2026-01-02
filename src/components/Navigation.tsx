"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  BarChart2,
  LogOut,
  // Settings,
  ChevronLeft,
  ChevronRight,
  Smile,
  Sun,
  Moon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useInsights } from "@/contexts/InsightsContext";
import { useChart } from "@/contexts/ChartContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const pathname = usePathname();
  const insightsControls = useInsights();
  const chartControls = useChart();
  const { setTheme, isDark } = useTheme();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Don't render navigation on login/signup pages or if not authenticated
  if (pathname === "/login" || !isAuthenticated || isLoading) {
    return null;
  }

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
    <nav className="fixed bottom-4 lg:bottom-auto lg:top-0 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 w-[calc(100%-2rem)] lg:w-full max-w-lg lg:max-w-none bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/50 lg:border-b px-2 lg:px-6 py-2 lg:py-4 z-40 rounded-2xl lg:rounded-none shadow-premium lg:shadow-none lg:overflow-visible">
      {/* Desktop Header */}
      <div className="hidden lg:flex justify-between items-center mb-0 overflow-visible gap-8">
        <div className="flex items-center gap-8 flex-1">
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
        </div>

        {/* Insights Controls - shows only on insights page */}
        {pathname === "/insights" && insightsControls && (
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 shadow-inner">
              {(["week", "month", "year", "custom"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => insightsControls.onViewChange(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all tracking-widest flex-1 ${
                    insightsControls.view === v
                      ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Date Navigation or Custom Range */}
            {insightsControls.view === "custom" ? (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={insightsControls.customRange?.start}
                  onChange={(e) =>
                    insightsControls.onCustomRangeChange?.(
                      e.target.value,
                      insightsControls.customRange?.end || ""
                    )
                  }
                  className="px-2 py-1 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
                <span className="text-[10px] font-bold text-zinc-400">TO</span>
                <input
                  type="date"
                  value={insightsControls.customRange?.end}
                  onChange={(e) =>
                    insightsControls.onCustomRangeChange?.(
                      insightsControls.customRange?.start || "",
                      e.target.value
                    )
                  }
                  className="px-2 py-1 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    insightsControls.onOffsetChange(insightsControls.offset - 1)
                  }
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
                >
                  <ChevronLeft
                    size={14}
                    className="text-zinc-600 dark:text-zinc-400"
                  />
                </button>
                <span className="font-black text-xs tracking-widest flex-1 text-center uppercase text-zinc-500 min-w-50">
                  {insightsControls.getPeriodLabel}
                </span>
                <button
                  onClick={() =>
                    insightsControls.onOffsetChange(insightsControls.offset + 1)
                  }
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
                >
                  <ChevronRight
                    size={14}
                    className="text-zinc-600 dark:text-zinc-400"
                  />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chart Controls - shows only on chart page */}
        {pathname === "/chart" && chartControls && (
          <div className="flex items-center gap-4">
            {/* Chart View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 shadow-inner">
              {(["grid", "calendar"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => chartControls.onChartViewChange(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all tracking-widest flex-1 ${
                    chartControls.chartView === v
                      ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  }`}
                >
                  {v === "grid" ? "GRID" : "CALENDAR"}
                </button>
              ))}
            </div>

            {/* Metric Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 shadow-inner">
              {(["mood", "workout", "alcohol"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => chartControls.onViewChange(v)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all tracking-widest flex-1 ${
                    chartControls.view === v
                      ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  }`}
                >
                  {v === "mood"
                    ? "MOOD"
                    : v === "workout"
                    ? "WORKOUT"
                    : "ALCOHOL"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              pathname === "/"
                ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            <Smile size={16} strokeWidth={pathname === "/" ? 2.5 : 2} />
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
          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-0 px-0.5 py-0.5 rounded-lg transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 shadow-inner relative"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            <motion.div
              animate={{ x: isDark ? "calc(100% + 4px)" : 0 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
              }}
              className="absolute left-0.5 top-0.5 bottom-0.5 rounded-lg bg-white dark:bg-zinc-700 shadow-premium pointer-events-none"
              style={{
                width: "calc(50% - 2px)",
              }}
            />
            <div className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg relative z-10">
              <Sun
                size={14}
                strokeWidth={2}
                className={!isDark ? "text-amber-500" : "text-zinc-400"}
              />
            </div>
            <div className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg relative z-10">
              <Moon
                size={14}
                strokeWidth={2}
                className={isDark ? "text-indigo-500" : "text-zinc-400"}
              />
            </div>
          </button>
          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-zinc-400 hover:text-red-500"
          >
            <LogOut size={16} strokeWidth={2} />
            <span className="text-xs font-black uppercase tracking-widest">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex lg:hidden justify-between items-center gap-0.5">
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
            <LayoutDashboard size={18} strokeWidth={2} />
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
            <Calendar size={18} strokeWidth={2} />
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
            <BarChart2 size={18} strokeWidth={2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            Insights
          </span>
        </Link>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 ${
            isDark ? "text-indigo-500" : "text-amber-500"
          }`}
        >
          <div className="p-1.5 rounded-lg">
            {isDark ? (
              <Moon size={18} strokeWidth={2} />
            ) : (
              <Sun size={18} strokeWidth={2} />
            )}
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">
            {isDark ? "Dark" : "Light"}
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
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
