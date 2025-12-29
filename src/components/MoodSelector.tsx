"use client";

import React from "react";
import { motion } from "framer-motion";

interface MoodSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

const moods = [
  {
    value: 1,
    color: "bg-linear-to-br from-red-500 to-red-600",
    label: "Awful",
    emoji: "😫",
    hoverColor: "hover:from-red-400 hover:to-red-500",
  },
  {
    value: 2,
    color: "bg-linear-to-br from-orange-400 to-orange-500",
    label: "Bad",
    emoji: "😔",
    hoverColor: "hover:from-orange-300 hover:to-orange-400",
  },
  {
    value: 3,
    color: "bg-linear-to-br from-yellow-400 to-yellow-500",
    label: "Okay",
    emoji: "😐",
    hoverColor: "hover:from-yellow-300 hover:to-yellow-400",
  },
  {
    value: 4,
    color: "bg-linear-to-br from-green-400 to-green-500",
    label: "Good",
    emoji: "😊",
    hoverColor: "hover:from-green-300 hover:to-green-400",
  },
  {
    value: 5,
    color: "bg-linear-to-br from-green-500 to-green-600",
    label: "Great",
    emoji: "😄",
    hoverColor: "hover:from-green-400 hover:to-green-500",
  },
];

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 tracking-wide px-1">
        How are you feeling today?
      </div>
      <div className="flex justify-between gap-3 px-1">
        {moods.map((mood, index) => (
          <div
            key={mood.value}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onChange(mood.value)}
              className={`
                w-full aspect-square max-w-14 rounded-2xl transition-all duration-300 relative overflow-hidden group
                ${mood.color} ${value !== mood.value ? mood.hoverColor : ""}
                ${
                  value === mood.value
                    ? "ring-4 ring-brand-500/60 shadow-[0_10px_28px_rgba(99,102,241,0.35)]"
                    : "opacity-70 hover:opacity-100 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400
              `}
              title={mood.label}
            >
              <span className="text-lg filter drop-shadow-md">
                {mood.emoji}
              </span>
              {value === mood.value && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 rounded-2xl ring-2 ring-white/40"
                />
              )}
            </motion.button>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{
                opacity: value === mood.value ? 1 : 0.6,
                scale: value === mood.value ? 1.05 : 1,
              }}
              className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${
                value === mood.value
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {mood.label.toUpperCase()}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
