export const locales = ["de", "fr", "it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const translations = {
  de: {
    siteTitle: "bike to work – Challenge 2026 Stats",
    nav: {
      topTen: "Top Ten",
      factsAndFigures: "Facts and Figures",
      maps: "Maps",
    },
    topTen: {
      title: "Challenge 2026",
      titleLine2: "top 10 Betriebe",
      description:
        "Gib den Namen deines Betriebes ein und finde heraus wie dein Betrieb in den verschiedenen Kategorien bei der bike to work Challenge abgeschnitten hat.",
      searchPlaceholder: "Betrieb suchen...",
      noResults: "Kein Betrieb gefunden",
      loadMore: "Mehr laden",
    },
    metrics: {
      beteiligung: "Beteiligung %",
      teams: "Anzahl Teams",
      distanz: "Distanz",
      kmProMa: "km pro MA",
      betriebsgroesse: "Betriebsgrösse",
    },
    sizes: {
      alle: "Alle Betriebe",
      mehr5000: "mehr 5’000 MA",
      bis5000: "bis 5’000 MA",
      bis1000: "bis 1’000 MA",
      bis500: "bis 500 MA",
      bis200: "bis 200 MA",
    },
    units: {
      ma: "MA",
      teams: "Teams",
      percent: "%",
      km: "km",
      co2: "kg CO₂",
    },
    common: {
      loading: "Laden...",
      unavailable: "Diese Seite ist momentan nicht verfügbar.",
      backToHome: "Zurück zur Startseite",
    },
    maps: {
      title: "Challenge 2026",
      titleLine2: "Kartenansichten",
      betriebe: "Teilnehmende Betriebe in der Schweiz",
      gemeinde: "Beteiligung nach Gemeinde",
      kanton: "Beteiligung nach Kanton",
      potenzial: "Potenzial pro Gemeinde",
    },
    facts: {
      title: "Challenge 2026",
      titleLine2: "Zahlen & Fakten",
      teilnehmende: "Teilnehmende",
      betriebe: "Betriebe",
      erdeText: "So viele Male seid ihr um die Erde geradelt",
      erdeSuffix: "x",
      co2Text:
        "So viel CO₂ habt ihr eingespart – das entspricht so vielen Flügen Schweiz–New York",
      teilnahmedauer: "Teilnahmedauer",
    },
    footer: {
      about: "Über uns",
      sponsors: "Sponsoren",
      contact: "Kontakt",
      newsletter: "Newsletter",
      actionBy: "eine Aktion von",
      supportedBy: "Unterstützt durch",
      terms: "AGB",
      privacy: "Datenschutz",
    },
  },
  fr: {
    siteTitle: "bike to work – Challenge 2026 Stats",
    nav: {
      topTen: "Top Ten",
      factsAndFigures: "Facts and Figures",
      maps: "Maps",
    },
    topTen: {
      title: "Challenge 2026",
      titleLine2: "top 10 entreprises",
      description:
        "Saisis le nom de ton entreprise et découvre comment elle s'est classée dans les différentes catégories du challenge bike to work.",
      searchPlaceholder: "Rechercher une entreprise...",
      noResults: "Aucune entreprise trouvée",
      loadMore: "Afficher plus",
    },
    metrics: {
      beteiligung: "Participation %",
      teams: "Nombre d'équipes",
      distanz: "Distance",
      kmProMa: "km par collab.",
      betriebsgroesse: "Taille",
    },
    sizes: {
      alle: "Toutes les entreprises",
      mehr5000: "plus de 5’000 collab.",
      bis5000: "jusqu'à 5’000 collab.",
      bis1000: "jusqu'à 1’000 collab.",
      bis500: "jusqu'à 500 collab.",
      bis200: "jusqu'à 200 collab.",
    },
    units: {
      ma: "collab.",
      teams: "équipes",
      percent: "%",
      km: "km",
      co2: "kg CO₂",
    },
    common: {
      loading: "Chargement...",
      unavailable: "Cette page n'est pas disponible pour le moment.",
      backToHome: "Retour à la page d'accueil",
    },
    maps: {
      title: "Challenge 2026",
      titleLine2: "Cartes",
      betriebe: "Entreprises participantes en Suisse",
      gemeinde: "Participation par commune",
      kanton: "Participation par canton",
      potenzial: "Potentiel par commune",
    },
    facts: {
      title: "Challenge 2026",
      titleLine2: "Chiffres & faits",
      teilnehmende: "Participant·e·s",
      betriebe: "Entreprises",
      erdeText: "Autant de fois vous avez fait le tour de la Terre à vélo",
      erdeSuffix: "x",
      co2Text:
        "Autant de CO₂ vous avez économisé – cela correspond à autant de vols Suisse–New York",
      teilnahmedauer: "Durée de participation",
    },
    footer: {
      about: "À propos",
      sponsors: "Sponsors",
      contact: "Contact",
      newsletter: "Newsletter",
      actionBy: "une action de",
      supportedBy: "Soutenu par",
      terms: "CGV",
      privacy: "Protection des données",
    },
  },
  it: {
    siteTitle: "bike to work – Challenge 2026 Stats",
    nav: {
      topTen: "Top Ten",
      factsAndFigures: "Facts and Figures",
      maps: "Maps",
    },
    topTen: {
      title: "Challenge 2026",
      titleLine2: "top 10 aziende",
      description:
        "Inserisci il nome della tua azienda e scopri come si è classificata nelle diverse categorie della sfida bike to work.",
      searchPlaceholder: "Cerca azienda...",
      noResults: "Nessuna azienda trovata",
      loadMore: "Mostra di più",
    },
    metrics: {
      beteiligung: "Partecipazione %",
      teams: "Numero di squadre",
      distanz: "Distanza",
      kmProMa: "km per collab.",
      betriebsgroesse: "Dimensione",
    },
    sizes: {
      alle: "Tutte le aziende",
      mehr5000: "più di 5’000 collab.",
      bis5000: "fino a 5’000 collab.",
      bis1000: "fino a 1’000 collab.",
      bis500: "fino a 500 collab.",
      bis200: "fino a 200 collab.",
    },
    units: {
      ma: "collab.",
      teams: "squadre",
      percent: "%",
      km: "km",
      co2: "kg CO₂",
    },
    common: {
      loading: "Caricamento...",
      unavailable: "Questa pagina non è al momento disponibile.",
      backToHome: "Torna alla pagina iniziale",
    },
    maps: {
      title: "Challenge 2026",
      titleLine2: "Mappe",
      betriebe: "Aziende partecipanti in Svizzera",
      gemeinde: "Partecipazione per comune",
      kanton: "Partecipazione per cantone",
      potenzial: "Potenziale per comune",
    },
    facts: {
      title: "Challenge 2026",
      titleLine2: "Cifre & fatti",
      teilnehmende: "Partecipanti",
      betriebe: "Aziende",
      erdeText: "Tante volte avete fatto il giro della Terra in bici",
      erdeSuffix: "x",
      co2Text:
        "Tanto CO₂ avete risparmiato – corrisponde a tanti voli Svizzera–New York",
      teilnahmedauer: "Durata di partecipazione",
    },
    footer: {
      about: "Chi siamo",
      sponsors: "Sponsor",
      contact: "Contatto",
      newsletter: "Newsletter",
      actionBy: "un'azione di",
      supportedBy: "Sostenuto da",
      terms: "CGC",
      privacy: "Protezione dei dati",
    },
  },
  en: {
    siteTitle: "bike to work – Challenge 2026 Stats",
    nav: {
      topTen: "Top Ten",
      factsAndFigures: "Facts and Figures",
      maps: "Maps",
    },
    topTen: {
      title: "Challenge 2026",
      titleLine2: "top 10 companies",
      description:
        "Enter the name of your company and find out how it performed in the various categories of the bike to work challenge.",
      searchPlaceholder: "Search company...",
      noResults: "No company found",
      loadMore: "Load more",
    },
    metrics: {
      beteiligung: "Participation %",
      teams: "Number of teams",
      distanz: "Distance",
      kmProMa: "km per employee",
      betriebsgroesse: "Company size",
    },
    sizes: {
      alle: "All companies",
      mehr5000: "over 5,000 employees",
      bis5000: "up to 5,000 employees",
      bis1000: "up to 1,000 employees",
      bis500: "up to 500 employees",
      bis200: "up to 200 employees",
    },
    units: {
      ma: "empl.",
      teams: "teams",
      percent: "%",
      km: "km",
      co2: "kg CO₂",
    },
    common: {
      loading: "Loading...",
      unavailable: "This page is currently unavailable.",
      backToHome: "Back to home page",
    },
    maps: {
      title: "Challenge 2026",
      titleLine2: "Map views",
      betriebe: "Participating companies in Switzerland",
      gemeinde: "Participation by municipality",
      kanton: "Participation by canton",
      potenzial: "Potential by municipality",
    },
    facts: {
      title: "Challenge 2026",
      titleLine2: "Facts & Figures",
      teilnehmende: "Participants",
      betriebe: "Companies",
      erdeText: "That's how many times you've cycled around the Earth",
      erdeSuffix: "x",
      co2Text:
        "That's how much CO₂ you've saved – equivalent to that many flights Switzerland–New York",
      teilnahmedauer: "Duration of participation",
    },
    footer: {
      about: "About us",
      sponsors: "Sponsors",
      contact: "Contact",
      newsletter: "Newsletter",
      actionBy: "an initiative by",
      supportedBy: "Supported by",
      terms: "Terms",
      privacy: "Privacy Policy",
    },
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepStringify<T[K]> : T[K];
};

export type Translations = DeepStringify<(typeof translations)["de"]>;

export function getTranslations(locale: Locale): Translations {
  return (translations[locale] || translations.de) as Translations;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}
