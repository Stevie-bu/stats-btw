import { defineType, defineField } from "sanity";

export default defineType({
  name: "mapsPage",
  title: "Maps-Seite",
  type: "document",
  icon: () => "🗺️",
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
      name: "published",
      title: "Seite veröffentlicht",
      description: "Wenn deaktiviert, ist die Seite nicht aufrufbar und verschwindet aus der Navigation.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "title",
      title: "Seitentitel (Zeile 1)",
      type: "string",
      initialValue: "Challenge 2026",
    }),
    defineField({
      name: "titleLine2",
      title: "Seitentitel (Zeile 2, farbig)",
      type: "string",
      initialValue: "Kartenansichten",
    }),
    defineField({
      name: "mapBetriebe",
      title: "Karte: Teilnehmende Betriebe",
      type: "object",
      fields: [
        defineField({ name: "visible", title: "Sichtbar", type: "boolean", initialValue: true }),
        defineField({ name: "title", title: "Titel", type: "string", initialValue: "Teilnehmende Betriebe in der Schweiz" }),
        defineField({ name: "description", title: "Beschreibung (optional)", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "mapGemeinde",
      title: "Karte: Beteiligung nach Gemeinde",
      type: "object",
      fields: [
        defineField({ name: "visible", title: "Sichtbar", type: "boolean", initialValue: true }),
        defineField({ name: "title", title: "Titel", type: "string", initialValue: "Beteiligung nach Gemeinde" }),
        defineField({ name: "description", title: "Beschreibung (optional)", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "mapKanton",
      title: "Karte: Beteiligung nach Kanton",
      type: "object",
      fields: [
        defineField({ name: "visible", title: "Sichtbar", type: "boolean", initialValue: true }),
        defineField({ name: "title", title: "Titel", type: "string", initialValue: "Beteiligung nach Kanton" }),
        defineField({ name: "description", title: "Beschreibung (optional)", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "mapPotenzial",
      title: "Karte: Potenzial pro Gemeinde",
      type: "object",
      fields: [
        defineField({ name: "visible", title: "Sichtbar", type: "boolean", initialValue: true }),
        defineField({ name: "title", title: "Titel", type: "string", initialValue: "Potenzial pro Gemeinde" }),
        defineField({ name: "description", title: "Beschreibung (optional)", type: "text", rows: 2 }),
      ],
    }),
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
      return { title: `Maps – ${labels[sprache] || sprache}` };
    },
  },
});
