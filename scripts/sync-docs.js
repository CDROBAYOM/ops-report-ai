const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const TARGET_DIR = path.join(ROOT_DIR, 'website', 'src', 'content', 'docs');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function extractTitle(content, fallback) {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    let t = headingMatch[1].trim();
    // Limpiar posibles etiquetas o caracteres raros
    return t.replace(/"/g, '\\"');
  }
  return fallback;
}

function processMarkdown(content, filename) {
  const defaultTitle = filename.replace(/\.mdx?$/, '');
  
  // Revisar si ya tiene front matter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  if (fmMatch) {
    let fmBody = fmMatch[1];
    if (!/^title\s*:/m.test(fmBody)) {
      const title = extractTitle(content, defaultTitle);
      const newFm = `---\ntitle: "${title}"\n${fmBody}\n---`;
      return content.replace(/^---\r?\n[\s\S]*?\r?\n---/, newFm);
    }
    return content;
  } else {
    // No tiene front matter
    const title = extractTitle(content, defaultTitle);
    return `---\ntitle: "${title}"\n---\n\n${content}`;
  }
}

function copyDocs(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDocs(srcPath, destPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        let content = fs.readFileSync(srcPath, 'utf8');
        content = processMarkdown(content, entry.name);
        fs.writeFileSync(destPath, content, 'utf8');
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

console.log('🔄 Sincronizando docs/ hacia website/src/content/docs/...');
copyDocs(DOCS_DIR, TARGET_DIR);
console.log('✅ Documentación sincronizada con éxito.');
