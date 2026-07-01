import { defineType, defineField } from "sanity";

export default defineType({
  name: "navigationSettings",
  title: "Navigation",
  type: "document",
  icon: () => "🧭",
  fieldsets: [
    { name: "de", title: "🇩🇪 Deutsch", options: { collapsible: true } },
    { name: "fr", title: "🇫🇷 Français", options: { collapsible: true } },
    { name: "it", title: "🇮🇹 Italiano", options: { collapsible: true } },
    { name: "en", title: "🇬🇧 English", options: { collapsible: true } },
  ],
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
    // 🇩🇪 Deutsch
    defineField({ name: "navTopTenDe", title: "Top Ten", type: "string", fieldset: "de" }),
    defineField({ name: "navFactsDe", title: "Facts and Figures", type: "string", fieldset: "de" }),
    defineField({ name: "navMapsDe", title: "Maps", type: "string", fieldset: "de" }),
    // 🇫🇷 Français
    defineField({ name: "navTopTenFr", title: "Top Ten", type: "string", fieldset: "fr" }),
    defineField({ name: "navFactsFr", title: "Facts and Figures", type: "string", fieldset: "fr" }),
    defineField({ name: "navMapsFr", title: "Maps", type: "string", fieldset: "fr" }),
    // 🇮🇹 Italiano
    defineField({ name: "navTopTenIt", title: "Top Ten", type: "string", fieldset: "it" }),
    defineField({ name: "navFactsIt", title: "Facts and Figures", type: "string", fieldset: "it" }),
    defineField({ name: "navMapsIt", title: "Maps", type: "string", fieldset: "it" }),
    // 🇬🇧 English
    defineField({ name: "navTopTenEn", title: "Top Ten", type: "string", fieldset: "en" }),
    defineField({ name: "navFactsEn", title: "Facts and Figures", type: "string", fieldset: "en" }),
    defineField({ name: "navMapsEn", title: "Maps", type: "string", fieldset: "en" }),
  ],
  preview: {
    prepare() {
      return { title: "Navigation" };
    },
  },
});
