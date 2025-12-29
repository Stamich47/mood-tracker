"use client";

import { ReactNode } from "react";
import { InsightsProvider } from "@/contexts/InsightsContext";
import Navigation from "./Navigation";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <InsightsProvider>
      <Navigation />
      {children}
    </InsightsProvider>
  );
}
