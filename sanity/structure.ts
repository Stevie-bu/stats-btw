import type { StructureBuilder } from "sanity/structure";
import { BetriebTableList } from "./plugins/table-list/BetriebTableList";

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
      S.documentTypeListItem("factsYear").title("Facts – Jahresdaten").icon(() => "📈"),
      S.documentTypeListItem("factsDauer").title("Facts – Teilnahmedauer").icon(() => "🥧"),
    ]);
