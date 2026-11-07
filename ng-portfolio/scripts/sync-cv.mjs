import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, watch, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..', '..');
const publicDir = resolve(scriptDir, '..', 'public');
const appTsFile = resolve(scriptDir, '..', 'src', 'app', 'app.ts');
const cvs = {
  software: { label: 'Software', file: 'CV Ernesto Starck.pdf' },
  data: { label: 'Data', file: 'CV_ERNESTO_STARCK.pdf' },
  ai: { label: 'AI', file: 'CV - Ernesto Starck.pdf' },
};

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--type') options.type = args[++i]?.toLowerCase();
    else if (args[i] === '--source') options.source = args[++i];
    else if (args[i] === '--watch' || args[i] === '-w') options.watch = true;
    else throw new Error(`Argumento desconocido: ${args[i]}`);
  }
  if (!cvs[options.type]) throw new Error('Indica --type software, data o ai.');
  return options;
}

function getDocumentDirs() {
  const userProfile = process.env.USERPROFILE || process.env.HOME || '';
  return [
    join(userProfile, 'OneDrive', 'Documentos'),
    join(userProfile, 'OneDrive', 'Documents'),
    join(userProfile, 'Documentos'),
    join(userProfile, 'Documents'),
  ].filter((dir) => existsSync(dir));
}

function findSource(type, dirs) {
  const matchesType = {
    software: /software|desarrollo/i,
    data: /data|datos|analytics|analista/i,
    ai: /\bai\b|artificial.?intelligence|inteligencia.?artificial/i,
  }[type];
  const candidates = [];
  for (const dir of dirs) {
    try {
      for (const name of readdirSync(dir)) {
        if (/^cv.*\.pdf$/i.test(name) && matchesType.test(name)) {
          const file = join(dir, name);
          const info = statSync(file);
          if (info.isFile()) candidates.push({ file, mtime: info.mtimeMs });
        }
      }
    } catch {
      // Ignore document folders that cannot be read.
    }
  }
  return candidates.sort((a, b) => b.mtime - a.mtime)[0]?.file;
}

function hash(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function syncCV({ type, source }) {
  const config = cvs[type];
  const sourceFile = source ? resolve(source) : findSource(type, getDocumentDirs());
  if (!sourceFile || !existsSync(sourceFile)) {
    console.error(`No encontré el PDF para ${config.label}. Usa --source "ruta/al/CV.pdf".`);
    return false;
  }

  const targetFile = join(publicDir, config.file);
  if (existsSync(targetFile) && hash(sourceFile) === hash(targetFile)) {
    console.log(`El CV de ${config.label} ya está actualizado.`);
    return false;
  }

  copyFileSync(sourceFile, targetFile);
  const appTs = readFileSync(appTsFile, 'utf8');
  const encodedName = encodeURIComponent(config.file);
  const filePattern = new RegExp(`'${encodedName}(?:\\?v=[^']*)?'`);
  const updatedAppTs = appTs.replace(filePattern, `'${encodedName}?v=${Date.now()}'`);
  if (updatedAppTs === appTs) throw new Error(`No encontré en app.ts el enlace del CV ${config.label}.`);
  writeFileSync(appTsFile, updatedAppTs, 'utf8');

  execFileSync(
    'git',
    ['commit', '--only', '-m', `Actualizar CV ${config.label}`, '--', targetFile, appTsFile],
    { cwd: repoRoot, stdio: 'inherit' },
  );
  execFileSync('git', ['push', 'origin', 'main'], { cwd: repoRoot, stdio: 'inherit' });
  console.log(`CV ${config.label} actualizado, commit creado y cambios enviados a origin/main.`);
  return true;
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.watch) {
    const dirs = getDocumentDirs();
    if (!dirs.length) throw new Error('No encontré carpetas Documentos para observar.');
    console.log(`Observando CVs de ${options.type} en: ${dirs.join(', ')}`);
    syncCV(options);
    let timer;
    for (const dir of dirs) {
      watch(dir, (_event, filename) => {
        if (filename && /^cv.*\.pdf$/i.test(filename)) {
          clearTimeout(timer);
          timer = setTimeout(() => syncCV(options), 1500);
        }
      });
    }
  } else {
    syncCV(options);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
