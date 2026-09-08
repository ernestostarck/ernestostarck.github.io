import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const sourceRoot = join(process.cwd(), 'src', 'app');
const violations = [];

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtml(path)));
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }

  return files;
}

function checkFile(filePath, source) {
  const relativePath = filePath.replace(`${process.cwd()}\\`, '').replaceAll('\\', '/');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const images = line.matchAll(/<img\b[^>]*>/gi);
    for (const match of images) {
      const tag = match[0];
      if (!/\balt\s*=\s*["'][^"']*["']/i.test(tag)) {
        violations.push(`${relativePath}:${lineNumber} image is missing alt text`);
      }
    }

    const buttons = line.matchAll(/<button\b[^>]*>/gi);
    for (const match of buttons) {
      const tag = match[0];
      if (!/\btype\s*=\s*["'][^"']+["']/i.test(tag)) {
        violations.push(`${relativePath}:${lineNumber} button is missing an explicit type`);
      }
    }

    const links = line.matchAll(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi);
    for (const match of links) {
      const tag = match[0];
      if (!/\brel\s*=\s*["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(tag)) {
        violations.push(
          `${relativePath}:${lineNumber} external blank link is missing noopener noreferrer`,
        );
      }
    }
  });
}

const files = await collectHtml(sourceRoot);
for (const file of files) {
  checkFile(file, await readFile(file, 'utf8'));
}

if (violations.length > 0) {
  console.error('Accessibility checks failed:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Accessibility checks passed for ${files.length} Angular templates.`);
