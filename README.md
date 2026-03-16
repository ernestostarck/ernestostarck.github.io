# Portfolio Profesional - Ernesto Starck H.

Repositorio del sitio personal de portfolio orientado a evidencia técnica y criterio de ingeniería aplicado a contextos reales.

Sitio publicado: https://ernestostarck.github.io/

---

## Enfoque

Este portfolio no está diseñado como CV largo ni como vitrina de tecnologías.

Objetivo principal:
1. Mostrar decisiones técnicas con impacto operativo.
2. Comunicar responsabilidad bajo restricciones reales.
3. Presentar soluciones mantenibles y utilizables por equipos no técnicos.

---

## Características del Sitio

1. Arquitectura multipágina con navegación consistente.
2. Diseño visual unificado tipo producto (desktop + móvil).
3. Ritmo vertical y ancho de lectura homogéneo en todas las vistas.
4. Jerarquía narrativa de proyectos por impacto y nivel de responsabilidad.
5. Footer global con año dinámico del sistema.
6. Botón flotante para volver arriba.
7. Accesibilidad base: estados focus visibles y soporte para `prefers-reduced-motion`.

---

## Estructura del Repositorio

- `index.html`: Home
- `sobre-mi.html`: Perfil profesional y criterio técnico
- `proyectos.html`: Proyectos seleccionados por impacto
- `certificaciones.html`: Certificaciones con respaldo aplicado
- `contacto.html`: Canales de contacto profesional
- `styles.css`: Sistema visual global (layout, tipografía, componentes)
- `script.js`: Año dinámico en footer + comportamiento del botón scroll top
- `favicon.svg`: Ícono principal del sitio
- `icons/`: Íconos SVG de contacto

---

## Stack Técnico

- HTML5
- CSS3
- JavaScript (vanilla)
- Bootstrap 5.3.8 (componentes y utilidades base)
- Google Fonts: IBM Plex Sans / IBM Plex Serif

---

## Proyectos Destacados

Ordenados por jerarquía profesional y contexto de aplicación:

1. Sistema de Apoyo a la Toma de Decisiones Clínicas (IA)
2. Sistema de Gestión y Modernización para APR
3. PowerPoint Add-In para Automatización de Reportes Corporativos
4. Sistema de Coordinación de Reuniones (Google Apps Script)

---

## Ejecución Local

1. Clonar el repositorio.
2. Abrir `index.html` en navegador.

Opcional: usar Live Server en VS Code para recarga automática.

---

## Deploy

El despliegue del sitio Angular vive en [ng-portfolio](ng-portfolio) y ahora puede publicarse de dos formas:

1. Manual desde [ng-portfolio/package.json](ng-portfolio/package.json) con `npm run deploy`.
2. Automática con GitHub Actions mediante [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).

### Configuración de GitHub Pages

En el repositorio `ernestostarck/ernestostarck.github.io`, deja configurado GitHub Pages así:

1. Ir a `Settings` > `Pages`.
2. En `Build and deployment`, elegir `Deploy from a branch`.
3. En `Branch`, seleccionar `gh-pages`.
4. En carpeta, seleccionar `/ (root)`.
5. Guardar.

Notas:

- Si la rama `gh-pages` todavía no aparece, haz primero un deploy manual o deja correr el workflow una vez.
- El workflow toma el proyecto Angular desde [ng-portfolio](ng-portfolio), ejecuta `npm ci`, construye con `npm run build:gh` y publica el resultado a `gh-pages`.
- Como el repositorio es `ernestostarck.github.io`, la URL final sigue siendo https://ernestostarck.github.io/.

### Deploy automático

El workflow se ejecuta automáticamente cuando hay cambios en [ng-portfolio](ng-portfolio) sobre `main`, y también puede ejecutarse manualmente desde la pestaña `Actions`.

---

## Estado

Migración Angular lista en [ng-portfolio](ng-portfolio).
Sitio publicado y preparado para despliegue automático con GitHub Pages.