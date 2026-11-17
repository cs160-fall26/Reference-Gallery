"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPoint } from "@/lib/types";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:9999px;background:#CCFF00;border:2px solid #111;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export function LocationMapInner({ location }: { location: GeoPoint }) {
  return (
    <div className="h-48 w-full overflow-hidden bg-[#ececec] [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-control-attribution]:text-[9px]">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={14}
        scrollWheelZoom={false}
        dragging
        zoomControl={false}
        attributionControl
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}
