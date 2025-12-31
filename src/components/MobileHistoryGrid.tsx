"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Log } from "@/types";
import { ChevronLeft, ChevronRight, Smile } from "lucide-react";

interface MobileHistoryGridProps {
  logs: Log[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  metric?: "mood" | "workout" | "alcohol";
  viewMode?: "month" | "year";
}

const moodColors: Record<number, string> = {
  1: "bg-red-600",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
  5: "bg-green-600",
};

const moodLabels: Record<number, string> = {
  1: "Awful",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export default function MobileHistoryGrid({
  logs,
  selectedDate,
  onDateSelect,
  metric = "mood",
  viewMode: viewModeProp,
}: MobileHistoryGridProps & { metric?: "mood" | "workout" | "alcohol" }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const viewMode = viewModeProp ?? "month";

  const logsMap = new Map(logs.map((log) => [log.date, log]));

  const alcoholColors: Record<number, string> = {
    0: "bg-zinc-200 dark:bg-zinc-800",
    1: "bg-amber-200",
    2: "bg-amber-300",
    3: "bg-amber-400",
    4: "bg-amber-500",
    5: "bg-amber-600",
  };

  const workoutColor = "bg-brand-600";
  const workoutEmpty = "bg-zinc-100 dark:bg-zinc-800";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    const isCurrentMonth =
      selectedYear === currentYear && selectedMonth === today.getMonth();
    if (!isCurrentMonth) {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear((y) => y + 1);
      } else {
        setSelectedMonth((m) => m + 1);
      }
    }
  };

