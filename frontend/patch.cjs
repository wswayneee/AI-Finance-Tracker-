const fs = require('fs');

try {
  const vitePath = 'node_modules/vite/bin/vite.js';
  let viteCode = fs.readFileSync(vitePath, 'utf8');
  viteCode = viteCode.replace(/process\.exit\(1\)/g, "console.log('Bypassed node version check')");
  fs.writeFileSync(vitePath, viteCode);
  console.log('Patched vite.js');
} catch (e) {
  console.error('Error patching vite.js:', e);
}

try {
  const configPath = 'node_modules/@lovable.dev/vite-tanstack-config/dist/index.cjs';
  let configCode = fs.readFileSync(configPath, 'utf8');
  // the config needs to bypass the require('lovable-tagger') which causes ERR_REQUIRE_ESM
  configCode = configCode.replace(/require\(['"]lovable-tagger['"]\)/g, "{ componentTagger: () => {} }");
  fs.writeFileSync(configPath, configCode);
  console.log('Patched index.cjs');
} catch (e) {
  console.error('Error patching index.cjs:', e);
}
