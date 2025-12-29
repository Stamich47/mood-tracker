"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Log } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryGridProps {
  logs: Log[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
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

export default function HistoryGrid({
  logs,
  selectedDate,
  onDateSelect,
}: HistoryGridProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const year = selectedYear;

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

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap year
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-full bg-white dark:bg-zinc-900 rounded-3xl md:rounded-4xl shadow-premium border border-slate-100 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <h3 className="text-lg md:text-xl font-black tracking-tight text-zinc-900 dark:text-white min-w-20 text-center">
            {year} Activity
          </h3>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            disabled={selectedYear >= currentYear}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
            aria-label="Next year"
          >
            <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Enhanced Legend */}
        <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((m) => (
              <motion.div
                key={m}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={`w-3 h-3 rounded-sm ${moodColors[m]} opacity-80 shadow-sm`}
                />
              </motion.div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Scrollable container - both labels and grid scroll together */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          {/* Month Labels Row - using grid to match column widths */}
          <div className="flex gap-1 mb-2 shrink-0 sticky top-0 bg-white dark:bg-zinc-900 z-20">
            {/* Placeholder for day labels column */}
            <div className="w-10 md:w-12 shrink-0 pr-2 md:pr-3 mr-1" />

            {/* Month labels - each gets exact width of grid column via grid-template-columns */}
            <div
              className="flex gap-1 flex-1"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(12, minmax(35px, 1fr))`,
                gap: "0.25rem",
              }}
            >
              {months.map((month) => (
                <div
                  key={month}
                  className="h-6 flex items-center justify-center text-center text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase"
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Day Labels Column + Grid */}
          <div className="flex gap-1">
            {/* Day Labels Column */}
            <div className="flex flex-col gap-1 shrink-0 pr-2 md:pr-3 w-10 md:w-12 mr-1 sticky left-0 z-10 bg-white dark:bg-zinc-900">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className="h-8 md:h-9 flex items-center justify-center text-[10px] md:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 shrink-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              className="flex-1 pb-1"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(12, minmax(35px, 1fr))`,
                gap: "0.25rem",
              }}
            >
              {months.map((month, monthIndex) => (
                <div
                  key={month}
                  className="flex flex-col gap-1 items-center"
                  style={{ gap: "0.25rem" }}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isValidDay = day <= daysInMonth[monthIndex];
                    const dateStr = `${year}-${String(monthIndex + 1).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;
                    const log = logsMap.get(dateStr);
                    const isSelected = selectedDate === dateStr;
                    const dateObj = new Date(year, monthIndex, day); // Local timezone
                    const isFuture = dateObj > today;
                    const isCurrentYear = dateObj.getFullYear() === year;

                    return (
                      <motion.button
                        key={`${month}-${day}`}
                        disabled={!isValidDay || !isCurrentYear || isFuture}
                        onClick={() => isValidDay && onDateSelect(dateStr)}
                        whileHover={
                          isValidDay && isCurrentYear && !isFuture
                            ? { scale: 1.08 }
                            : undefined
                        }
                        whileTap={
                          isValidDay && isCurrentYear && !isFuture
                            ? { scale: 0.95 }
                            : undefined
                        }
                        className={`w-8 md:w-9 h-8 md:h-9 shrink-0 rounded-lg transition-all duration-200 relative flex items-center justify-center ${
                          !isValidDay
                            ? "invisible"
                            : log
                            ? `${
                                moodColors[log.mood]
                              } shadow-[0_2px_6px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3)]`
                            : "bg-zinc-100 dark:bg-zinc-800 shadow-sm"
                        } ${
                          isSelected
                            ? "ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-zinc-900 z-10"
                            : ""
                        } ${
                          isFuture || !isCurrentYear || !isValidDay
                            ? "opacity-35 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                        } group`}
                        title={
                          isValidDay
                            ? `${dateStr}: ${
                                log ? moodLabels[log.mood] : "No data"
                              }`
                            : ""
                        }
                      >
                        <span className="absolute text-[10px] md:text-[12px] font-bold text-white opacity-0 group-hover:opacity-40 transition-opacity duration-200">
                          {day}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
