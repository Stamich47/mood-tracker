"use client";

import { useState, useRef } from "react";
import MoodSelector from "@/components/MoodSelector";
import WorkoutLogger from "@/components/WorkoutLogger";
import DrinkCounter from "@/components/DrinkCounter";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  StickyNote,
} from "lucide-react";

interface TrackerFormProps {
  date: string;
  initialData?: {
    mood: number | null;
    worked_out: boolean;
    exercises: string[];
    drinks: number;
    notes?: string;
  };
  onSaveSuccess?: () => void;
  onPreviousDay?: () => void;
  onNextDay?: () => void;
}

export default function TrackerForm({
  date,
  initialData,
  onSaveSuccess,
  onPreviousDay,
  onNextDay,
}: TrackerFormProps) {
  const [mood, setMood] = useState<number | null>(initialData?.mood ?? null);
  const [workedOut, setWorkedOut] = useState(initialData?.worked_out ?? false);
  const touchStartRef = useRef<number | null>(null);
  const [exercises, setExercises] = useState<string[]>(
    initialData?.exercises ?? []
  );
  const [drinks, setDrinks] = useState(initialData?.drinks ?? 0);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const supabase = createClient();

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    // Ignore touches that originate from inputs/textareas or buttons
    if (
      target &&
      (target.closest("input") ||
        target.closest("textarea") ||
        target.closest("button"))
    ) {
      touchStartRef.current = null;
      return;
    }

    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.closest("input") ||
        target.closest("textarea") ||
        target.closest("button"))
    ) {
      // Don't treat taps inside form controls as swipes
      touchStartRef.current = null;
      return;
    }

    const start = touchStartRef.current;
    const end = e.changedTouches[0].clientX;
    touchStartRef.current = null;

    if (start == null) return;

    const distance = start - end;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && onNextDay) {
      onNextDay();
    }
    if (isRightSwipe && onPreviousDay) {
      onPreviousDay();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to save.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("daily_logs").upsert(
      {
        user_id: user.id,
        date: date,
        mood,
        worked_out: workedOut,
        exercises,
        drinks,
        notes,
      },
      {
        onConflict: "user_id,date",
      }
    );

    if (error) {
      console.error("Error saving log:", error);
      alert("Failed to save: " + error.message);
    } else {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      if (onSaveSuccess) onSaveSuccess();
    }

    setIsSaving(false);
  };

  return (
    <div
      className="flex flex-col gap-5 touch-pan-y select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col gap-5">
        <MoodSelector value={mood} onChange={setMood} />

        <div className="flex flex-col gap-4">
          <WorkoutLogger
            workedOut={workedOut}
            exercises={exercises}
            onToggleWorkout={setWorkedOut}
            onUpdateExercises={setExercises}
          />

          <DrinkCounter count={drinks} onChange={setDrinks} />
        </div>

        {/* Notes Section */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="flex items-center justify-between p-4 md:p-5 rounded-3xl bg-linear-to-br from-zinc-50/80 to-zinc-100/60 dark:from-zinc-900/40 dark:to-zinc-800/30 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_10px_32px_rgba(0,0,0,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          >
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div className="p-2 md:p-3 bg-linear-to-br from-cyan-100/70 to-cyan-200/60 dark:from-cyan-900/40 dark:to-cyan-800/30 rounded-2xl shadow-sm shrink-0">
                <StickyNote
                  size={18}
                  className="md:w-5 md:h-5 text-cyan-600 dark:text-cyan-400"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Notes
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap truncate">
                  {notes ? "Added" : "Optional"}
                </p>
              </div>
            </div>
            {isNotesOpen ? (
              <ChevronUp
                size={18}
                className="text-zinc-500 dark:text-zinc-400 shrink-0"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-zinc-500 dark:text-zinc-400 shrink-0"
              />
            )}
          </button>

          <AnimatePresence>
            {isNotesOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How was your day?"
                  className="w-full h-16 p-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 hover:border-zinc-300/70 dark:hover:border-zinc-600/70 transition-all resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving || mood === null}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide uppercase transition-all shrink-0 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500/50 ${
          showSuccess
            ? "bg-linear-to-r from-green-400 to-green-500 text-white shadow-[0_8px_24px_rgba(34,197,94,0.35)]"
            : isSaving || mood === null
            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
            : "bg-linear-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-[0_8px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_32px_rgba(99,102,241,0.4)] active:scale-[0.98]"
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            SAVING...
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            SAVED!
          </>
        ) : (
          "SAVE ENTRY"
        )}
      </motion.button>
    </div>
  );
}
