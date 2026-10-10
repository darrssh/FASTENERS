# ASSET DOCUMENTATION

All 3D and imagery in this build is **procedurally generated in code** — a deliberate,
documented alternative to external downloads (per prompt §29/§47: generator code is the deliverable).
There are intentionally **zero binary model/texture files**, hence zero broken paths and zero license risk.

| Asset | Type | Source / creation | License | Size | Used in |
|---|---|---|---|---|---|
| Hero hex bolt (head + shank + helical thread + tip) | Procedural geometry (`src/lib/geometry.ts` → `buildBolt`) | Hand-built Three.js: beveled 6-seg head, cylinder shank, `TubeGeometry` helix thread, chamfer tip | Original, no attribution | ~0 KB on disk (runtime geometry) | `HeroBolt`, `BoltJourney`, `ProductViewer`, `FinalCTA` |
| Hex nut (extruded hex + bore, beveled) | Procedural (`buildNut`) | `ExtrudeGeometry` with hex shape + circular hole | Original | runtime | Journey scenes 3–6, Final CTA assembly |
| Flat washer (ring extrusion) | Procedural (`buildWasher`) | Ring `Shape` + hole, extruded | Original | runtime | Journey scenes 4–6, Final CTA |
| PBR finishes ×7 (stainless, carbon, alloy, brass, zinc, black-oxide, HDG) | Material configs (`src/lib/materials.ts` + `src/data/categories.ts`) | Calibrated `MeshStandardMaterial` (metalness ≈1, roughness 0.2–0.58, env intensity) + procedural brushed canvas texture | Original | runtime | Hero, Materials showcase, ProductViewer |
| Studio lighting + reflections | Local env (`HeroLighting.tsx`) | 1 shadow key + fill + rim + blue accent + 4× `Lightformer` env (no remote HDRI) | Original | runtime | Every 3D scene |
| Product renders ×24 | Procedural SVG (`ProductRender.tsx`) | Consistent dark-studio SVG per fastener family, labeled SAMPLE RENDER | Original | runtime | Cards, detail, categories, showcase |
| Industry scenes ×6 | Procedural SVG/CSS | In-brand truss/gradient illustrations (no stock photos) | Original | runtime | Industries section/page |
| Favicon | SVG file (`public/favicon.svg`) | Original hex-nut mark | Original | <1 KB | Browser tab |

**Replacing with real assets:** keep file names/keys stable, drop binaries under `public/assets/...` per the prompt’s suggested tree, and point `Product.images` / viewer `modelPath` at them. Until then, every visual is verifiably present because it is code.
