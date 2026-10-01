import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(projectRoot, 'public');
const sourceDir = path.join(projectRoot, 'source');

await mkdir(publicDir, { recursive: true });

const files = ['_headers', '_redirects'];
for (const file of files) {
  const source = path.join(sourceDir, file);
  if (!existsSync(source)) continue;
  await copyFile(source, path.join(publicDir, file));
  console.log(`Copied Cloudflare Pages file: ${file}`);
}