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

    defineField({
      name: "navTopTen",
      title: "Navigation: Top Ten",
      type: "string",
      group: "navigation",
    }),
    defineField({
      name: "navFacts",
      title: "Navigation: Facts and Figures",
      type: "string",
      group: "navigation",
    }),
    defineField({
      name: "navMaps",
      title: "Navigation: Maps",
      type: "string",
      group: "navigation",
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
  ],
  groups: [
    { name: "navigation", title: "Navigation" },
    { name: "topTen", title: "Top Ten Seite" },
    { name: "common", title: "Allgemein" },
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
