import { useCallback, useEffect, useRef, useState } from "react";
import { useClient, useCurrentUser } from "sanity";
import { useRouter } from "sanity/router";

interface BetriebDoc {
  _id: string;
  _rev?: string;
  name: string;
  ort: string;
  mitarbeitende: number;
  teams: number;
  beteiligung: number;
  veloanteil: number;
  distanz: number;
  co2: number;
  _isDraft?: boolean;
}

type SortField =
  | "name"
  | "ort"
  | "mitarbeitende"
  | "teams"
  | "beteiligung"
  | "veloanteil"
  | "distanz"
  | "co2";
type SortDir = "asc" | "desc";

const QUERY = `{
  "published": *[_type == "betrieb" && !(_id in path("drafts.**"))]{
    _id, name, ort, mitarbeitende, teams, beteiligung, veloanteil, distanz, co2
  },
  "drafts": *[_type == "betrieb" && _id in path("drafts.**")]{
    _id, name, ort, mitarbeitende, teams, beteiligung, veloanteil, distanz, co2
  }
}`;

function formatNum(n: number | undefined): string {
  if (n == null) return "–";
  const rounded = Math.round(n);
  const s = rounded.toString();
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join("\u2019");
}

function formatPct(n: number | undefined): string {
  if (n == null) return "–";
  if (Number.isInteger(n)) return `${n}%`;
  return `${n.toFixed(1)}%`;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(sep);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (vals[i] || "").trim();
    });
    return obj;
  });
}

function toCSV(data: BetriebDoc[]): string {
  const headers = [
    "Betriebsname",
    "Ort",
    "Anzahl Mitarbeitende",
    "Anzahl Teams",
    "Beteiligung %",
    "Velo %",
    "Gesamtkilometer",
    "CO2 in KG",
  ];
  const rows = data.map((b) =>
    [
      b.name,
      b.ort,
      b.mitarbeitende,
      b.teams,
      b.beteiligung,
      b.veloanteil,
      b.distanz,
      b.co2,
    ].join(";")
  );
  return [headers.join(";"), ...rows].join("\n");
}

