const fs = require("fs");
const path = "H:\\ai\\codex\\web\\node_modules\\hexo-theme-butterfly\\layout\\includes\\rightside.pug";
let lastSize = fs.statSync(path).size;
console.log("Watching", path, "initial size:", lastSize);
let counter = 0;
const interval = setInterval(() => {
  try {
    const curr = fs.statSync(path).size;
    if (curr !== lastSize) {
      counter++;
      const c = fs.readFileSync(path, "utf8");
      const dl = (c.match(/data-label/g) || []).length;
      console.log(`[${counter}] Size changed: ${lastSize} -> ${curr}, data-label: ${dl}`);
      console.log("Content preview:", c.substring(0, 200));
      lastSize = curr;
    }
  } catch(e) {}
}, 500);
setTimeout(() => { clearInterval(interval); console.log("Stopped watching after 15s"); process.exit(0); }, 15000);
