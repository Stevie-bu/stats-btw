export interface Destination {
  name: string;
  lat: number;
  lon: number;
  preposition: string;
  description: string;
}

export interface SanityDestination {
  name: string;
  lat: number;
  lon: number;
  prepositionDe?: string;
  prepositionFr?: string;
  prepositionIt?: string;
  descriptionDe?: string;
  descriptionFr?: string;
  descriptionIt?: string;
}

type Locale = "de" | "fr" | "it" | "en";

function toLocalized(d: SanityDestination, locale: Locale): Destination {
  const lang = locale === "en" ? "de" : locale;
  const preKey = `preposition${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof SanityDestination;
  const descKey = `description${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof SanityDestination;
  return {
    name: d.name,
    lat: d.lat,
    lon: d.lon,
    preposition: (d[preKey] as string) || d.prepositionDe || "",
    description: (d[descKey] as string) || d.descriptionDe || "",
  };
}

const EARTH_RADIUS = 6371.0088;
const EARTH_CIRC = 40075;
const MAX_RING = 20037.5;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

export type Regime = "NORMAL" | "PAST_ANTIPODE" | "WORLD_LAPS";

export interface DistanceResult {
  totalKm: number;
  effectiveTarget: number;
  laps: number;
  regime: Regime;
  pastAntipode: boolean;
}

export function calculateRegime(totalKm: number): DistanceResult {
  const laps = Math.floor(totalKm / EARTH_CIRC);
  const rest = totalKm % EARTH_CIRC;
  let effectiveTarget: number;
  let pastAntipode = false;

  if (rest <= MAX_RING) {
    effectiveTarget = rest;
  } else {
    effectiveTarget = EARTH_CIRC - rest;
    pastAntipode = true;
  }

  let regime: Regime;
  if (laps >= 1) {
    regime = "WORLD_LAPS";
  } else if (pastAntipode) {
    regime = "PAST_ANTIPODE";
  } else {
    regime = "NORMAL";
  }

  return { totalKm, effectiveTarget, laps, regime, pastAntipode };
}

const TEMPLATES: Record<Locale, {
  normal: (c: string, q: string, p: string, n: string, d: string) => string;
  antipode: (c: string, q: string, p: string, n: string, d: string) => string;
  laps: (c: string, l: number, q: string, p: string, n: string, d: string) => string;
  almost: string;
  beyond: string;
}> = {
  de: {
    normal: (c, q, p, n, d) => `Wow! ${c} ist ${q}${p} ${n} geradelt – ${d}.`,
    antipode: (c, q, p, n, d) => `Unglaublich! ${c} ist am entferntesten Punkt der Erde vorbeigeradelt und auf der Rückseite des Planeten ${q}${p} ${n} gerollt – ${d}.`,
    laps: (c, l, q, p, n, d) => `Wahnsinn! ${c} ist ${l}× um die Welt geradelt und dann noch ${q}${p} ${n} – ${d}.`,
    almost: "fast ",
    beyond: "weiter als ",
  },
  fr: {
    normal: (c, q, p, n, d) => `Wow ! ${c} a pédalé ${q}${p} ${n} – ${d}.`,
    antipode: (c, q, p, n, d) => `Incroyable ! ${c} a dépassé le point le plus éloigné de la Terre et a roulé sur l'autre face de la planète ${q}${p} ${n} – ${d}.`,
    laps: (c, l, q, p, n, d) => `Incroyable ! ${c} a fait ${l}× le tour du monde à vélo et encore ${q}${p} ${n} – ${d}.`,
    almost: "presque ",
    beyond: "plus loin que ",
  },
  it: {
    normal: (c, q, p, n, d) => `Wow! ${c} ha pedalato ${q}${p} ${n} – ${d}.`,
    antipode: (c, q, p, n, d) => `Incredibile! ${c} ha superato il punto più lontano della Terra e ha pedalato sull'altro lato del pianeta ${q}${p} ${n} – ${d}.`,
    laps: (c, l, q, p, n, d) => `Incredibile! ${c} ha fatto ${l}× il giro del mondo in bici e poi ancora ${q}${p} ${n} – ${d}.`,
    almost: "quasi ",
    beyond: "più lontano di ",
  },
  en: {
    normal: (c, q, p, n, d) => `Wow! ${c} cycled ${q}${p} ${n} – ${d}.`,
    antipode: (c, q, p, n, d) => `Unbelievable! ${c} cycled past the farthest point on Earth and on the other side of the planet ${q}${p} ${n} – ${d}.`,
    laps: (c, l, q, p, n, d) => `Amazing! ${c} cycled ${l}× around the world and then ${q}${p} ${n} – ${d}.`,
    almost: "almost ",
    beyond: "beyond ",
  },
};

export interface MatchResult {
  destination: Destination;
  actualDistance: number;
  deviation: number;
  regime: Regime;
  laps: number;
  sentence: string;
}

export function findDestination(
  fromLat: number,
  fromLon: number,
  totalKm: number,
  companyName: string,
  sanityDestinations: SanityDestination[],
  locale: Locale = "de"
): MatchResult | null {
  if (totalKm < 1 || sanityDestinations.length === 0) return null;

  const { effectiveTarget, laps, regime } = calculateRegime(totalKm);
  const destinations = sanityDestinations.map((d) => toLocalized(d, locale));

  let bestIdx = 0;
  let bestDev = Infinity;

  for (let i = 0; i < sanityDestinations.length; i++) {
    const dist = haversine(fromLat, fromLon, sanityDestinations[i].lat, sanityDestinations[i].lon);
    const dev = Math.abs(dist - effectiveTarget);
    if (dev < bestDev) {
      bestDev = dev;
      bestIdx = i;
    }
  }

  const d = destinations[bestIdx];
  const actualDist = haversine(fromLat, fromLon, d.lat, d.lon);
  const t = TEMPLATES[locale] || TEMPLATES.de;

  const isShort = effectiveTarget < actualDist;
  const isLong = effectiveTarget > actualDist;
  const qualifier = isShort ? t.almost : isLong ? t.beyond : "";

  let sentence: string;
  if (regime === "NORMAL") {
    sentence = t.normal(companyName, qualifier, d.preposition, d.name, d.description);
  } else if (regime === "PAST_ANTIPODE") {
    sentence = t.antipode(companyName, qualifier, d.preposition, d.name, d.description);
  } else {
    sentence = t.laps(companyName, laps, qualifier, d.preposition, d.name, d.description);
  }

  return {
    destination: d,
    actualDistance: Math.round(actualDist),
    deviation: Math.round(bestDev),
    regime,
    laps,
    sentence,
  };
}
