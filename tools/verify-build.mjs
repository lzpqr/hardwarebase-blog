import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(projectRoot, 'public');

const requiredFiles = [
  'index.html',
  'about/index.html',
  'archives/index.html',
  'categories/index.html',
  'tags/index.html',
  '404.html',
  'atom.xml',
  'sitemap.xml',
  'search.xml',
  'robots.txt',
  'baidu_verify_codeva-oV7fgdobPq.html',
  'BingSiteAuth.xml',
  '_headers',
  '_redirects',
  'vendor/fontawesome/css/all.min.css',
  'vendor/fontawesome/webfonts/fa-solid-900.woff2'
];

const errors = [];

for (const file of requiredFiles) {
  const target = path.join(publicDir, file);
  if (!existsSync(target)) errors.push(`缺少必要构建文件：${file}`);
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }

  return files;
}

function isExternalReference(reference) {
  return /^(?:https?:|mailto:|tel:|javascript:|data:|#|\/\/)/i.test(reference);
}

function resolveLocalReference(pageFile, reference) {
  const cleanReference = reference.split(/[?#]/, 1)[0];
  if (!cleanReference) return null;

  let decodedReference;
  try {
    decodedReference = decodeURIComponent(cleanReference);
  } catch {
    return null;
  }

  const baseDirectory = decodedReference.startsWith('/')
    ? publicDir
    : path.dirname(pageFile);
  const relativeReference = decodedReference.replace(/^\/+/, '');
  let target = path.resolve(baseDirectory, relativeReference);

  if (!target.startsWith(publicDir)) {
    errors.push(`发现越界本地链接：${reference}`);
    return null;
  }

  if (existsSync(target) && !existsSync(path.join(target, 'index.html'))) return target;
  if (existsSync(path.join(target, 'index.html'))) return path.join(target, 'index.html');

  if (!path.extname(target) || decodedReference.endsWith('/')) {
    target = path.join(target, 'index.html');
  }

  return target;
}

if (existsSync(publicDir)) {
  const htmlFiles = await collectHtmlFiles(publicDir);
  let checkedReferences = 0;

  for (const pageFile of htmlFiles) {
    const html = await readFile(pageFile, 'utf8');
    const references = html.matchAll(/(?:href|src)=["']([^"']+)["']/gi);

    for (const match of references) {
      const reference = match[1];
      if (isExternalReference(reference)) continue;

      const target = resolveLocalReference(pageFile, reference);
      checkedReferences += 1;

      if (target && !existsSync(target)) {
        errors.push(`${path.relative(projectRoot, pageFile)} 缺少链接目标：${reference}`);
      }
    }
  }

  if (!errors.length) {
    console.log(`构建验证通过：${htmlFiles.length} 个页面，检查 ${checkedReferences} 个本地引用。`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else if (!existsSync(publicDir)) {
  console.error('构建验证失败：public 目录不存在，请先执行 npm run build。');
  process.exitCode = 1;
}