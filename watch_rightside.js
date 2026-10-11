const fs = require("fs");
const path = "H:\\ai\\codex\\web\\node_modules\\hexo-theme-butterfly\\layout\\includes\\rightside.pug";
const correct = fs.readFileSync("H:\\ai\\codex\\web\\_butterfly_tmp\\package\\layout\\includes\\rightside.pug", "utf8");
console.log("Original size:", correct.length);
fs.writeFileSync(path, correct, "utf8");
console.log("Written at", new Date().toISOString());
let count = 0;
const watch = fs.watchFile(path, (curr, prev) => {
  count++;
  const c = fs.readFileSync(path, "utf8");
  const dl = c.split("data-label").length - 1;
  console.log(`[${count}] File modified! size=${c.length} data-label=${dl} at ${new Date().toISOString()}`);
  if (dl > 10) {
    console.log("CORRUPTED! Restoring...");
    fs.writeFileSync(path, correct, "utf8");
  }
});
console.log("Watching started. Killing watcher in 30s...");
setTimeout(() => { fs.unwatchFile(path); console.log("Watcher stopped"); process.exit(0); }, 30000);
