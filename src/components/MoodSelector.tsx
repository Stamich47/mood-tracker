"use client";

import React from "react";
import { motion } from "framer-motion";

interface MoodSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

const moods = [
  { value: 1, color: "bg-zinc-900 dark:bg-zinc-950", label: "Awful" },
  { value: 2, color: "bg-rose-500", label: "Bad" },
  { value: 3, color: "bg-amber-400", label: "Okay" },
  { value: 4, color: "bg-emerald-400", label: "Good" },
  { value: 5, color: "bg-emerald-600", label: "Great" },
];

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
        How are you feeling?
      </div>
      <div className="flex justify-between gap-2 px-2 py-3">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(mood.value)}
            className={`flex-1 aspect-square max-w-16 rounded-2xl transition-all duration-300 ${
              mood.color
            } ${
              value === mood.value
                ? "ring-4 ring-brand-500/40 scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-10"
                : "opacity-50 hover:opacity-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            }`}
            title={mood.label}
          />
        ))}
      </div>
    </div>
  );
}
