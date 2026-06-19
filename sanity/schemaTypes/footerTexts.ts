import { defineType, defineField } from "sanity";

export default defineType({
  name: "footerTexts",
  title: "Footer Texte",
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
      name: "menuItems",
      title: "Menüpunkte",
      description: "Links im Footer-Menü (z.B. Über uns, Kontakt, Newsletter)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),

    defineField({
      name: "actionByLabel",
      title: "«Aktion von» Text",
      type: "string",
      description: "z.B. «eine Aktion von» / «une action de»",
    }),
    defineField({
      name: "supportedByLabel",
      title: "«Unterstützt von» Text",
      type: "string",
      description: "z.B. «Unterstützt durch» / «Soutenu par»",
    }),

    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: "z.B. «© 2026 bike to work»",
    }),

    defineField({
      name: "termsLabel",
      title: "AGB Linktext",
      type: "string",
      description: "z.B. «AGB» / «CGV» / «Terms»",
    }),
    defineField({
      name: "termsUrl",
      title: "AGB URL",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "privacyLabel",
      title: "Datenschutz Linktext",
      type: "string",
      description: "z.B. «Datenschutz» / «Protection des données»",
    }),
    defineField({
      name: "privacyUrl",
      title: "Datenschutz URL",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
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
      return { title: `Footer Texte – ${labels[sprache] || sprache}` };
    },
  },
});
