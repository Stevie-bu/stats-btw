"use client";

import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { sanityClient } from "@/lib/sanity";
import Link from "next/link";

const SwissMap = lazy(() =>
  import("@/components/SwissMap").then((m) => ({ default: m.SwissMap }))
);
const ChoroplethMap = lazy(() =>
  import("@/components/ChoroplethMap").then((m) => ({ default: m.ChoroplethMap }))
);
const DensityMap = lazy(() =>
  import("@/components/DensityMap").then((m) => ({ default: m.DensityMap }))
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface YearData {
  year: number;
  teilnehmende: number;
  wachstumTeilnehmende?: string;
  betriebe: number;
  wachstumBetriebe?: string;
  teams?: number;
  totalKm?: number;
  co2?: number;
}

interface DauerData {
  label: string;
  anzahl: number;
  prozent: number;
  sortOrder?: number;
}

const YEAR_QUERY = `*[_type == "factsYear"] | order(year asc) {
  year, teilnehmende, wachstumTeilnehmende, betriebe, wachstumBetriebe, teams, totalKm, co2
}`;

const DAUER_QUERY = `*[_type == "factsDauer"] | order(sortOrder asc) {
  label, anzahl, prozent, sortOrder
}`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatSwiss(n: number): string {
  const s = Math.round(n).toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("\u2019");
}

const PIE_COLORS = ["#fa7fdf", "#32a7ff", "#7efaf3", "#fcff66", "#000000"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FactsAndFigures() {
  const [yearData, setYearData] = useState<YearData[]>([]);
  const [dauerData, setDauerData] = useState<DauerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<YearData[]>(YEAR_QUERY),
      sanityClient.fetch<DauerData[]>(DAUER_QUERY),
    ]).then(([years, dauer]) => {
      setYearData(years);
      setDauerData(dauer);
      setLoading(false);
    });
  }, []);

  const maxTeilnehmende = Math.max(...yearData.map((y) => y.teilnehmende), 1);

  /* Pie chart SVG */
  function renderPie(data: DauerData[]) {
    const total = data.reduce((sum, d) => sum + d.anzahl, 0);
    if (total === 0) return null;
    let cumulative = 0;
    const slices = data.map((d, i) => {
      const startAngle = (cumulative / total) * 360;
      cumulative += d.anzahl;
      const endAngle = (cumulative / total) * 360;
      return { ...d, startAngle, endAngle, color: PIE_COLORS[i % PIE_COLORS.length] };
    });

    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-[300px] sm:max-w-[360px]">
        {slices.map((slice) => {
          const startRad = ((slice.startAngle - 90) * Math.PI) / 180;
          const endRad = ((slice.endAngle - 90) * Math.PI) / 180;
          const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
          const x1 = 100 + 90 * Math.cos(startRad);
          const y1 = 100 + 90 * Math.sin(startRad);
          const x2 = 100 + 90 * Math.cos(endRad);
          const y2 = 100 + 90 * Math.sin(endRad);
          const midRad = ((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI / 180;
          const labelX = 100 + 55 * Math.cos(midRad);
          const labelY = 100 + 55 * Math.sin(midRad);

          return (
            <g key={slice.label}>
              <path
                d={`M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={slice.color}
              />
              <text
                x={labelX}
                y={labelY - 6}
                textAnchor="middle"
                fill="black"
                fontSize="11"
                fontWeight="700"
              >
                {slice.prozent}%
              </text>
              <text
                x={labelX}
                y={labelY + 8}
                textAnchor="middle"
                fill="black"
                fontSize="8"
                fontWeight="400"
              >
                {formatSwiss(slice.anzahl)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HEADER ============ */}
      <header className="bg-brand-pink">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-4 px-0 sm:px-4 lg:px-8 py-4">
            <Link href="/" className="shrink-0 size-16 sm:size-20 lg:size-[116px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/btw-logo.svg"
                alt="bike to work"
                className="size-full object-contain"
              />
            </Link>
            <div className="flex flex-1 items-center gap-2 sm:gap-4">
              <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-0">
                {[
                  { label: "Top Ten", href: "/", active: false },
                  { label: "Facts and Figures", href: "/facts-and-figures", active: true },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`h-10 sm:h-12 rounded-full px-3 sm:px-5 lg:px-6 text-sm sm:text-base lg:text-xl font-medium whitespace-nowrap transition-colors flex items-center ${
                      item.active
                        ? "bg-black text-brand-white"
                        : "bg-brand-white text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="hidden sm:flex items-center gap-1 text-base lg:text-xl font-medium text-black shrink-0">
                <span>DE</span>
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" className="mt-0.5">
                  <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main>
        <div className="bg-brand-pink">
          <div className="h-10 sm:h-12 lg:h-16 rounded-t-[32px] sm:rounded-t-[48px] lg:rounded-t-[64px] bg-brand-white" />
        </div>

        <div className="bg-brand-white overflow-hidden px-4 sm:px-8 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
          {/* Title */}
          <div className="flex flex-col items-center mb-10 sm:mb-14 lg:mb-16">
            <h1 className="font-[family-name:var(--font-display)] text-[28px] sm:text-[34px] lg:text-[40px] italic uppercase leading-[1.1] tracking-[1.25px] text-center">
              <span className="text-black">Challenge 2026</span>
              <br />
              <span className="text-brand-blue">Zahlen & Fakten</span>
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <p className="text-black/50 text-lg">Daten werden geladen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20">
              {/* ---- Bar Chart: Teilnehmende pro Jahr ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    Teilnehmende
                  </h2>

                  {/* Desktop: vertical bars */}
                  <div className="hidden sm:flex items-end gap-2 lg:gap-3 h-[300px] lg:h-[350px]">
                    {yearData.map((y) => {
                      const height = (y.teilnehmende / maxTeilnehmende) * 100;
                      return (
                        <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                          <span className="text-xs lg:text-sm text-black/60 font-medium whitespace-nowrap">
                            {formatSwiss(y.teilnehmende)}
                          </span>
                          <div
                            className="w-full rounded-t-[12px] sm:rounded-t-[24px] bg-brand-blue transition-all duration-500 flex items-end justify-center"
                            style={{ height: `${height}%` }}
                          >
                            {y.wachstumTeilnehmende && (
                              <span className="text-[9px] lg:text-xs text-white font-bold pb-2 whitespace-nowrap">
                                {y.wachstumTeilnehmende.startsWith("-") ? y.wachstumTeilnehmende : `+${y.wachstumTeilnehmende}`}
                              </span>
                            )}
                          </div>
                          <span className="text-sm lg:text-base text-black font-bold whitespace-nowrap mt-1">
                            {y.year}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: horizontal bars */}
                  <div className="flex sm:hidden flex-col gap-2">
                    {[...yearData].reverse().map((y) => {
                      const width = (y.teilnehmende / maxTeilnehmende) * 100;
                      return (
                        <div key={y.year} className="flex items-center gap-0 h-8">
                          <div className="relative flex-1 h-full bg-white rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-blue rounded-full flex items-center transition-all duration-500"
                              style={{ width: `${width}%` }}
                            >
                              <span className="text-[11px] text-white font-extrabold pl-3 whitespace-nowrap">
                                {y.year}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-black/60 font-medium pl-2 w-[70px] text-right shrink-0">
                            {formatSwiss(y.teilnehmende)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ---- Bar Chart: Anzahl Betriebe pro Jahr ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    Betriebe
                  </h2>

                  {/* Desktop: vertical bars */}
                  <div className="hidden sm:flex items-end gap-2 lg:gap-3 h-[300px] lg:h-[350px]">
                    {yearData.map((y) => {
                      const maxBetriebe = Math.max(...yearData.map((d) => d.betriebe), 1);
                      const height = (y.betriebe / maxBetriebe) * 100;
                      return (
                        <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                          <span className="text-xs lg:text-sm text-black/60 font-medium whitespace-nowrap">
                            {formatSwiss(y.betriebe)}
                          </span>
                          <div
                            className="w-full rounded-t-[12px] sm:rounded-t-[24px] bg-brand-blue transition-all duration-500 flex items-end justify-center"
                            style={{ height: `${height}%` }}
                          >
                            {y.wachstumBetriebe && (
                              <span className="text-[9px] lg:text-xs text-white font-bold pb-2 whitespace-nowrap">
                                {y.wachstumBetriebe.startsWith("-") ? y.wachstumBetriebe : `+${y.wachstumBetriebe}`}
                              </span>
                            )}
                          </div>
                          <span className="text-sm lg:text-base text-black font-bold whitespace-nowrap mt-1">
                            {y.year}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: horizontal bars */}
                  <div className="flex sm:hidden flex-col gap-2">
                    {[...yearData].reverse().map((y) => {
                      const maxBetriebe = Math.max(...yearData.map((d) => d.betriebe), 1);
                      const width = (y.betriebe / maxBetriebe) * 100;
                      return (
                        <div key={y.year} className="flex items-center gap-0 h-8">
                          <div className="relative flex-1 h-full bg-white rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-blue rounded-full flex items-center transition-all duration-500"
                              style={{ width: `${width}%` }}
                            >
                              <span className="text-[11px] text-white font-extrabold pl-3 whitespace-nowrap">
                                {y.year}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-black/60 font-medium pl-2 w-[50px] text-right shrink-0">
                            {formatSwiss(y.betriebe)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ---- Around the World ---- */}
              {(() => {
                const latestYear = yearData[yearData.length - 1];
                const totalKm = latestYear?.totalKm || 29180331;
                const earthCircumference = 40075;
                const timesAround = Math.floor(totalKm / earthCircumference);
                return (
                  <div className="w-full max-w-[1120px]">
                    <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
                      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 lg:gap-16">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/world-icon.svg"
                          alt="Weltkugel"
                          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shrink-0 text-brand-blue"
                          style={{ filter: "invert(55%) sepia(85%) saturate(1000%) hue-rotate(185deg)" }}
                        />
                        <div className="text-center sm:text-left">
                          <p className="font-[family-name:var(--font-display)] text-[48px] sm:text-[64px] lg:text-[80px] italic uppercase leading-none tracking-[1.25px] text-brand-blue">
                            {formatSwiss(timesAround)}x
                          </p>
                          <p className="text-base sm:text-lg lg:text-2xl text-black mt-2 sm:mt-3 lg:mt-4 leading-relaxed">
                            So viele Male seid ihr um die Erde geradelt
                          </p>
                          <p className="text-sm sm:text-base text-black/50 mt-1">
                            {formatSwiss(totalKm)} km total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ---- CO₂ / Flights Section ---- */}
              {(() => {
                const latestYear = yearData[yearData.length - 1];
                const totalCo2 = latestYear?.co2 || 4201968;
                const co2PerFlight = 1100;
                const flights = Math.floor(totalCo2 / co2PerFlight);
                return (
                  <div className="w-full max-w-[1120px]">
                    <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
                      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 lg:gap-16">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/statue-of-liberty-icon.svg"
                          alt="Freiheitsstatue"
                          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shrink-0"
                          style={{ filter: "invert(55%) sepia(85%) saturate(1000%) hue-rotate(185deg)" }}
                        />
                        <div className="text-center sm:text-left">
                          <p className="font-[family-name:var(--font-display)] text-[48px] sm:text-[64px] lg:text-[80px] italic uppercase leading-none tracking-[1.25px] text-brand-blue">
                            {formatSwiss(flights)}
                          </p>
                          <p className="text-base sm:text-lg lg:text-2xl text-black mt-2 sm:mt-3 lg:mt-4 leading-relaxed">
                            So viel CO₂ habt ihr eingespart – das entspricht so vielen Flügen Schweiz–New York
                          </p>
                          <p className="text-sm sm:text-base text-black/50 mt-1">
                            {formatSwiss(totalCo2)} kg CO₂ total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ---- Swiss Map: Betriebe ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    Teilnehmende Betriebe in der Schweiz
                  </h2>
                  <Suspense fallback={<div className="w-full h-[400px] sm:h-[500px] bg-neutral-200 rounded-2xl animate-pulse" />}>
                    <SwissMap />
                  </Suspense>
                </div>
              </div>

              {/* ---- Choropleth: Beteiligung pro Gemeinde ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    Beteiligung nach Gemeinde
                  </h2>
                  <Suspense fallback={<div className="w-full h-[400px] sm:h-[500px] bg-neutral-200 rounded-2xl animate-pulse" />}>
                    <ChoroplethMap />
                  </Suspense>
                </div>
              </div>

              {/* ---- Density Map: Betriebe pro Einwohner ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-2 sm:mb-3">
                    Potenzial pro Gemeinde
                  </h2>
                  <p className="text-sm sm:text-base text-black/50 mb-6 sm:mb-8">
                    Basierend auf Bevölkerungsdichte und erwartetem Anteil teilnehmender Betriebe. Dunkelblau = ausgeschöpft, Pink = ungenutztes Potenzial.
                  </p>
                  <Suspense fallback={<div className="w-full h-[400px] sm:h-[500px] bg-neutral-200 rounded-2xl animate-pulse" />}>
                    <DensityMap />
                  </Suspense>
                </div>
              </div>

              {/* ---- Pie Chart: Teilnahmedauer ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    Teilnahmedauer
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
                    {/* Pie */}
                    <div className="flex justify-center">
                      {renderPie(dauerData)}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-4">
                      {dauerData.map((d, i) => (
                        <div key={d.label} className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-sm shrink-0"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          <div>
                            <p className="text-sm sm:text-base font-bold text-black">
                              {d.label}
                            </p>
                            <p className="text-xs sm:text-sm text-black/50">
                              {formatSwiss(d.anzahl)} Betriebe · {d.prozent}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-brand-blue">
          <div className="h-10 sm:h-12 lg:h-16 rounded-b-[32px] sm:rounded-b-[48px] lg:rounded-b-[64px] bg-brand-white" />
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="bg-brand-blue">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
            <div className="px-0 sm:px-4 lg:px-8 flex flex-col gap-8 sm:gap-10 lg:gap-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-2 text-base sm:text-lg lg:text-xl font-medium text-black">
                  <a href="#" className="hover:opacity-80 transition-opacity">Über uns</a>
                  <a href="#" className="hover:opacity-80 transition-opacity">Sponsoren</a>
                  <a href="#" className="hover:opacity-80 transition-opacity">Kontakt</a>
                  <a href="#" className="hover:opacity-80 transition-opacity">Newsletter</a>
                </nav>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/facebook-icon.svg" alt="Facebook" className="size-8 sm:size-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/instagram-icon.svg" alt="Instagram" className="size-8 sm:size-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="size-8 sm:size-10" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-sm text-brand-white">eine Aktion von</p>
                  <div className="pb-1 sm:pb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/provelo-logo.svg" alt="Pro Velo" className="h-6 sm:h-8 w-auto" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm text-brand-white">Unterstützt durch</p>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/veloplus-logo.svg" alt="Veloplus" className="h-8 sm:h-10 lg:h-12 w-auto" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/panter-logo.svg" alt="Panter" className="h-6 sm:h-7 lg:h-[34px] w-auto" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/suva-logo.svg" alt="Suva" className="h-4 sm:h-5 lg:h-[23px] w-auto" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/stromer-logo.svg" alt="Stromer" className="h-4 sm:h-5 lg:h-[21px] w-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black px-4 sm:px-8 py-3 sm:py-4">
          <div className="mx-auto max-w-[1440px] px-0 sm:px-4 lg:px-16">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-base text-neutral-lighter">© 2025 bike to work</p>
              <div className="flex items-center gap-6 sm:gap-10 text-sm sm:text-base text-neutral-lighter">
                <a href="#" className="hover:opacity-80 transition-opacity">AGB</a>
                <a href="#" className="hover:opacity-80 transition-opacity">Datenschutz</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
