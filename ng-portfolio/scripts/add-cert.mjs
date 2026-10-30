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

const AREA_ORDER = ['data', 'ai', 'software', 'general'];

const AREA_ARIA = {
  data: { es: 'Data', en: 'Data' },
  ai: { es: 'AI', en: 'AI' },
  software: { es: 'Software', en: 'Software' },
  general: { es: 'Gestión', en: 'Management' },
};

const NAV_ICON_PREV =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>';
const NAV_ICON_NEXT =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

function buildSlide({ isEnglish, area, index, iconHtml, title, description, url }) {
  const T = '\t';
  const status = isEnglish ? 'Completed' : 'Completado';
  const linkText = isEnglish ? 'View certificate' : 'Ver certificado';
  return [
    `${T.repeat(6)}<div class="swiper-slide" [class.is-active]="getActiveIndex('${area}') === ${index}">`,
    `${T.repeat(7)}<div class="cert-card cert-completado">`,
    `${T.repeat(8)}<div class="cert-card-top">`,
    `${T.repeat(9)}${iconHtml}`,
    `${T.repeat(9)}<span class="cert-counter-chip" *ngIf="certCounts['${area}'] > 1">${index + 1} / {{ certCounts['${area}'] }}</span>`,
    `${T.repeat(8)}</div>`,
    `${T.repeat(8)}<strong>✓ ${title}</strong>`,
    `${T.repeat(8)}<span class="cert-card-description">${description}</span>`,
    `${T.repeat(8)}<div class="cert-card-footer">`,
    `${T.repeat(9)}<span class="cert-card-status status-completado status-${area}">${status}</span>`,
    `${T.repeat(9)}<span class="cert-card-link"><a href="${url}" target="_blank" rel="noopener noreferrer">${linkText} <span aria-hidden="true">↗</span></a></span>`,
    `${T.repeat(8)}</div>`,
    `${T.repeat(7)}</div>`,
    `${T.repeat(6)}</div>`,
  ].join('\n');
}

function buildAreaSection({ isEnglish, area, areaId, slideHtml }) {
  const config = AREA_CONFIG[area];
  const T = '\t';
  const title = (isEnglish ? config.labelEn : config.labelEs).replace(/&/g, '&amp;');
  const badgeText = isEnglish ? '1 certification' : '1 certificación';
  const aria = AREA_ARIA[area][isEnglish ? 'en' : 'es'];
  const regionLabel = isEnglish
    ? `${aria} certifications carousel`
    : `Carrusel de certificaciones de ${aria}`;
  const prevLabel = isEnglish ? `Previous certificate in ${aria}` : `Certificado anterior en ${aria}`;
  const nextLabel = isEnglish ? `Next certificate in ${aria}` : `Siguiente certificado en ${aria}`;
  const pagLabel = isEnglish ? `${aria} pagination` : `Paginación ${aria}`;
  const goLabel = isEnglish ? 'Go to certificate ' : 'Ir a certificado ';
  return [
    `${T.repeat(3)}<!-- ÁREA: ${area.toUpperCase()} -->`,
    `${T.repeat(3)}<div class="cert-area-group area-${area}" id="${areaId}">`,
    `${T.repeat(4)}<div class="cert-area-header">`,
    `${T.repeat(5)}<div class="cert-area-title-wrap">`,
    `${T.repeat(6)}<span class="area-indicator indicator-${area}" aria-hidden="true"></span>`,
    `${T.repeat(6)}<h4>${title}</h4>`,
    `${T.repeat(5)}</div>`,
    `${T.repeat(5)}<span class="area-badge ${config.badgeClass}">${badgeText}</span>`,
    `${T.repeat(4)}</div>`,
    '',
    `${T.repeat(4)}<div class="cert-swiper" role="region" aria-label="${regionLabel}">`,
    `${T.repeat(5)}<div class="swiper-wrapper">`,
    slideHtml,
    `${T.repeat(5)}</div>`,
    '',
    `${T.repeat(5)}<div class="cert-swiper-nav" *ngIf="certCounts['${area}'] > 1">`,
    `${T.repeat(6)}<button class="cert-swiper-btn cert-swiper-prev" type="button" (click)="prevCert('${area}')" aria-label="${prevLabel}">`,
    `${T.repeat(7)}${NAV_ICON_PREV}`,
    `${T.repeat(6)}</button>`,
    `${T.repeat(6)}<div class="cert-swiper-pagination" aria-label="${pagLabel}">`,
    `${T.repeat(7)}<button *ngFor="let i of getBullets('${area}')" type="button" class="cert-bullet" [class.is-active]="getActiveIndex('${area}') === i" (click)="goToCert('${area}', i)" [attr.aria-label]="'${goLabel}' + (i + 1)"></button>`,
    `${T.repeat(6)}</div>`,
    `${T.repeat(6)}<button class="cert-swiper-btn cert-swiper-next" type="button" (click)="nextCert('${area}')" aria-label="${nextLabel}">`,
    `${T.repeat(7)}${NAV_ICON_NEXT}`,
    `${T.repeat(6)}</button>`,
    `${T.repeat(5)}</div>`,
    `${T.repeat(4)}</div>`,
    `${T.repeat(3)}</div>`,
    '',
    '',
  ].join('\n');
}

