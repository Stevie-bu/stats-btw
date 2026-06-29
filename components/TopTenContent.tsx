"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { sanityClient } from "@/lib/sanity";
import type { SiteTexts } from "@/lib/sanity";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { findDestination } from "@/lib/destinations";
import mapData from "@/data/betriebe-map.json";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getTranslations, getLocalizedPath } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface Betrieb {
  name: string;
  ort: string;
  mitarbeitende: number;
  teams: number;
  beteiligung: number;
  veloanteil: number;
  distanz: number;
  co2: number;
}

const METRICS = [
  "Beteiligung %",
  "Anzahl Teams",
  "Distanz",
  "km pro MA",
  "Betriebsgrösse",
] as const;
type Metric = (typeof METRICS)[number];

const SIZE_CATEGORIES = [
  "mehr 5’000 MA",
  "bis 5’000 MA",
  "bis 1’000 MA",
  "bis 500 MA",
  "bis 200 MA",
  "Alle Betriebe",
] as const;
type SizeCategory = (typeof SIZE_CATEGORIES)[number];

const SANITY_QUERY = `*[_type == "betrieb"]{
  name,
  ort,
  mitarbeitende,
  teams,
  beteiligung,
  veloanteil,
  distanz,
  co2
}`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatSwiss(n: number): string {
  const rounded = Math.round(n);
  const s = rounded.toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("’");
}

function formatPercent(n: number): string {
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.05) {
    return Math.round(n).toString();
  }
  return n.toFixed(1);
}

function getMetricValue(b: Betrieb, m: Metric): number {
  switch (m) {
    case "Betriebsgrösse":
      return b.mitarbeitende ?? 0;
    case "Anzahl Teams":
      return b.teams ?? 0;
    case "Beteiligung %":
      return Math.min(b.beteiligung ?? 0, 100);
    case "Distanz":
      return b.distanz ?? 0;
    case "km pro MA":
      return b.mitarbeitende > 0 ? Math.round((b.distanz ?? 0) / b.mitarbeitende) : 0;
  }
}

function filterBySize(data: Betrieb[], size: SizeCategory): Betrieb[] {
  switch (size) {
    case "Alle Betriebe":
      return data;
    case "mehr 5’000 MA":
      return data.filter((b) => b.mitarbeitende > 5000);
    case "bis 5’000 MA":
      return data.filter(
        (b) => b.mitarbeitende > 1000 && b.mitarbeitende <= 5000
      );
    case "bis 1’000 MA":
      return data.filter(
        (b) => b.mitarbeitende > 500 && b.mitarbeitende <= 1000
      );
    case "bis 500 MA":
      return data.filter(
        (b) => b.mitarbeitende > 200 && b.mitarbeitende <= 500
      );
    case "bis 200 MA":
      return data.filter((b) => b.mitarbeitende <= 200);
  }
}

function formatBarValue(v: number, m: Metric): string {
  switch (m) {
    case "Betriebsgrösse":
      return formatSwiss(v);
    case "Anzahl Teams":
      return formatSwiss(v);
    case "Beteiligung %":
      return formatPercent(v);
    case "Distanz":
      return formatSwiss(v);
    case "km pro MA":
      return formatSwiss(v);
  }
}

