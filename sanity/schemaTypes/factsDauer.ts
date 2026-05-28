import { defineField, defineType } from "sanity";

export default defineType({
  name: "factsDauer",
  title: "Facts & Figures – Teilnahmedauer",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "anzahl",
      title: "Anzahl Betriebe",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "prozent",
      title: "Prozent (%)",
      type: "number",
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: "sortOrder",
      title: "Reihenfolge",
      type: "number",
      description: "Kleinere Zahl = weiter oben",
    }),
  ],
  preview: {
    select: {
      title: "label",
      anzahl: "anzahl",
      prozent: "prozent",
    },
    prepare({ title, anzahl, prozent }) {
      return {
        title: title || "",
        subtitle: `${anzahl || 0} Betriebe · ${prozent || 0}%`,
      };
    },
  },
  orderings: [
    { title: "Reihenfolge", name: "sortAsc", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
});
