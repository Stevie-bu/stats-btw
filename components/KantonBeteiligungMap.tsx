"use client";

import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cantons from "@/data/ch-cantons.json";
import kantonData from "@/data/kanton-beteiligung.json";

type KantonEntry = { name: string; trimmed_mean: number; betriebe: number };
const data = kantonData as Record<string, KantonEntry>;

const KT_NAMES: Record<string, string> = {
  ZH:"Zürich",BE:"Bern",LU:"Luzern",UR:"Uri",SZ:"Schwyz",OW:"Obwalden",NW:"Nidwalden",
  GL:"Glarus",ZG:"Zug",FR:"Fribourg",SO:"Solothurn",BS:"Basel-Stadt",BL:"Basel-Landschaft",
  SH:"Schaffhausen",AR:"Appenzell A.Rh.",AI:"Appenzell I.Rh.",SG:"St. Gallen",GR:"Graubünden",
  AG:"Aargau",TG:"Thurgau",TI:"Tessin",VD:"Waadt",VS:"Wallis",NE:"Neuenburg",GE:"Genf",JU:"Jura",
};

/* Color scale: 7 blue shades based on Beteiligung */
const STEPS = [
  { min: 0, max: 15, color: "#e0f0ff", label: "<15%" },
  { min: 15, max: 20, color: "#c5e7ff", label: "15–20%" },
  { min: 20, max: 25, color: "#7ec8ff", label: "20–25%" },
  { min: 25, max: 30, color: "#32a7ff", label: "25–30%" },
  { min: 30, max: 35, color: "#1a7fd4", label: "30–35%" },
  { min: 35, max: 40, color: "#0a5a9e", label: "35–40%" },
  { min: 40, max: 100, color: "#062f5a", label: ">40%" },
];

function getColor(bfsId: string): string {
  const d = data[bfsId];
  if (!d) return "#e0e0e0";
  for (const step of STEPS) {
    if (d.trimmed_mean >= step.min && d.trimmed_mean < step.max) return step.color;
  }
  return STEPS[STEPS.length - 1].color;
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[45.8, 5.9], [47.85, 10.5]], { padding: [10, 10] });
  }, [map]);
  return null;
}

function ResetZoom() {
  const map = useMap();
  return (
    <button
      onClick={() => map.fitBounds([[45.8, 5.9], [47.85, 10.5]], { padding: [10, 10] })}
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

export function KantonBeteiligungMap() {
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<KantonEntry | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const onEachKanton = useCallback(
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
  const kantonStyle = useCallback((feature: any) => {
    const id = String(feature?.properties?.id || feature?.id || "");
    return {
      fillColor: getColor(id),
      fillOpacity: 0.85,
      color: "#ffffff",
      weight: 2,
      opacity: 0.9,
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
          data={cantons as any}
          style={kantonStyle}
          onEachFeature={onEachKanton}
        />
        <ResetZoom />
      </MapContainer>

      {/* Info box */}
      {info && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-3 max-w-[240px]">
          <button
            onClick={() => setInfo(null)}
            className="absolute top-2 right-3 text-black/40 hover:text-black text-sm"
          >
            ✕
          </button>
          <p className="font-bold text-sm text-black">
            {KT_NAMES[info.name] || info.name} ({info.name})
          </p>
          <p className="text-2xl font-bold text-brand-blue mt-1">
            {info.trimmed_mean}%
          </p>
          <p className="text-xs text-black/50">
            Trimmed Mean (10%) · {info.betriebe} Betriebe
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mt-4 sm:mt-6">
        <span className="text-xs sm:text-sm text-black/40">Tiefe Beteiligung</span>
        {STEPS.map((step) => (
          <div key={step.label} className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: step.color }} />
            <span className="text-xs sm:text-sm text-black/50">{step.label}</span>
          </div>
        ))}
        <span className="text-xs sm:text-sm text-black/40">Hohe Beteiligung</span>
      </div>
    </div>
  );
}