function mapCSVRow(row: Record<string, string>): Omit<BetriebDoc, "_id"> | null {
  const name =
    row["Betriebsname"] || row["name"] || row["Name"] || row["betriebsname"];
  if (!name) return null;
  return {
    name: name.trim(),
    ort: (row["Ort"] || row["ort"] || "").trim(),
    mitarbeitende: parseInt(row["Anzahl Mitarbeitende"] || row["mitarbeitende"] || "0") || 0,
    teams: parseInt(row["Anzahl Teams"] || row["teams"] || "0") || 0,
    beteiligung: parseFloat(row["Beteiligung %"] || row["beteiligung"] || "0") || 0,
    veloanteil: parseFloat(row["Velo %"] || row["veloanteil"] || "0") || 0,
    distanz: parseFloat(row["Gesamtkilometer"] || row["distanz"] || "0") || 0,
    co2: parseFloat(row["CO2 in KG"] || row["co2"] || "0") || 0,
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

/* ------------------------------------------------------------------ */

export function BetriebTableList() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<BetriebDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState("");

  const fetchData = useCallback(async () => {
    const result = await client.fetch<{
      published: BetriebDoc[];
      drafts: BetriebDoc[];
    }>(QUERY);

    const publishedIds = new Set(result.published.map((d) => d._id));
    const draftBaseIds = new Set(
      result.drafts.map((d) => d._id.replace("drafts.", ""))
    );

    const merged: BetriebDoc[] = [];

    // Published docs that have no draft
    for (const doc of result.published) {
      if (!draftBaseIds.has(doc._id)) {
        merged.push({ ...doc, _isDraft: false });
      }
    }

    // Draft docs (show draft version, mark if also published)
    for (const doc of result.drafts) {
      const baseId = doc._id.replace("drafts.", "");
      merged.push({
        ...doc,
        _id: baseId,
        _isDraft: true,
      });
    }

    setData(merged);
    setLoading(false);
  }, [client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir(field === "name" || field === "ort" ? "asc" : "desc");
      }
    },
    [sortField]
  );

  const filtered = data
    .filter((b) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.name?.toLowerCase().includes(q) || b.ort?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal, "de")
          : bVal.localeCompare(aVal, "de");
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

  const allSelected =
    filtered.length > 0 && filtered.every((b) => selected.has(b._id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((b) => b._id)));
    }
  };

  const openDoc = useCallback(
    (id: string) => {
      router.navigateIntent("edit", { id });
    },
    [router]
  );

  /* Actions */
  const handlePublish = async () => {
    if (selected.size === 0) return;
    setBusy("Publizieren...");
    try {
      for (const id of selected) {
        const doc = data.find((d) => d._id === id);
        if (doc && doc._isDraft) {
          const { _isDraft, _rev, ...rest } = doc;
          await client.createOrReplace({ ...rest, _id: id, _type: "betrieb" });
          try { await client.delete(`drafts.${id}`); } catch { /* ok */ }
        }
      }
      setSelected(new Set());
      await fetchData();
    } catch (err) {
      console.error("Publish failed:", err);
      alert(`Publizieren fehlgeschlagen: ${err instanceof Error ? err.message : err}`);
    }
    setBusy("");
  };

  const handleUnpublish = async () => {
    if (selected.size === 0) return;
    setBusy("Als Entwurf...");
    try {
      for (const id of selected) {
        const doc = data.find((d) => d._id === id);
        if (doc && !doc._isDraft) {
          const { _isDraft, _rev, ...rest } = doc;
          await client.createOrReplace({
            ...rest,
            _id: `drafts.${id}`,
            _type: "betrieb",
          });
          try { await client.delete(id); } catch { /* ok */ }
        }
      }
      setSelected(new Set());
      await fetchData();
    } catch (err) {
      console.error("Unpublish failed:", err);
      alert(`Als Entwurf fehlgeschlagen: ${err instanceof Error ? err.message : err}`);
    }
    setBusy("");
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    const count = selected.size;
    if (!confirm(`${count} Eintrag/Einträge wirklich löschen?`)) return;
    setBusy("Löschen...");
    try {
      for (const id of selected) {
        // Delete both published and draft versions
        try { await client.delete(id); } catch { /* may not exist */ }
        try { await client.delete(`drafts.${id}`); } catch { /* may not exist */ }
      }
      setSelected(new Set());
      await fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`Löschen fehlgeschlagen: ${err instanceof Error ? err.message : err}`);
    }
    setBusy("");
  };

  const handleExport = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "betriebsliste.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy("Importieren...");
    const text = await file.text();
    const rows = parseCSV(text);
    const BATCH = 100;

    const seen = new Map<string, number>();
    let imported = 0;

    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const tx = client.transaction();
      for (const row of batch) {
        const mapped = mapCSVRow(row);
        if (!mapped) continue;
        let slug = slugify(mapped.name);
        const count = seen.get(slug) || 0;
        seen.set(slug, count + 1);
        if (count > 0) slug = `${slug}-${count + 1}`;
        tx.createOrReplace({
          _id: `betrieb-${slug}`,
          _type: "betrieb",
          ...mapped,
        });
        imported++;
      }
      await tx.commit();
      setBusy(`Importieren... (${Math.min(i + BATCH, rows.length)}/${rows.length})`);
    }

    setBusy("");
    alert(`${imported} Betriebe importiert`);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchData();
  };

  const selectedDraftCount = [...selected].filter((id) =>
    data.find((d) => d._id === id && d._isDraft)
  ).length;
  const selectedPublishedCount = [...selected].filter((id) =>
    data.find((d) => d._id === id && !d._isDraft)
  ).length;

  const columns: {
    key: SortField;
    label: string;
    align?: "right";
    width?: number;
    format: (b: BetriebDoc) => string;
  }[] = [
    { key: "name", label: "Betriebsname", format: (b) => b.name || "–" },
    { key: "ort", label: "Ort", width: 120, format: (b) => b.ort || "–" },
    {
      key: "mitarbeitende",
      label: "MA",
      align: "right",
      width: 70,
      format: (b) => formatNum(b.mitarbeitende),
    },
    {
      key: "teams",
      label: "Teams",
      align: "right",
      width: 70,
      format: (b) => formatNum(b.teams),
    },
    {
      key: "beteiligung",
      label: "Beteiligung",
      align: "right",
      width: 90,
      format: (b) => formatPct(b.beteiligung),
    },
    {
      key: "veloanteil",
      label: "Velo %",
      align: "right",
      width: 70,
      format: (b) => formatPct(b.veloanteil),
    },
    {
      key: "distanz",
      label: "Distanz",
      align: "right",
      width: 100,
      format: (b) => `${formatNum(b.distanz)} km`,
    },
    {
      key: "co2",
      label: "CO₂",
      align: "right",
      width: 90,
      format: (b) => `${formatNum(b.co2)} kg`,
    },
  ];

  const btnBase: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid #ddd",
    background: "white",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e5e5e5",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Betriebsliste
            </h2>
            <span style={{ fontSize: 13, color: "#888" }}>
              {loading
                ? "Laden..."
                : busy || `${filtered.length} Einträge`}
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen..."
            style={{
              padding: "8px 14px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 14,
              width: 220,
              outline: "none",
            }}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: "none" }}
          />
          <button
            style={{ ...btnBase, color: "#2563eb" }}
            onClick={() => fileInputRef.current?.click()}
            disabled={!!busy}
          >
            ↑ Importieren
          </button>
          <button
            style={{ ...btnBase, color: "#333" }}
            onClick={handleExport}
            disabled={!!busy}
          >
            ↓ Export
          </button>
          {selected.size > 0 && (
            <>
              {selectedDraftCount > 0 && (
                <button
                  style={{
                    ...btnBase,
                    color: "white",
                    background: "#2563eb",
                    border: "1px solid #2563eb",
                  }}
                  onClick={handlePublish}
                  disabled={!!busy}
                >
                  ↗ Publizieren ({selectedDraftCount})
                </button>
              )}
              {selectedPublishedCount > 0 && (
                <button
                  style={{
                    ...btnBase,
                    color: "#c2410c",
                    border: "1px solid #c2410c",
                  }}
                  onClick={handleUnpublish}
                  disabled={!!busy}
                >
                  Als Entwurf ({selectedPublishedCount})
                </button>
              )}
              <button
                style={{
                  ...btnBase,
                  color: "#dc2626",
                  border: "1px solid #dc2626",
                }}
                onClick={handleDelete}
                disabled={!!busy}
              >
                🗑 Löschen ({selected.size})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr
              style={{
                position: "sticky",
                top: 0,
                background: "#fafafa",
                zIndex: 1,
              }}
            >
              <th
                style={{
                  padding: "10px 8px",
                  width: 36,
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "right",
                  fontWeight: 600,
                  borderBottom: "1px solid #e5e5e5",
                  width: 50,
                  color: "#666",
                  fontSize: 12,
                }}
              >
                Nr.
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  width: 20,
                  borderBottom: "1px solid #e5e5e5",
                  fontSize: 12,
                  color: "#666",
                }}
              >
                {/* status */}
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: "10px 10px",
                    textAlign: col.align || "left",
                    fontWeight: 600,
                    borderBottom: "1px solid #e5e5e5",
                    cursor: "pointer",
                    userSelect: "none",
                    color: "#666",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span style={{ marginLeft: 4 }}>
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const isSelected = selected.has(b._id);
              return (
                <tr
                  key={b._id}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: isSelected ? "#f0f4ff" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background =
                        "#f9f9f9";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      isSelected ? "#f0f4ff" : "";
                  }}
                >
                  <td
                    style={{ padding: "10px 8px", textAlign: "center" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(b._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      color: "#888",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                    onClick={() => openDoc(b._id)}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{
                      padding: "10px 4px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => openDoc(b._id)}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: b._isDraft ? "#f59e0b" : "#22c55e",
                      }}
                      title={b._isDraft ? "Entwurf" : "Publiziert"}
                    />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "10px 10px",
                        textAlign: col.align || "left",
                        whiteSpace:
                          col.key === "name" ? "normal" : "nowrap",
                        maxWidth: col.key === "name" ? 280 : undefined,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                      onClick={() => openDoc(b._id)}
                    >
                      {col.format(b)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#888",
            }}
          >
            Keine Betriebe gefunden
          </div>
        )}
      </div>
    </div>
  );
}
