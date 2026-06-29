# bike to work – Challenge 2026 Stats

> Top 10 Betriebe der bike to work Challenge 2026

## Brand Identity
- **Personality:** Sporty, energetic, community-driven
- **Primary Color:** Pink (#fa7fdf) – the bike to work brand pink
- **Secondary Color:** Blue (#32a7ff) – "Picton Blue"
- **Accent Colors:** Turquoise (#7efaf3) for 2nd place, Laser Lemon (#fcff66) for 3rd place
- **Text:** Black on white, white on colored backgrounds
- **Fonts:** Brandon Grotesque Black Italic (headings, display), Inter (body text)
- **Font file:** `public/fonts/brandon-grotesque-black-italic.otf`

## Pages
- **Top Ten** (`/`) – Betriebe ranking with interactive bar chart, search, and "Mehr laden"
- **Facts & Figures** (`/facts-and-figures`) – Teilnehmende, Betriebe, Erdumdrehungen, CO₂, Teilnahmedauer
- **Maps** (`/maps`) – Betriebe-Karte, Gemeinde, Kanton, Potenzial

### Multi-Language
- DE: Root-Pfad (`/`, `/maps`, `/facts-and-figures`)
- FR, IT, EN: Unter `[locale]` (`/fr/`, `/it/maps`, `/en/facts-and-figures`)

### Seiten aktivieren/deaktivieren
Jede Seite hat einen "Veröffentlicht"-Schalter in Sanity (pro Sprache):
- **Top Ten:** In "Seitentexte" → jeweilige Sprache → "Seite veröffentlicht"
- **Facts & Figures:** In "Facts & Figures" → jeweilige Sprache → "Seite veröffentlicht"
- **Maps:** In "Maps" → jeweilige Sprache → "Seite veröffentlicht"

Deaktivierte Seiten verschwinden aus der Navigation und sind nicht von Google auffindbar.

## Sanity CMS – Alle Texte editierbar

### Seitentexte (pro Sprache)
In Sanity unter "Seitentexte" → Sprache wählen:
- **Navigation:** Tab-Labels (Top Ten, Facts and Figures, Maps)
- **Top Ten Seite:** Titel, Untertitel, Beschreibungstext, Suchfeld, Buttons
- **Metriken & Kategorien:** Tab-Labels (Beteiligung %, Anzahl Teams, etc.), Grössenkategorien, Einheiten
- **Distanz-Feature:** Labels für km total, Ziel, Distanz zum Ziel, um die Welt
- **Allgemein:** Ladetext, "Seite nicht verfügbar", "Zurück zur Startseite"

### Facts & Figures (pro Sprache)
- Seitentitel, Abschnittstitel
- Erdumrundung: Text, Suffix, "km total"-Label
- CO₂: Text, CO₂ pro Flug, "kg CO₂ total"-Label
- Teilnahmedauer: Titel, Einheit in Legende ("Betriebe")

### Maps (pro Sprache)
- Seitentitel, Kartentitel, Beschreibungen
- Sichtbarkeit pro Karte

### Allgemeine Einstellungen
- **Navigation:** Logo, Favicon
- **Footer:** Social Links, Logos, Texte pro Sprache

## Data
- Source: Excel Betriebsliste (3'931 Betriebe) in Sanity CMS
- Fields per Betrieb: Name, Ort, Mitarbeitende, Teams, Beteiligung %, Veloanteil %, Distanz (km), CO₂ (kg)
- Betriebe are auto-categorized by Mitarbeitende count
- Values use Swiss number formatting (apostrophe as thousands separator)

## Assets (in `/public/images/`)
- `btw-logo.svg` – bike to work logo
- `search-icon.svg` – Magnifying glass for search field
- `facebook-icon.svg`, `instagram-icon.svg`, `linkedin-icon.svg` – social icons
- `provelo-logo.svg` – Pro Velo logo
- `veloplus-logo.svg`, `panter-logo.svg`, `suva-logo.svg`, `stromer-logo.svg` – sponsor logos
- `world-icon.svg` – Weltkugel (Facts page)
- `statue-of-liberty-icon.svg` – Freiheitsstatue (Facts page)

## Architektur & Performance

### ISR (Incremental Static Regeneration)
- Alle Seiten werden beim Build statisch generiert
- Automatische Revalidation alle **300 Sekunden** (5 Minuten)
- On-Demand Revalidation per Webhook (`/api/revalidate` mit Secret)

### Security Headers
Alle Seiten (ausser `/studio`) erhalten:
- `Strict-Transport-Security` (HSTS mit 2 Jahren, includeSubDomains, preload)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### SEO
- `robots.txt` – erlaubt alles ausser `/studio/`
- `sitemap.xml` – alle Seiten mit hreflang-Alternates pro Sprache
- Open Graph & Twitter Card Tags pro Sprache
- Dynamisches `lang`-Attribut auf `<html>` pro Sprache
- `theme-color: #fa7fdf` (Brand Pink)

### Error Handling
- **404-Seite** (`app/not-found.tsx`) – "Diese Seite wurde nicht gefunden"
- **500-Seite** (`app/error.tsx`) – "Ein Fehler ist aufgetreten" mit Retry-Button
- **Global Error** (`app/global-error.tsx`) – Fallback bei kritischen Fehlern

### Bilder
- Footer-Bilder nutzen `next/image` mit `unoptimized` für SVGs
- Sanity CDN als Remote-Pattern konfiguriert (`cdn.sanity.io`)

## Recent Changes
- 2026-05-22: Initial build from Figma design
- 2026-05-22: Added real data from Challenge 2025 PDF
- 2026-05-22: Made fully responsive (mobile, tablet, desktop)
- 2026-05-22: Switched to real Brandon Grotesque Black Italic font
- 2026-05-26: Bar colors per rank (1st pink, 2nd turquoise, 3rd lemon, rest blue)
- 2026-05-26: Major rebuild: 3'931 Betriebe from Excel, swapped tabs, search, "Mehr laden", CO₂ on Distanz
- 2026-06-19: All texts now editable via Sanity CMS (siteTexts, factsPage, mapsPage)
- 2026-06-19: Page activate/deactivate toggle per language (noindex when deactivated)
- 2026-06-19: Pre-filled all Sanity documents with current texts in DE/FR/IT/EN
- 2026-06-19: ISR (300s), Security Headers, SEO (robots, sitemap, OG, hreflang), Error Pages, next/image
- 2026-06-19: Sanity Studio v5 → v6 (inkl. @sanity/vision@6, @sanity/client@7.23, next-sanity@13.1)
- 2026-06-19: Deploy-Workflow: Branch-Protection auf main, CI-Pipeline (Typecheck + Lint + Build), PR-Template

## How to Customize
- **Texte ändern:** Im Sanity Studio unter "Seitentexte", "Facts & Figures" oder "Maps" die jeweilige Sprache öffnen
- **Seite ein-/ausblenden:** "Seite veröffentlicht" Schalter in Sanity umschalten
- **Sprache ein-/ausblenden:** "Sprache aktiv" in Seitentexte umschalten
- **Update data:** Betriebsliste in Sanity Studio aktualisieren
- **Change colors:** Edit CSS variables in `app/globals.css`
