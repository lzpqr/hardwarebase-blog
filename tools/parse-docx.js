const fs = require('fs');
const dir = 'H:/ai/codex/web/_tmp_docx';
const names = process.argv.slice(2);
names.forEach((n) => {
  const x = fs.readFileSync(dir + '/' + n + '.xml', 'utf8');
  // Split by paragraph, but treat tables specially.
  const out = [];
  // Walk through the document top-level: paragraphs and tables interleaved.
  const tokens = [];
  const re = /<w:tbl>[\s\S]*?<\/w:tbl>|<w:p[\s>][\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(x)) !== null) {
    const chunk = m[0];
    if (chunk.indexOf('<w:tbl>') === 0) {
      const rows = [];
      const rowRe = /<w:tr[\s>][\s\S]*?<\/w:tr>/g;
      let rm;
      while ((rm = rowRe.exec(chunk)) !== null) {
        const cells = [];
        const cellRe = /<w:tc[\s>][\s\S]*?<\/w:tc>/g;
        let cm;
        while ((cm = cellRe.exec(rm[0])) !== null) {
          const txt = (cm[0].match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [])
            .map((s) => s.replace(/^<[^>]+>|<\/w:t>$/g, ''))
            .join('');
          cells.push(txt.trim());
        }
        if (cells.length) rows.push(cells);
      }
      if (rows.length) {
        out.push('[TABLE]');
        rows.forEach((r) => out.push('| ' + r.join(' | ') + ' |'));
        out.push('[/TABLE]');
      }
    } else {
      const hasPict = chunk.indexOf('<w:pict') >= 0 || chunk.indexOf('<w:object') >= 0 || chunk.indexOf('<w:drawing') >= 0;
      const style = (chunk.match(/w:pStyle[^A-Za-z][\s\S]{0,30}w:val="([^"]+)"/) || [])[1] || '';
      const txt = (chunk.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [])
        .map((s) => s.replace(/^<[^>]+>|<\/w:t>$/g, ''))
        .join('');
      if (hasPict) out.push('[IMG] ' + txt.trim());
      else if (txt.trim()) out.push((['Heading1','Heading2','Heading3','Title'].includes(style) ? style + '|' : '') + txt.trim());
    }
  }
  console.log('================ ' + n + ' ================');
  console.log(out.join('\n'));
  console.log('');
});
