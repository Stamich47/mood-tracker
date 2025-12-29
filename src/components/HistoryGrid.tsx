"use client";

import React from "react";
import { Log } from "@/types";

interface HistoryGridProps {
  logs: Log[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const moodColors: Record<number, string> = {
  1: "bg-zinc-950",
  2: "bg-red-500",
  3: "bg-yellow-400",
  4: "bg-green-300",
  5: "bg-green-500",
};

export default function HistoryGrid({
  logs,
  selectedDate,
  onDateSelect,
}: HistoryGridProps) {
  const today = new Date();
  const year = today.getFullYear();

  // Generate all days for the current year
  const daysInYear = [];
  const end = new Date(year, 11, 31);

  // Adjust start to the beginning of the week (Sunday) to align rows
  const firstDayOfYear = new Date(year, 0, 1);
  const startOffset = firstDayOfYear.getDay();
  const calendarStart = new Date(firstDayOfYear);
  calendarStart.setDate(calendarStart.getDate() - startOffset);

  for (
    let d = new Date(calendarStart);
    d <= end || d.getDay() !== 0;
    d.setDate(d.getDate() + 1)
  ) {
    daysInYear.push(new Date(d));
  }

  const logsMap = new Map(logs.map((log) => [log.date, log]));

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-6 p-8 bg-white dark:bg-zinc-900 rounded-4xl shadow-premium border border-slate-100 dark:border-zinc-800 overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
          {year} Activity
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((m) => (
              <div
                key={m}
                className={`w-3 h-3 rounded-sm ${moodColors[m]} opacity-80`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {/* Day Labels */}
        <div className="grid grid-rows-7 gap-1.5 pt-6 shrink-0">
          {dayLabels.map((label, i) => (
            <span
              key={label}
              className="text-[9px] font-bold text-zinc-400 h-3 flex items-center uppercase"
            >
              {i % 2 === 1 ? label : ""}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 relative">
          {/* Month Labels */}
          <div className="flex gap-1.5 h-5">
            {months.map((month, i) => {
              const monthStart = new Date(year, i, 1);
              const weekIndex = Math.floor(
                (monthStart.getTime() - calendarStart.getTime()) /
                  (7 * 24 * 60 * 60 * 1000)
              );
              return (
                <span
                  key={month}
                  className="absolute text-[9px] font-bold text-zinc-400 uppercase"
                  style={{ left: `${weekIndex * 18}px` }}
                >
                  {month}
                </span>
              );
            })}
          </div>

          {/* The Grid */}
          <div className="grid grid-flow-col grid-rows-7 gap-1.5">
            {daysInYear.map((dateObj) => {
              const date = dateObj.toISOString().split("T")[0];
              const isCurrentYear = dateObj.getFullYear() === year;
              const log = logsMap.get(date);
              const isSelected = selectedDate === date;
              const isToday = new Date().toISOString().split("T")[0] === date;
              const isFuture = dateObj > today;

              return (
                <button
                  key={date}
                  disabled={!isCurrentYear || isFuture}
                  onClick={() => onDateSelect(date)}
                  className={`w-3 h-3 rounded-sm transition-all duration-200 ${
                    !isCurrentYear
                      ? "opacity-0 pointer-events-none"
                      : log
                      ? moodColors[log.mood]
                      : "bg-zinc-100 dark:bg-zinc-800"
                  } ${
                    isSelected
                      ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-zinc-900 scale-125 z-10"
                      : "hover:scale-110"
                  } ${isToday ? "border-2 border-brand-500" : ""} ${
                    isFuture
                      ? "opacity-20 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  title={`${date}: Mood ${log?.mood ?? "N/A"}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
