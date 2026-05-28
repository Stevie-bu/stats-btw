"use client";

import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cantons from "@/data/ch-cantons.json";
import municipalities from "@/data/ch-municipalities.json";
import beteiligungData from "@/data/muni-beteiligung.json";

type BeteiligungMap = Record<string, { avg: number; name: string; count: number }>;
const data = beteiligungData as BeteiligungMap;

/* 5 color steps from light to dark Picton Blue */
const STEPS = [
  { min: 0, max: 5, color: "#c5e7ff", label: "0–5%" },
  { min: 5, max: 15, color: "#7ec8ff", label: "5–15%" },
  { min: 15, max: 30, color: "#32a7ff", label: "15–30%" },
  { min: 30, max: 50, color: "#1a7fd4", label: "30–50%" },
  { min: 50, max: 200, color: "#0a5a9e", label: ">50%" },
];
const NO_DATA_COLOR = "#e0e0e0";

function getColor(avg: number | undefined): string {
  if (avg === undefined) return NO_DATA_COLOR;
  for (const step of STEPS) {
    if (avg >= step.min && avg < step.max) return step.color;
  }
  return STEPS[STEPS.length - 1].color;
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [45.7, 5.8],
        [47.95, 10.6],
      ],
      { padding: [30, 30] }
    );
  }, [map]);
  return null;
}

function ResetZoom() {
  const map = useMap();
  return (
    <button
      onClick={() =>
        map.fitBounds(
          [
            [45.7, 5.8],
            [47.95, 10.6],
          ],
          { padding: [30, 30] }
        )
      }
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        color: "#333",
      }}
    >
      Zurücksetzen
    </button>
  );
}

export function ChoroplethMap() {
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<{ name: string; avg: number; count: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onEachMunicipality = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any, layer: L.Layer) => {
      const id = String(feature.properties?.id || feature.id || "");
      const entry = data[id];

      layer.on({
        click: () => {
          if (entry) {
            setInfo({ name: entry.name, avg: entry.avg, count: entry.count });
          } else {
            setInfo(null);
          }
        },
      });
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const muniStyle = useCallback((feature: any) => {
    const id = String(feature?.properties?.id || feature?.id || "");
    const entry = data[id];
    return {
      fillColor: getColor(entry?.avg),
      fillOpacity: 0.75,
      color: "#ffffff",
      weight: 0.5,
      opacity: 0.6,
    };
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] lg:h-[550px] bg-neutral-200 rounded-2xl animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={[46.82, 8.23]}
        zoom={9}
        minZoom={8}
        maxZoom={14}
        scrollWheelZoom={true}
        style={{
          height: "550px",
          width: "100%",
          borderRadius: 16,
          background: "#f8f8f8",
        }}
        zoomControl={false}
        attributionControl={false}
      >
        <FitBounds />

        {/* Municipalities colored by beteiligung */}
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={municipalities as any}
          style={muniStyle}
          onEachFeature={onEachMunicipality}
        />

        {/* Canton borders on top */}
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={cantons as any}
          style={() => ({
            fillColor: "transparent",
            fillOpacity: 0,
            color: "#ffffff",
            weight: 2,
            opacity: 0.9,
          })}
          interactive={false}
        />

        <ResetZoom />
      </MapContainer>

      {/* Info box on click */}
      {info && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-3 max-w-[220px]">
          <button
            onClick={() => setInfo(null)}
            className="absolute top-2 right-3 text-black/40 hover:text-black text-sm"
          >
            ✕
          </button>
          <p className="font-bold text-sm text-black">{info.name}</p>
          <p className="text-2xl font-bold text-brand-blue mt-1">{info.avg}%</p>
          <p className="text-xs text-black/50 mt-0.5">
            Ø Beteiligung · {info.count} Betrieb{info.count > 1 ? "e" : ""}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
        {STEPS.map((step) => (
          <div key={step.label} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: step.color }}
            />
            <span className="text-xs sm:text-sm text-black/50">{step.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: NO_DATA_COLOR }}
          />
          <span className="text-xs sm:text-sm text-black/50">Keine Daten</span>
        </div>
      </div>
    </div>
  );
}
