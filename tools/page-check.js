// Quick per-page asset/layout probe for the running dev server.
const http = require('http')

;(async () => {
  const pages = [
    ['/', 'home'],
    ['/posts/hardware-development-process/', 'post'],
    ['/collections/hardware-development/', 'collection'],
  ]
  for (const [p, n] of pages) {
    const t0 = Date.now()
    const body = await new Promise((res) => {
      http.get('http://127.0.0.1:4000' + p, r => {
        let d = ''
        r.on('data', c => (d += c))
        r.on('end', () => res(d))
      }).on('error', e => res('ERR ' + e.code))
    })
    const hero = body.includes('hb-hero')
    const hasRecent = body.includes('recent-posts')
    console.log(
      n.padEnd(12),
      'ms=' + (Date.now() - t0).toString().padStart(4),
      'hero=' + hero,
      'recent-posts=' + hasRecent,
      'len=' + ((body.length / 1024) | 0) + 'KB'
    )
  }
})()
