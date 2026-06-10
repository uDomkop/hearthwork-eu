# Hearthwork EU

An interactive map visualizing the **Hearthwork EU Charter** — a conceptual reimagining of EU integration structured around voluntary "Hestias" (fires of integration).

![Map showing European countries colored by their Charter standing](screenshot.png)

## What is this?

The Hearth Charter replaces the binary in-or-out model of EU membership with a spectrum of four standings — **Member**, **Companion**, **Compact**, and **Strategic Partner** — each participating in a different mix of 16 policy-domain Hestias.

The 16 Hestias cover: Fiscal (eurozone), Krone (Nordic currency), Shield (defence), Gate (Schengen), Atlas (space), Anchor (maritime), Bench (judicial), Green (climate), Forge (industry), Loom (digital), Library (education), Spring (water), Pharmacy (health), Beacon (research), Lattice (energy grid), and Lyre (heritage).

Countries can participate fully (●), partially (◐), or not at all (○) in each Hestia, with per-country reasons explaining notable choices.

## Live

**[tijmenvanegmond.github.io/eu-hestias-map](https://tijmenvanegmond.github.io/eu-hestias-map/)**

## Running locally

```bash
npm install
npm run dev        # Vite dev server with HMR
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Documents

- **Charter** — Constitutional charter defining standings and Hestias
- **Manifesto** — Political rationale
- **Commentary** — Interpretive commentary on the charter

## Tech

Vanilla JS, [D3-geo](https://github.com/d3/d3-geo), [Vite](https://vite.dev). Vue. YAML data files imported at build time. TopoJSON vendored locally.
