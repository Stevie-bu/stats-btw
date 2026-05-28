"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import cantons from "@/data/ch-cantons.json";
import municipalities from "@/data/ch-municipalities.json";
import mapPoints from "@/data/betriebe-map.json";

interface MapBetrieb {
  name: string;
  plz: string;
  ort: string;
  ma: number;
  lat: number;
  lon: number;
}

function formatSwiss(n: number): string {
  const s = Math.round(n).toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("\u2019");
}

function getRadius(ma: number): number {
  if (ma > 5000) return 12;
  if (ma > 1000) return 9;
  if (ma > 500) return 7;
  if (ma > 200) return 5;
  return 3.5;
}

function getSizeLabel(ma: number): string {
  if (ma > 5000) return "mehr 5\u2019000 MA";
  if (ma > 1000) return "bis 5\u2019000 MA";
  if (ma > 500) return "bis 1\u2019000 MA";
  if (ma > 200) return "bis 500 MA";
  return "bis 200 MA";
}

/* Fit map to Switzerland bounds */
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

/* Reset zoom button */
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

/* Custom cluster icon sized by total MA */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const markers = cluster.getAllChildMarkers();
  const count = markers.length;
  // Sum MA from marker options (stored as custom property)
  let totalMa = 0;
  for (const m of markers) {
    totalMa += (m.options as unknown as { ma?: number }).ma || 0;
  }
  // Size: log scale of total MA, min 30px, max 70px
  const logMa = Math.log10(Math.max(totalMa, 1));
  const size = Math.round(Math.min(Math.max(30 + (logMa / 6) * 40, 30), 70));
  const innerSize = Math.round(size * 0.75);
  const offset = Math.round((size - innerSize) / 2);
  const fontSize = size < 40 ? 11 : size < 55 ? 13 : 15;

  return L.divIcon({
    html: `<div style="width:${innerSize}px;height:${innerSize}px;margin:${offset}px;border-radius:50%;background:rgba(250,127,223,0.85);color:white;font-weight:700;font-size:${fontSize}px;display:flex;align-items:center;justify-content:center;line-height:1">${count}</div>`,
    className: "marker-cluster",
    iconSize: L.point(size, size),
  });
}

const LEGEND = [
  { label: "bis 200 MA", radius: 3.5 },
  { label: "bis 500 MA", radius: 5 },
  { label: "bis 1\u2019000 MA", radius: 7 },
  { label: "bis 5\u2019000 MA", radius: 9 },
  { label: "mehr 5\u2019000 MA", radius: 12 },
];

export function SwissMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-neutral-200 rounded-2xl animate-pulse" />
    );
  }

  const data = mapPoints as MapBetrieb[];

  return (
    <div className="relative">
      <style>{`
        .marker-cluster {
          border-radius: 50% !important;
          background: rgba(250, 127, 223, 0.3) !important;
        }
        .marker-cluster div {
          border-radius: 50% !important;
          background: rgba(250, 127, 223, 0.85) !important;
          color: white !important;
          font-weight: 700 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          line-height: 1 !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important;
        }
        .leaflet-popup-tip {
          box-shadow: none !important;
        }
      `}</style>

      <MapContainer
        center={[46.82, 8.23]}
        zoom={9}
        minZoom={8}
        maxZoom={15}
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

        {/* Municipalities – finer white borders */}
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={municipalities as any}
          style={() => ({
            fillColor: "#32a7ff",
            fillOpacity: 0.15,
            color: "#ffffff",
            weight: 0.5,
            opacity: 0.5,
          })}
        />

        {/* Canton boundaries – thicker white borders */}
        <GeoJSON
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={cantons as any}
          style={() => ({
            fillColor: "#32a7ff",
            fillOpacity: 0.25,
            color: "#ffffff",
            weight: 2,
            opacity: 0.9,
          })}
        />

        {/* Clustered Betriebe dots */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={25}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          zoomToBoundsOnClick
          iconCreateFunction={createClusterIcon}
        >
          {data.map((b, i) => {
            const radius = getRadius(b.ma);
            return (
              <CircleMarker
                key={`${b.plz}-${i}`}
                center={[b.lat, b.lon]}
                radius={radius}
                // Store MA on marker for cluster sizing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...({ ma: b.ma } as any)}
                pathOptions={{
                  fillColor: "#fa7fdf",
                  fillOpacity: 0.7,
                  color: "#ffffff",
                  weight: 1,
                  opacity: 0.9,
                }}
              >
                <Popup>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      minWidth: 180,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        margin: "0 0 4px",
                      }}
                    >
                      {b.name}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#666",
                        margin: "0 0 2px",
                      }}
                    >
                      {b.plz} {b.ort}
                    </p>
                    <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
                      {formatSwiss(b.ma)} Mitarbeitende
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>

        <ResetZoom />
      </MapContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 sm:mt-6">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg
              width={item.radius * 2 + 4}
              height={item.radius * 2 + 4}
            >
              <circle
                cx={item.radius + 2}
                cy={item.radius + 2}
                r={item.radius}
                fill="#fa7fdf"
                fillOpacity={0.7}
                stroke="#ffffff"
                strokeWidth={1}
              />
            </svg>
            <span className="text-xs sm:text-sm text-black/50">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
