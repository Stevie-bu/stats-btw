import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteTexts",
  title: "Seitentexte",
  type: "document",
  icon: () => "✏️",
  fields: [
    defineField({
      name: "sprache",
      title: "Sprache",
      type: "string",
      options: {
        list: [
          { title: "Deutsch", value: "de" },
          { title: "Français", value: "fr" },
          { title: "Italiano", value: "it" },
          { title: "English", value: "en" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aktiv",
      title: "Sprache aktiv",
      type: "boolean",
      description: "Wenn deaktiviert, wird diese Sprache im Menü nicht angezeigt",
      initialValue: true,
    }),

    // --- Top Ten Seite ---
    defineField({
      name: "topTenPublished",
      title: "Seite veröffentlicht",
      description: "Wenn deaktiviert, ist die Top Ten Seite nicht aufrufbar und verschwindet aus der Navigation.",
      type: "boolean",
      initialValue: true,
      group: "topTen",
    }),
    defineField({
      name: "topTenTitle",
      title: "Titel (Zeile 1)",
      type: "string",
      group: "topTen",
    }),
    defineField({
      name: "topTenTitleLine2",
      title: "Titel (Zeile 2, farbig)",
      type: "string",
      group: "topTen",
    }),
    defineField({
      name: "topTenDescription",
      title: "Beschreibungstext",
      type: "text",
      rows: 3,
      group: "topTen",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Suchfeld Platzhalter",
      type: "string",
      group: "topTen",
    }),
    defineField({
      name: "noResults",
      title: "Text: Kein Ergebnis",
      type: "string",
      group: "topTen",
    }),
    defineField({
      name: "loadMore",
      title: "Button: Mehr laden",
      type: "string",
      group: "topTen",
    }),

    // --- Metriken (Tab-Labels, Kategorien, Einheiten) ---
    defineField({
      name: "metricBeteiligung",
      title: "Tab: Beteiligung",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "metricTeams",
      title: "Tab: Teams",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "metricDistanz",
      title: "Tab: Distanz",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "metricKmProMa",
      title: "Tab: km pro Mitarbeitende",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "metricBetriebsgroesse",
      title: "Tab: Betriebsgrösse",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "sizeAlle",
      title: "Kategorie: Alle Betriebe",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "sizeMehr5000",
      title: "Kategorie: mehr als 5'000",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "sizeBis5000",
      title: "Kategorie: bis 5'000",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "sizeBis1000",
      title: "Kategorie: bis 1'000",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "sizeBis500",
      title: "Kategorie: bis 500",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "sizeBis200",
      title: "Kategorie: bis 200",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "unitMa",
      title: "Einheit: Mitarbeitende",
      type: "string",
      description: "z.B. «MA» oder «collab.»",
      group: "metriken",
    }),
    defineField({
      name: "unitTeams",
      title: "Einheit: Teams",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "unitPercent",
      title: "Einheit: Prozent",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "unitKm",
      title: "Einheit: Kilometer",
      type: "string",
      group: "metriken",
    }),
    defineField({
      name: "unitCo2",
      title: "Einheit: CO₂",
      type: "string",
      group: "metriken",
    }),

    // --- Distanz-Feature ---
    defineField({
      name: "distanzKmTotal",
      title: "Label: km total",
      type: "string",
      description: "Text nach der Zahl, z.B. «km total»",
      group: "distanz",
    }),
    defineField({
      name: "distanzZiel",
      title: "Label: Ziel",
      type: "string",
      description: "z.B. «Ziel:»",
      group: "distanz",
    }),
    defineField({
      name: "distanzZumZiel",
      title: "Label: Distanz zum Ziel",
      type: "string",
      description: "z.B. «Distanz zum Ziel:»",
      group: "distanz",
    }),
    defineField({
      name: "distanzUmDieWelt",
      title: "Label: um die Welt",
      type: "string",
      description: "Text nach der Zahl, z.B. «× um die Welt»",
      group: "distanz",
    }),

    // --- Allgemein ---
    defineField({
      name: "noDataText",
      title: "Keine Statistiken verfügbar",
      type: "string",
      description: "Wird angezeigt wenn keine Betriebsdaten vorhanden sind (z.B. vor dem Launch)",
      group: "common",
    }),
    defineField({
      name: "loadingText",
      title: "Ladetext",
      type: "string",
      description: "Wird angezeigt während Daten geladen werden",
      group: "common",
    }),
    defineField({
      name: "unavailableText",
      title: "Seite nicht verfügbar",
      type: "string",
      description: "Wird angezeigt wenn eine Seite deaktiviert ist",
      group: "common",
    }),
    defineField({
      name: "backToHome",
      title: "Link: Zurück zur Startseite",
      type: "string",
      group: "common",
    }),

    // --- Fehlerseiten ---
    defineField({
      name: "error404Text",
      title: "404: Seite nicht gefunden",
      type: "string",
      description: "Text auf der 404-Fehlerseite",
      group: "errors",
    }),
    defineField({
      name: "error404Link",
      title: "404: Link-Text",
      type: "string",
      description: "Text des Buttons auf der 404-Seite (z.B. «Zurück zur Startseite»)",
      group: "errors",
    }),
    defineField({
      name: "error500Text",
      title: "500: Fehler aufgetreten",
      type: "string",
      description: "Text auf der 500-Fehlerseite",
      group: "errors",
    }),
    defineField({
      name: "error500Button",
      title: "500: Button-Text",
      type: "string",
      description: "Text des Retry-Buttons auf der 500-Seite (z.B. «Erneut versuchen»)",
      group: "errors",
    }),
  ],
  groups: [
    { name: "topTen", title: "Top Ten Seite" },
    { name: "metriken", title: "Metriken & Kategorien" },
    { name: "distanz", title: "Distanz-Feature" },
    { name: "common", title: "Allgemein" },
    { name: "errors", title: "Fehlerseiten" },
  ],
  preview: {
    select: { sprache: "sprache" },
    prepare({ sprache }) {
      const labels: Record<string, string> = {
        de: "Deutsch",
        fr: "Français",
        it: "Italiano",
        en: "English",
      };
      return { title: `Seitentexte – ${labels[sprache] || sprache}` };
    },
  },
});
