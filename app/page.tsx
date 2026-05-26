"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { sanityClient } from "@/lib/sanity";
import { ComparePanel } from "@/components/ComparePanel";

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
  "Betriebsgrösse",
] as const;
type Metric = (typeof METRICS)[number];

const SIZE_CATEGORIES = [
  "mehr 5\u2019000 MA",
  "bis 5\u2019000 MA",
  "bis 1\u2019000 MA",
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
  return parts.join("\u2019");
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
  }
}

function filterBySize(data: Betrieb[], size: SizeCategory): Betrieb[] {
  switch (size) {
    case "Alle Betriebe":
      return data;
    case "mehr 5\u2019000 MA":
      return data.filter((b) => b.mitarbeitende > 5000);
    case "bis 5\u2019000 MA":
      return data.filter(
        (b) => b.mitarbeitende > 1000 && b.mitarbeitende <= 5000
      );
    case "bis 1\u2019000 MA":
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
  }
}

function metricUnit(m: Metric): string {
  switch (m) {
    case "Betriebsgrösse":
      return "MA";
    case "Anzahl Teams":
      return "Teams";
    case "Beteiligung %":
      return "%";
    case "Distanz":
      return "km";
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

export default function Home() {
  const [allData, setAllData] = useState<Betrieb[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<Metric>("Beteiligung %");
  const [activeSize, setActiveSize] = useState<SizeCategory>("mehr 5\u2019000 MA");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<Betrieb[]>([]);
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
  }, []);

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
    if (compareMode) {
      const betrieb = allData.find((b) => b.name === name);
      if (betrieb && compareSelection.length < 5 && !selectedNames.has(name)) {
        setCompareSelection((prev) => [...prev, betrieb]);
      }
      setSearchInput("");
      setShowSuggestions(false);
    } else {
      setSearchInput(name);
      setSearchQuery(name);
      setShowSuggestions(false);
      setVisibleCount(10);
    }
  }

  function removeFromCompare(name: string) {
    setCompareSelection((prev) => {
      const next = prev.filter((b) => b.name !== name);
      if (next.length === 0) {
        setCompareMode(false);
      }
      return next;
    });
  }

  function clearSearch() {
    setSearchInput("");
    setSearchQuery("");
    setShowSuggestions(false);
  }

  function enterCompareMode() {
    setCompareMode(true);
    setCompareSelection([]);
    setSearchInput("");
    setSearchQuery("");
    setShowSuggestions(false);
  }

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

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HEADER ============ */}
      <header className="bg-brand-pink">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-4 px-0 sm:px-4 lg:px-8 py-4">
            <div className="shrink-0 size-16 sm:size-20 lg:size-[116px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/btw-logo.svg"
                alt="bike to work"
                className="size-full object-contain"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 sm:gap-4">
              <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-0">
                {[
                  { label: "Top Ten", active: true },
                  { label: "Facts and Figures", active: false },
                  { label: "Betriebsliste", active: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`h-10 sm:h-12 rounded-full px-3 sm:px-5 lg:px-6 text-sm sm:text-base lg:text-xl font-medium whitespace-nowrap transition-colors ${
                      item.active
                        ? "bg-black text-brand-white"
                        : "bg-brand-white text-black"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="hidden sm:flex items-center gap-1 text-base lg:text-xl font-medium text-black shrink-0">
                <span>DE</span>
                <svg
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  className="mt-0.5"
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                <span className="text-black">Challenge 2026</span>
                <br />
                <span className="text-brand-blue">top 10 Betriebe</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-2xl text-black text-center leading-relaxed lg:leading-8">
                Gib den Namen deines Betriebes ein und finde heraus wie dein
                Betrieb in den verschiedenen Kategorien bei der bike to work
                Challenge abgeschnitten hat.
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
                    if (!compareMode && e.target.value.trim() === "") {
                      setSearchQuery("");
                    }
                  }}
                  onFocus={() => {
                    if (searchInput.trim().length > 0) setShowSuggestions(true);
                  }}
                  placeholder={
                    compareMode
                      ? compareSelection.length >= 5
                        ? "Maximum 5 Betriebe erreicht"
                        : "Betrieb hinzufügen..."
                      : "Betrieb suchen..."
                  }
                  disabled={compareMode && compareSelection.length >= 5}
                  className="w-full h-[56px] sm:h-[64px] lg:h-[70px] rounded-full border border-black bg-white pl-14 sm:pl-16 pr-12 text-base sm:text-lg text-black placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-50"
                />
                {searchInput && !compareMode && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-black/50 hover:text-black text-xl z-10"
                  >
                    ✕
                  </button>
                )}
                {searchInput && compareMode && (
                  <button
                    onClick={() => { setSearchInput(""); setShowSuggestions(false); }}
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
                      Kein Betrieb gefunden
                    </div>
                  </div>
                )}
              </div>

              {/* Compare pills */}
              {compareMode && compareSelection.length > 0 && (
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
              )}
            </div>

            {/* Vergleichen / Beenden button */}
            {!compareMode ? (
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
            ) : null}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-20">
              <p className="text-black/50 text-lg">Daten werden geladen...</p>
            </div>
          )}

          {/* Compare Panel */}
          {!loading && compareMode && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[1120px]">
                <div className="bg-neutral-100 rounded-[24px] sm:rounded-[36px] lg:rounded-[48px] px-3 sm:px-5 lg:px-7 py-6 sm:py-8">
                  <ComparePanel selected={compareSelection} />
                </div>
              </div>
            </div>
          )}

          {/* Stats Card */}
          {!loading && !compareMode && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[1120px]">
                {/* ---- Metric Tabs (top, rectangular) ---- */}
                <div className="flex w-full overflow-x-auto scrollbar-hide">
                  {METRICS.map((metric, i) => {
                    const isActive = activeMetric === metric;
                    const isFirst = i === 0;
                    const isLast = i === METRICS.length - 1;

                    return (
                      <button
                        key={metric}
                        onClick={() => handleMetricChange(metric)}
                        className={`flex-1 min-w-[100px] sm:min-w-0 overflow-hidden px-2 sm:px-4 pt-5 sm:pt-6 pb-2 sm:pb-3 text-center text-xs sm:text-sm lg:text-base font-bold whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-neutral-100"
                            : "border border-neutral-200 bg-white"
                        } ${isFirst ? "rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px]" : ""} ${
                          isLast
                            ? "rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px]"
                            : ""
                        }`}
                      >
                        {metric}
                      </button>
                    );
                  })}
                </div>

                {/* ---- Chart Card ---- */}
                <div className="bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl px-3 sm:px-5 lg:px-7 pb-6 sm:pb-8">
                  {/* Size Category Pills */}
                  <div className="py-5 sm:py-6 lg:py-8">
                    <div className="inline-flex rounded-full bg-white p-1 flex-wrap gap-1">
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
                            className={`rounded-full px-3 sm:px-4 lg:px-[22px] py-2 sm:py-2.5 text-xs sm:text-sm lg:text-base font-bold whitespace-nowrap transition-colors ${
                              isActive
                                ? "bg-brand-blue text-brand-white"
                                : disabled
                                  ? "text-black/15 cursor-not-allowed"
                                  : "text-black/35 hover:text-black/50"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* No results */}
                  {searchActive && displayEntries.length === 0 && (
                    <div className="py-12 text-center text-black/50 text-base sm:text-lg">
                      Kein Betrieb gefunden für &ldquo;{searchQuery}&rdquo;
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
                                  {formatSwiss(betrieb.co2)} kg CO₂
                                </span>
                              )}
                            </div>

                            {/* Mobile row – stacked */}
                            <div className="flex sm:hidden items-center gap-2">
                              {/* Rank */}
                              <p className="w-7 shrink-0 text-right font-[family-name:var(--font-display)] text-base italic uppercase leading-6 tracking-[1px] text-black">
                                {String(rank + 1).padStart(2, "0")}
                              </p>

                              {/* Name + bar stacked */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs truncate mb-0.5 ${isHighlighted ? "text-black font-bold" : "text-black"}`}
                                >
                                  {betrieb.name}
                                </p>
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
                                    {formatSwiss(betrieb.co2)} kg CO₂
                                  </p>
                                )}
                              </div>
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
                        Mehr laden
                      </button>
                    </div>
                  )}
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
      <footer>
        <div className="bg-brand-blue">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
            <div className="px-0 sm:px-4 lg:px-8 flex flex-col gap-8 sm:gap-10 lg:gap-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-2 text-base sm:text-lg lg:text-xl font-medium text-black">
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    Über uns
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    Sponsoren
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    Kontakt
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    Newsletter
                  </a>
                </nav>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/facebook-icon.svg"
                    alt="Facebook"
                    className="size-8 sm:size-10"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/instagram-icon.svg"
                    alt="Instagram"
                    className="size-8 sm:size-10"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/linkedin-icon.svg"
                    alt="LinkedIn"
                    className="size-8 sm:size-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-sm text-brand-white">
                    eine Aktion von
                  </p>
                  <div className="pb-1 sm:pb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/provelo-logo.svg"
                      alt="Pro Velo"
                      className="h-6 sm:h-8 w-auto"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm text-brand-white">
                    Unterstützt durch
                  </p>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/veloplus-logo.svg"
                      alt="Veloplus"
                      className="h-8 sm:h-10 lg:h-12 w-auto"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/panter-logo.svg"
                      alt="Panter"
                      className="h-6 sm:h-7 lg:h-[34px] w-auto"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/suva-logo.svg"
                      alt="Suva"
                      className="h-4 sm:h-5 lg:h-[23px] w-auto"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/stromer-logo.svg"
                      alt="Stromer"
                      className="h-4 sm:h-5 lg:h-[21px] w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black px-4 sm:px-8 py-3 sm:py-4">
          <div className="mx-auto max-w-[1440px] px-0 sm:px-4 lg:px-16">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-base text-neutral-lighter">
                © 2025 bike to work
              </p>
              <div className="flex items-center gap-6 sm:gap-10 text-sm sm:text-base text-neutral-lighter">
                <a href="#" className="hover:opacity-80 transition-opacity">
                  AGB
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  Datenschutz
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
