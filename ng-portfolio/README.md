# Portafolio - Ernesto Starck

SPA profesional desarrollada con Angular para presentar perfil, proyectos, certificaciones y contacto.

## Resumen

- Framework: Angular 20
- Lenguaje: TypeScript
- Estilos: CSS personalizado + Tailwind CSS v4 + utilidades Bootstrap
- Hosting: GitHub Pages
- Enrutamiento: Hash routing (`withHashLocation`) para compatibilidad con Pages

## Secciones del sitio

- Home
- Sobre mí
- Proyectos
- Certificaciones
- Contacto

## Requisitos

- Node.js 20+ (recomendado 22)
- npm 10+

## Instalación y ejecución local

```bash
npm install
npm run dev
```

Aplicación local: `http://localhost:4200/`

## Scripts disponibles

| Script | Uso |
| --- | --- |
| `npm run dev` | Levanta servidor de desarrollo |
| `npm start` | Alias de `npm run dev` |
| `npm run build` | Build de producción estándar |
| `npm run build:gh` | Build para GitHub Pages (`--base-href ./`) |
| `npm run deploy` | Build + publicación manual a `gh-pages` |
| `npm run watch` | Build en modo watch |
| `npm test` | Ejecuta pruebas |

## Despliegue

### Opción 1: Automático (recomendado)

El workflow [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) despliega automáticamente cuando hay cambios en `main` dentro de `ng-portfolio/`.

Pipeline:

1. `npm ci`
2. `npm run build:gh`
3. Publicación en rama `gh-pages`

### Opción 2: Manual

```bash
npm run deploy
```

## Estructura principal

```text
ng-portfolio/
├── public/
├── src/
│   ├── app/
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

- `/#/` Home
- `/#/sobre-mi`
- `/#/proyectos`
- `/#/certificaciones`
- `/#/contacto`

## Notas técnicas

- Componentes standalone en todas las páginas.
- Navbar controlado por estado Angular (sin dependencia de colapso JS de Bootstrap).
- Diseño responsive con layout optimizado para desktop y mobile.

## Contacto

- Email: ernesto.starck.exe@gmail.com
- LinkedIn: https://linkedin.com/in/ernestostarck
- GitHub: https://github.com/ernestostarck
