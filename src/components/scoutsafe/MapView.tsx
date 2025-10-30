"use client";

import { useMemo } from "react";
import { useScoutSafe } from "@/contexts/ScoutSafeContext";

export default function MapView() {
  const { campDetails } = useScoutSafe();

  const lat = campDetails?.lat ?? 45.0;
  const lng = campDetails?.lng ?? 9.0;

  if (!campDetails) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center text-muted-foreground p-4">
          <h3 className="font-semibold text-lg mb-2">Dettagli del campo mancanti</h3>
          <p className="text-sm">I dettagli del campo non sono disponibili al momento.</p>
        </div>
      </div>
    );
  }

  // Use OpenStreetMap embedded map to avoid adding extra runtime dependencies.
  const zoom = 14;
  const bboxDelta = 0.02; // small bbox around marker
  const left = lng - bboxDelta;
  const right = lng + bboxDelta;
  const top = lat + bboxDelta;
  const bottom = lat - bboxDelta;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="h-full w-full">
      <iframe
        title="OpenStreetMap"
        src={src}
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
