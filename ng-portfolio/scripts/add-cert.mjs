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

const AREA_CONFIG = {
  data: {
    labelEs: 'Data',
    labelEn: 'Data',
    chipLabelEs: 'Data',
    chipLabelEn: 'Data',
    badgeClass: 'badge-data',
    chipClass: 'chip-data',
  },
  ai: {
    labelEs: 'AI & Machine Learning',
    labelEn: 'AI & Machine Learning',
    chipLabelEs: 'AI',
    chipLabelEn: 'AI',
    badgeClass: 'badge-ai',
    chipClass: 'chip-ai',
  },
  software: {
    labelEs: 'Software & Cloud',
    labelEn: 'Software & Cloud',
    chipLabelEs: 'Software',
    chipLabelEn: 'Software',
    badgeClass: 'badge-software',
    chipClass: 'chip-software',
  },
  general: {
    labelEs: 'Gestión & Metodología',
    labelEn: 'Management & Methodology',
    chipLabelEs: 'Gestión & Proyectos',
    chipLabelEn: 'Management & Projects',
    badgeClass: 'badge-general',
    chipClass: 'chip-general',
  },
};

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

function detectArea(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  if (
    /\b(machine learning|deep learning|ai|ia|inteligencia artificial|neural|redes neuronales|nlp|llm|computer vision|prompt|supervised|unsupervised|clasificaci[oó]n|regresi[oó]n|reinforcement)\b/i.test(
      text,
    )
  ) {
    return 'ai';
  }
  if (
    /\b(data|datos|analytics|anal[ií]tica|analisis|sql|tableau|power bi|bigquery|etl|bi|database|business intelligence)\b/i.test(
      text,
    )
  ) {
    return 'data';
  }
  if (
    /\b(software|programming|programaci[oó]n|desarrollo|web|frontend|backend|fullstack|cloud|devops|docker|kubernetes|git|api|rest|angular|react|vue|node|java|c#|python|html|css|ciberseguridad|cybersecurity|azure|aws|gcp)\b/i.test(
      text,
    )
  ) {
    return 'software';
  }
  return 'general';
}

async function extractMetadata(url) {
  let title = '';
  let provider = 'Coursera';
  let issuer = '';
  let description = '';

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
      description = rawDesc;
      const orgMatch = rawDesc.match(/successful completion of ([^'"]+)'s/i);
      if (orgMatch) {
        issuer = orgMatch[1].trim();
      }
    }
  } catch (err) {
    console.warn('⚠️ No se pudo obtener metadatos automáticos de la URL:', err.message);
  }

  return { title, provider, issuer, description };
}

function getIconHtml(provider) {
  if (provider === 'Udemy') {
    return `<img *ngIf="theme() === 'light'" src="/icons/udemy_light.png" alt="Udemy" class="cert-card-icon" />\n\t\t\t\t\t<img *ngIf="theme() === 'dark'" src="/icons/Udemy-Symbol.png" alt="Udemy" class="cert-card-icon" />`;
  }
  return `<img src="icons/coursera-logo.png" alt="${provider}" class="cert-card-icon" />`;
}

