# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive web application visualizing the "Hearthwork EU Charter" — a conceptual reimagining of EU integration structured around voluntary "Hestias" (fires of integration) and four standings (Member, Companion, Accord State, Strategic Partner). Built with Vue 3 + TypeScript, d3-geo, and Vite. Deployed to GitHub Pages on push to `main` (`.github/workflows/`).

## Commands

```bash
npm install
npm run dev          # Vite dev server with HMR
npm run build        # vue-tsc --noEmit type check, then vite build → dist/
npm run preview      # preview the production build
npm run type-check   # vue-tsc --noEmit only
```

There are no tests or linters. `npm run build` is the verification step — it type-checks the whole project.

No CDN dependency at runtime — TopoJSON world-atlas data is vendored in `public/countries-50m.json` and fetched at startup by `MapSvg.vue`.

## Architecture

```
index.html               # Shell: #app mount point + static OG/Twitter meta tags
src/
  main.ts                # createApp + router + styles.css
  App.vue                # Header (theme toggle, nav), <router-view>, footer
  router.ts              # Hash-based routing: / (map), /charter, /manifesto, /commentary
  types.ts               # Shared interfaces: Hestia, Standing, CountryData, MapCountry, …
  styles.css             # All CSS — themed via CSS vars on [data-theme], responsive at 600/900px
  views/
    MapView.vue          # Composes HestiaBar + MapSvg + MapLegend + DetailPanel
    DocumentView.vue     # Renders charter/manifesto/commentary markdown (marked.parse, ?raw imports)
  components/
    MapSvg.vue           # d3-geo conic conformal projection → SVG paths; click handling;
                         #   aspirant stripe patterns; capital markers; text fallback on fetch failure
    HestiaBar.vue        # View-switch buttons (Standings + 16 Hestias) + selected-Hestia description
    MapLegend.vue        # Legend for current view
    DetailPanel.vue      # Selected country: standing, population, note, per-Hestia participation
    SiteNav.vue          # Router links
  composables/
    useAppState.ts       # Module-level reactive state shared by all components (see State)
    useTheme.ts          # Light/dark toggle, persisted to localStorage, sets [data-theme]
    useHead.ts           # Per-route document.title + meta updates (JS-only; crawlers see index.html defaults)
data/
  countries.yaml         # Master registry: ~53 countries keyed by ISO alpha-3
  hestias.yaml           # All 16 Hestias: key, label, sub, description, explanation, capital(+coords)
  standings.yaml         # Standing definitions: label, className, color
  iso-mappings.yaml      # Numeric ISO → alpha-3, plus name → alpha-3 fallbacks (e.g. Kosovo)
  non-framework.yaml     # Notes for countries outside the Charter (incl. suspended: Russia, Belarus)
docs/
  charter.md             # Constitutional charter — canonical definitions of standings and Hestias
  manifesto.md           # Political rationale
  commentary.md          # Interpretive commentary on the charter
  powerdynamics.md       # Analysis note (not rendered in the app)
  charters/              # Archived charter drafts (v13, v14)
public/
  countries-50m.json     # Vendored world-atlas TopoJSON (50m resolution)
  screenshot.png         # OG/social preview image — regenerate after visible UI changes
```

YAML data files are imported at build time via `@rollup/plugin-yaml`; markdown docs via Vite `?raw` imports (both wired in `vite.config.js`). Type assertions (`as Record<string, CountryData>` etc.) bridge YAML imports to the interfaces in `src/types.ts`.

### Data Model

`data/countries.yaml` is the master registry — keyed by ISO alpha-3 code, each entry has:
- `name`, `population` (millions)
- `standing`: `"member"` | `"companion"` | `"compact"` | `"strategic"` — note the key `compact` is **displayed as "Accord State"** (label lives in `standings.yaml`); the YAML key was kept for stability
- `note`: policy context string
- `hestias`: object with 16 participation values: `1` (full) or `0` (none)
- `reasons` (optional): Hestia key → explanation string, only for notable/surprising entries
- `aspirant` (optional): `"member"` (Companion aspiring to Member) or `"companion"` (Accord State aspiring to Companion) — rendered as a striped SVG pattern on the map

The 16 Hestias are: fiscal, krone, shield, gate, atlas, anchor, bench, green, forge, loom, library, spring, pharmacy, beacon, lattice, lyre. Defined in `data/hestias.yaml`; the order there controls button-bar and detail-panel display order.

`data/non-framework.yaml` entries are either a plain string note, an object with `note`/`suspended`, or `~` (null — renders a generic "outside the framework" message). Code touching these entries must handle all three shapes; remember `typeof null === 'object'`.

### State

`useAppState.ts` exports a singleton reactive object (module-level, shared across all components):
- `currentView` — `"standings"` or a Hestia key (e.g. `"fiscal"`)
- `selectedCountry` — alpha-3 code of selected framework country, or `null`
- `selectedNonFramework` — feature name of selected non-framework country, or `null`

`selectedCountry` and `selectedNonFramework` are mutually exclusive; use the provided `selectCountry()` / `selectNonFramework()` mutators, which clear the other.

### Map rendering notes

- Country features are matched to data via `lookupAlpha3()`: numeric TopoJSON feature id → alpha-3 (in `iso-mappings.yaml`), with name-based fallback for features without proper ids (e.g. Kosovo).
- Features are sorted by projected area (descending) before rendering so micro-states (Vatican, Monaco, San Marino, …) draw on top of larger neighbours and remain clickable.
- If the TopoJSON fetch fails, `MapSvg.vue` renders an HTML list of countries by standing as a fallback.

## Policy Documents

The `.md` files in `docs/` are governance/policy documents, not code docs. When editing country data or Hestia definitions, consult `docs/charter.md` for canonical definitions. The charter is versioned by draft (currently the Fifteenth Draft); superseded drafts are archived in `docs/charters/`.

When editing country data or Hestia definitions, consult `charter.md` for canonical definitions.

## Data Conventions

- Do not reference specific politicians, party names, or individuals in country notes, reasons, or any data files. Describe political situations in institutional terms (e.g. "pro-EU government elected", "authoritarian governance") rather than naming people or parties.
