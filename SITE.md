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
- **Homepage** (`/`) – Betriebe ranking page with interactive bar chart, search, and "Mehr laden"

## Data
- Source: Excel Betriebsliste (3'931 Betriebe) exported to `data/betriebe.json`
- Fields per Betrieb: Name, Ort, Mitarbeitende, Teams, Beteiligung %, Veloanteil %, Distanz (km), CO₂ (kg)
- Betriebe are auto-categorized by Mitarbeitende count
- Values use Swiss number formatting (apostrophe as thousands separator)

## Sections
- **Header** – Pink background, bike to work logo, navigation tabs (Top Ten active, Facts and Figures, Betriebsliste), language selector (DE)
- **Title** – "CHALLENGE 2026 / TOP 10 BETRIEBE" in Brandon Grotesque Black Italic
- **Subtitle** – Beschreibungstext mit Aufforderung zur Suche
- **Search** – Pill-shaped search input with magnifying glass icon, centered (max 560px)
- **Metric Tabs (top, rectangular)** – Anzahl Teams, Beteiligung %, Velo %, Distanz
- **Size Category Pills (inside card)** – Alle Betriebe, mehr 5'000 MA, bis 5'000 MA, bis 1'000 MA, bis 500 MA, bis 200 MA
- **Bar Chart** – Horizontal bars, colors: 1st Pink, 2nd Turquoise, 3rd Lemon, rest Blue
- **Distanz metric** – Shows CO₂ (kg) as additional info to the right of the km bar
- **Search result** – Shows 4 before + matched Betrieb (black bar, white text) + 5 after
- **Mehr laden Button** – Loads 10 more entries per click
- **Footer** – Blue background, links, social icons, sponsor logos, copyright bar

## Size Categories (auto-assigned by Mitarbeitende)
- **Alle Betriebe** – No filter (all 3'931)
- **mehr 5'000 MA** – Mitarbeitende > 5000 (34 Betriebe)
- **bis 5'000 MA** – 1001–5000 (199 Betriebe)
- **bis 1'000 MA** – 501–1000 (264 Betriebe)
- **bis 500 MA** – 201–500 (619 Betriebe)
- **bis 200 MA** – ≤200 (2'815 Betriebe)

## Responsive Design
- **Desktop (≥1024px):** Full 1440px layout matching Figma
- **Tablet (640–1023px):** Condensed spacing, smaller fonts, narrower name column
- **Mobile (<640px):** Company name stacked above bar, scrollable tabs

## Assets (in `/public/images/`)
- `btw-logo.svg` – bike to work logo
- `search-icon.svg` – Magnifying glass for search field
- `facebook-icon.svg`, `instagram-icon.svg`, `linkedin-icon.svg` – social icons
- `provelo-logo.svg` – Pro Velo logo
- `veloplus-logo.svg`, `panter-logo.svg`, `suva-logo.svg`, `stromer-logo.svg` – sponsor logos

## Recent Changes
- 2026-05-22: Initial build from Figma design
- 2026-05-22: Added real data from Challenge 2025 PDF
- 2026-05-22: Made fully responsive (mobile, tablet, desktop)
- 2026-05-22: Switched to real Brandon Grotesque Black Italic font
- 2026-05-26: Bar colors per rank (1st pink, 2nd turquoise, 3rd lemon, rest blue)
- 2026-05-26: Major rebuild: 3'931 Betriebe from Excel, swapped tabs, search, "Mehr laden", CO₂ on Distanz

## How to Customize
- **Update data:** Replace `data/betriebe.json` (exported from Excel Betriebsliste)
- **Change colors:** Edit CSS variables in `app/globals.css`
- **Change year in title:** Edit the `<h1>` text in `app/page.tsx`
