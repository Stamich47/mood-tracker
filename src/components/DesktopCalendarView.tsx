"use client";

import React from "react";
import { Log } from "@/types";

interface DesktopCalendarViewProps {
  logs: Log[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  metric: "mood" | "workout" | "alcohol";
}

const moodColors: Record<number, string> = {
  1: "bg-red-600",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
  5: "bg-green-600",
};

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

export default function DesktopCalendarView({
  logs,
  selectedDate,
  onDateSelect,
  metric,
}: DesktopCalendarViewProps) {
  const today = new Date();
  const logsMap = new Map(logs.map((log) => [log.date, log]));

  // Generate last 12 months
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({ year: date.getFullYear(), month: date.getMonth() });
  }

  const renderMonthGrid = (year: number, monthIndex: number) => {
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
      <div
        key={`${year}-${monthIndex}`}
        className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800"
      >
        <div className="text-center text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-1">
          {monthLabel}
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-zinc-400 uppercase tracking-widest py-0.5"
            >
              {d[0]}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-0.5">
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
                      } shadow-[0_1px_3px_rgba(0,0,0,0.1)]`
                    : "bg-zinc-100 dark:bg-zinc-800 shadow-sm";
                } else if (metric === "workout") {
                  cellClasses =
                    log && log.worked_out ? workoutColor : workoutEmpty;
                } else {
                  const drinks = Math.min(log?.drinks ?? 0, 5);
                  cellClasses = alcoholColors[drinks];
                }

                return (
                  <button
                    key={di}
                    disabled={isFuture}
                    onClick={() => onDateSelect(dateStr)}
                    className={`aspect-square rounded-sm transition-all duration-150 relative flex items-center justify-center text-xs font-bold ${cellClasses} ${
                      isSelected
                        ? "ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-zinc-900 z-10"
                        : ""
                    } ${
                      isFuture
                        ? "opacity-35 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                        : "cursor-pointer hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)] text-zinc-900 dark:text-white"
                    }`}
                    title={!isFuture ? dateStr : undefined}
                  >
                    <span className="text-xs">{day}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-zinc-50 dark:bg-zinc-900 rounded-3xl shadow-premium border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-brand-600 overflow-hidden">
      <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-4">
        {months.map((m) => renderMonthGrid(m.year, m.month))}
      </div>
    </div>
  );
}
