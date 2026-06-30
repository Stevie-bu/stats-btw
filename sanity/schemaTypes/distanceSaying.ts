import { defineType, defineField } from "sanity";

export default defineType({
  name: "distanceSaying",
  title: "Distanz-Spruch",
  type: "document",
  icon: () => "🌍",
  fieldsets: [
    { name: "coords", title: "Koordinaten", options: { columns: 2 } },
    { name: "de", title: "🇩🇪 Deutsch", options: { collapsible: true } },
    { name: "fr", title: "🇫🇷 Français", options: { collapsible: true } },
    { name: "it", title: "🇮🇹 Italiano", options: { collapsible: true } },
    { name: "en", title: "🇬🇧 English", options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Zielort",
      type: "string",
      description: "Name des Ziels (z.B. Rarotonga Cookinseln)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lat",
      title: "Breitengrad",
      type: "number",
      fieldset: "coords",
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: "lon",
      title: "Längengrad",
      type: "number",
      fieldset: "coords",
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    // Deutsch
    defineField({
      name: "nameDe",
      title: "Name",
      type: "string",
      description: "Übersetzter Name (falls abweichend vom Hauptnamen)",
      fieldset: "de",
    }),
    defineField({
      name: "prepositionDe",
      title: "Präposition",
      type: "string",
      description: 'z.B. "bis zum", "bis zur", "bis nach", "bis zu den"',
      fieldset: "de",
    }),
    defineField({
      name: "descriptionDe",
      title: "Beschreibung",
      type: "text",
      rows: 2,
      fieldset: "de",
    }),
    // Français
    defineField({
      name: "nameFr",
      title: "Nom",
      type: "string",
      description: "Nom traduit du lieu",
      fieldset: "fr",
    }),
    defineField({
      name: "prepositionFr",
      title: "Préposition",
      type: "string",
      description: "ex. \"jusqu'au\", \"jusqu'à\", \"jusqu'aux\"",
      fieldset: "fr",
    }),
    defineField({
      name: "descriptionFr",
      title: "Description",
      type: "text",
      rows: 2,
      fieldset: "fr",
    }),
    // Italiano
    defineField({
      name: "nameIt",
      title: "Nome",
      type: "string",
      description: "Nome tradotto del luogo",
      fieldset: "it",
    }),
    defineField({
      name: "prepositionIt",
      title: "Preposizione",
      type: "string",
      description: 'es. "fino al", "fino alla", "fino a"',
      fieldset: "it",
    }),
    defineField({
      name: "descriptionIt",
      title: "Descrizione",
      type: "text",
      rows: 2,
      fieldset: "it",
    }),
    // English
    defineField({
      name: "nameEn",
      title: "Name",
      type: "string",
      description: "Translated name of the destination",
      fieldset: "en",
    }),
    defineField({
      name: "prepositionEn",
      title: "Preposition",
      type: "string",
      description: 'e.g. "to", "to the"',
      fieldset: "en",
    }),
    defineField({
      name: "descriptionEn",
      title: "Description",
      type: "text",
      rows: 2,
      fieldset: "en",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "descriptionDe" },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
