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
      <main className="max-w-3xl mx-auto w-full pt-6 pb-24 px-4 md:px-6 flex flex-col gap-4 md:gap-6 flex-1 overflow-hidden flex-col">
        <header className="shrink-0">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Daily Check-in
          </h1>
        </header>

        {/* Entry Section - No internal scroll, auto-sizing */}
        <section className="w-full bg-white dark:bg-zinc-900 p-5 md:p-8 rounded-4xl shadow-premium border border-slate-100 dark:border-zinc-800 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 mb-4 md:mb-6 shrink-0">
            <div className="w-1.5 h-6 bg-brand-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
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
      </main>
      <Navigation />
    </div>
  );
}
