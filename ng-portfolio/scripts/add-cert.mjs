import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const certHtmlPath = resolve(
  __dirname,
  '..',
  'src',
  'app',
  'pages',
  'certificaciones',
  'certificaciones.html',
);

function prompt(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim());
    });
  });
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function extractMetadata(url) {
  let title = '';
  let provider = 'Coursera';
  let issuer = '';

  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('udemy.com')) provider = 'Udemy';
  else if (lowerUrl.includes('coursera.org')) provider = 'Coursera';

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const html = await res.text();

    const titleMatch =
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i);

    if (titleMatch) {
      let rawTitle = decodeHtmlEntities(titleMatch[1]);
      rawTitle = rawTitle.replace(/^Completion Certificate for /i, '');
      rawTitle = rawTitle.replace(/ \| Coursera$/i, '').trim();
      title = rawTitle;
    }

    const descMatch =
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

    if (descMatch) {
      const rawDesc = decodeHtmlEntities(descMatch[1]);
      const orgMatch = rawDesc.match(/successful completion of ([^'"]+)'s/i);
      if (orgMatch) {
        issuer = orgMatch[1].trim();
      }
    }
  } catch (err) {
    console.warn('⚠️ No se pudo obtener metadatos automáticos de la URL:', err.message);
  }

  return { title, provider, issuer };
}

function getIconHtml(provider) {
  if (provider === 'Udemy') {
    return `<img *ngIf="theme() === 'light'" src="/icons/udemy_light.png" alt="Udemy" class="cert-card-icon" />\n\t\t\t\t\t<img *ngIf="theme() === 'dark'" src="/icons/Udemy-Symbol.png" alt="Udemy" class="cert-card-icon" />`;
  }
  return `<img src="icons/coursera-logo.png" alt="${provider}" class="cert-card-icon" />`;
}

async function main() {
  let url = process.argv[2];
  if (!url) {
    url = await prompt('🔗 Ingresa la URL del certificado: ');
  }

  if (!url || !url.startsWith('http')) {
    console.error('❌ URL inválida.');
    process.exit(1);
  }

  console.log('🔍 Consultando información del certificado...');
  const meta = await extractMetadata(url);

  let fullTitle = meta.title;
  if (meta.issuer && !fullTitle.includes(meta.issuer)) {
    fullTitle = `${fullTitle} (${meta.issuer})`;
  }

  const inputTitle = await prompt(
    `📌 Título detectado [${fullTitle || 'Sin título'}]. Presiona Enter o escribe uno nuevo: `,
  );
  if (inputTitle) fullTitle = inputTitle;

  const defaultDescEs = `Certificación profesional en ${fullTitle}, orientada al desarrollo y aplicación práctica de competencias técnicas en proyectos reales.`;
  const defaultDescEn = `Professional certification in ${fullTitle}, focused on applied technical competencies and execution in real-world environments.`;

  const inputDescEs = await prompt(
    `📝 Descripción en español (Enter para usar predeterminada):\n> `,
  );
  const descEs = inputDescEs || defaultDescEs;

  const inputDescEn = await prompt(
    `📝 Description in English (Enter para usar predeterminada):\n> `,
  );
  const descEn = inputDescEn || defaultDescEn;

  const iconHtml = getIconHtml(meta.provider);

  const cardHtmlEs = `\t\t\t\t<div class="cert-card cert-completado">
\t\t\t\t\t${iconHtml}
\t\t\t\t\t<strong>✓ ${fullTitle}</strong>
\t\t\t\t\t<span class="cert-card-description">${descEs}</span>
\t\t\t\t\t<span class="cert-card-status status-completado">Completado</span>
\t\t\t\t\t<span class="cert-card-link"><a href="${url}" target="_blank" rel="noopener noreferrer">Ver certificado</a></span>
\t\t\t\t</div>`;

  const cardHtmlEn = `\t\t\t\t<div class="cert-card cert-completado">
\t\t\t\t\t${iconHtml}
\t\t\t\t\t<strong>✓ ${fullTitle}</strong>
\t\t\t\t\t<span class="cert-card-description">${descEn}</span>
\t\t\t\t\t<span class="cert-card-status status-completado">Completed</span>
\t\t\t\t\t<span class="cert-card-link"><a href="${url}" target="_blank" rel="noopener noreferrer">View certificate</a></span>
\t\t\t\t</div>`;

  console.log('\n📄 Insertando certificado en certificaciones.html...');
  let content = readFileSync(certHtmlPath, 'utf8');

  // Insert in Spanish section (before the first closing </div> followed by cert-note)
  const esNoteMarker = '<p class="cert-note">Las certificaciones';
  const esIndex = content.indexOf(esNoteMarker);
  if (esIndex === -1) {
    console.error('❌ No se encontró la sección en español en certificaciones.html');
    process.exit(1);
  }

  const esClosingDiv = content.lastIndexOf('</div>', esIndex);
  content = content.slice(0, esClosingDiv) + cardHtmlEs + '\n\t\t\t' + content.slice(esClosingDiv);

  // Insert in English section (before the English cert-note)
  const enNoteMarker = '<p class="cert-note">Certifications are used';
  const enIndex = content.indexOf(enNoteMarker);
  if (enIndex === -1) {
    console.error('❌ No se encontró la sección en inglés en certificaciones.html');
    process.exit(1);
  }

  const enClosingDiv = content.lastIndexOf('</div>', enIndex);
  content = content.slice(0, enClosingDiv) + cardHtmlEn + '\n\t\t\t' + content.slice(enClosingDiv);

  writeFileSync(certHtmlPath, content, 'utf8');
  console.log('✅ Archivo certificaciones.html actualizado.');

  console.log('🧪 Validando accesibilidad...');
  execSync('npm run audit:accessibility', { cwd: resolve(__dirname, '..'), stdio: 'inherit' });

  const confirmPush = await prompt(
    '\n🚀 ¿Deseas subir automáticamente los cambios a GitHub? (S/n): ',
  );
  if (confirmPush.toLowerCase() !== 'n') {
    execSync(`git add "${certHtmlPath}"`, { cwd: repoRoot, stdio: 'inherit' });
    execSync(`git commit -m "Agregar certificado: ${fullTitle}"`, {
      cwd: repoRoot,
      stdio: 'inherit',
    });
    execSync('git push origin main', { cwd: repoRoot, stdio: 'inherit' });
    console.log('\n🎉 ¡Certificado subido y desplegado con éxito en GitHub!');
  } else {
    console.log('💾 Cambios guardados localmente sin hacer push.');
  }
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