function insertCardInArea(content, isEnglish, area, cardHtml) {
  const config = AREA_CONFIG[area];
  const areaId = isEnglish ? `area-${area}-en` : `area-${area}`;
  const sectionMarker = isEnglish
    ? '<section class="section lang-en"'
    : '<section class="section lang-es"';
  const noteMarker = isEnglish
    ? '<p class="cert-note">Certifications are used'
    : '<p class="cert-note">Las certificaciones';

  const sectionStart = content.indexOf(sectionMarker);
  if (sectionStart === -1) throw new Error(`No se encontró la sección ${isEnglish ? 'EN' : 'ES'}`);

  const sectionEnd = content.indexOf('</section>', sectionStart);
  let sectionContent = content.slice(sectionStart, sectionEnd);

  // Check if area already exists
  const areaIndex = sectionContent.indexOf(`id="${areaId}"`);

  if (areaIndex !== -1) {
    // Area exists: insert inside its education-grid
    const gridStart = sectionContent.indexOf('<div class="education-grid">', areaIndex);
    const gridEnd = sectionContent.indexOf('</div>', gridStart);
    sectionContent =
      sectionContent.slice(0, gridEnd) + cardHtml + '\n\t\t\t\t' + sectionContent.slice(gridEnd);

    // Update count badge
    const badgeRegex = isEnglish
      ? new RegExp(`<span class="area-badge ${config.badgeClass}">(\\d+) certification(s)?</span>`)
      : new RegExp(
          `<span class="area-badge ${config.badgeClass}">(\\d+) certificaci[oó]n(es)?</span>`,
        );

    sectionContent = sectionContent.replace(badgeRegex, (match, count) => {
      const newCount = parseInt(count, 10) + 1;
      return isEnglish
        ? `<span class="area-badge ${config.badgeClass}">${newCount} certifications</span>`
        : `<span class="area-badge ${config.badgeClass}">${newCount} certificaciones</span>`;
    });
  } else {
    // Area does NOT exist: add chip to banner and create new area section
    const bannerChipsClose = sectionContent.indexOf(
      '</div>',
      sectionContent.indexOf('class="banner-chips"'),
    );
    const chipHtml = `\t\t\t\t\t<span class="chip-area ${config.chipClass}">${isEnglish ? config.chipLabelEn : config.chipLabelEs}</span>\n`;
    sectionContent =
      sectionContent.slice(0, bannerChipsClose) + chipHtml + sectionContent.slice(bannerChipsClose);

    // Create new area section
    const areaTitle = isEnglish ? config.labelEn : config.labelEs;
    const badgeText = isEnglish ? '1 certification' : '1 certificación';
    const newAreaHtml = `\n\t\t\t<!-- ÁREA: ${areaTitle.toUpperCase()} -->\n\t\t\t<div class="cert-area-group" id="${areaId}">\n\t\t\t\t<div class="cert-area-header">\n\t\t\t\t\t<h4>${areaTitle}</h4>\n\t\t\t\t\t<span class="area-badge ${config.badgeClass}">${badgeText}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="education-grid">\n${cardHtml}\n\t\t\t\t</div>\n\t\t\t</div>\n`;

    const noteIndex = sectionContent.indexOf(noteMarker);
    sectionContent =
      sectionContent.slice(0, noteIndex) +
      newAreaHtml +
      '\n\t\t\t' +
      sectionContent.slice(noteIndex);
  }

  return content.slice(0, sectionStart) + sectionContent + content.slice(sectionEnd);
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

  // Detect Area
  const autoArea = detectArea(fullTitle, meta.description);
  const inputArea = await prompt(
    `🎯 Área detectada: [${autoArea.toUpperCase()}]. Opciones: data | ai | software | general (Enter para aceptar): `,
  );
  const selectedArea = (inputArea || autoArea).toLowerCase();
  const areaKey = AREA_CONFIG[selectedArea] ? selectedArea : 'general';
  console.log(`✓ Asignado al área: ${AREA_CONFIG[areaKey].labelEs}`);

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

  const cardHtmlEs = `\t\t\t\t\t<div class="cert-card cert-completado">
\t\t\t\t\t\t${iconHtml}
\t\t\t\t\t\t<strong>✓ ${fullTitle}</strong>
\t\t\t\t\t\t<span class="cert-card-description">${descEs}</span>
\t\t\t\t\t\t<span class="cert-card-status status-completado">Completado</span>
\t\t\t\t\t\t<span class="cert-card-link"><a href="${url}" target="_blank" rel="noopener noreferrer">Ver certificado</a></span>
\t\t\t\t\t</div>`;

  const cardHtmlEn = `\t\t\t\t\t<div class="cert-card cert-completado">
\t\t\t\t\t\t${iconHtml}
\t\t\t\t\t\t<strong>✓ ${fullTitle}</strong>
\t\t\t\t\t\t<span class="cert-card-description">${descEn}</span>
\t\t\t\t\t\t<span class="cert-card-status status-completado">Completed</span>
\t\t\t\t\t\t<span class="cert-card-link"><a href="${url}" target="_blank" rel="noopener noreferrer">View certificate</a></span>
\t\t\t\t\t</div>`;

  console.log('\n📄 Insertando certificado en certificaciones.html...');
  let content = readFileSync(certHtmlPath, 'utf8');

  // Insert in Spanish section
  content = insertCardInArea(content, false, areaKey, cardHtmlEs);

  // Insert in English section
  content = insertCardInArea(content, true, areaKey, cardHtmlEn);

  writeFileSync(certHtmlPath, content, 'utf8');
  console.log('✅ Archivo certificaciones.html actualizado.');

  console.log('🧪 Validando accesibilidad...');
  execSync('npm run audit:accessibility', { cwd: resolve(__dirname, '..'), stdio: 'inherit' });

  const confirmPush = await prompt(
    '\n🚀 ¿Deseas subir automáticamente los cambios a GitHub? (S/n): ',
  );
  if (confirmPush.toLowerCase() !== 'n') {
    execSync(`git add "${certHtmlPath}"`, { cwd: repoRoot, stdio: 'inherit' });
    execSync(
      `git commit -m "Agregar certificado (${AREA_CONFIG[areaKey].labelEn}): ${fullTitle}"`,
      {
        cwd: repoRoot,
        stdio: 'inherit',
      },
    );
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
