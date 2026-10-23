// Builds dist-artifact into one self-contained HTML file (for the in-chat preview).
const fs = require('fs');
let html = fs.readFileSync('dist-artifact/index.html', 'utf8');
const js = fs.readFileSync('dist-artifact/app.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const css = fs.readFileSync('dist-artifact/app.css', 'utf8');
html = html.replace(/<script[^>]*src="[^"]*app\.js"[^>]*><\/script>/, '')
  .replace(/<link rel="stylesheet"[^>]*>/, '')
  .replace('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />', '')
  .replace('</head>', () => '<style>' + css + '</style></head>')
  .replace('</body>', () => '<script>' + js + '</script></body>');
fs.writeFileSync(process.argv[2], html);
console.log('wrote', process.argv[2], html.length);
