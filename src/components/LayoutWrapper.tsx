"use client";

import { ReactNode } from "react";
import { InsightsProvider } from "@/contexts/InsightsContext";
import { ChartProvider } from "@/contexts/ChartContext";
import Navigation from "./Navigation";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ChartProvider>
      <InsightsProvider>
        <Navigation />
        {children}
      </InsightsProvider>
    </ChartProvider>
  );
}
