import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, watch } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const targetFile = resolve(__dirname, '..', 'public', 'CV Ernesto Starck.pdf');

function getDocumentDirs() {
  const userProfile = process.env.USERPROFILE || process.env.HOME || '';
  const candidates = [
    join(userProfile, 'OneDrive', 'Documentos'),
    join(userProfile, 'OneDrive', 'Documents'),
    join(userProfile, 'Documentos'),
    join(userProfile, 'Documents'),
  ];
  return candidates.filter((dir) => existsSync(dir));
}

function getLatestCvFile() {
  const dirs = getDocumentDirs();
  let latestFile = null;
  let latestMtime = 0;

  for (const dir of dirs) {
    try {
      const files = readdirSync(dir);
      for (const file of files) {
        if (/^cv.*\.pdf$/i.test(file)) {
          const fullPath = join(dir, file);
          try {
            const stat = statSync(fullPath);
            if (stat.isFile() && stat.mtimeMs > latestMtime) {
              latestMtime = stat.mtimeMs;
              latestFile = fullPath;
            }
          } catch {
            // Ignore stat errors for inaccessible files
          }
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  return latestFile;
}

function getFileHash(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    const buffer = readFileSync(filePath);
    return createHash('sha256').update(buffer).digest('hex');
  } catch {
    return null;
  }
}

function syncCV() {
  const latestSource = getLatestCvFile();
  if (!latestSource) {
    console.log('⚠️ No se encontró ningún archivo PDF de CV en la carpeta Documentos.');
    return false;
  }

  console.log(`📄 Archivo detectado: ${latestSource}`);
  const sourceHash = getFileHash(latestSource);
  const targetHash = getFileHash(targetFile);

  if (sourceHash && targetHash && sourceHash === targetHash) {
    console.log('✓ El CV en el portafolio ya está actualizado con la versión más reciente.');
    return false;
  }

  console.log('🔄 Copiando nueva versión del CV al portafolio...');
  copyFileSync(latestSource, targetFile);

  console.log('🚀 Subiendo cambios a GitHub...');
  try {
    execSync(`git add "${targetFile}"`, { cwd: repoRoot, stdio: 'inherit' });
    execSync('git commit -m "Actualizar CV Ernesto Starck.pdf"', {
      cwd: repoRoot,
      stdio: 'inherit',
    });
    execSync('git push origin main', { cwd: repoRoot, stdio: 'inherit' });
    console.log('✅ CV actualizado y subido exitosamente a GitHub.');
    return true;
  } catch (error) {
    console.error('❌ Error al subir a GitHub:', error.message);
    return false;
  }
}

const isWatchMode = process.argv.includes('--watch') || process.argv.includes('-w');

if (isWatchMode) {
  const dirs = getDocumentDirs();
  console.log('👀 Modo observación activo. Monitoreando cambios en:', dirs.join(', '));
  syncCV();

  let debounceTimer = null;
  for (const dir of dirs) {
    try {
      watch(dir, (eventType, filename) => {
        if (filename && /^cv.*\.pdf$/i.test(filename)) {
          console.log(`\n🔔 Cambio detectado en "${filename}".`);
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            syncCV();
          }, 2500);
        }
      });
    } catch (err) {
      console.warn(`No se pudo observar la carpeta ${dir}:`, err.message);
    }
  }
} else {
  syncCV();
}
