"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/i18n";

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

const boxClasses = "bg-neutral-100 rounded-br-[24px] sm:rounded-br-[36px] lg:rounded-br-[48px] rounded-bl rounded-tr-[24px] sm:rounded-tr-[36px] lg:rounded-tr-[48px] rounded-tl-[24px] sm:rounded-tl-[36px] lg:rounded-tl-[48px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8";

export function MapsContent({ locale }: { locale: Locale }) {
  const [pageData, setPageData] = useState<MapsPageData>(undefined as unknown as MapsPageData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "mapsPage" && !(_id in path("drafts.**")) && sprache == "${locale}"][0]{
  _id, published, title, titleLine2,
  mapBetriebe, mapGemeinde, mapKanton, mapPotenzial
}`;
    sanityClient.fetch<MapsPageData>(query).then((result) => {
      setPageData(result);
      setLoading(false);
    });
  }, [locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black/50 text-lg"></p>
      </div>
    );
  }

  if (!pageData || pageData.published === false) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-xl"></p>
        <Link href={getLocalizedPath("/", locale)} className="text-brand-blue underline hover:text-brand-blue/70">
        </Link>
        <meta name="robots" content="noindex, nofollow" />
      </div>
    );
  }

  const title = pageData.title || "";
  const titleLine2 = pageData.titleLine2 || "";
  const betriebe = pageData.mapBetriebe;
  const gemeinde = pageData.mapGemeinde;
  const kanton = pageData.mapKanton;
  const potenzial = pageData.mapPotenzial;

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} activePage="maps" />

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
                    {betriebe?.title || ""}
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
                    {gemeinde?.title || ""}
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
                    {kanton?.title || ""}
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
                    {potenzial?.title || ""}
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
      <Footer locale={locale} />
    </div>
  );
}
