"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { ChevronLeft, ChevronRight, ChevronDown, Filter } from "lucide-react";
import { Log } from "@/types";
import { useSetInsights } from "@/contexts/InsightsContext";

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [collapsedGraphs, setCollapsedGraphs] = useState<{
    mood: boolean;
    alcohol: boolean;
    exercise: boolean;
  }>({ mood: false, alcohol: false, exercise: false });

  const setInsightsControls = useSetInsights();

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

  // Update context with current state
  useEffect(() => {
    if (setInsightsControls) {
      setInsightsControls({
        view,
        offset,
        getPeriodLabel,
        onViewChange: (v: "week" | "month" | "year") => {
          setView(v);
          setOffset(0);
        },
        onOffsetChange: (o: number) => setOffset(o),
      });
    }
  }, [view, offset, getPeriodLabel, setInsightsControls]);

  const toggleGraph = (graph: "mood" | "alcohol" | "exercise") => {
    setCollapsedGraphs((prev) => ({
      ...prev,
      [graph]: !prev[graph],
    }));
  };

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

  const exerciseStats = useMemo(() => {
    const now = new Date();
    const start = new Date();
    let totalDaysInPeriod = 0;

    if (view === "week") {
      start.setDate(now.getDate() - 7 + offset * 7);
      totalDaysInPeriod = 7;
    } else if (view === "month") {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      totalDaysInPeriod = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      ).getDate();
    } else {
      totalDaysInPeriod = 365;
    }

    if (filteredData.length === 0) {
      return {
        yes: 0,
        no: 0,
        unrecorded: totalDaysInPeriod,
        percentage: 0,
      };
    }

    const yesCount = filteredData.filter((d) => d.worked_out).length;
    const noCount = filteredData.filter((d) => !d.worked_out).length;
    const unrecordedCount = totalDaysInPeriod - filteredData.length;
    const percentage = Math.round((yesCount / filteredData.length) * 100);

    return {
      yes: yesCount,
      no: noCount,
      unrecorded: unrecordedCount,
      percentage,
    };
  }, [filteredData, view, offset]);

  return (
    <div className="h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden lg:pt-24">
      {/* Mobile Header */}
      <header className="lg:hidden p-4 flex items-center justify-between bg-white dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
          Insights
        </h1>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-900/50 flex items-center justify-center hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-all"
        >
          <Filter size={18} className="text-brand-600 dark:text-brand-400" />
        </button>
      </header>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {filterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-30 top-0"
            />
            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl p-6 z-30 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex flex-col gap-6">
                {/* Handle Bar */}
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    Filter Analytics
                  </h3>
                </div>

                {/* View Toggle */}
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-widest uppercase font-semibold mb-3">
                    Time Period
                  </p>
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 shadow-inner">
                    {(["week", "month", "year"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setView(v);
                          setOffset(0);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-black transition-all tracking-widest flex-1 ${
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

                {/* Date Navigation */}
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-widest uppercase font-semibold mb-3">
                    Range
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOffset(offset - 1)}
                      className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      <ChevronLeft
                        size={18}
                        className="text-zinc-600 dark:text-zinc-400"
                      />
                    </button>
                    <span className="font-black text-sm tracking-widest flex-1 text-center uppercase text-zinc-600 dark:text-zinc-300">
                      {getPeriodLabel}
                    </span>
                    <button
                      onClick={() => setOffset(offset + 1)}
                      className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      <ChevronRight
                        size={18}
                        className="text-zinc-600 dark:text-zinc-400"
                      />
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full py-3 bg-zinc-900 dark:bg-brand-600 text-white font-black rounded-2xl hover:bg-zinc-800 dark:hover:bg-brand-700 transition-all tracking-widest uppercase text-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Controls Section - HIDDEN */}
      {/* Controls now integrated into navbar */}

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-8 scrollbar-hide pb-20 lg:pb-8">
        {/* Mood Trend - Full Width */}
        <section className="bg-white dark:bg-zinc-900 p-4 md:p-8 rounded-4xl shadow-lg border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-2 h-8 bg-linear-to-b from-brand-500 to-brand-600 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-1 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-linear-to-r from-brand-600 to-brand-500 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
                    Mood Trend
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-900/30">
                    <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black tracking-widest text-brand-700 dark:text-brand-300 uppercase">
                      AVG: {averageMood}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wide uppercase font-semibold">
                  {getPeriodLabel}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleGraph("mood")}
              className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronDown
                size={18}
                className={`text-zinc-600 dark:text-zinc-400 transition-transform ${
                  collapsedGraphs.mood ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <AnimatePresence>
            {!collapsedGraphs.mood && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-80 w-full min-w-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorMood"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0.1}
                        />
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
                      cursor={{
                        stroke: "#6366f1",
                        strokeWidth: 2,
                        opacity: 0.3,
                      }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alcohol Consumption */}
          <section className="bg-white dark:bg-zinc-900 p-4 md:p-8 rounded-4xl shadow-lg border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-xl font-black tracking-tight">
                  Alcohol Intake
                </h2>
              </div>
              <button
                onClick={() => toggleGraph("alcohol")}
                className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ChevronDown
                  size={18}
                  className={`text-zinc-600 dark:text-zinc-400 transition-transform ${
                    collapsedGraphs.alcohol ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <AnimatePresence>
              {!collapsedGraphs.alcohol && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-64 w-full min-w-0"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
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
                        tick={{
                          fontSize: 10,
                          fontWeight: 700,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 700,
                          fill: "#94a3b8",
                        }}
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
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Exercise Activity */}
          <section className="bg-white dark:bg-zinc-900 p-4 md:p-8 rounded-4xl shadow-lg border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h2 className="text-xl font-black tracking-tight">
                  Exercise Activity
                </h2>
              </div>
              <button
                onClick={() => toggleGraph("exercise")}
                className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ChevronDown
                  size={18}
                  className={`text-zinc-600 dark:text-zinc-400 transition-transform ${
                    collapsedGraphs.exercise ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <AnimatePresence>
              {!collapsedGraphs.exercise && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-64 w-full min-w-0 flex flex-col items-center justify-center"
                >
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-black text-emerald-500 mb-2">
                        {exerciseStats.percentage}%
                      </div>
                      <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                        Active Days
                      </div>
                    </div>
                    <div className="w-px h-24 bg-zinc-200 dark:bg-zinc-800" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-bold">
                          Yes: {exerciseStats.yes}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-sm font-bold">
                          No: {exerciseStats.no}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" />
                        <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
                          Unrecorded: {exerciseStats.unrecorded}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
