"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import type { TentStabilityOutput } from "@/ai/flows/tent-stability-simulation";
import type { SafetyRecommendationsOutput } from "@/ai/flows/dynamic-safety-recommendations";

type CampDetails = {
  campName: string;
  lat: number;
  lng: number;
};

type ScoutSafeContextType = {
  campDetails: CampDetails;
  setCampDetails: Dispatch<SetStateAction<CampDetails>>;
  tentSimResult: TentStabilityOutput | null;
  setTentSimResult: Dispatch<SetStateAction<TentStabilityOutput | null>>;
  dynamicRecResult: SafetyRecommendationsOutput | null;
  setDynamicRecResult: Dispatch<SetStateAction<SafetyRecommendationsOutput | null>>;
};

const ScoutSafeContext = createContext<ScoutSafeContextType | undefined>(undefined);

export function ScoutSafeProvider({ children }: { children: ReactNode }) {
  const [campDetails, setCampDetails] = useState<CampDetails>({
    campName: "Pine Ridge Camp",
    lat: 40.7128,
    lng: -74.006,
  });
  const [tentSimResult, setTentSimResult] = useState<TentStabilityOutput | null>(null);
  const [dynamicRecResult, setDynamicRecResult] = useState<SafetyRecommendationsOutput | null>(null);

  return (
    <ScoutSafeContext.Provider
      value={{
        campDetails,
        setCampDetails,
        tentSimResult,
        setTentSimResult,
        dynamicRecResult,
        setDynamicRecResult,
      }}
    >
      {children}
    </ScoutSafeContext.Provider>
  );
}

export function useScoutSafe() {
  const context = useContext(ScoutSafeContext);
  if (context === undefined) {
    throw new Error("useScoutSafe must be used within a ScoutSafeProvider");
  }
  return context;
}
