import { defineType, defineField } from "sanity";

export default defineType({
  name: "footerSettings",
  title: "Footer Einstellungen",
  type: "document",
  icon: () => "🦶",
  fields: [
    defineField({
      name: "socialLinks",
      title: "Social Media",
      description: "Social-Media-Links mit Icons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Plattform",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              description: "SVG oder PNG Icon",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url", media: "icon" },
          },
        },
      ],
    }),

    defineField({
      name: "actionByLogo",
      title: "«Aktion von» Logo",
      type: "image",
      description: "Logo der Organisation (z.B. Pro Velo)",
      options: { hotspot: true },
    }),
    defineField({
      name: "actionByUrl",
      title: "«Aktion von» Link",
      type: "url",
      description: "URL hinter dem Logo",
    }),

    defineField({
      name: "supporters",
      title: "Unterstützer",
      description: "Unterstützer-Logos mit Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer Einstellungen" };
    },
  },
});
