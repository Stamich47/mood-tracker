"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Log } from "@/types";
import { ChevronLeft, ChevronRight, Dumbbell, Beer } from "lucide-react";

interface ActivitiesGridProps {
  logs: Log[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  activityType?: "workout" | "alcohol";
}

const workoutColor = "bg-brand-600";
const workoutColorEmpty = "bg-zinc-200 dark:bg-zinc-800";

const alcoholColors: Record<number, string> = {
  0: "bg-zinc-200 dark:bg-zinc-800",
  1: "bg-amber-200",
  2: "bg-amber-300",
  3: "bg-amber-400",
  4: "bg-amber-500",
  5: "bg-amber-600",
};

export default function ActivitiesGrid({
  logs,
  selectedDate,
  onDateSelect,
  activityType: propActivityType,
}: ActivitiesGridProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  // Use controlled prop if provided, otherwise default to "workout"
  const activityType = propActivityType ?? "workout";

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

  const getActivityColor = (log: Log | undefined): string => {
    if (!log)
      return activityType === "workout" ? workoutColorEmpty : alcoholColors[0];

    if (activityType === "workout") {
      return log.worked_out ? workoutColor : workoutColorEmpty;
    } else {
      const drinkCount = Math.min(log.drinks, 5);
      return alcoholColors[drinkCount];
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 w-full h-full bg-zinc-50 dark:bg-zinc-900 rounded-3xl md:rounded-4xl shadow-premium border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-amber-500 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 shrink-0 justify-between">
        <div className="flex items-center gap-2 flex-1 justify-start">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <h3 className="text-lg md:text-xl font-black tracking-tight text-zinc-900 dark:text-white text-center flex items-center gap-2 justify-center w-40 whitespace-nowrap">
            {activityType === "workout" ? (
              <>
                <Dumbbell
                  size={24}
                  className="text-brand-600 dark:text-brand-400 shrink-0"
                />
                {year} Workouts
              </>
            ) : (
              <>
                <Beer
                  size={24}
                  className="text-amber-600 dark:text-amber-400 shrink-0"
                />
                {year} Alcohol
              </>
            )}
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

        {/* Legend */}
        <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {activityType === "workout" ? (
            <>
              <span>No</span>
              <div className="flex gap-1">
                <div className="w-3.5 h-3.5 rounded-sm bg-zinc-200 dark:bg-zinc-800 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-sm bg-brand-600 shadow-sm" />
              </div>
              <span>Yes</span>
            </>
          ) : (
            <>
              <span>0</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((d) => (
                  <motion.div
                    key={d}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm ${alcoholColors[d]} opacity-80 shadow-sm`}
                    />
                  </motion.div>
                ))}
              </div>
              <span>5+</span>
            </>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Scrollable container */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {/* Month Labels Row */}
          <div className="flex gap-1 mb-2 shrink-0 sticky top-0 bg-zinc-50/70 dark:bg-zinc-900/70 z-20 pb-2 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
            {/* Placeholder for day labels column */}
            <div className="w-10 md:w-8 shrink-0 pr-2 md:pr-2 mr-1" />

            {/* Month labels */}
            <div
              className="flex gap-1 flex-1 pr-4"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(12, 1fr)`,
                gap: "0.5rem",
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
            <div className="flex flex-col gap-2 shrink-0 pr-2 md:pr-2 w-10 md:w-8 mr-1 sticky left-0 z-10 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className="h-12 md:h-14 flex items-center justify-center text-[10px] md:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 shrink-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              className="flex-1 pb-1 pr-4"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(12, 1fr)`,
                gap: "0.5rem",
              }}
            >
              {months.map((month, monthIndex) => (
                <div
                  key={month}
                  className="flex flex-col gap-1 items-center"
                  style={{ gap: "0.5rem" }}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isValidDay = day <= daysInMonth[monthIndex];
                    const dateStr = `${year}-${String(monthIndex + 1).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;
                    const log = logsMap.get(dateStr);
                    const isSelected = selectedDate === dateStr;
                    const dateObj = new Date(year, monthIndex, day);
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
                        className={`w-full h-12 md:h-14 shrink-0 rounded-lg transition-all duration-200 relative flex items-center justify-center ${
                          !isValidDay
                            ? "invisible"
                            : log
                            ? `${getActivityColor(
                                log
                              )} shadow-[0_2px_6px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3)]`
                            : `${getActivityColor(undefined)} shadow-sm`
                        } ${
                          isSelected
                            ? "ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-zinc-900 z-10"
                            : ""
                        } ${
                          isFuture || !isCurrentYear || !isValidDay
                            ? "opacity-35 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                        }`}
                        title={
                          isValidDay
                            ? `${dateStr}: ${
                                activityType === "workout"
                                  ? log?.worked_out
                                    ? "Worked Out"
                                    : "Rest Day"
                                  : `${log?.drinks || 0} drinks`
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
