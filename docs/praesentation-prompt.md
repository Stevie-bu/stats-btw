# Prompt für Claude Design – Präsentation "Potenzialanalyse bike to work"

Erstelle eine Präsentation (10–12 Slides) für die interne Präsentation bei Pro Velo Schweiz. Zielgruppe: Geschäftsleitung und Marketing-Team. Die Präsentation soll visuell ansprechend sein, mit dem bike to work Designsystem (Pink #fa7fdf, Blau #32a7ff, Schwarz, Weiss, Brandon Grotesque Bold Italic für Headlines, Inter für Body).

---

## Slide 1: Titel
**bike to work Challenge 2025 – Potenzialanalyse**
Untertitel: Wo liegt das grösste Wachstumspotenzial für die Challenge 2026?

---

## Slide 2: Ausgangslage
- 3'935 Betriebe nehmen an der bike to work Challenge 2025 teil
- Verteilt auf 750 von 2'131 Schweizer Gemeinden
- 65% der Gemeinden haben keinen einzigen teilnehmenden Betrieb
- Frage: Wo lohnt sich die Akquise am meisten?

---

## Slide 3: Die Idee
Wir wollen herausfinden, welche Gemeinden das grösste **ungenutzte Potenzial** haben – basierend auf einem datengetriebenen Ansatz.

Die Hypothese: In dicht besiedelten Gebieten gibt es mehr Betriebe und damit mehr potenzielle Teilnehmer. Wenn eine Gemeinde mit hoher Bevölkerungsdichte wenig oder keine Betriebe hat, ist das ungenutztes Potenzial.

---

## Slide 4: Datenquellen
Drei öffentliche Datenquellen wurden kombiniert:

1. **bike to work Betriebsliste** – 3'935 Betriebe mit PLZ, Ort, Mitarbeitende, Beteiligung (Pro Velo intern)
2. **Bevölkerungszahlen** – Ständige Wohnbevölkerung pro Gemeinde, Stand 31.12.2024 (Bundesamt für Statistik, PxWeb API)
3. **Gemeindeflächen** – Offizielle Fläche in km² pro Gemeinde (Swisstopo via geo.admin.ch + Wikidata)

Daraus berechnet: **Bevölkerungsdichte** = Einwohner ÷ Fläche (Einw./km²)

---

## Slide 5: Der Lösungsansatz – Quintil-Methode

**Schritt 1:** Alle 2'131 Gemeinden werden nach Bevölkerungsdichte in 5 gleich grosse Gruppen (Quintile) aufgeteilt:

| Quintil | Bevölkerungsdichte | Beobachtete Rate |
|---------|-------------------|-----------------|
| Q1 (ländlich) | 1–64 Einw./km² | 1.95 Betriebe pro 10'000 Einw. |
| Q2 | 64–143 Einw./km² | 2.01 pro 10'000 |
| Q3 | 143–280 Einw./km² | 2.86 pro 10'000 |
| Q4 | 280–641 Einw./km² | 3.84 pro 10'000 |
| Q5 (urban) | 641–13'132 Einw./km² | 5.30 pro 10'000 |

Erkenntnis: In urbanen Gemeinden nehmen **2.7× mehr Betriebe** pro Kopf teil als in ländlichen.

---

## Slide 6: Berechnung des Potenzial-Index

**Schritt 2:** Für jede Gemeinde wird ein Erwartungswert berechnet:

```
Erwartete Betriebe = Einwohnerzahl × Rate der Dichte-Gruppe
```

**Schritt 3:** Index berechnen:

```
Roher Index = (Tatsächliche − Erwartete) / Erwartete × 100%
```

**Schritt 4:** Bayesian Shrinkage – kleine Gemeinden werden zum Durchschnitt gedämpft:

```
Gewicht = Einwohner / (Einwohner + 1'726)
Index = Gewicht × Roher Index
```

1'726 = Median der Schweizer Gemeindegrösse. Gemeinden unter dem Median werden zur Mitte gezogen, damit Ausreisser in Kleinstgemeinden die Karte nicht verzerren.

---

## Slide 7: Rechenbeispiel

| | Bern | Neuchâtel | Lugano |
|---|---:|---:|---:|
| Einwohner | 137'995 | 45'309 | 63'629 |
| Bevölkerungsdichte | 2'673 Einw./km² | 2'509 Einw./km² | 838 Einw./km² |
| Quintil | Q5 (urban) | Q5 (urban) | Q4 |
| Erwartete Betriebe | 76.7 | 24.0 | 35.4 |
| Tatsächliche Betriebe | 234 | 11 | 3 |
| **Index** | **+203%** | **−52%** | **−89%** |
| Bedeutung | Starker Überperformer | Halbes Potenzial ungenutzt | Kaum Teilnahme trotz Grösse |

---

## Slide 8: Ergebnis – Karte

Zeige die interaktive Choropleth-Karte der Schweiz:
- **Dunkelblau** = Überperformer (mehr Betriebe als erwartet)
- **Hellblau** = Leicht über Durchschnitt
- **Pink** = Ungenutztes Potenzial
- **Dunkelpink** = Grösstes Potenzial

Auffällig: Die **Westschweiz** und das **Tessin** sind überwiegend pink – hier liegt das grösste Wachstumspotenzial.

---

## Slide 9: Top-Potenzial-Gemeinden

Die grössten Gemeinden mit dem meisten ungenutzten Potenzial:

| Gemeinde | Einwohner | Betriebe | Erwartet | Potenzial |
|----------|----------:|----------:|---------:|----------:|
| Vevey | 20'142 | 0 | 11 | −92% |
| Pully | 19'538 | 0 | 11 | −92% |
| Onex | 18'915 | 0 | 10 | −92% |
| Sierre | 17'829 | 0 | 10 | −91% |
| Arbon | 16'354 | 13 | 9 | +39% |
| Lugano | 63'629 | 3 | 35 | −89% |
| Neuchâtel | 45'309 | 11 | 24 | −52% |
| Genève | 209'061 | 84 | 116 | −28% |

→ In der Romandie und im Tessin schlummert das grösste Wachstumspotenzial.

---

## Slide 10: Schwierigkeiten & Limitationen

**1. PLZ-zu-Gemeinde-Zuordnung (~9% Ungenauigkeit)**
- Schweizer PLZ decken sich nicht 1:1 mit Gemeindegrenzen
- PLZ-Zentroide (geo.admin.ch) fallen teilweise in Nachbargemeinden
- 63 PLZ mussten manuell korrigiert werden
- Lösung: Offizielle PLZ→Gemeinde-Tabelle der Schweizer Post beschaffen

**2. Asymmetrie der Skala**
- 78% der Gemeinden sind "Unterperformer" (pink), weil 65% gar keine Betriebe haben
- Wenige Grossstädte (Bern, Zürich) ziehen den Durchschnitt hoch
- Die Quintil-Methode korrigiert teilweise, aber die Karte bleibt pink-lastig

**3. Bevölkerungsdichte ≠ Betriebsdichte**
- Wohngemeinden (z.B. Zollikon) haben hohe Einwohnerdichte aber wenige Arbeitgeber
- Industriestandorte haben evtl. mehr Betriebe als die Einwohnerzahl vermuten lässt
- Idealerweise: Arbeitsstätten-Statistik (STATENT) als Ergänzung verwenden

**4. Bayesian Shrinkage dämpft Kleinstgemeinden**
- Bewusste Designentscheidung: Binn (129 Einw., 2 Betriebe) wird nicht als Top-Performer gewertet
- Der Index zeigt verlässlichere Werte für Gemeinden >2'000 Einwohner

---

## Slide 11: Empfehlungen

1. **Fokus Romandie:** Vevey, Pully, Montreux, Neuchâtel – grosse Städte ohne/mit wenig Teilnahme
2. **Fokus Tessin:** Lugano, Locarno, Bellinzona – riesiges ungenutztes Potenzial
3. **Fokus Deutschschweiz:** Arbon, Romanshorn, einzelne Lücken in der Ostschweiz
4. **Genf stärken:** 84 von erwarteten 116 Betrieben – noch 28% Potenzial in der grössten Westschweizer Stadt
5. **Datenqualität verbessern:** Offizielle PLZ→Gemeinde-Zuordnung beschaffen für genauere Analyse

---

## Slide 12: Nächste Schritte

- [ ] Offizielle PLZ-Tabelle der Schweizer Post integrieren
- [ ] STATENT-Daten (Arbeitsstätten pro Gemeinde) als zusätzlichen Faktor einbeziehen
- [ ] Zielregionen für Challenge 2026 Marketing-Kampagnen definieren
- [ ] Interaktive Karte auf stats.biketowork.ch veröffentlichen
- [ ] Potenzialanalyse jährlich aktualisieren und Fortschritt messen

---

## Design-Hinweise für Claude Design

- Verwende das bike to work Farbsystem: Pink (#fa7fdf), Blau (#32a7ff), Schwarz, Weiss (#fdfdfd)
- Headlines in Brandon Grotesque Bold Italic (oder ähnliche kräftige Italic-Schrift)
- Body Text in Inter
- Karten und Diagramme als Bilder/Screenshots einbetten
- Minimalistisches, sportliches Design – nicht zu viel Text pro Slide
- Daten-Slides mit grossen Zahlen und wenig Text
- Die Karte (Slide 8) als zentrales visuelles Element gross darstellen
