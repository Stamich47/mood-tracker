"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrackerForm from "./TrackerForm";
import Navigation from "./Navigation";
import DateNavigator from "./DateNavigator";
import { createClient } from "@/utils/supabase/client";
import { Log } from "@/types";

export default function Dashboard({ initialLogs }: { initialLogs: Log[] }) {
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

  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const year = new Date().getFullYear();
    const { data } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", `${year}-01-01`)
      .lte("date", `${year}-12-31`);

    if (data) setLogs(data);
  }, [supabase]);

  const selectedLog = logs.find((l) => l.date === selectedDate);

  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatLocalDate = (date: Date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  const handlePreviousDay = () => {
    const date = parseLocalDate(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatLocalDate(date));
  };

  const handleNextDay = () => {
    const date = parseLocalDate(selectedDate);
    date.setDate(date.getDate() + 1);
    // Don't allow going to future dates
    const today = getTodayString();
    const nextDate = formatLocalDate(date);
    if (nextDate <= today) {
      setSelectedDate(nextDate);
    }
  };

  return (
    <div className="h-dvh bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden flex flex-col">
      <main className="w-full pt-6 md:pt-24 pb-24 md:pb-6 flex-col gap-4 md:gap-6 flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6 flex flex-col gap-4 md:gap-6">
          {/* Mobile Header */}
          <header className="shrink-0 md:hidden mb-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-0.5">
              {parseLocalDate(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Daily Check-in
            </h1>
          </header>

          {/* Mobile: Date Navigator */}
          <div className="md:hidden">
            <DateNavigator
              selectedDate={selectedDate}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
            />
          </div>

          {/* Desktop: Tracker with side arrows (arrows are fixed positioned) */}
          <div className="hidden md:flex md:items-center md:justify-center md:gap-8">
            {/* Entry Section - Enhanced with glassmorphism */}
            <section className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-zinc-800/50 flex flex-col overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-shadow duration-300">
              <div className="flex flex-col gap-1 mb-4 md:mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-linear-to-b from-brand-400 to-brand-600 rounded-full shadow-[0_0_16px_rgba(99,102,241,0.6)]" />
                  <h2 className="text-lg md:text-xl font-black tracking-tight">
                    Tracker
                  </h2>
                </div>
                {selectedDate !== getTodayString() && (
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide pl-5">
                    {parseLocalDate(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="overflow-hidden">
                <TrackerForm
                  key={selectedDate}
                  date={selectedDate}
                  initialData={selectedLog}
                  onSaveSuccess={fetchLogs}
                  onPreviousDay={handlePreviousDay}
                  onNextDay={handleNextDay}
                />
              </div>
            </section>
          </div>

          {/* Mobile: Entry Section */}
          <section className="md:hidden w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-zinc-800/50 flex flex-col overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4 md:mb-6 shrink-0">
              <div className="w-1.5 h-6 bg-linear-to-b from-brand-400 to-brand-600 rounded-full shadow-[0_0_16px_rgba(99,102,241,0.6)]" />
              <h2 className="text-lg md:text-xl font-black tracking-tight">
                Tracker
              </h2>
            </div>

            <div className="overflow-hidden">
              <TrackerForm
                key={selectedDate}
                date={selectedDate}
                initialData={selectedLog}
                onSaveSuccess={fetchLogs}
                onPreviousDay={handlePreviousDay}
                onNextDay={handleNextDay}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Desktop Navigation Arrows - Stay in place during scroll */}
      <div className="hidden md:block">
        {/* Left Arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePreviousDay}
          className="fixed left-[calc(50%-28rem)] top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-linear-to-br from-white/90 to-white/70 dark:from-zinc-800/90 dark:to-zinc-800/70 backdrop-blur-sm border border-white/40 dark:border-zinc-700/40 text-brand-600 dark:text-brand-400 shadow-lg hover:shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 h-fit z-40"
        >
          <ChevronLeft size={32} strokeWidth={2.5} />
        </motion.button>

        {/* Right Arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextDay}
          disabled={selectedDate >= getTodayString()}
          className="fixed right-[calc(50%-28rem)] top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-linear-to-br from-white/90 to-white/70 dark:from-zinc-800/90 dark:to-zinc-800/70 backdrop-blur-sm border border-white/40 dark:border-zinc-700/40 text-brand-600 dark:text-brand-400 shadow-lg hover:shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 h-fit z-40 disabled:bg-zinc-100/50 dark:disabled:bg-zinc-900/50 disabled:text-zinc-300 dark:disabled:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={32} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}
