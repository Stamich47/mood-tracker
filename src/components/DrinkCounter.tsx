"use client";

import React from "react";
import { motion } from "framer-motion";
import { Beer } from "lucide-react";

interface DrinkCounterProps {
  count: number;
  onChange: (count: number) => void;
}

export default function DrinkCounter({ count, onChange }: DrinkCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-between p-5 rounded-3xl bg-linear-to-br from-zinc-50/80 to-zinc-100/60 dark:from-zinc-900/40 dark:to-zinc-800/30 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_10px_32px_rgba(0,0,0,0.35)] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-linear-to-br from-amber-100/70 to-amber-200/60 dark:from-amber-900/40 dark:to-amber-800/30 rounded-2xl shadow-sm">
          <Beer size={20} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Alcohol
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Drinks consumed today
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(0, count - 1))}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 shadow-sm hover:shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
        >
          <span className="font-bold text-lg leading-none">−</span>
        </motion.button>
        <span className="text-xl font-black tracking-tight w-8 text-center text-zinc-900 dark:text-zinc-100">
          {count}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(count + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900 shadow-md hover:shadow-lg hover:from-zinc-700 hover:to-zinc-800 dark:hover:from-zinc-200 dark:hover:to-zinc-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
        >
          <span className="font-bold text-lg leading-none">+</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
