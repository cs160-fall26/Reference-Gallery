"use client";

import { useEffect, useState } from "react";
import type { GeoPoint } from "@/lib/types";

type LocationMapProps = {
  location: GeoPoint;
};

export function LocationMap({ location }: LocationMapProps) {
  const [MapView, setMapView] = useState<React.ComponentType<{
    location: GeoPoint;
  }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("./location-map-inner").then((mod) => {
      if (!cancelled) setMapView(() => mod.LocationMapInner);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!MapView) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-[#ececec] font-mono text-xs text-black/50">
        Loading map…
      </div>
    );
  }

  return <MapView location={location} />;
}
