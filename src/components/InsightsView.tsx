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

interface CustomYAxisTickProps {
  x: number;
  y: number;
  payload: { value: number };
}

const moodColors: Record<number, string> = {
  1: "#dc2626",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#16a34a",
};

const CustomYAxisTick = (props: CustomYAxisTickProps) => {
  const { x, y, payload } = props;
  const color = moodColors[payload.value];
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={5} fill={color} />
    </g>
  );
};

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

  const getPeriodLabel = useMemo(() => {
    const now = new Date();
    const start = new Date();

    if (view === "week") {
      start.setDate(now.getDate() - 7 + offset * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else if (view === "month") {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      return `${new Date(now.getFullYear() + offset, 0, 1).getFullYear()}`;
    }
  }, [view, offset]);

  return (
    <div className="h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden md:pt-24">
      {/* Mobile Header */}
      <header className="md:hidden p-4 flex justify-between items-center bg-white dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
            Insights
          </h1>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 shadow-inner">
          {(["week", "month", "year"] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all tracking-widest ${
                view === v
                  ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Mobile Controls */}
      <div className="md:hidden p-4 flex flex-col gap-2 bg-white dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset(offset - 1)}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            <ChevronLeft
              size={14}
              className="text-zinc-600 dark:text-zinc-400"
            />
          </button>
          <span className="font-black text-xs tracking-widest flex-1 text-center uppercase text-zinc-500">
            {getPeriodLabel}
          </span>
          <button
            onClick={() => setOffset(offset + 1)}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            <ChevronRight
              size={14}
              className="text-zinc-600 dark:text-zinc-400"
            />
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-900/30 text-[9px]">
          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          <span className="font-black tracking-widest text-brand-700 dark:text-brand-300 uppercase flex-1">
            AVG: {averageMood}
          </span>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden md:flex justify-between items-center px-6 py-4 bg-white dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 gap-6">
        <div className="flex items-center gap-6">
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 shadow-inner">
            {(["week", "month", "year"] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  setOffset(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all tracking-widest ${
                  view === v
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOffset(offset - 1)}
            className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-soft"
          >
            <ChevronLeft
              size={18}
              className="text-zinc-600 dark:text-zinc-400"
            />
          </button>
          <span className="font-black text-xs tracking-[0.2em] min-w-52 text-center uppercase text-zinc-500">
            {getPeriodLabel}
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

      <main className="flex-1 overflow-y-auto p-8 md:pt-24 space-y-8 scrollbar-hide pb-24 md:pb-8">
        {/* Mood Trend - Full Width */}
        <section className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-4xl shadow-lg border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-linear-to-b from-brand-500 to-brand-600 rounded-full" />
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-linear-to-r from-brand-600 to-brand-500 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
                Mood Trend
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 tracking-wide uppercase font-semibold">
                {getPeriodLabel}
              </p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={CustomYAxisTick}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "2px solid #6366f1",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "bold",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                    padding: "12px",
                  }}
                  cursor={{ stroke: "#6366f1", strokeWidth: 2, opacity: 0.3 }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#6366f1",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                  fillOpacity={1}
                  fill="url(#colorMood)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alcohol Consumption */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-4xl shadow-lg border border-slate-100 dark:border-zinc-800">
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
