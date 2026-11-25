import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = process.cwd();
const BASE = process.env.RENDER_BASE_URL || 'http://localhost:5173/FASTENERS';
const VIEWS = ['threequarter', 'head', 'side'];
const OUT = path.join(root, 'public', 'products', 'renders');

const src = fs.readFileSync(path.join(root, 'src/data/products.ts'), 'utf8');
let body = src.slice(src.indexOf('export const products'));
body = body.slice(body.indexOf('['));
body = body.slice(0, body.lastIndexOf('];') + 1);
const products = eval(body);

const CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => p && fs.existsSync(p));

if (!CHROME) throw new Error('Chrome/Edge not found. Set CHROME_PATH.');

const only = process.env.ONLY ? process.env.ONLY.split(',').map((s) => s.trim()).filter(Boolean) : null;
const skipExisting = process.env.SKIP_EXISTING === '1';
const list = only ? products.filter((p) => only.includes(p.id)) : products;

fs.mkdirSync(OUT, { recursive: true });

async function launch() {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

let browser = await launch();
let page = await browser.newPage();
await page.setViewport({ width: 960, height: 640, deviceScaleFactor: 2 });

async function resetBrowser() {
  try { await page.close(); } catch {}
  try { await browser.close(); } catch {}
  browser = await launch();
  page = await browser.newPage();
  await page.setViewport({ width: 960, height: 640, deviceScaleFactor: 2 });
}

let n = 0;
const total = list.length * VIEWS.length;
for (const product of list) {
  for (const view of VIEWS) {
    const dest = path.join(OUT, `${product.id}-${view}.webp`);
    if (skipExisting && fs.existsSync(dest)) { n++; console.log(`[skip ${n}/${total}] ${product.id} ${view}`); continue; }
    const url = `${BASE}/__render/${product.id}/${view}`;
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForSelector('[data-render-ready="true"]', { timeout: 20000 });
        await new Promise((r) => setTimeout(r, 250));
        const el = await page.$('#render-target');
        if (!el) throw new Error('Missing #render-target');
        await el.screenshot({ path: dest, type: 'webp', quality: 92 });
        ok = true;
      } catch (err) {
        console.error(`[retry ${attempt}] ${product.id} ${view}: ${err.message}`);
        await resetBrowser();
      }
    }
    if (!ok) throw new Error(`Failed: ${product.id} ${view}`);
    n += 1;
    console.log(`[${n}/${total}] ${product.id} ${view}`);
  }
}

try { await page.close(); } catch {}
try { await browser.close(); } catch {}
console.log(`Captured ${n} renders.`);