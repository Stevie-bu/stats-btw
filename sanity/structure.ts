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
      S.listItem()
        .title("Betriebsliste")
        .icon(() => "📊")
        .child(
          S.component()
            .title("Betriebsliste")
            .id("betrieb-table")
            .component(BetriebTableList)
        ),
      S.divider(),
      S.listItem()
        .title("Facts & Figures – Seite")
        .icon(() => "📊")
        .child(
          S.document()
            .schemaType("factsPage")
            .documentId("factsPage")
            .title("Facts & Figures – Seite")
        ),
      S.documentTypeListItem("factsYear").title("Facts – Jahresdaten").icon(() => "📈"),
      S.documentTypeListItem("factsDauer").title("Facts – Teilnahmedauer").icon(() => "🥧"),
      S.divider(),
      S.listItem()
        .title("Maps-Seite")
        .icon(() => "🗺️")
        .child(
          S.document()
            .schemaType("mapsPage")
            .documentId("mapsPage")
            .title("Maps-Seite")
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
    ]);
