"use client";

import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cantons from "@/data/ch-cantons.json";
import municipalities from "@/data/ch-municipalities.json";
import potentialData from "@/data/muni-potential.json";

type PotentialEntry = {
  name: string;
  index: number;
  betriebe: number;
  expected: number;
  population: number;
  pop_density: number;
};

const data = potentialData as Record<string, PotentialEntry>;

/* 5 blue steps (positive = overperformer) + 5 pink steps (negative = underperformer) */
const BLUE_STEPS = [
  { min: 0, max: 25, color: "#c5e7ff", label: "0–25%" },
  { min: 25, max: 50, color: "#7ec8ff", label: "25–50%" },
  { min: 50, max: 100, color: "#32a7ff", label: "50–100%" },
  { min: 100, max: 200, color: "#1a7fd4", label: "100–200%" },
  { min: 200, max: 99999, color: "#062f5a", label: ">200%" },
];

const PINK_STEPS = [
  { min: -25, max: 0, color: "#fde0f4", label: "0–25%" },
  { min: -50, max: -25, color: "#f9b4e2", label: "25–50%" },
  { min: -70, max: -50, color: "#fa7fdf", label: "50–70%" },
  { min: -90, max: -70, color: "#d94fbf", label: "70–90%" },
  { min: -999, max: -90, color: "#a8208f", label: ">90%" },
];

const NO_DATA_COLOR = "#f0f0f0";

function getColor(bfsId: string): string {
  const d = data[bfsId];
  if (!d) return NO_DATA_COLOR;
  const idx = d.index;
  if (idx >= 0) {
    for (const step of BLUE_STEPS) {
      if (idx >= step.min && idx < step.max) return step.color;
    }
    return BLUE_STEPS[BLUE_STEPS.length - 1].color;
  }
  for (const step of PINK_STEPS) {
    if (idx >= step.min && idx < step.max) return step.color;
    }
  return PINK_STEPS[PINK_STEPS.length - 1].color;
}

function formatSwiss(n: number): string {
  const s = Math.round(n).toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("\u2019");
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[45.7, 5.8], [47.95, 10.6]], { padding: [30, 30] });
  }, [map]);
  return null;
}

function ResetZoom() {
  const map = useMap();
  return (
    <button
      onClick={() => map.fitBounds([[45.7, 5.8], [47.95, 10.6]], { padding: [30, 30] })}
      style={{
        position: "absolute", top: 10, right: 10, zIndex: 1000,
        background: "white", border: "1px solid #ddd", borderRadius: 8,
        padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#333",
      }}
    >
      Zurücksetzen
    </button>
  );
}

export function DensityMap() {
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<PotentialEntry | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const onEachMunicipality = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any, layer: L.Layer) => {
      const id = String(feature.properties?.id || feature.id || "");
      layer.on({
        click: () => { setInfo(data[id] || null); },
      });
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const muniStyle = useCallback((feature: any) => {
    const id = String(feature?.properties?.id || feature?.id || "");
    return {
      fillColor: getColor(id),
      fillOpacity: 0.8,
      color: "#ffffff",
      weight: 0.5,
      opacity: 0.6,
    };
  }, []);

  if (!mounted) {
    return <div className="w-full h-[400px] sm:h-[500px] lg:h-[550px] bg-neutral-200 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="relative">
      <MapContainer
        center={[46.82, 8.23]}
        zoom={9}
        minZoom={8}
        maxZoom={14}
        scrollWheelZoom={true}
        style={{ height: "550px", width: "100%", borderRadius: 16, background: "#f8f8f8" }}
        zoomControl={false}
        attributionControl={false}
      >
        <FitBounds />
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={municipalities as any}
          style={muniStyle}
          onEachFeature={onEachMunicipality}
        />
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={cantons as any}
          style={() => ({
            fillColor: "transparent", fillOpacity: 0,
            color: "#ffffff", weight: 2, opacity: 0.9,
          })}
          interactive={false}
        />
        <ResetZoom />
      </MapContainer>

      {/* Info box */}
      {info && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-3 max-w-[260px]">
          <button
            onClick={() => setInfo(null)}
            className="absolute top-2 right-3 text-black/40 hover:text-black text-sm"
          >
            ✕
          </button>
          <p className="font-bold text-sm text-black">{info.name}</p>
          <p className={`text-2xl font-bold mt-1 ${info.index >= 0 ? "text-brand-blue" : "text-brand-pink"}`}>
            {info.index > 0 ? "+" : ""}{info.index}%
          </p>
          <p className="text-xs text-black/50">
            {info.index > 0 ? "Überperformer" : info.index === 0 ? "Durchschnitt" : "Ungenutztes Potenzial"}
          </p>
          <div className="flex flex-col gap-1 mt-2 text-xs text-black/50">
            <span>{info.betriebe} Betriebe (erwartet: {info.expected})</span>
            <span>{formatSwiss(info.population)} Einw. · {formatSwiss(info.pop_density)} Einw./km²</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mt-4 sm:mt-6">
        <span className="text-xs sm:text-sm text-black/40">Potenzial</span>
        {[...PINK_STEPS].reverse().map((step) => (
          <div key={step.label} className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: step.color }} />
            <span className="text-[10px] sm:text-xs text-black/40">{step.label}</span>
          </div>
        ))}
        <span className="text-[10px] sm:text-xs text-black/30 mx-1">0</span>
        {BLUE_STEPS.map((step) => (
          <div key={step.label} className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: step.color }} />
            <span className="text-[10px] sm:text-xs text-black/40">{step.label}</span>
          </div>
        ))}
        <span className="text-xs sm:text-sm text-black/40">Überperformer</span>
      </div>
    </div>
  );
}
