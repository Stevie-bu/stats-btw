import { defineType, defineField } from "sanity";

export default defineType({
  name: "factsPage",
  title: "Facts & Figures – Seite",
  type: "document",
  icon: () => "📊",
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
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Titel der Seite im Browser-Tab und in Google-Resultaten (50–60 Zeichen ideal)",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Beschreibung in Google-Resultaten (120–160 Zeichen ideal)",
    }),
    defineField({
      name: "published",
      title: "Seite veröffentlicht",
      description:
        "Wenn deaktiviert, ist die Seite nicht aufrufbar und verschwindet aus der Navigation.",
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
      initialValue: "Zahlen & Fakten",
    }),
    defineField({
      name: "sectionTeilnehmende",
      title: "Abschnitt: Teilnehmende",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Teilnehmende",
        }),
      ],
    }),
    defineField({
      name: "sectionBetriebe",
      title: "Abschnitt: Betriebe",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Betriebe",
        }),
      ],
    }),
    defineField({
      name: "sectionErde",
      title: "Abschnitt: Um die Erde geradelt",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "string",
          initialValue: "So viele Male seid ihr um die Erde geradelt",
        }),
        defineField({
          name: "suffix",
          title: "Suffix nach der Zahl",
          type: "string",
          initialValue: "x",
        }),
        defineField({
          name: "kmTotalLabel",
          title: "Label: km total",
          type: "string",
          description: "Text unter der Zahl, z.B. «km total»",
          initialValue: "km total",
        }),
      ],
    }),
    defineField({
      name: "sectionCo2",
      title: "Abschnitt: CO₂ eingespart",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "string",
          initialValue:
            "So viel CO₂ habt ihr eingespart – das entspricht so vielen Flügen Schweiz–New York",
        }),
        defineField({
          name: "co2PerFlight",
          title: "CO₂ pro Flug (kg)",
          description: "Wird für die Berechnung der Anzahl Flüge verwendet.",
          type: "number",
          initialValue: 1100,
        }),
        defineField({
          name: "co2TotalLabel",
          title: "Label: CO₂ total",
          type: "string",
          description: "Text unter der Zahl, z.B. «kg CO₂ total»",
          initialValue: "kg CO₂ total",
        }),
      ],
    }),
    defineField({
      name: "sectionDauer",
      title: "Abschnitt: Teilnahmedauer",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Teilnahmedauer",
        }),
        defineField({
          name: "pieUnit",
          title: "Einheit in Legende",
          type: "string",
          description: "Text in der Pie-Chart-Legende, z.B. «Betriebe»",
          initialValue: "Betriebe",
        }),
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
      return { title: `Facts & Figures – ${labels[sprache] || sprache}` };
    },
  },
});
