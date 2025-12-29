"use client";

import { useState, useCallback } from "react";
import TrackerForm from "./TrackerForm";
import Navigation from "./Navigation";
import { createClient } from "@/utils/supabase/client";
import { Log } from "@/types";

export default function Dashboard({ initialLogs }: { initialLogs: Log[] }) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
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

  return (
    <div className="h-dvh bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden flex flex-col">
      <main className="w-full pt-6 md:pt-24 pb-24 md:pb-6 flex-col gap-4 md:gap-6 flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6 flex flex-col gap-4 md:gap-6">
          {/* Mobile Header */}
          <header className="shrink-0 md:hidden mb-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Daily Check-in
            </h1>
          </header>

          {/* Entry Section - Enhanced with glassmorphism */}
          <section className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-zinc-800/50 flex flex-col overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-shadow duration-300">
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
              />
            </div>
          </section>
        </div>
      </main>
      <Navigation />
    </div>
  );
}
