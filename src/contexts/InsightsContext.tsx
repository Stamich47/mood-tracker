"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  ReactNode as ReactNodeType,
} from "react";

interface InsightsContextType {
  view: "week" | "month" | "year";
  offset: number;
  getPeriodLabel: string;
  onViewChange: (view: "week" | "month" | "year") => void;
  onOffsetChange: (offset: number) => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(
  undefined
);

const InsightsSetContext = createContext<
  ((value: InsightsContextType) => void) | undefined
>(undefined);

export function InsightsProvider({ children }: { children: ReactNodeType }) {
  const [controls, setControls] = useState<InsightsContextType | undefined>();

  return (
    <InsightsSetContext.Provider value={setControls}>
      <InsightsContext.Provider value={controls}>
        {children}
      </InsightsContext.Provider>
    </InsightsSetContext.Provider>
  );
}

export function useInsights() {
  return useContext(InsightsContext);
}

export function useSetInsights() {
  return useContext(InsightsSetContext);
}