function getBarColor(rank: number): string {
  switch (rank) {
    case 0:
      return "bg-brand-pink";
    case 1:
      return "bg-brand-turquoise";
    case 2:
      return "bg-brand-lemon";
    default:
      return "bg-brand-blue";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TopTenContent({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);

  /* Translation helpers – CMS overrides i18n fallback */
  function metricLabel(m: Metric): string {
    const map: Record<Metric, string> = {
      "Beteiligung %": cmsTexts.metricBeteiligung || t.metrics.beteiligung,
      "Anzahl Teams": cmsTexts.metricTeams || t.metrics.teams,
      "Distanz": cmsTexts.metricDistanz || t.metrics.distanz,
      "km pro MA": cmsTexts.metricKmProMa || t.metrics.kmProMa,
      "Betriebsgrösse": cmsTexts.metricBetriebsgroesse || t.metrics.betriebsgroesse,
    };
    return map[m];
  }

  function sizeLabel(s: SizeCategory): string {
    const map: Record<SizeCategory, string> = {
      "mehr 5’000 MA": cmsTexts.sizeMehr5000 || t.sizes.mehr5000,
      "bis 5’000 MA": cmsTexts.sizeBis5000 || t.sizes.bis5000,
      "bis 1’000 MA": cmsTexts.sizeBis1000 || t.sizes.bis1000,
      "bis 500 MA": cmsTexts.sizeBis500 || t.sizes.bis500,
      "bis 200 MA": cmsTexts.sizeBis200 || t.sizes.bis200,
      "Alle Betriebe": cmsTexts.sizeAlle || t.sizes.alle,
    };
    return map[s];
  }

  function metricUnit(m: Metric): string {
    switch (m) {
      case "Betriebsgrösse":
        return cmsTexts.unitMa || t.units.ma;
      case "Anzahl Teams":
        return cmsTexts.unitTeams || t.units.teams;
      case "Beteiligung %":
        return cmsTexts.unitPercent || t.units.percent;
      case "Distanz":
        return cmsTexts.unitKm || t.units.km;
      case "km pro MA":
        return cmsTexts.unitKm || t.units.km;
    }
  }

  const [allData, setAllData] = useState<Betrieb[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<Metric>("Beteiligung %");
  const [activeSize, setActiveSize] = useState<SizeCategory>("mehr 5’000 MA");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [cmsTexts, setCmsTexts] = useState<SiteTexts>({});
  // const [compareMode, setCompareMode] = useState(false);
  // const [compareSelection, setCompareSelection] = useState<Betrieb[]>([]);
  const compareMode = false;
  const compareSelection: Betrieb[] = [];
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    sanityClient.fetch<Betrieb[]>(SANITY_QUERY).then((result) => {
      setAllData(result);
      setLoading(false);
    });
    sanityClient
      .fetch<SiteTexts | null>(
        `*[_type == "siteTexts" && !(_id in path("drafts.**")) && sprache == "${locale}"][0]{
          topTenPublished,
          topTenTitle, topTenTitleLine2, topTenDescription,
          searchPlaceholder, noResults, loadMore,
          metricBeteiligung, metricTeams, metricDistanz, metricKmProMa, metricBetriebsgroesse,
          sizeAlle, sizeMehr5000, sizeBis5000, sizeBis1000, sizeBis500, sizeBis200,
          unitMa, unitTeams, unitPercent, unitKm, unitCo2,
          distanzKmTotal, distanzZiel, distanzZumZiel, distanzUmDieWelt,
          noDataText, loadingText, unavailableText, backToHome,
          error404Text, error404Link, error500Text, error500Button
        }`
      )
      .then((r) => setCmsTexts(r || {}));
  }, [locale]);

  /* Search suggestions */
  const selectedNames = new Set(compareSelection.map((b) => b.name));
  const suggestions = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (q.length < 1) return [];
    return allData
      .filter((b) => b.name.toLowerCase().includes(q) && !selectedNames.has(b.name))
      .sort((a, b) => a.name.localeCompare(b.name, "de"))
      .slice(0, 10);
  }, [allData, searchInput, selectedNames]);

  function selectBetrieb(name: string) {
    // if (compareMode) {
    //   const betrieb = allData.find((b) => b.name === name);
    //   if (betrieb && compareSelection.length < 5 && !selectedNames.has(name)) {
    //     setCompareSelection((prev) => [...prev, betrieb]);
    //   }
    //   setSearchInput("");
    //   setShowSuggestions(false);
    // } else {
      setSearchInput(name);
      setSearchQuery(name);
      setShowSuggestions(false);
      setVisibleCount(10);
    // }
  }

  // function removeFromCompare(name: string) {
  //   setCompareSelection((prev) => {
  //     const next = prev.filter((b) => b.name !== name);
  //     if (next.length === 0) {
  //       setCompareMode(false);
  //     }
  //     return next;
  //   });
  // }

  function clearSearch() {
    setSearchInput("");
    setSearchQuery("");
    setShowSuggestions(false);
  }

  // function enterCompareMode() {
  //   setCompareMode(true);
  //   setCompareSelection([]);
  //   setSearchInput("");
  //   setSearchQuery("");
  //   setShowSuggestions(false);
  // }

  /* Search logic */
  const searchActive = searchQuery.trim().length > 0;
  const effectiveSize = searchActive ? "Alle Betriebe" as SizeCategory : activeSize;

  const ranked = useMemo(() => {
    const filtered = filterBySize(allData, effectiveSize);
    return [...filtered].sort(
      (a, b) =>
        getMetricValue(b, activeMetric) - getMetricValue(a, activeMetric)
    );
  }, [allData, effectiveSize, activeMetric]);

  const maxValue =
    ranked.length > 0 ? getMetricValue(ranked[0], activeMetric) : 1;
  const searchMatchIndex = searchActive
    ? ranked.findIndex((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : -1;

  let displayEntries: {
    betrieb: Betrieb;
    rank: number;
    isHighlighted: boolean;
  }[];

  if (searchActive && searchMatchIndex >= 0) {
    displayEntries = [{
      betrieb: ranked[searchMatchIndex],
      rank: searchMatchIndex,
      isHighlighted: true,
    }];
  } else if (searchActive) {
    displayEntries = [];
  } else {
    displayEntries = ranked.slice(0, visibleCount).map((b, i) => ({
      betrieb: b,
      rank: i,
      isHighlighted: false,
    }));
  }

  const hasMore = !searchActive && visibleCount < ranked.length;

  function handleMetricChange(m: Metric) {
    setActiveMetric(m);
    setVisibleCount(10);
  }

  function handleSizeChange(s: SizeCategory) {
    setActiveSize(s);
    setVisibleCount(10);
    clearSearch();
  }

  const topTenPublished = cmsTexts.topTenPublished !== false;

  if (!loading && !topTenPublished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-xl">{cmsTexts.unavailableText || t.common.unavailable}</p>
        <Link href={getLocalizedPath("/", locale)} className="text-brand-blue underline hover:text-brand-blue/70">
          {cmsTexts.backToHome || t.common.backToHome}
        </Link>
        <meta name="robots" content="noindex, nofollow" />
      </div>
    );
  }

  /* Resolved text (CMS overrides i18n) */
  const title = cmsTexts.topTenTitle || t.topTen.title;
  const titleLine2 = cmsTexts.topTenTitleLine2 || t.topTen.titleLine2;
  const description = cmsTexts.topTenDescription || t.topTen.description;
  const searchPlaceholder = cmsTexts.searchPlaceholder || t.topTen.searchPlaceholder;
  const noResults = cmsTexts.noResults || t.topTen.noResults;
  const loadMore = cmsTexts.loadMore || t.topTen.loadMore;

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HEADER ============ */}
      <Navigation locale={locale} activePage="topTen" />

      {/* ============ MAIN ============ */}
      <main>
        {/* Curve pink → white */}
        <div className="bg-brand-pink">
          <div className="h-10 sm:h-12 lg:h-16 rounded-t-[32px] sm:rounded-t-[48px] lg:rounded-t-[64px] bg-brand-white" />
        </div>

        {/* Content */}
        <div className="bg-brand-white overflow-hidden px-4 sm:px-8 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
          {/* Title + Subtitle + Search */}
          <div className="flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
            <div className="max-w-[768px] flex flex-col items-center gap-6">
              <h1 className="font-[family-name:var(--font-display)] text-[28px] sm:text-[34px] lg:text-[40px] italic uppercase leading-[1.1] tracking-[1.25px] text-center">
                <span className="text-black">{title}</span>
                <br />
                <span className="text-brand-blue">{titleLine2}</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-2xl text-black text-center leading-relaxed lg:leading-8">
                {description}
              </p>
            </div>

            {/* Search */}
            <div className="w-full max-w-[560px]" ref={searchRef}>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/search-icon.svg"
                  alt=""
                  className="absolute left-6 top-1/2 -translate-y-1/2 size-6 pointer-events-none z-10"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                    if (e.target.value.trim() === "") {
                      setSearchQuery("");
                    }
                  }}
                  onFocus={() => {
                    if (searchInput.trim().length > 0) setShowSuggestions(true);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full h-[56px] sm:h-[64px] lg:h-[70px] rounded-full border border-black bg-white pl-14 sm:pl-16 pr-12 text-base sm:text-lg text-black placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-50"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-black/50 hover:text-black text-xl z-10"
                  >
                    ✕
                  </button>
                )}

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-50">
                    {suggestions.map((b) => (
                      <button
                        key={b.name}
                        onClick={() => selectBetrieb(b.name)}
                        className="w-full text-left px-6 py-3 text-base text-black hover:bg-neutral-100 transition-colors flex items-center justify-between"
                      >
                        <span>{b.name}</span>
                        <span className="text-sm text-black/40 ml-4 shrink-0">
                          {b.ort}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {showSuggestions && searchInput.trim().length > 0 && suggestions.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-50">
                    <div className="px-6 py-4 text-base text-black/50">
                      {noResults}
                    </div>
                  </div>
                )}
              </div>

              {/* Compare pills - disabled */}
              {/* {compareMode && compareSelection.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {compareSelection.map((b) => (
                    <span
                      key={b.name}
                      className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium rounded-full pl-4 pr-2 py-1.5"
                    >
                      {b.name}
                      <button
                        onClick={() => removeFromCompare(b.name)}
                        className="text-white/60 hover:text-white text-base leading-none"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )} */}
            </div>

            {/* Vergleichen / Beenden button - disabled */}
            {/* {!compareMode ? (
              <button
                onClick={enterCompareMode}
                className="text-sm sm:text-base font-medium text-brand-blue hover:text-brand-blue/70 underline transition-colors"
              >
                Vergleichen
              </button>
            ) : compareSelection.length === 0 ? (
              <button
                onClick={() => setCompareMode(false)}
                className="text-sm sm:text-base font-medium text-black/50 hover:text-black underline transition-colors"
              >
                Vergleichen beenden
              </button>
            ) : null} */}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-20">
              <p className="text-black/50 text-lg">{cmsTexts.loadingText || t.common.loading}</p>
            </div>
          )}

          {/* No data state */}
          {!loading && allData.length === 0 && (
            <div className="flex justify-center py-20">
              <p className="text-black/50 text-lg text-center">
                {cmsTexts.noDataText || "Aktuell keine Statistiken verfügbar."}
              </p>
            </div>
          )}

          {/* Stats Card */}
          {!loading && allData.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[1120px]">
                {/* ---- Metric Tabs (top, rectangular) ---- */}
                {/* Desktop: all in one row */}
                <div className="hidden sm:flex w-full">
                  {METRICS.map((metric, i) => {
                    const isActive = activeMetric === metric;
                    const isFirst = i === 0;
                    const isLast = i === METRICS.length - 1;

                    return (
                      <button
                        key={metric}
                        onClick={() => handleMetricChange(metric)}
                        className={`flex-1 overflow-hidden px-4 pt-6 pb-3 text-center text-sm lg:text-base font-bold whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-neutral-100"
                            : "border border-neutral-200 bg-white"
                        } ${isFirst ? "rounded-tl-[36px] lg:rounded-tl-[48px]" : ""} ${
                          isLast ? "rounded-tr-[36px] lg:rounded-tr-[48px]" : ""
                        }`}
                      >
                        {metricLabel(metric)}
                      </button>
                    );
                  })}
                </div>
                {/* Mobile: stacked */}
                <div className="flex flex-col sm:hidden w-full">
                  {METRICS.map((metric, i) => {
                    const isActive = activeMetric === metric;

                    return (
                      <button
                        key={metric}
                        onClick={() => handleMetricChange(metric)}
                        className={`overflow-hidden px-2 pt-4 pb-2 text-center text-sm font-bold whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-neutral-100"
                            : "border border-neutral-200 bg-white"
                        } ${i === 0 ? "rounded-tl-[24px] rounded-tr-[24px]" : ""}`}
                      >
                        {metricLabel(metric)}
                      </button>
                    );
                  })}
                </div>

                {/* ---- Chart Card ---- */}
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl px-3 sm:px-5 lg:px-7 pb-6 sm:pb-8">
                  {/* Size Category Pills */}
                  <div className="py-4 sm:py-6 lg:py-8">
                    <div className="grid grid-cols-2 lg:inline-flex lg:flex-row rounded-2xl lg:rounded-full bg-white p-1 gap-1">
                      {SIZE_CATEGORIES.map((size) => {
                        const isActive = searchActive
                          ? size === "Alle Betriebe"
                          : activeSize === size;
                        const disabled = searchActive && size !== "Alle Betriebe";

                        return (
                          <button
                            key={size}
                            onClick={() => !disabled && handleSizeChange(size)}
                            disabled={disabled}
                            className={`rounded-full px-3 sm:px-4 lg:px-[22px] py-2.5 sm:py-2.5 text-sm sm:text-sm lg:text-base font-bold whitespace-nowrap transition-colors ${
                              isActive
                                ? "bg-brand-blue text-brand-white"
                                : disabled
                                  ? "text-black/15 cursor-not-allowed"
                                  : "text-black/35 hover:text-black/50"
                            }`}
                          >
                            {sizeLabel(size)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* No results */}
                  {searchActive && displayEntries.length === 0 && (
                    <div className="py-12 text-center text-black/50 text-base sm:text-lg">
                      {noResults} &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}

                  {/* Bar Chart */}
                  <div className="flex flex-col gap-6">
                    {displayEntries.map(
                      ({ betrieb, rank, isHighlighted }) => {
                        const value = getMetricValue(betrieb, activeMetric);
                        const barWidth =
                          maxValue > 0 ? (value / maxValue) * 100 : 0;
                        const barColor = isHighlighted
                          ? "bg-black"
                          : getBarColor(rank);
                        const textColor = isHighlighted
                          ? "text-white"
                          : "text-black";
                        const unitColor = isHighlighted
                          ? "text-white/75"
                          : "text-black/75";

                        return (
                          <div key={betrieb.name + rank}>
                            {/* Desktop / Tablet row */}
                            <div className="hidden sm:flex items-center gap-6">
                              {/* Rank */}
                              <p className="w-8 md:w-10 lg:w-[44px] shrink-0 text-right font-[family-name:var(--font-display)] text-lg md:text-xl lg:text-[28px] italic uppercase leading-8 tracking-[1.25px] text-black">
                                {String(rank + 1).padStart(2, "0")}
                              </p>

                              {/* Name */}
                              <p
                                className={`w-[140px] md:w-[180px] lg:w-[220px] shrink-0 text-xs md:text-sm lg:text-base truncate ${isHighlighted ? "text-black font-bold" : "text-black"}`}
                              >
                                {betrieb.name}
                              </p>

                              {/* Bar + Label */}
                              <div className="flex-1 h-9 md:h-10 lg:h-[44px] relative">
                                <div className="absolute inset-0 bg-white rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
                                    style={{ width: `${barWidth}%` }}
                                  />
                                </div>
                                {barWidth > 22 ? (
                                  <div
                                    className="absolute top-0 h-full flex items-center justify-end gap-1 px-4 transition-all duration-500 ease-out"
                                    style={{ left: 0, width: `${barWidth}%` }}
                                  >
                                    <span
                                      className={`text-sm md:text-base font-bold ${textColor} whitespace-nowrap`}
                                    >
                                      {formatBarValue(value, activeMetric)}
                                    </span>
                                    <span
                                      className={`text-sm md:text-base ${unitColor} whitespace-nowrap font-normal`}
                                    >
                                      {metricUnit(activeMetric)}
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    className="absolute top-0 h-full flex items-center gap-1 pl-4"
                                    style={{ left: `${barWidth}%` }}
                                  >
                                    <span className="text-sm md:text-base font-bold text-black whitespace-nowrap">
                                      {formatBarValue(value, activeMetric)}
                                    </span>
                                    <span className="text-sm md:text-base text-black/75 whitespace-nowrap font-normal">
                                      {metricUnit(activeMetric)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* CO₂ info for Distanz metric – outside bar */}
                              {activeMetric === "Distanz" && (
                                <span className="shrink-0 text-xs md:text-sm text-black/40 whitespace-nowrap">
                                  {formatSwiss(betrieb.co2)} {cmsTexts.unitCo2 || t.units.co2}
                                </span>
                              )}
                            </div>

                            {/* Mobile row – stacked */}
                            <div className="flex sm:hidden flex-col gap-1">
                              {/* Rank + Name on same line */}
                              <div className="flex items-center gap-2 pl-3">
                                <p className="shrink-0 font-[family-name:var(--font-display)] text-base italic uppercase leading-6 tracking-[1px] text-black">
                                  {String(rank + 1).padStart(2, "0")}
                                </p>
                                <p
                                  className={`text-xs truncate ${isHighlighted ? "text-black font-bold" : "text-black"}`}
                                >
                                  {betrieb.name}
                                </p>
                              </div>
                              <div className="h-7 relative">
                                <div className="absolute inset-0 bg-white rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
                                    style={{ width: `${barWidth}%` }}
                                  />
                                </div>
                                {barWidth > 30 ? (
                                  <div
                                    className="absolute top-0 h-full flex items-center justify-end gap-1 px-3 transition-all duration-500 ease-out"
                                    style={{
                                      left: 0,
                                      width: `${barWidth}%`,
                                    }}
                                  >
                                    <span
                                      className={`text-xs font-bold ${textColor} whitespace-nowrap`}
                                    >
                                      {formatBarValue(value, activeMetric)}
                                    </span>
                                    <span
                                      className={`text-xs ${unitColor} whitespace-nowrap font-normal`}
                                    >
                                      {metricUnit(activeMetric)}
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    className="absolute top-0 h-full flex items-center gap-1 pl-3"
                                    style={{ left: `${barWidth}%` }}
                                  >
                                    <span className="text-xs font-bold text-black whitespace-nowrap">
                                      {formatBarValue(value, activeMetric)}
                                    </span>
                                    <span className="text-xs text-black/75 whitespace-nowrap font-normal">
                                      {metricUnit(activeMetric)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {/* CO₂ info for Distanz metric (mobile) */}
                              {activeMetric === "Distanz" && (
                                <p className="text-[10px] text-black/40 whitespace-nowrap mt-0.5">
                                  {formatSwiss(betrieb.co2)} {cmsTexts.unitCo2 || t.units.co2}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Mehr laden Button */}
                  {hasMore && (
                    <div className="flex justify-center pt-8">
                      <button
                        onClick={() =>
                          setVisibleCount((prev) =>
                            Math.min(prev + 10, ranked.length)
                          )
                        }
                        className="rounded-full bg-black text-white font-bold px-8 py-3 text-sm sm:text-base hover:opacity-80 transition-opacity"
                      >
                        {loadMore}
                      </button>
                    </div>
                  )}

                  {/* "Wie weit geradelt?" – only when a Betrieb is searched */}
                  {searchActive && searchMatchIndex >= 0 && activeMetric === "Distanz" && (() => {
                    const betrieb = ranked[searchMatchIndex];
                    const mapEntry = (mapData as { name: string; lat: number; lon: number; plz: string; ort: string; ma: number }[])
                      .find((m) => m.name === betrieb.name);
                    if (!mapEntry || betrieb.distanz < 1) return null;
                    const result = findDestination(mapEntry.lat, mapEntry.lon, betrieb.distanz, betrieb.name);
                    if (!result) return null;

                    return (
                      <div className="mt-8 sm:mt-10 bg-white rounded-[16px] sm:rounded-[24px] p-5 sm:p-8">
                        <p className="text-lg sm:text-xl lg:text-2xl text-black leading-relaxed">
                          {result.sentence}
                        </p>
                        <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 text-sm text-black/50">
                          <span>{formatSwiss(Math.round(betrieb.distanz))} {cmsTexts.distanzKmTotal || "km total"}</span>
                          <span>{cmsTexts.distanzZiel || "Ziel:"} {result.destination.name}</span>
                          <span>{cmsTexts.distanzZumZiel || "Distanz zum Ziel:"} {formatSwiss(result.actualDistance)} km</span>
                          {result.laps > 0 && <span>{result.laps}{cmsTexts.distanzUmDieWelt || "× um die Welt"}</span>}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Curve white → blue */}
        <div className="bg-brand-blue">
          <div className="h-10 sm:h-12 lg:h-16 rounded-b-[32px] sm:rounded-b-[48px] lg:rounded-b-[64px] bg-brand-white" />
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <Footer locale={locale} />
    </div>
  );
}
