// One-shot patcher: restrict the injected hero to the homepage only.
// The hero was falling back to #content-inner on non-home pages, which
// broke the two-column layout (hero ended up in the sidebar slot).
// Run once, then safe to delete.
const fs = require('fs')
const path = require('path')
const p = path.join(__dirname, '..', '_config.butterfly.yml')
let s = fs.readFileSync(p, 'utf8')
const lines = s.split('\n')
let patched = false
for (let i = 0; i < lines.length; i++) {
  const l = lines[i]
  if (l.includes('recent-posts') && l.includes('content-inner') && l.includes('getElementById')) {
    lines[i] = "        var host = document.getElementById('recent-posts');"
    lines.splice(i + 1, 0, "        if (!isHome) return;")
    patched = true
    break
  }
}
if (patched) {
  fs.writeFileSync(p, lines.join('\n'))
  console.log('patched: hero now homepage-only')
} else {
  console.log('pattern not found, checking...')
  lines.forEach((l, i) => {
    if (l.includes('recent-posts') || l.includes('content-inner')) console.log(i + 1, l.trim())
  })
}
