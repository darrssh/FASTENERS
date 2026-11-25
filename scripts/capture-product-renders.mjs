/**
 * Batch-captures product-specific Three.js renders for the catalogue.
 *
 * Prerequisites:
 *  - Vite dev server running on http://localhost:5173
 *  - Desktop browser attached to this OpenCode session
 *
 * The browser harness route is /__render/:id/:view. This script expects the
 * OpenCode browser MCP tools to be available through the Code Mode `tools`
 * object; run it from Code Mode, not plain Node.
 */
const BASE = process.env.RENDER_BASE_URL || 'http://localhost:5173/FASTENERS';
const VIEWS = ['threequarter', 'head', 'side'];
const OUT = 'public/products/renders';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fs = await import('node:fs');
const path = await import('node:path');
const source = fs.readFileSync('src/data/products.ts', 'utf8');
const body = source.slice(source.indexOf('export const products'));
const listBody = body.slice(body.indexOf('['));
const products = eval(listBody.slice(0, listBody.lastIndexOf('];') + 1));

const tab = await tools.browser.tabs.open({ url: 'about:blank', focus: false });
const results = [];
for (const product of products) {
  for (const view of VIEWS) {
    const url = `${BASE}/__render/${product.id}/${view}`;
    await tools.browser.navigate({ tabID: tab.id, url });
    await tools.browser.wait({ tabID: tab.id, condition: 'load' });
    let ready = false;
    for (let i = 0; i < 40; i += 1) {
      const check = await tools.browser.evaluate({
        tabID: tab.id,
        script: "document.querySelector('[data-render-ready]')?.getAttribute('data-render-ready') === 'true'",
      });
      if (check.value === true) { ready = true; break; }
      await sleep(100);
    }
    if (!ready) throw new Error(`Render harness not ready: ${url}`);
    const shot = await tools.browser.screenshot({ tabID: tab.id, format: 'webp', quality: 92 });
    const file = shot.files[0];
    const dest = path.join(process.cwd(), OUT, `${product.id}-${view}.webp`);
    fs.copyFileSync(file.path, dest);
    results.push(dest);
  }
}
await tools.browser.tabs.close({ tabID: tab.id });
console.log(`Captured ${results.length} renders to ${OUT}`);