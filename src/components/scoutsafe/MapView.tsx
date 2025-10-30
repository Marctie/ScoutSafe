"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useScoutSafe } from "@/contexts/ScoutSafeContext";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";

export default function MapView() {
  const { campDetails } = useScoutSafe();
  const position = { lat: campDetails.lat, lng: campDetails.lng };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center text-muted-foreground p-4">
          <h3 className="font-semibold text-lg mb-2">Chiave API di Google Maps Mancante</h3>
          <p className="text-sm">
            Aggiungi la tua chiave API di Google Maps al file .env.local per abilitare la funzionalità della mappa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        zoom={14}
        center={position}
        mapId={"scoutsafe-map"}
        disableDefaultUI={true}
        gestureHandling={'greedy'}
      >
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  );
}
