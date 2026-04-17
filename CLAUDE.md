# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive web application visualizing the "European Hearth Charter" — a conceptual reimagining of EU integration structured around voluntary "Hestias" (fires of integration). Built with vanilla JS, D3 (d3-geo only), and Vite.

## Running the App

```bash
npm install
npm run dev        # Vite dev server with HMR
npm run build      # production build → dist/
npm run preview    # preview the production build
```

No CDN dependency at runtime — TopoJSON world-atlas data is vendored in `public/countries-110m.json`.

## Architecture

```
index.html          # HTML shell (header, button bar, SVG container, legend, detail panel, footer)
src/
  main.js           # Entry point: imports data, wires state, calls init
  styles.css        # All CSS (theme via --ember/--hearth/--ash vars, responsive at 600/900px)
  map.js            # drawMap(), lookupAlpha3() — D3 projection + SVG path rendering
  view.js           # applyView(), renderLegend(), setupHestiaButtons()
  detail.js         # selectCountry(), renderDetail(), renderNonFrameworkDetail()
  fallback.js       # buildListFallback() — text fallback when map fails to load
data/
  countries.yaml    # 36 country records keyed by ISO alpha-3
  hestias.yaml      # All 16 Hestias with key, label, sub, description
  standings.yaml    # Standing definitions (member, inner-assoc, outer-assoc, strategic, non-eu)
  iso-mappings.yaml # Numeric ISO → alpha-3 + name fallbacks (e.g. Kosovo)
public/
  countries-110m.json  # Vendored world-atlas TopoJSON
```

YAML data files are imported at build time via `@rollup/plugin-yaml` (configured in `vite.config.js`).

### Data Model

`data/countries.yaml` is the master registry — keyed by ISO alpha-3 code, each entry has:
- `standing`: `"member"` | `"inner-assoc"` | `"outer-assoc"` | `"strategic"`
- `note`: policy context string
- `hestias`: object with 16 participation values: `1` (full), `0.5` (partial), `0` (none)

The 16 Hestias are: fiscal, krone, shield, gate, atlas, anchor, bench, green, forge, loom, library, spring, pharmacy, beacon, lattice, lyre. All defined in `data/hestias.yaml`.

### State

A single `state` object in `src/main.js` holds:
- `currentView` — `"standings"` or a Hestia key (e.g. `"fiscal"`)
- `selectedCountry` — alpha-3 code of selected country, or `null`
- `svgEl` — reference to the SVG element

## Policy Documents

The `.md` files are governance/policy documents, not code docs:
- `charter.md` — Constitutional charter defining standings and Hestias
- `manifesto.md` — Political rationale
- `commentary.md` — Interpretive commentary on the charter

When editing country data or Hestia definitions, consult `charter.md` for canonical definitions.
