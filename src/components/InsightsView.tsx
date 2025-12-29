"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Log } from "@/types";
import Navigation from "./Navigation";

export default function InsightsPage({ logs }: { logs: Log[] }) {
  const [view, setView] = useState<"week" | "month" | "year">("week");
  const [offset, setOffset] = useState(0);

  const filteredData = useMemo(() => {
    const now = new Date();
    const start = new Date();

    if (view === "week") {
      start.setDate(now.getDate() - 7 + offset * 7);
    } else if (view === "month") {
      start.setMonth(now.getMonth() + offset, 1);
    } else {
      start.setFullYear(now.getFullYear() + offset, 0, 1);
    }

    const end = new Date(start);
    if (view === "week") end.setDate(start.getDate() + 7);
    else if (view === "month") end.setMonth(start.getMonth() + 1);
    else end.setFullYear(start.getFullYear() + 1);

    return logs
      .filter((log) => {
        const d = new Date(log.date + "T00:00:00");
        return d >= start && d < end;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((log) => ({
        ...log,
        displayDate: new Date(log.date + "T00:00:00").toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            weekday: view === "week" ? "short" : undefined,
          }
        ),
      }));
  }, [logs, view, offset]);

  const averageMood = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, curr) => acc + curr.mood, 0);
    return (sum / filteredData.length).toFixed(1);
  }, [filteredData]);

  return (
    <div className="h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      <header className="p-8 flex flex-col gap-6 bg-white dark:bg-zinc-900 shadow-premium border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">
              Analytics
            </p>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              Insights
            </h1>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1.5 shadow-inner">
            {(["week", "month", "year"] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  setOffset(0);
                }}
                className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all tracking-widest ${
                  view === v
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setOffset(offset - 1)}
              className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-soft"
            >
              <ChevronLeft
                size={18}
                className="text-zinc-600 dark:text-zinc-400"
              />
            </button>
            <span className="font-black text-xs tracking-[0.2em] min-w-32 text-center uppercase text-zinc-500">
              {view === "week"
                ? offset === 0
                  ? "THIS WEEK"
                  : `WEEK ${offset}`
                : view === "month"
                ? new Date(
                    new Date().setMonth(new Date().getMonth() + offset)
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : new Date(
                    new Date().setFullYear(new Date().getFullYear() + offset)
                  ).getFullYear()}
            </span>
            <button
              onClick={() => setOffset(offset + 1)}
              className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-soft"
            >
              <ChevronRight
                size={18}
                className="text-zinc-600 dark:text-zinc-400"
              />
            </button>
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-900/30">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-brand-700 dark:text-brand-300 uppercase">
              AVG MOOD: {averageMood}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trend */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-4xl shadow-premium border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
              <h2 className="text-xl font-black tracking-tight">Mood Trend</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="displayDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "none",
                      borderRadius: "16px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#6366f1"
                    strokeWidth={4}
                    dot={{
                      r: 4,
                      fill: "#6366f1",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Alcohol Consumption */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-4xl shadow-premium border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-xl font-black tracking-tight">
                Alcohol Intake
              </h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="displayDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(245, 158, 11, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "none",
                      borderRadius: "16px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar
                    dataKey="drinks"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    barSize={view === "week" ? 40 : 12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>
      <Navigation />
    </div>
  );
}
