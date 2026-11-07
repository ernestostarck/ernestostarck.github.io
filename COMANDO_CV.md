# Comandos de automatización del portafolio

### Actualizar un CV
El header ofrece tres versiones y cada una usa su propio PDF en `ng-portfolio/public`:

| Opción del header | Archivo publicado |
| --- | --- |
| CV Software | `CV Ernesto Starck.pdf` |
| CV Data | `CV_ERNESTO_STARCK.pdf` |
| CV AI | `CV - Ernesto Starck.pdf` |

Para reemplazar una versión y crear automáticamente el commit y el push, ejecuta desde `ng-portfolio`:

```bash
npm run cv:sync -- --type software --source "C:/ruta/a/CV Software.pdf"
npm run cv:sync -- --type data --source "C:/ruta/a/CV Data.pdf"
npm run cv:sync -- --type ai --source "C:/ruta/a/CV AI.pdf"
```

Los tipos aceptados son `software`, `data` y `ai`. `--source` puede omitirse si el PDF está en Documentos/OneDrive y su nombre comienza con `CV` e incluye el tipo (por ejemplo, `CV Data.pdf` o `CV Software.pdf`). Si hay más de uno, se usa el más reciente que coincida con ese tipo. El comando compara el archivo mediante SHA-256, actualiza el parámetro anti-caché del enlace correspondiente y solo agrega ese PDF y `app.html` al commit antes de enviar a `origin/main`.

También puedes vigilar la carpeta Documentos para un tipo concreto:

```bash
npm run cv:watch -- --type data
```

En modo observación, el nombre del archivo debe comenzar con `CV` e incluir `software`, `data`/`datos` o `ai`/`inteligencia artificial`, según el tipo indicado.

### Agregar nueva certificación
- **`npm run cert:add`**: Solicita la URL del certificado, detecta automáticamente el área (**Data**, **AI**, **Software** o **Gestión/General**) y el emisor (Coursera, Udemy, etc.), inserta la tarjeta en su categoría correspondiente en español e inglés, añade el chip al banner si es una nueva área (como Software) y sube los cambios a GitHub.
  Si el área ya existe, agrega un slide a su carrusel y actualiza el contador; si no existe, crea la sección completa (encabezado, carrusel, chip con ícono) en el orden Data → AI → Software → Gestión. El contador y la paginación del carrusel se calculan solos.
  *(También puedes pasar la URL directamente: `npm run cert:add -- <url>`)*
