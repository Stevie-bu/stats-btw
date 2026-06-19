"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { Footer } from "@/components/Footer";

const SwissMap = dynamic(() =>
  import("@/components/SwissMap").then((m) => m.SwissMap), { ssr: false }
);
const ChoroplethMap = dynamic(() =>
  import("@/components/ChoroplethMap").then((m) => m.ChoroplethMap), { ssr: false }
);
const DensityMap = dynamic(() =>
  import("@/components/DensityMap").then((m) => m.DensityMap), { ssr: false }
);
const KantonBeteiligungMap = dynamic(() =>
  import("@/components/KantonBeteiligungMap").then((m) => m.KantonBeteiligungMap), { ssr: false }
);

const mapFallback = (
  <div className="w-full h-[400px] sm:h-[500px] bg-neutral-200 rounded-2xl animate-pulse" />
);

type MapSection = {
  visible?: boolean;
  title?: string;
  description?: string;
};

type MapsPageData = {
  _id: string;
  published?: boolean;
  title?: string;
  titleLine2?: string;
  mapBetriebe?: MapSection;
  mapGemeinde?: MapSection;
  mapKanton?: MapSection;
  mapPotenzial?: MapSection;
} | null;

const QUERY = `*[_id == "mapsPage"][0]{
  _id, published, title, titleLine2,
  mapBetriebe, mapGemeinde, mapKanton, mapPotenzial
}`;

const boxClasses = "bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8";

export default function MapsPage() {
  const [pageData, setPageData] = useState<MapsPageData>(undefined as unknown as MapsPageData);
  const [loading, setLoading] = useState(true);
  const [factsPublished, setFactsPublished] = useState(false);

  useEffect(() => {
    sanityClient.fetch<MapsPageData>(QUERY).then((result) => {
      setPageData(result);
      setLoading(false);
    });
    sanityClient.fetch<boolean | null>(`*[_id == "factsPage"][0].published`).then((val) => {
      setFactsPublished(val !== false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black/50 text-lg">Laden...</p>
      </div>
    );
  }

  if (!pageData || pageData.published === false) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-xl">Diese Seite ist momentan nicht verfügbar.</p>
        <Link href="/" className="text-brand-blue underline hover:text-brand-blue/70">
          Zurück zur Startseite
        </Link>
        <meta name="robots" content="noindex, nofollow" />
      </div>
    );
  }

  const title = pageData.title || "Challenge 2026";
  const titleLine2 = pageData.titleLine2 || "Kartenansichten";
  const betriebe = pageData.mapBetriebe;
  const gemeinde = pageData.mapGemeinde;
  const kanton = pageData.mapKanton;
  const potenzial = pageData.mapPotenzial;

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HEADER ============ */}
      <header className="bg-brand-pink">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-4 px-0 sm:px-4 lg:px-8 py-4">
            <Link href="/" className="shrink-0 size-16 sm:size-20 lg:size-[116px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/btw-logo.svg" alt="bike to work" className="size-full object-contain" />
            </Link>
            <div className="flex flex-1 items-center gap-2 sm:gap-4">
              <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-0">
                {[
                  { label: "Top Ten", href: "/", active: false },
                  ...(factsPublished ? [{ label: "Facts and Figures", href: "/facts-and-figures", active: false }] : []),
                  { label: "Maps", href: "/maps", active: true },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`h-10 sm:h-12 rounded-full px-3 sm:px-5 lg:px-6 text-sm sm:text-base lg:text-xl font-medium whitespace-nowrap transition-colors flex items-center ${
                      item.active ? "bg-black text-brand-white" : "bg-brand-white text-black"
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
              <span className="text-black">{title}</span>
              <br />
              <span className="text-brand-blue">{titleLine2}</span>
            </h1>
          </div>

          <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20">
            {/* ---- Swiss Map: Betriebe ---- */}
            {betriebe?.visible !== false && (
              <div className="w-full max-w-[1120px]">
                <div className={boxClasses}>
                  <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black mb-6 sm:mb-8">
                    {betriebe?.title || "Teilnehmende Betriebe in der Schweiz"}
                  </h2>
                  {betriebe?.description && (
                    <p className="text-sm sm:text-base text-black/50 -mt-4 sm:-mt-6 mb-6 sm:mb-8">
                      {betriebe.description}
                    </p>
                  )}
                  <Suspense fallback={mapFallback}>
                    <SwissMap />
                  </Suspense>
                </div>
              </div>
            )}

            {/* ---- Choropleth: Beteiligung pro Gemeinde ---- */}
            {gemeinde?.visible !== false && (
              <div className="w-full max-w-[1120px]">
                <div className={boxClasses}>
                  <h2 className={`font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black ${gemeinde?.description ? "mb-2 sm:mb-3" : "mb-6 sm:mb-8"}`}>
                    {gemeinde?.title || "Beteiligung nach Gemeinde"}
                  </h2>
                  {gemeinde?.description && (
                    <p className="text-sm sm:text-base text-black/50 mb-6 sm:mb-8">
                      {gemeinde.description}
                    </p>
                  )}
                  <Suspense fallback={mapFallback}>
                    <ChoroplethMap />
                  </Suspense>
                </div>
              </div>
            )}

            {/* ---- Kanton Beteiligung ---- */}
            {kanton?.visible !== false && (
              <div className="w-full max-w-[1120px]">
                <div className={boxClasses}>
                  <h2 className={`font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black ${kanton?.description ? "mb-2 sm:mb-3" : "mb-6 sm:mb-8"}`}>
                    {kanton?.title || "Beteiligung nach Kanton"}
                  </h2>
                  {kanton?.description && (
                    <p className="text-sm sm:text-base text-black/50 mb-6 sm:mb-8">
                      {kanton.description}
                    </p>
                  )}
                  <Suspense fallback={mapFallback}>
                    <KantonBeteiligungMap />
                  </Suspense>
                </div>
              </div>
            )}

            {/* ---- Density/Potential Map ---- */}
            {potenzial?.visible !== false && (
              <div className="w-full max-w-[1120px]">
                <div className={boxClasses}>
                  <h2 className={`font-[family-name:var(--font-display)] text-lg sm:text-xl lg:text-2xl italic uppercase tracking-[1px] text-black ${potenzial?.description ? "mb-2 sm:mb-3" : "mb-6 sm:mb-8"}`}>
                    {potenzial?.title || "Potenzial pro Gemeinde"}
                  </h2>
                  {potenzial?.description && (
                    <p className="text-sm sm:text-base text-black/50 mb-6 sm:mb-8">
                      {potenzial.description}
                    </p>
                  )}
                  <Suspense fallback={mapFallback}>
                    <DensityMap />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-brand-blue">
          <div className="h-10 sm:h-12 lg:h-16 rounded-b-[32px] sm:rounded-b-[48px] lg:rounded-b-[64px] bg-brand-white" />
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <Footer locale="de" />
    </div>
  );
}
