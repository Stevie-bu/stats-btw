import type { StructureBuilder } from "sanity/structure";
import { BetriebTableList } from "./plugins/table-list/BetriebTableList";

const languages = [
  { id: "de", title: "Deutsch" },
  { id: "fr", title: "Français" },
  { id: "it", title: "Italiano" },
  { id: "en", title: "English" },
];

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Inhalt")
    .items([
      // --- Top Ten ---
      S.listItem()
        .title("Top Ten")
        .icon(() => "🏆")
        .child(
          S.list()
            .title("Top Ten")
            .items([
              ...languages.map((lang) =>
                S.listItem()
                  .title(lang.title)
                  .id(`texts-${lang.id}`)
                  .child(
                    S.documentList()
                      .title(`Top Ten – ${lang.title}`)
                      .filter('_type == "siteTexts" && sprache == $sprache')
                      .params({ sprache: lang.id })
                  )
              ),
              S.divider(),
              S.listItem()
                .title("Sprüche")
                .icon(() => "🌍")
                .child(
                  S.documentTypeList("distanceSaying")
                    .title("Distanz-Sprüche")
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                ),
              S.divider(),
              S.listItem()
                .title("Betriebsliste")
                .icon(() => "📊")
                .child(
                  S.component()
                    .title("Betriebsliste")
                    .id("betrieb-table")
                    .component(BetriebTableList)
                ),
            ])
        ),

      S.divider(),

      // --- Facts & Figures ---
      S.listItem()
        .title("Facts & Figures")
        .icon(() => "📊")
        .child(
          S.list()
            .title("Facts & Figures")
            .items([
              ...languages.map((lang) =>
                S.listItem()
                  .title(lang.title)
                  .id(`facts-page-${lang.id}`)
                  .child(
                    S.documentList()
                      .title(`Facts & Figures – ${lang.title}`)
                      .filter('_type == "factsPage" && sprache == $sprache')
                      .params({ sprache: lang.id })
                  )
              ),
              S.divider(),
              S.documentTypeListItem("factsYear")
                .title("Jahresdaten")
                .icon(() => "📈"),
              S.documentTypeListItem("factsDauer")
                .title("Teilnahmedauer")
                .icon(() => "🥧"),
            ])
        ),

      S.divider(),

      // --- Maps ---
      S.listItem()
        .title("Maps")
        .icon(() => "🗺️")
        .child(
          S.list()
            .title("Maps")
            .items(
              languages.map((lang) =>
                S.listItem()
                  .title(lang.title)
                  .id(`maps-page-${lang.id}`)
                  .child(
                    S.documentList()
                      .title(`Maps – ${lang.title}`)
                      .filter('_type == "mapsPage" && sprache == $sprache')
                      .params({ sprache: lang.id })
                  )
              )
            )
        ),

      S.divider(),

      // --- Allgemein ---
      S.listItem()
        .title("Allgemein")
        .icon(() => "⚙️")
        .child(
          S.list()
            .title("Allgemein")
            .items([
              S.listItem()
                .title("Navigation")
                .icon(() => "🧭")
                .child(
                  S.document()
                    .schemaType("navigationSettings")
                    .documentId("navigationSettings")
                    .title("Navigation")
                ),
              S.divider(),
              S.listItem()
                .title("Footer")
                .icon(() => "🦶")
                .child(
                  S.list()
                    .title("Footer")
                    .items([
                      S.listItem()
                        .title("Einstellungen")
                        .icon(() => "⚙️")
                        .child(
                          S.document()
                            .schemaType("footerSettings")
                            .documentId("footerSettings")
                            .title("Footer Einstellungen")
                        ),
                      S.divider(),
                      ...languages.map((lang) =>
                        S.listItem()
                          .title(`Texte – ${lang.title}`)
                          .id(`footer-texts-${lang.id}`)
                          .child(
                            S.documentList()
                              .title(`Footer Texte – ${lang.title}`)
                              .filter('_type == "footerTexts" && sprache == $sprache')
                              .params({ sprache: lang.id })
                          )
                      ),
                    ])
                ),
            ])
        ),
    ]);
