"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import HistoryGrid from "@/components/HistoryGrid";
import Navigation from "@/components/Navigation";
import Modal from "@/components/Modal";
import TrackerForm from "@/components/TrackerForm";
import type { Log } from "../../types";
import { format, parseISO } from "date-fns";
import { Beer, Dumbbell, Smile, Edit2, Trash2 } from "lucide-react";
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
    fetchLogs().then((data) => {
      if (data) setLogs(data);
    });
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
    <main className="h-dvh bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex flex-col">
      <div className="w-full px-4 md:px-6 py-4 md:pt-24 md:pb-6 flex-1 flex flex-col min-h-0 pb-24">
        {/* Mobile Header */}
        <header className="mb-4 md:mb-0 md:hidden shrink-0">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-0.5">
            Analytics
          </p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Yearly Progress
          </h1>
        </header>

        <div className="flex-1 min-h-0 flex flex-col">
          <HistoryGrid
            logs={logs}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
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
                          <div className="flex flex-wrap gap-1.5">
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
