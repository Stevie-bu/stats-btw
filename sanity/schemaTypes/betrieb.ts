import { defineField, defineType } from "sanity";

export default defineType({
  name: "betrieb",
  title: "Betrieb",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Betriebsname",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ort",
      title: "Ort",
      type: "string",
    }),
    defineField({
      name: "mitarbeitende",
      title: "Anzahl Mitarbeitende",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "teams",
      title: "Anzahl Teams",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "beteiligung",
      title: "Beteiligung %",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "veloanteil",
      title: "Velo %",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "distanz",
      title: "Distanz (km)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "co2",
      title: "CO₂ (kg)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "ort",
      mitarbeitende: "mitarbeitende",
      teams: "teams",
    },
    prepare({ title, subtitle, mitarbeitende, teams }) {
      return {
        title: title || "Unbenannt",
        subtitle: `${subtitle || ""} · ${mitarbeitende || 0} MA · ${teams || 0} Teams`,
      };
    },
  },
  orderings: [
    { title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
    { title: "Teams (absteigend)", name: "teamsDesc", by: [{ field: "teams", direction: "desc" }] },
    { title: "Mitarbeitende (absteigend)", name: "maDesc", by: [{ field: "mitarbeitende", direction: "desc" }] },
    { title: "Beteiligung (absteigend)", name: "beteiligungDesc", by: [{ field: "beteiligung", direction: "desc" }] },
  ],
});
