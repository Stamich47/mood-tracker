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
      className="flex flex-col items-center justify-between p-4 border rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800 shadow-soft h-full min-h-27.5"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <Beer size={14} className="text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          Alcohol
        </span>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(0, count - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-zinc-500 shadow-sm transition-all"
        >
          -
        </motion.button>
        <span className="text-2xl font-black tracking-tighter w-6 text-center">
          {count}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(count + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-soft transition-all"
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
}