  const renderMonthGrid = (
    year: number,
    monthIndex: number,
    showHeader = true
  ) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    const monthLabel = new Date(year, monthIndex).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    return (
      <div key={`${year}-${monthIndex}`} className="mb-3">
        {showHeader && (
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
              {monthLabel}
            </div>
          </div>
        )}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day, di) => {
                if (day === null)
                  return <div key={di} className="aspect-square" />;

                const dateStr = `${year}-${String(monthIndex + 1).padStart(
                  2,
                  "0"
                )}-${String(day).padStart(2, "0")}`;
                const log = logsMap.get(dateStr);
                const dateObj = new Date(year, monthIndex, day);
                const isFuture = dateObj > today;
                const isSelected = selectedDate === dateStr;

                let cellClasses = "";
                if (metric === "mood") {
                  cellClasses = log
                    ? `${
                        moodColors[log.mood]
                      } shadow-[0_2px_6px_rgba(0,0,0,0.15)]`
                    : "bg-zinc-100 dark:bg-zinc-800 shadow-sm";
                } else if (metric === "workout") {
                  cellClasses =
                    log && log.worked_out ? workoutColor : workoutEmpty;
                } else {
                  const drinks = Math.min(log?.drinks ?? 0, 5);
                  cellClasses = alcoholColors[drinks];
                }

                const tooltip = (() => {
                  if (!log) return undefined;
                  if (metric === "mood")
                    return `${dateStr}: ${moodLabels[log.mood]}`;
                  if (metric === "workout")
                    return `${dateStr}: ${log.worked_out ? "Yes" : "No"}`;
                  return `${dateStr}: ${log.drinks} ${
                    log.drinks === 1 ? "drink" : "drinks"
                  }`;
                })();

                return (
                  <motion.button
                    key={di}
                    disabled={isFuture}
                    onClick={() => onDateSelect(dateStr)}
                    whileHover={!isFuture ? { scale: 1.08 } : undefined}
                    whileTap={!isFuture ? { scale: 0.95 } : undefined}
                    className={`aspect-square rounded-md transition-all duration-150 relative flex items-center justify-center text-sm font-bold ${cellClasses} ${
                      isSelected
                        ? "ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-zinc-900 z-10"
                        : ""
                    } ${
                      isFuture
                        ? "opacity-35 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                        : "cursor-pointer hover:shadow-[0_4px_10px_rgba(0,0,0,0.12)] text-zinc-900 dark:text-white"
                    }`}
                    title={!isFuture ? tooltip ?? dateStr : undefined}
                  >
                    <span className="text-xs">{day}</span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Generate months range for year view (most recent first) up to a limit
  const generateMonthsRange = (
    startYear: number,
    startMonth: number,
    monthsBack: number
  ) => {
    const months: { year: number; month: number }[] = [];
    let y = startYear;
    let m = startMonth;
    for (let i = 0; i < monthsBack; i++) {
      months.push({ year: y, month: m });
      m -= 1;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
    }
    return months; // most recent first
  };

  // Refs for month elements and container to enable auto-scroll
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute months list for Year view based on earliest log date up to 5 years (60 months)
  const computeYearMonthsList = () => {
    if (logs.length === 0)
      return generateMonthsRange(selectedYear, selectedMonth, 12);

    const earliestLog = logs.reduce((a, b) => (a.date < b.date ? a : b));
    const [ey, em] = earliestLog.date.split("-").map(Number);
    const emIndex = em - 1; // convert to 0-based month

    const diff = (selectedYear - ey) * 12 + (selectedMonth - emIndex);
    const monthsBack = Math.min(Math.max(diff + 1, 12), 60); // at least 12, at most 60 months

    return generateMonthsRange(selectedYear, selectedMonth, monthsBack);
  };

  const monthsList = computeYearMonthsList();

  // Auto-scroll to the selected month when entering Year view
  useEffect(() => {
    if (viewMode !== "year") return;
    requestAnimationFrame(() => {
      const key = `${selectedYear}-${selectedMonth}`;
      const el = monthRefs.current[key];

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [viewMode, selectedYear, selectedMonth, logs, monthsList]);

  return (
    <div className="flex flex-col gap-3 p-2 w-full flex-1 min-h-0 bg-zinc-50 dark:bg-zinc-900 rounded-3xl shadow-premium border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-brand-600 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-1 min-w-0">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors shrink-0"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </button>

          <div className="flex items-center gap-1 min-w-0">
            <Smile
              size={14}
              className="text-brand-600 dark:text-brand-400 shrink-0"
            />
            <h3 className="text-sm font-black tracking-tight text-zinc-900 dark:text-white whitespace-nowrap truncate">
              {new Date(selectedYear, selectedMonth).toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" }
              )}
            </h3>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={
              selectedYear === currentYear && selectedMonth === today.getMonth()
            }
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent shrink-0"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Metric label (compact) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-sm font-black text-zinc-900 dark:text-white">
            {metric === "mood"
              ? "Mood"
              : metric === "workout"
              ? "Exercise"
              : "Alcohol"}
          </div>
        </div>
      </div>

      {/* Legend row moved below header to keep month title from truncating */}
      <div className="flex justify-end pb-2">
        <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
          {metric === "mood" && (
            <>
              <span className="text-[10px] font-semibold">Bad</span>
              <div className="flex gap-0.5 items-center px-1">
                {[1, 2, 3, 4, 5].map((m) => (
                  <motion.div
                    key={m}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-sm ${moodColors[m]} opacity-80 shadow-sm`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-[10px] font-semibold">Great</span>
            </>
          )}

          {metric === "workout" && (
            <>
              <span>No</span>
              <div className="flex gap-1 items-center">
                <div className="w-3.5 h-3.5 rounded-sm bg-zinc-200 dark:bg-zinc-800 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-sm bg-brand-600 shadow-sm" />
              </div>
              <span>Yes</span>
            </>
          )}

          {metric === "alcohol" && (
            <>
              <span>0</span>
              <div className="flex gap-1 items-center">
                {[0, 1, 2, 3, 4, 5].map((d) => (
                  <div
                    key={d}
                    className={`w-3 h-3 rounded-sm ${alcoholColors[d]} opacity-80 shadow-sm`}
                  />
                ))}
              </div>
              <span>5+</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2 pb-24 overscroll-contain max-h-[calc(100vh-12rem)]"
        ref={containerRef}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {viewMode === "month" && (
          <div>{renderMonthGrid(selectedYear, selectedMonth, false)}</div>
        )}

        {viewMode === "year" && (
          <div>
            {monthsList.map((m) => (
              <div
                key={`${m.year}-${m.month}`}
                ref={(el) => {
                  monthRefs.current[`${m.year}-${m.month}`] = el;
                }}
                className="p-2"
              >
                {renderMonthGrid(m.year, m.month)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