function insertCardInArea(content, isEnglish, area, cardData) {
  const config = AREA_CONFIG[area];
  const areaSuffix = isEnglish ? '-en' : '';
  const areaId = `area-${area}${areaSuffix}`;
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

  const areaIndex = sectionContent.indexOf(`id="${areaId}"`);

  if (areaIndex !== -1) {
    const navIndex = sectionContent.indexOf('<div class="cert-swiper-nav"', areaIndex);
    if (navIndex === -1) throw new Error(`No se encontró el carrusel del área ${area}`);
    const slideCount = (
      sectionContent.slice(areaIndex, navIndex).match(/class="swiper-slide"/g) || []
    ).length;
    const slideHtml = buildSlide({ isEnglish, area, index: slideCount, ...cardData });

    const wrapperClose = sectionContent.lastIndexOf('</div>', navIndex);
    const lineStart = sectionContent.lastIndexOf('\n', wrapperClose) + 1;
    sectionContent =
      sectionContent.slice(0, lineStart) + slideHtml + '\n' + sectionContent.slice(lineStart);

    const badgeRegex = new RegExp(
      `(<span class="area-badge ${config.badgeClass}">)(\\d+) [^<]*(</span>)`,
    );
    sectionContent = sectionContent.replace(badgeRegex, (_m, open, count, close) => {
      const n = parseInt(count, 10) + 1;
      return `${open}${n} ${isEnglish ? 'certifications' : 'certificaciones'}${close}`;
    });
  } else {
    // Área nueva: chip en el banner (con ícono) + sección con carrusel en su posición
    const chipsStart = sectionContent.indexOf('class="banner-chips"');
    const chipsClose = sectionContent.indexOf('\n\t\t\t\t</div>', chipsStart);
    const chipLabel = (isEnglish ? config.chipLabelEn : config.chipLabelEs).replace(/&/g, '&amp;');
    const chipHtml = `\n\t\t\t\t\t<span class="chip-area ${config.chipClass}"><span class="chip-dot" aria-hidden="true"></span>${chipLabel}</span>`;
    let chipAt = chipsClose;
    for (const next of AREA_ORDER.slice(AREA_ORDER.indexOf(area) + 1)) {
      const nextChip = sectionContent.indexOf(`chip-area ${AREA_CONFIG[next].chipClass}"`, chipsStart);
      if (nextChip !== -1 && nextChip < chipsClose) {
        chipAt = sectionContent.lastIndexOf('\n', nextChip);
        break;
      }
    }
    sectionContent = sectionContent.slice(0, chipAt) + chipHtml + sectionContent.slice(chipAt);

    const slideHtml = buildSlide({ isEnglish, area, index: 0, ...cardData });
    const newAreaHtml = buildAreaSection({ isEnglish, area, areaId, slideHtml });

    let insertAt = -1;
    for (const next of AREA_ORDER.slice(AREA_ORDER.indexOf(area) + 1)) {
      const nextIdx = sectionContent.indexOf(`id="area-${next}${areaSuffix}"`);
      if (nextIdx !== -1) {
        const commentIdx = sectionContent.lastIndexOf('<!-- ÁREA', nextIdx);
        insertAt = sectionContent.lastIndexOf('\n', commentIdx) + 1;
        break;
      }
    }
    if (insertAt === -1) {
      const noteIdx = sectionContent.indexOf(noteMarker);
      insertAt = sectionContent.lastIndexOf('\n', noteIdx) + 1;
    }
    sectionContent =
      sectionContent.slice(0, insertAt) + newAreaHtml + sectionContent.slice(insertAt);
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

  const cardDataEs = { iconHtml, title: fullTitle, description: descEs, url };
  const cardDataEn = { iconHtml, title: fullTitle, description: descEn, url };

  console.log('\n📄 Insertando certificado en certificaciones.html...');
  let content = readFileSync(certHtmlPath, 'utf8');

  // Insert in Spanish section
  content = insertCardInArea(content, false, areaKey, cardDataEs);

  // Insert in English section
  content = insertCardInArea(content, true, areaKey, cardDataEn);

  writeFileSync(certHtmlPath, content, 'utf8');
  console.log('✅ Archivo certificaciones.html actualizado.');

  const statsPath = resolve(__dirname, '..', 'src', 'app', 'core', 'portfolio-stats.ts');
  const esSection = content.slice(0, content.indexOf('lang-en'));
  const certTotal = (esSection.match(/cert-card cert-completado/g) || []).length;
  writeFileSync(
    statsPath,
    readFileSync(statsPath, 'utf8').replace(
      /CERTIFICATION_COUNT = \d+/,
      `CERTIFICATION_COUNT = ${certTotal}`,
    ),
    'utf8',
  );
  console.log(`✅ Contador de certificaciones: ${certTotal}`);

  console.log('🧪 Validando accesibilidad...');
  execSync('npm run audit:accessibility', { cwd: resolve(__dirname, '..'), stdio: 'inherit' });

  const confirmPush = await prompt(
    '\n🚀 ¿Deseas subir automáticamente los cambios a GitHub? (S/n): ',
  );
  if (confirmPush.toLowerCase() !== 'n') {
    execSync(`git add "${certHtmlPath}" "${statsPath}"`, { cwd: repoRoot, stdio: 'inherit' });
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
