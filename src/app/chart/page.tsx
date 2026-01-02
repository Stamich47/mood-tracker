"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import HistoryGrid from "@/components/HistoryGrid";
import MobileHistoryGrid from "@/components/MobileHistoryGrid";
import ActivitiesGrid from "@/components/ActivitiesGrid";
import DesktopCalendarView from "@/components/DesktopCalendarView";
import Navigation from "@/components/Navigation";
import Modal from "@/components/Modal";
import TrackerForm from "@/components/TrackerForm";
import { useSetChart } from "@/contexts/ChartContext";
import type { Log } from "../../types";
import { format, parseISO } from "date-fns";
import { Beer, Dumbbell, Smile, Edit2, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ChartPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"mood" | "workout" | "alcohol">(
    "mood"
  );
  const [mobileMode, setMobileMode] = useState<"month" | "year">("month");
  const [chartView, setChartView] = useState<"grid" | "calendar">("grid");
  const setChartControls = useSetChart();
  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    return data;
  }, [supabase]);

  useEffect(() => {
    fetchLogs().then((data) => {
      if (data) setLogs(data);
      setLoading(false);
    });
  }, [fetchLogs]);

  // Update context with current state
  useEffect(() => {
    if (setChartControls) {
      setChartControls({
        view: mobileView,
        chartView: chartView,
        onViewChange: (v: "mood" | "workout" | "alcohol") => {
          setMobileView(v);
        },
        onChartViewChange: (v: "grid" | "calendar") => {
          setChartView(v);
        },
      });
    }
  }, [mobileView, chartView, setChartControls]);

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsDetailPopupOpen(true);
  };

  const handleDeleteEntry = async () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("daily_logs")
      .delete()
      .eq("user_id", user.id)
      .eq("date", selectedDate);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    // Refetch logs after deletion
    setTimeout(() => {
      fetchLogs().then((data) => {
        if (data) setLogs(data);
      });
    }, 100);
    setIsDetailPopupOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  const selectedLog = logs.find((l) => l.date === selectedDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="h-dvh bg-white dark:bg-zinc-950 overflow-hidden flex flex-col">
      <div className="w-full px-4 lg:px-6 py-4 lg:pt-24 lg:pb-6 flex-1 flex flex-col min-h-0 pb-24">
        {/* Mobile Header */}
        <header className="mb-4 lg:mb-0 lg:hidden shrink-0">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-0.5">
            Analytics
          </p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Yearly Progress
          </h1>
        </header>

        {/* Mobile Controls: metric icons + mode toggle */}
        <div className="lg:hidden mb-4 shrink-0 w-full px-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setMobileView("mood")}
                className={`p-2 rounded-md transition-all ${
                  mobileView === "mood"
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
                aria-label="Mood"
                title="Mood"
              >
                <Smile size={14} />
              </button>
              <button
                onClick={() => setMobileView("workout")}
                className={`p-2 rounded-md transition-all ${
                  mobileView === "workout"
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
                aria-label="Workout"
                title="Workout"
              >
                <Dumbbell size={14} />
              </button>
              <button
                onClick={() => setMobileView("alcohol")}
                className={`p-2 rounded-md transition-all ${
                  mobileView === "alcohol"
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-brand-600 dark:text-brand-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
                aria-label="Alcohol"
                title="Alcohol"
              >
                <Beer size={14} />
              </button>
            </div>

            {/* Monthly/Yearly Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setMobileMode("month")}
                className={`px-3 py-1 rounded-md text-[10px] font-black ${
                  mobileMode === "month"
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-zinc-900 dark:text-white"
                    : "text-zinc-400"
                }`}
                aria-label="Monthly view"
                title="Monthly view"
              >
                Monthly
              </button>
              <button
                onClick={() => setMobileMode("year")}
                className={`px-3 py-1 rounded-md text-[10px] font-black ${
                  mobileMode === "year"
                    ? "bg-white dark:bg-zinc-700 shadow-premium text-zinc-900 dark:text-white"
                    : "text-zinc-400"
                }`}
                aria-label="Yearly view"
                title="Yearly view"
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Single Chart Display */}
        <div className="flex min-h-0 flex-1 flex-col w-full lg:w-full mx-auto px-2 lg:px-0 overflow-hidden">
          {mobileView === "mood" && (
            <>
              {/* Desktop view */}
              <div className="hidden lg:flex lg:h-full lg:flex-1">
                <div className="flex-1 min-h-0">
                  {chartView === "grid" ? (
                    <HistoryGrid
                      logs={logs}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  ) : (
                    <DesktopCalendarView
                      logs={logs}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      metric="mood"
                    />
                  )}
                </div>
              </div>
              {/* Mobile monthly calendar view */}
              <div className="lg:hidden flex-1 min-h-0">
                <MobileHistoryGrid
                  logs={logs}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  metric="mood"
                  viewMode={mobileMode}
                />
              </div>
            </>
          )}

          {(mobileView === "workout" || mobileView === "alcohol") && (
            <>
              <div className="hidden lg:flex lg:h-full lg:flex-1">
                <div className="flex-1 min-h-0">
                  {chartView === "grid" ? (
                    <ActivitiesGrid
                      logs={logs}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      activityType={
                        mobileView === "workout" ? "workout" : "alcohol"
                      }
                    />
                  ) : (
                    <DesktopCalendarView
                      logs={logs}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      metric={mobileView === "workout" ? "workout" : "alcohol"}
                    />
                  )}
                </div>
              </div>
              <div className="lg:hidden flex-1 min-h-0">
                <MobileHistoryGrid
                  logs={logs}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  metric={mobileView === "workout" ? "workout" : "alcohol"}
                  viewMode={mobileMode}
                />
              </div>
            </>
          )}
        </div>

        {/* Detail Popup Overlay */}
        <AnimatePresence>
          {isDetailPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDetailPopupOpen(false)}
                className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-4xl shadow-premium border border-slate-100 dark:border-zinc-800 p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                      {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Daily Summary
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsDetailPopupOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-brand-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    {selectedLog && (
                      <button
                        onClick={handleDeleteEntry}
                        className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => setIsDetailPopupOpen(false)}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {selectedLog ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                      <div
                        className={`p-2 rounded-xl ${
                          moodColors[selectedLog.mood]
                        } bg-opacity-20`}
                      >
                        <Smile
                          className="w-5 h-5"
                          style={{
                            color: moodColors[selectedLog.mood].replace(
                              "bg-",
                              ""
                            ),
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Mood
                        </p>
                        <p className="text-sm font-bold">
                          {moodLabels[selectedLog.mood]}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
                          <Dumbbell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Workout
                          </p>
                          <p className="text-sm font-bold">
                            {selectedLog.worked_out ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                          <Beer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Alcohol
                          </p>
                          <p className="text-sm font-bold">
                            {selectedLog.drinks}{" "}
                            {selectedLog.drinks === 1 ? "drink" : "drinks"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Exercises
                      </p>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800 min-h-20">
                        {selectedLog.exercises &&
                        selectedLog.exercises.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                            {selectedLog.exercises.map((ex, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-zinc-700 shadow-sm"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400 italic text-xs">
                            No exercises recorded
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedLog.notes && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Notes
                        </p>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                            {selectedLog.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-300 dark:text-zinc-700">
                    <Smile className="w-10 h-10 mb-3 opacity-20" />
                    <p className="font-bold text-sm">No data for this day</p>
                    <button
                      onClick={() => {
                        setIsDetailPopupOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-xl text-xs font-black tracking-widest shadow-soft hover:bg-brand-700 transition-all"
                    >
                      ADD ENTRY
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          title={`Edit Entry: ${format(parseISO(selectedDate), "MMM do")}`}
        >
          <TrackerForm
            date={selectedDate}
            initialData={selectedLog}
            onSaveSuccess={() => {
              // Refetch logs immediately after save, with a small delay to ensure DB is updated
              setTimeout(() => {
                fetchLogs().then((data) => {
                  if (data) setLogs(data);
                });
              }, 100);
              setIsEditModalOpen(false);
            }}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          title="Delete Entry"
        >
          <div className="space-y-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete the entry for{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {format(parseISO(selectedDate), "MMMM d, yyyy")}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg font-semibold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors shadow-soft"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <Navigation />
    </main>
  );
}
