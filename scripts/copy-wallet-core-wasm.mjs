// wallet-core's Emscripten glue resolves wallet-core.wasm relative to
// document.currentScript, which is unavailable inside webpack chunks, so at
// runtime it falls back to fetching /wallet-core.wasm from the site root.
// The build (4.7.0) aborts on Module hooks like locateFile/wasmBinary, so the
// URL cannot be overridden in code; instead, serve the file at the site root
// by copying it into public/ before `next dev` / `next build`.
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const source = require.resolve('@trustwallet/wallet-core/dist/lib/wallet-core.wasm');
const destination = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'wallet-core.wasm');

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
console.log(`Copied ${source} -> ${destination}`);
