# ASSET DOCUMENTATION

The 3D scenes and fallback artwork are **procedurally generated in code**. All 41 products use the
**original JPEG images extracted from the supplied `Weltorque cat.pdf`** — one per page — stored in
`public/products/catalog/`. Every image path is checked into the repo, so there are no remote fetches.
Earlier demo renders are no longer referenced by the 41-product catalog.

| Asset | Type | Source / creation | License | Size | Used in |
|---|---|---|---|---|---|
| Hero hex bolt (head + shank + helical thread + tip) | Procedural geometry (`src/lib/geometry.ts` → `buildBolt`) | Hand-built Three.js: beveled 6-seg head, cylinder shank, `TubeGeometry` helix thread, chamfer tip | Original, no attribution | ~0 KB on disk (runtime geometry) | `HeroBolt`, `BoltJourney`, `ProductViewer`, `FinalCTA` |
| Hex nut (extruded hex + bore, beveled) | Procedural (`buildNut`) | `ExtrudeGeometry` with hex shape + circular hole | Original | runtime | Journey scenes 3–6, Final CTA assembly |
| Flat washer (ring extrusion) | Procedural (`buildWasher`) | Ring `Shape` + hole, extruded | Original | runtime | Journey scenes 4–6, Final CTA |
| PBR finishes ×7 (stainless, carbon, alloy, brass, zinc, black-oxide, HDG) | Material configs (`src/lib/materials.ts` + `src/data/categories.ts`) | Calibrated `MeshStandardMaterial` (metalness ≈1, roughness 0.2–0.58, env intensity) + procedural brushed canvas texture | Original | runtime | Hero, Materials showcase, ProductViewer |
| Studio lighting + reflections | Local env (`HeroLighting.tsx`) | 1 shadow key + fill + rim + blue accent + 4× `Lightformer` env (no remote HDRI) | Original | runtime | Every 3D scene |
| Catalogue product photos ×41 | JPEG (`public/products/catalog/*.jpg`) | Extracted verbatim from `Weltorque cat.pdf` (pages 1–41), mapped to the 41 PDF products in `src/data/products.ts` | Supplied by the user in the PDF | ~6.9 MB total | Catalogue cards, product detail, related products, cart, admin |
| Industry scenes ×6 | Procedural SVG/CSS | In-brand truss/gradient illustrations (no stock photos) | Original | runtime | Industries section/page |
| Favicon | SVG file (`public/favicon.svg`) | Original hex-nut mark | Original | <1 KB | Browser tab |

**Source mapping:** PDF page → product id → image file is defined in the generated `src/data/products.ts`
(`catalogPage` and `images[]`). Re-extract with PyMuPDF if the PDF changes; keep the filenames stable so
seed data and existing cart lines stay valid. The SVG fallback in `ProductRender` only appears if an
image path is missing or fails to load.
