"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus } from "lucide-react";

interface WorkoutLoggerProps {
  workedOut: boolean;
  exercises: string[];
  onToggleWorkout: (val: boolean) => void;
  onUpdateExercises: (exercises: string[]) => void;
}

export default function WorkoutLogger({
  workedOut,
  exercises,
  onToggleWorkout,
  onUpdateExercises,
}: WorkoutLoggerProps) {
  const [newExercise, setNewExercise] = useState("");

  const addExercise = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newExercise.trim()) {
      onUpdateExercises([...exercises, newExercise.trim()]);
      setNewExercise("");
    }
  };

  const removeExercise = (index: number) => {
    onUpdateExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-between p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-27.5"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
            <Dumbbell size={16} className="text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
            Workout
          </span>
        </div>

        <div
          onClick={() => onToggleWorkout(!workedOut)}
          className="relative w-24 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg p-0.5 cursor-pointer border border-zinc-300 dark:border-zinc-700"
        >
          <motion.div
            animate={{ x: workedOut ? 44 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute top-0.5 left-0.5 w-1/2 h-8 bg-white dark:bg-zinc-900 rounded-md shadow-sm"
          />
          <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-black uppercase tracking-widest pointer-events-none z-10">
            <span
              className={
                workedOut
                  ? "text-zinc-500 dark:text-zinc-600"
                  : "text-white dark:text-white"
              }
            >
              No
            </span>
            <span
              className={
                workedOut
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-zinc-500 dark:text-zinc-600"
              }
            >
              Yes
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {workedOut && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addExercise()}
                  placeholder="Add exercise..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
                <button
                  onClick={() => addExercise()}
                  className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  <Plus size={16} />
                </button>
              </div>

              {exercises.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {exercises.map((ex, i) => (
                    <motion.span
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => removeExercise(i)}
                      className="px-2 py-1 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {ex}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
