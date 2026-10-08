const fs = require('fs');
const zlib = require('zlib');

const zipPath = process.argv[2];
const outPath = process.argv[3];
const buf = fs.readFileSync(zipPath);

function findEntry(data, name) {
  let eocd = -1;
  for (let i = data.length - 22; i >= Math.max(0, data.length - 22 - 65535); i--) {
    if (data.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('EOCD not found');
  const cdOffset = data.readUInt32LE(eocd + 16);
  let off = cdOffset;
  while (data.readUInt32LE(off) === 0x02014b50) {
    const nLen = data.readUInt16LE(off + 28);
    const cLen = data.readUInt16LE(off + 30);
    const eLen = data.readUInt16LE(off + 32);
    const localOff = data.readUInt32LE(off + 42);
    const entryName = data.toString('utf8', off + 46, off + 46 + nLen);
    if (entryName === name) {
      const lNameLen = data.readUInt16LE(localOff + 26);
      const lExtraLen = data.readUInt16LE(localOff + 28);
      const dataStart = localOff + 30 + lNameLen + lExtraLen;
      const csize = data.readUInt32LE(localOff + 18);
      const raw = data.slice(dataStart, dataStart + csize);
      const method = data.readUInt16LE(localOff + 8);
      if (method === 0) return raw;
      return zlib.inflateRawSync(raw);
    }
    off += 46 + nLen + cLen + eLen;
  }
  throw new Error('entry not found: ' + name);
}

const xml = findEntry(buf, 'word/document.xml').toString('utf8');
fs.writeFileSync(outPath, xml);
console.log('extracted ' + outPath + ' bytes=' + xml.length);
