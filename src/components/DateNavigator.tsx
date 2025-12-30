"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateNavigatorProps {
  selectedDate: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

export default function DateNavigator({
  selectedDate,
  onPreviousDay,
  onNextDay,
}: DateNavigatorProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getTodayString = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const todayString = getTodayString();
  const isToday = selectedDate === todayString;
  const isFuture = selectedDate > todayString;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && !isFuture) {
      onNextDay();
    }
    if (isRightSwipe) {
      onPreviousDay();
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 w-full touch-pan-y">
      {/* Left Arrow */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onPreviousDay}
        className="p-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 shadow-sm hover:shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 shrink-0"
      >
        <ChevronLeft size={24} />
      </motion.button>

      {/* Center Date Display */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {parseLocalDate(selectedDate).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {parseLocalDate(selectedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {isToday && (
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                  Today
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Arrow */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onNextDay}
        disabled={isFuture}
        className={`p-2 rounded-xl backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 shrink-0 ${
          isFuture
            ? "bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
            : "bg-white/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-750"
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ChevronRight size={24} />
      </motion.button>
    </div>
  );
}
