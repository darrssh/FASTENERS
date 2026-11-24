/**
 * Export the existing frontend catalog (single source of truth) to JSON so the
 * Python backend can seed PostgreSQL with the exact same products, categories,
 * materials and image paths. Run with:
 *   node --experimental-strip-types scripts/export-seed.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const load = (rel) => import(pathToFileURL(resolve(root, rel)).href);

const { products } = await load('src/data/products.ts');
const cats = await load('src/data/categories.ts');

const payload = {
  generatedAt: new Date().toISOString(),
  products,
  categories: cats.categories,
  categoryGroups: cats.categoryGroups,
  materials: cats.materials,
};

const outPath = resolve(root, 'backend/seed/seed_data.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');

console.log(
  `Wrote ${outPath}\n  products: ${products.length}\n  categories: ${cats.categories.length}\n  materials: ${cats.materials.length}`,
);
