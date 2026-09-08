# Ernesto Starck Portfolio

Portafolio SPA orientado a perfil de Software Engineer, construido con Angular 20 y TypeScript. El objetivo del proyecto no es solo mostrar trabajos, sino evidenciar criterio técnico en arquitectura frontend, mantenibilidad, experiencia de usuario, operación y despliegue continuo.

## Ingeniería aplicada en este proyecto

- Arquitectura modular con componentes standalone y páginas desacopladas por dominio.
- Gestión de estado de preferencias (tema e idioma) mediante señales y persistencia en localStorage.
- Enrutamiento compatible con GitHub Pages usando hash location para evitar dependencias de rewrites del servidor.
- Sistema de diseño basado en tokens CSS, con variantes coherentes para modo claro/oscuro y responsive mobile-first.
- Internacionalización práctica ES/EN a nivel de contenido y navegación.
- Integración con la API pública de GitHub para actualizar repositorios sin editar el portafolio manualmente.
- Despliegue automatizado por pipeline para reducir fricción operacional.

## Stack técnico

- Framework: Angular 20
- Lenguaje: TypeScript
- Estilos: CSS personalizado + Tailwind CSS v4 + utilidades Bootstrap
- Build toolchain: Angular CLI
- Hosting: GitHub Pages
- CI/CD: GitHub Actions

## Alcance funcional

- Home
- Sobre mí
- Proyectos
- Certificaciones
- Contacto
- Modo claro/oscuro
- Cambio de idioma ES/EN

## Decisiones técnicas relevantes

1. Hash routing para Pages
Se utiliza withHashLocation para asegurar resolución de rutas sin configuración adicional de servidor en entornos estáticos.

2. Preferencias de usuario persistentes
Tema e idioma se mantienen entre sesiones para mejorar UX y reducir fricción cognitiva.

3. UI basada en sistema
El styling se controla desde variables y reglas consistentes para sostener legibilidad, contraste y coherencia visual en todas las páginas.

4. Navegación controlada por estado Angular
La apertura/cierre de navbar se maneja en la app sin dependencia del JavaScript de Bootstrap.

## Requisitos

- Node.js 20 o superior (recomendado 22)
- npm 10 o superior

## Ejecución local

```bash
npm install
npm run dev
```

Aplicación local:

http://localhost:4200/

## Scripts disponibles

| Script | Propósito |
| --- | --- |
| npm run dev | Servidor de desarrollo |
| npm start | Alias de npm run dev |
| npm run build | Build de producción |
| npm run build:gh | Build para GitHub Pages con base-href relativo |
| npm run deploy | Publicación manual a rama gh-pages |
| npm run watch | Build continuo en modo desarrollo |
| npm test | Ejecución de pruebas |

## Despliegue

### Automático (recomendado)

El workflow en ../.github/workflows/deploy-pages.yml despliega cuando hay cambios en main bajo ng-portfolio/.

Pipeline:

1. npm ci
2. npm run build:gh
3. Publicación en gh-pages

### Manual

```bash
npm run deploy
```

## Estructura del proyecto

```text
ng-portfolio/
├── public/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── sobre-mi/
│   │   │   ├── proyectos/
│   │   │   ├── certificaciones/
│   │   │   └── contacto/
│   │   ├── app.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

## Rutas

- /#/ Home
- /#/sobre-mi
- /#/proyectos
- /#/certificaciones
- /#/contacto

## Criterios de calidad

- Build reproducible con Angular CLI.
- Separación clara entre layout global, páginas y estilos transversales.
- Convenciones de UI consistentes entre idiomas y temas.
- Enfoque en mantenibilidad antes que soluciones ad-hoc.

## Validaciones de calidad

- Tests unitarios para preferencias, navegación y componentes Angular.
- Auditoría estructural de accesibilidad para alt text, tipos de botón y enlaces externos.
- Presupuesto de rendimiento para el bundle inicial y los estilos de componentes.
- Workflow CI con lint, auditoría de accesibilidad, tests con cobertura y build de producción.

Comandos locales:

```bash
npm run lint
npm run audit:accessibility
npm run test:ci
npm run build:gh
```

La auditoría estructural complementa, pero no reemplaza, una revisión manual de contraste, foco y navegación completa con teclado.

## Contacto

- Email: ernesto.starck@gmail.com
- LinkedIn: https://linkedin.com/in/ernestostarck
- GitHub: https://github.com/ernestostarck
