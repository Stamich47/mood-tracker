"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  ReactNode as ReactNodeType,
} from "react";

interface ChartContextType {
  view: "mood" | "workout" | "alcohol";
  chartView: "grid" | "calendar";
  onViewChange: (view: "mood" | "workout" | "alcohol") => void;
  onChartViewChange: (chartView: "grid" | "calendar") => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

const ChartSetContext = createContext<
  ((value: ChartContextType) => void) | undefined
>(undefined);

export function ChartProvider({ children }: { children: ReactNodeType }) {
  const [controls, setControls] = useState<ChartContextType | undefined>();

  return (
    <ChartSetContext.Provider value={setControls}>
      <ChartContext.Provider value={controls}>{children}</ChartContext.Provider>
    </ChartSetContext.Provider>
  );
}

export function useChart() {
  return useContext(ChartContext);
}

export function useSetChart() {
  return useContext(ChartSetContext);
}
