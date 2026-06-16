import { defineType, defineField } from "sanity";

export default defineType({
  name: "mapsPage",
  title: "Maps-Seite",
  type: "document",
  icon: () => "🗺️",
  fields: [
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
        defineField({
          name: "visible",
          title: "Sichtbar",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Teilnehmende Betriebe in der Schweiz",
        }),
        defineField({
          name: "description",
          title: "Beschreibung (optional)",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "mapGemeinde",
      title: "Karte: Beteiligung nach Gemeinde",
      type: "object",
      fields: [
        defineField({
          name: "visible",
          title: "Sichtbar",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Beteiligung nach Gemeinde",
        }),
        defineField({
          name: "description",
          title: "Beschreibung (optional)",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "mapKanton",
      title: "Karte: Beteiligung nach Kanton",
      type: "object",
      fields: [
        defineField({
          name: "visible",
          title: "Sichtbar",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Beteiligung nach Kanton",
        }),
        defineField({
          name: "description",
          title: "Beschreibung (optional)",
          type: "text",
          rows: 2,
          initialValue:
            "Trimmed Mean (10%) der Teilnahmequote pro Kanton. Die obersten und untersten 10% der Werte werden entfernt.",
        }),
      ],
    }),
    defineField({
      name: "mapPotenzial",
      title: "Karte: Potenzial pro Gemeinde",
      type: "object",
      fields: [
        defineField({
          name: "visible",
          title: "Sichtbar",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Potenzial pro Gemeinde",
        }),
        defineField({
          name: "description",
          title: "Beschreibung (optional)",
          type: "text",
          rows: 2,
          initialValue:
            "Basierend auf Bevölkerungsdichte und erwartetem Anteil teilnehmender Betriebe. Dunkelblau = überperformt, Pink = ungenutztes Potenzial.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Maps-Seite" };
    },
  },
});
