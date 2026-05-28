import { defineField, defineType } from "sanity";

export default defineType({
  name: "factsYear",
  title: "Facts & Figures – Jahresdaten",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Jahr",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teilnehmende",
      title: "Teilnehmende",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "wachstumTeilnehmende",
      title: "Wachstum Teilnehmende (%)",
      type: "string",
    }),
    defineField({
      name: "betriebe",
      title: "Betriebe",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "wachstumBetriebe",
      title: "Wachstum Betriebe (%)",
      type: "string",
    }),
    defineField({
      name: "teams",
      title: "Teams",
      type: "number",
    }),
    defineField({
      name: "totalKm",
      title: "Total KM",
      type: "number",
    }),
    defineField({
      name: "co2",
      title: "CO₂-Äquivalenz (kg)",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "year",
      teilnehmende: "teilnehmende",
      betriebe: "betriebe",
    },
    prepare({ title, teilnehmende, betriebe }) {
      return {
        title: String(title || ""),
        subtitle: `${teilnehmende?.toLocaleString("de-CH") || 0} Teilnehmende · ${betriebe || 0} Betriebe`,
      };
    },
  },
  orderings: [
    { title: "Jahr (absteigend)", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
    { title: "Jahr (aufsteigend)", name: "yearAsc", by: [{ field: "year", direction: "asc" }] },
  ],
});
