"use client";

import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cantons from "@/data/ch-cantons.json";
import municipalities from "@/data/ch-municipalities.json";
import opportunityData from "@/data/muni-opportunity.json";

type MuniData = Record<
  string,
  { name: string; population: number; participating: boolean; betriebe: number }
>;
const data = opportunityData as MuniData;

/* Pink intensity for non-participating by population */
const PINK_STEPS = [
  { min: 0, max: 1000, color: "#fde0f4" },
  { min: 1000, max: 5000, color: "#f9b4e2" },
  { min: 5000, max: 15000, color: "#fa7fdf" },
  { min: 15000, max: 30000, color: "#d94fbf" },
  { min: 30000, max: 999999, color: "#a8208f" },
];
const PARTICIPATING_COLOR = "#32a7ff";
const NO_DATA_COLOR = "#e8e8e8";

function getColor(entry: MuniData[string] | undefined): string {
  if (!entry || entry.population === 0) return NO_DATA_COLOR;
  if (entry.participating) return PARTICIPATING_COLOR;
  const pop = entry.population;
  for (const step of PINK_STEPS) {
    if (pop >= step.min && pop < step.max) return step.color;
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

export function OpportunityMap() {
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<{
    name: string;
    population: number;
    participating: boolean;
    betriebe: number;
  } | null>(null);

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
          if (entry) setInfo(entry);
          else setInfo(null);
        },
        mouseover: (e: L.LeafletMouseEvent) => {
          (e.target as L.Path).setStyle({
            weight: 2,
            color: "#000",
            fillOpacity: 0.85,
          });
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          (e.target as L.Path).setStyle({
            weight: 0.5,
            color: "#ffffff",
            fillOpacity: 0.75,
          });
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
      fillColor: getColor(entry),
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
            fillColor: "transparent",
            fillOpacity: 0,
            color: "#ffffff",
            weight: 2,
            opacity: 0.9,
          })}
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
          <p className="font-bold text-sm text-black">{info.name}</p>
          {info.participating ? (
            <>
              <p className="text-lg font-bold text-brand-blue mt-1">
                Nimmt teil
              </p>
              <p className="text-xs text-black/50">
                {info.betriebe} Betrieb{info.betriebe > 1 ? "e" : ""} ·{" "}
                {formatSwiss(info.population)} Einwohner
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-brand-pink mt-1">
                Keine Teilnahme
              </p>
              <p className="text-xs text-black/50">
                {formatSwiss(info.population)} Einwohner
              </p>
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: PARTICIPATING_COLOR }}
          />
          <span className="text-xs sm:text-sm text-black/50">
            Nimmt teil
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#fde0f4" }}
          />
          <span className="text-xs sm:text-sm text-black/50">
            &lt;1&apos;000 Einw.
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#fa7fdf" }}
          />
          <span className="text-xs sm:text-sm text-black/50">
            5&apos;000–15&apos;000
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#a8208f" }}
          />
          <span className="text-xs sm:text-sm text-black/50">
            &gt;30&apos;000 Einw.
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: NO_DATA_COLOR }}
          />
          <span className="text-xs sm:text-sm text-black/50">
            Keine Daten
          </span>
        </div>
      </div>
    </div>
  );
}
