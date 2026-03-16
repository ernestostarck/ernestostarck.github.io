# Portafolio - Ernesto Starck

Portfolio profesional moderno construido con **Angular 20.3.0** como Single Page Application (SPA).

## 🚀 Tecnologías

- **Angular 20.3.0** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **Bootstrap 5.3.8** - Framework CSS
- **Tailwind CSS 4.2.1** - Utility-first CSS
- **Devicon** - Iconos de tecnologías
- **GitHub Pages** - Hosting con despliegue automático

## 📋 Secciones

- **Home** - Presentación ejecutiva con resumen profesional
- **Sobre mí** - Perfil profesional, filosofía de trabajo y stack tecnológico
- **Proyectos** - Portafolio priorizado de proyectos desarrollados
- **Certificaciones** - Educación y certificaciones profesionales
- **Contacto** - Información de contacto y enlaces sociales

## 🛠️ Desarrollo

### Instalación

```bash
npm install
```

### Servidor de desarrollo

```bash
npm run dev
```

Abre tu navegador y ve a `http://localhost:4200/`. Los cambios se reflejan automáticamente.

### Construcción

**Producción general:**
```bash
npm run build
```

**Producción para GitHub Pages:**
```bash
npm run build:gh
```

## 🚢 Despliegue

### Automático (CI/CD)

El proyecto está configurado con **GitHub Actions** para despliegue automático:

1. Los cambios en `main` dentro de la carpeta `ng-portfolio/` disparan el workflow
2. Se ejecuta automáticamente: `npm ci` → `npm run build:gh` → Deploy a `gh-pages`
3. La rama `gh-pages` se publica en GitHub Pages

**Archivo:** `.github/workflows/deploy-pages.yml`

### Manual

```bash
npm run deploy
```

Esto compila la app y la publica en la rama `gh-pages`.

## 📁 Estructura

```
ng-portfolio/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── sobre-mi/
│   │   │   ├── proyectos/
│   │   │   ├── certificaciones/
│   │   │   └── contacto/
│   │   ├── app.ts              (Root component)
│   │   ├── app.config.ts       (Routing + providers)
│   │   └── app.routes.ts       (Definición de rutas)
│   ├── styles.css              (Estilos globales)
│   └── main.ts
├── public/                     (Assets estáticos)
├── angular.json
├── package.json
└── tsconfig.json
```

## 🔧 Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm start` | Alias para `npm run dev` |
| `npm run build` | Build de producción |
| `npm run build:gh` | Build para GitHub Pages (`--base-href ./`) |
| `npm run deploy` | Build + Deploy a gh-pages |
| `npm run watch` | Watch mode para desarrollo |
| `npm test` | Ejecutar tests |

## 🌐 Rutas

La aplicación usa **hash routing** para compatibilidad con GitHub Pages:

- `/` → Home
- `/#/sobre-mi` → Sobre mí
- `/#/proyectos` → Proyectos
- `/#/certificaciones` → Certificaciones
- `/#/contacto` → Contacto

## 📦 Paquetes Principales

```json
{
  "dependencies": {
    "@angular/animations": "^20.3.0",
    "@angular/common": "^20.3.0",
    "@angular/compiler": "^20.3.0",
    "@angular/core": "^20.3.0",
    "@angular/forms": "^20.3.0",
    "@angular/platform-browser": "^20.3.0",
    "@angular/platform-browser-dynamic": "^20.3.0",
    "@angular/router": "^20.3.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular/cli": "^20.3.0",
    "@angular/compiler-cli": "^20.3.0",
    "tailwindcss": "^4.2.1",
    "@tailwindcss/postcss": "^4.2.1",
    "postcss": "^8.5.8",
    "angular-cli-ghpages": "^1.0.0"
  }
}
```

## 📝 Notas

- Los componentes de página son **standalone** para mejor modularidad
- Los estilos combinan **Tailwind CSS** con CSS personalizado
- El sitio es completamente responsive
- Usa **GitHub Pages** como hosting sin costo

## 📧 Contacto

Puedes encontrarme en:
- Email: ernesto.starck.exe@gmail.com
- LinkedIn: [Ernesto Starck](https://linkedin.com/in/ernestostarck)
- GitHub: [ernestostarck](https://github.com/ernestostarck)
