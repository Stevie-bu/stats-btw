import { defineType, defineField } from "sanity";

export default defineType({
  name: "navigationSettings",
  title: "Navigation",
  type: "document",
  icon: () => "🧭",
  fields: [
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description: "Kleines Icon im Browser-Tab (PNG, 32×32px oder 180×180px)",
    }),
    defineField({
      name: "headerLogo",
      title: "Header Logo",
      type: "image",
      description: "Logo oben links im Header (SVG oder PNG)",
      options: { hotspot: true },
    }),
    defineField({
      name: "headerLogoUrl",
      title: "Header Logo Link",
      type: "url",
      description: "URL hinter dem Logo (z.B. https://www.biketowork.ch)",
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "headCode",
      title: "Head Code (z.B. Google Tag Manager)",
      type: "text",
      rows: 8,
      description: "Code-Snippet das im <head> jeder Seite eingefügt wird. Hier z.B. den Google Tag Manager Code einfügen.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Navigation" };
    },
  },
});
