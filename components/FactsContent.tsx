"use client";

import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getTranslations, getLocalizedPath } from "@/lib/i18n";

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

type FactsPageData = {
  published?: boolean;
  title?: string;
  titleLine2?: string;
  sectionTeilnehmende?: { title?: string };
  sectionBetriebe?: { title?: string };
  sectionErde?: { text?: string; suffix?: string };
  sectionCo2?: { text?: string; co2PerFlight?: number };
  sectionDauer?: { title?: string };
} | null;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatSwiss(n: number): string {
  const s = Math.round(n).toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("’");
}

const PIE_COLORS = ["#fa7fdf", "#32a7ff", "#7efaf3", "#fcff66", "#000000"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FactsContent({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);

  const PAGE_QUERY = `*[_type == "factsPage" && !(_id in path("drafts.**")) && sprache == "${locale}"][0]{
  published, title, titleLine2,
  sectionTeilnehmende, sectionBetriebe, sectionErde, sectionCo2, sectionDauer
}`;

  const [yearData, setYearData] = useState<YearData[]>([]);
  const [dauerData, setDauerData] = useState<DauerData[]>([]);
  const [pageData, setPageData] = useState<FactsPageData>(null);
  const [loading, setLoading] = useState(true);
  const [factsPublished, setFactsPublished] = useState(true);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<YearData[]>(YEAR_QUERY),
      sanityClient.fetch<DauerData[]>(DAUER_QUERY),
      sanityClient.fetch<FactsPageData>(PAGE_QUERY),
    ]).then(([years, dauer, page]) => {
      setYearData(years);
      setDauerData(dauer);
      setPageData(page);
      setFactsPublished(page?.published !== false);
      setLoading(false);
    });
  }, [PAGE_QUERY]);

  if (!loading && !factsPublished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-xl">{t.common.unavailable}</p>
        <Link href={getLocalizedPath("/", locale)} className="text-brand-blue underline hover:text-brand-blue/70">
          {t.common.backToHome}
        </Link>
        <meta name="robots" content="noindex, nofollow" />
      </div>
    );
  }

  const p = pageData;
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
      <Navigation locale={locale} activePage="facts" />

      {/* ============ MAIN ============ */}
      <main>
        <div className="bg-brand-pink">
          <div className="h-10 sm:h-12 lg:h-16 rounded-t-[32px] sm:rounded-t-[48px] lg:rounded-t-[64px] bg-brand-white" />
        </div>

        <div className="bg-brand-white overflow-hidden px-4 sm:px-8 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
          {/* Title */}
          <div className="flex flex-col items-center mb-10 sm:mb-14 lg:mb-16">
            <h1 className="font-[family-name:var(--font-display)] text-[28px] sm:text-[34px] lg:text-[40px] italic uppercase leading-[1.1] tracking-[1.25px] text-center">
              <span className="text-black">{p?.title || t.facts.title}</span>
              <br />
              <span className="text-brand-blue">{p?.titleLine2 || t.facts.titleLine2}</span>
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <p className="text-black/50 text-lg">{t.common.loading}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20">
              {/* ---- Bar Chart: Teilnehmende pro Jahr ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    {p?.sectionTeilnehmende?.title || t.facts.teilnehmende}
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
                    {p?.sectionBetriebe?.title || t.facts.betriebe}
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
                            {formatSwiss(timesAround)}{p?.sectionErde?.suffix || t.facts.erdeSuffix}
                          </p>
                          <p className="text-base sm:text-lg lg:text-2xl text-black mt-2 sm:mt-3 lg:mt-4 leading-relaxed">
                            {p?.sectionErde?.text || t.facts.erdeText}
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
                const co2PerFlight = p?.sectionCo2?.co2PerFlight || 1100;
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
                            {p?.sectionCo2?.text || t.facts.co2Text}
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

              {/* ---- Pie Chart: Teilnahmedauer ---- */}
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    {p?.sectionDauer?.title || t.facts.teilnahmedauer}
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
      <Footer locale={locale} />
    </div>
  );
}
