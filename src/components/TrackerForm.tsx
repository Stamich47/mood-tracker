"use client";

import { useState } from "react";
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
}

export default function TrackerForm({
  date,
  initialData,
  onSaveSuccess,
}: TrackerFormProps) {
  const [mood, setMood] = useState<number | null>(initialData?.mood ?? null);
  const [workedOut, setWorkedOut] = useState(initialData?.worked_out ?? false);
  const [exercises, setExercises] = useState<string[]>(
    initialData?.exercises ?? []
  );
  const [drinks, setDrinks] = useState(initialData?.drinks ?? 0);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const supabase = createClient();

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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <MoodSelector value={mood} onChange={setMood} />

        <div className="grid grid-cols-2 gap-2 items-start">
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
            className="flex items-center justify-between p-3 bg-gradient-to-br from-zinc-50 to-zinc-50/50 dark:from-zinc-900/30 dark:to-zinc-900/10 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl">
                <StickyNote
                  size={16}
                  className="text-zinc-600 dark:text-zinc-400"
                />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  Daily Notes
                </h3>
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  {notes ? "Added" : "Optional"}
                </p>
              </div>
            </div>
            {isNotesOpen ? (
              <ChevronUp
                size={18}
                className="text-zinc-500 dark:text-zinc-400"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-zinc-500 dark:text-zinc-400"
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
                  className="w-full h-16 p-3 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
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
        className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shrink-0 flex items-center justify-center gap-2 ${
          showSuccess
            ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            : isSaving || mood === null
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
            : "bg-brand-600 text-white hover:bg-brand-700 shadow-premium active:scale-[0.98]"
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
