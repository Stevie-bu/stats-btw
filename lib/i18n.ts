export const locales = ["de", "fr", "it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const translations = {
  de: {
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

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.de;
}
