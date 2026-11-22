# Alquimia Córdoba – sitio estático

Sitio estático que reemplaza al WordPress de https://alquimiacordoba.com/. Está en español; responde al usuario en el idioma de su mensaje.

## Estructura del repositorio

```
site/            lo único que se publica (ver wrangler.jsonc)
  *.html         páginas: index, servicios, articulos, formacion, angel-chialvo,
                 contacto, cambio-de-paradigma (el artículo), 404
  css/styles.css todos los estilos; colores y fuentes en variables de :root
  css/fonts/     ABeeZee, Roboto, Roboto Condensed (locales)
  images/        imágenes, favicons y el video alquimia-cordoba.mp4
  js/main.js     JavaScript simple (sin módulos): slider, acordeón FAQ, carrusel
                 de testimonios, menú móvil, volver arriba, botones de compartir
  _redirects     redirecciones 301: URLs viejas de WordPress → páginas nuevas
  sitemap.xml, robots.txt
wrangler.jsonc   configuración de Cloudflare (carpeta publicada, página 404)
CLAUDE.md        este archivo (no se publica)
```

Fuera de `site/` van solo archivos de trabajo: nada de eso se publica.

## Reglas

- **Debe funcionar desde el disco (file://):** rutas relativas (`css/…`, `images/…`, `servicios.html`), sin `<script type="module">`, sin frameworks, sin build ni npm.
- **Excepción:** `404.html` usa rutas absolutas desde la raíz (`/css/…`, `/servicios`), porque Cloudflare lo sirve en cualquier profundidad de URL.
- **Header y footer están repetidos en las 7 páginas** (y en el 404). Un cambio en el menú, el footer o el `<head>` se hace en todos los archivos.
- **Cada página tiene en el `<head>`** meta description, canonical (`https://alquimiacordoba.com/<página>`, sin `.html`), Open Graph y favicons. Una página nueva necesita lo mismo, más su entrada en `sitemap.xml`.
- **Diseño fiel al WordPress original.** Para valores exactos (colores, tiempos, hover), consulta el CSS de Elementor del sitio en vivo. Color principal del tema: `#CCA683` (`--c-tan`).
- **No corrijas el texto de los testimonios:** son citas textuales de clientes.

## Detalles que ya costaron un bug

- **Slider del inicio:** durante el fundido, la diapositiva que sale (`.is-prev`) queda visible debajo de la que entra (`.is-active`). Mostrar la *siguiente* debajo producía un destello de una tercera imagen.
- **Hover de las tarjetas de Servicios:** la imagen está dentro de `.serv-thumb` (con `overflow: hidden`) para que el zoom quede recortado. El efecto es `scale(1.1)` y el título pasa a `--c-tan`, en 0.4 s.
- **El formulario de contacto del WordPress estaba oculto,** por eso no se replicó. **`/turnos/` era una página vacía** y redirige a `/contacto`.

## Publicar (GitHub → Cloudflare Workers)

- **Repositorio:** `pabrobles/alquimiacordoba-com`, rama `main`. Esta carpeta es el repositorio: se edita, se hace commit y push aquí mismo.
- **Pide aprobación antes de cada commit o push:** un push a `main` publica en producción.
- **Cloudflare:** el proyecto es un **Worker** (no Pages) llamado `alquimiacordoba-com`. Cada push a `main` ejecuta `npx wrangler deploy`, que lee `wrangler.jsonc` y publica `site/`. En el panel no hay que configurar ninguna carpeta. El `name` de `wrangler.jsonc` debe coincidir con el nombre del Worker.
- **Git y `gh` están instalados** y `gh` está autenticado.
- **La carpeta vieja** `G:\My Drive\web projects\Alquimia-com` (con `website/` y la versión React original) es histórica: no se edita ni se publica desde ahí.

## Probar

- **Rápido:** abrir `site/*.html` en el navegador.
- **Capturas:** Edge en modo headless (`msedge --headless=new --screenshot=… --window-size=1280,2000 --virtual-time-budget=…`). El hover no se puede capturar: haz una copia de prueba donde `:hover` se reemplaza por `:first-child`.
- **`404.html` y las URLs sin `.html`:** necesitan un servidor local, porque no funcionan con file://. Las reglas de `_redirects` solo se pueden verificar en el subdominio `*.workers.dev` del Worker o en el dominio real.
