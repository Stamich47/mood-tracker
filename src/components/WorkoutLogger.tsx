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
        className="flex items-center justify-between p-4 md:p-5 rounded-3xl bg-linear-to-br from-zinc-50/80 to-zinc-100/60 dark:from-zinc-900/40 dark:to-zinc-800/30 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_10px_32px_rgba(0,0,0,0.35)] transition-all duration-300"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="p-2 md:p-3 bg-linear-to-br from-blue-100/70 to-blue-200/60 dark:from-blue-900/40 dark:to-blue-800/30 rounded-2xl shadow-sm shrink-0">
            <Dumbbell
              size={18}
              className="md:w-5 md:h-5 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Workout
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap truncate">
              Exercised today?
            </span>
          </div>
        </div>

        <button
          onClick={() => onToggleWorkout(!workedOut)}
          className="relative inline-flex h-8 md:h-10 w-20 md:w-24 items-center rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-300/50 dark:border-zinc-700/50 p-1 hover:border-zinc-400/60 dark:hover:border-zinc-600/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-all duration-200 shrink-0"
        >
          {/* Mobile Sliding button */}
          <motion.span
            animate={{ x: workedOut ? "calc(100% + 7px)" : 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
            }}
            className={`lg:hidden absolute h-6 md:h-8 w-8 md:w-10 rounded-lg shadow-md transition-colors duration-300 ${
              workedOut
                ? "bg-linear-to-br from-green-400 to-green-500"
                : "bg-white dark:bg-zinc-100"
            }`}
          />

          {/* Desktop Sliding button */}
          <motion.span
            animate={{ x: workedOut ? "calc(100% + 8px)" : 0 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
            }}
            className={`hidden lg:block absolute left-1 h-6 md:h-8 w-8 md:w-10 rounded-lg shadow-md transition-colors duration-300 ${
              workedOut
                ? "bg-linear-to-br from-green-400 to-green-500"
                : "bg-white dark:bg-zinc-100"
            }`}
          />

          {/* Background text showing both options */}
          <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none z-10">
            <span
              className={`text-xs font-bold transition-colors duration-300 ${
                !workedOut ? "text-black" : "text-zinc-500 dark:text-zinc-500"
              }`}
            >
              No
            </span>
            <span
              className={`text-xs font-bold transition-colors duration-300 ${
                workedOut ? "text-white" : "text-zinc-500 dark:text-zinc-500"
              }`}
            >
              Yes
            </span>
          </div>
        </button>
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
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
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
