// wallet-core's Emscripten glue resolves wallet-core.wasm relative to
// document.currentScript, which is unavailable inside webpack chunks, so at
// runtime it falls back to fetching wallet-core.wasm relative to the current
// document directory. On a hard load of a nested route the directory is not
// the site root: e.g. /setting/wallet fetches /setting/wallet-core.wasm.
// The build (4.7.0) aborts on Module hooks like locateFile/wasmBinary, so the
// URL cannot be overridden in code; instead, serve the file both at the site
// root (for top-level routes) and under /setting/ (for the /setting/* pages)
// by copying it into public/ before `next dev` / `next build`.
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const source = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');
const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Serve the wasm from every directory a hard-loaded route can resolve against.
// Top-level routes (/, /wallet, /activity, /setting, /get-started, ...) resolve
// from the site root; the nested settings pages resolve from /setting/.
const destinations = [
  join(publicDir, 'wallet-core.wasm'),
  join(publicDir, 'setting', 'wallet-core.wasm'),
];

for (const destination of destinations) {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  console.log(`Copied ${source} -> ${destination}`);
}
