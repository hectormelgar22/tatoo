# NIGREDO Tattoo Studio

Web de demostración para un estudio de tatuaje ficticio en Malasaña, Madrid.
HTML, CSS y JavaScript a pelo. Sin framework, sin dependencias en el navegador
y sin paso de compilación: lo que hay en esta carpeta es exactamente lo que se
sirve.

```
index.html      Portada
artistas.html   Los cuatro artistas, con lo que hace y lo que no hace cada uno
galeria.html    El registro de obra (filtrable) y la hoja de flash
cuidados.html   Guía de cuidados día a día, con recordatorios .ics
reservar.html   Estimador, simulador de colocación, solicitud y lista de espera
sistema.html    Pliego de muestra del sistema de diseño (lleva noindex)

css/            Siete hojas, de la más general a la más específica
js/             content.js (todo el contenido) + un módulo por página
assets/         Fuentes subseteadas, imágenes en WebP y los flash en SVG
tools/          Herramientas de autoría. No se despliegan.
```

Para verla en local basta con cualquier servidor estático:

```bash
python -m http.server 5173
```

Abrir con doble clic también funciona: los scripts son clásicos, no módulos,
justo para que un `file://` no rompa nada.

---

## 1. Cómo se edita el contenido

**Todo lo editable vive en `js/content.js`.** Nombre, dirección, teléfono,
horarios, artistas, tarifas, flash, cuidados y huecos libres. No hace falta
tocar un solo HTML para cambiar un precio.

> **Después de editar `content.js`, ejecuta esto:**
>
> ```
> python tools/sync-contenido.py
> ```
>
> Copia el texto nuevo dentro de los cinco HTML. Si se te olvida, la web
> sigue funcionando —el navegador rellena los huecos igual—, pero el texto
> viejo se queda en el código fuente, que es lo que leen Google y las
> previsualizaciones de WhatsApp. Tarda unos segundos y solo necesita tener
> Chrome o Edge instalado. Hay más abajo, en la sección 5.

El archivo es un único objeto `window.STUDIO` dividido en diez secciones
numeradas. Las más habituales:

| Quiero cambiar… | Sección |
|---|---|
| Nombre, dirección, teléfono, WhatsApp, horarios | `studio` |
| El botón flotante de WhatsApp y su mensaje | `studio.botonWhatsapp` |
| El @ de Instagram y de TikTok | `studio.instagram`, `studio.tiktok` |
| Titulares y entradillas de cada página | `textos` |
| Artistas: bio, tarifa por hora, mínimo, agenda | `artistas` |
| Precios del estimador | `estimador` |
| La obra del registro | `planchas` |
| Flash y su estado | `flash` |
| La guía de cuidados y los avisos del .ics | `cuidados` |
| Huecos por cancelación | `huecos` |
| Las preguntas frecuentes de la portada | `preguntas` |

Dos reglas al editar:

- **Las comas y las comillas importan.** Si la web se queda en blanco, casi
  seguro falta una coma o sobra una. El navegador lo dice en la consola (F12).
- **Los `slug` y los `id` son direcciones internas.** Cambiar `vera-mota` por
  otra cosa rompe los enlaces ya publicados. Cambiar el texto visible no rompe
  nada.

### El botón flotante de WhatsApp

Sale en la esquina inferior derecha de todas las páginas. Se apaga entero
poniendo `activo: false` en `studio.botonWhatsapp`. El `mensaje` es el texto
con el que se abre el chat ya escrito: cuanto más concreto, menos «hola»
sueltos que contestar. Mientras se pregunta la edad no aparece, porque esa
respuesta va primero y además ocupa el mismo sitio.

### El WhatsApp

El formulario de cita no tiene servidor: monta un mensaje de texto y abre
WhatsApp con él ya escrito. El número sale de `studio.whatsapp`, **solo
dígitos y con prefijo de país**, sin espacios ni `+`:

```js
whatsapp: "34600000000",
```

### Redes sociales, en la portada

La sección «Redes» no es un widget embebido de Instagram o de TikTok. Esos
widgets son script de terceros: piden su propio permiso, pesan y suelen
costar puntos de CLS — justo lo que más ha costado dejar en 0 en esta web.
En su lugar hay una hoja de contactos: seis planchas del propio registro
(nunca la de portada ni las cuatro más recientes, para no repetir), a su
proporción real, que enlazan al perfil. Se recalculan solas al añadir o
quitar planchas; no hay nada que mantener a mano. Debajo, una fila por
cuenta con lo que se encuentra en cada una.

Los usuarios van en `studio.instagram` y `studio.tiktok` (sin la arroba), y
los textos en `textos.redes`. **Si vacías uno de los dos, esa fila
desaparece; si vacías los dos, desaparece la sección entera** en vez de
dejar un titular sobre un hueco.

### Preguntas frecuentes

Van en `preguntas`, justo encima de «Huecos por cancelación». Cada una es
`{ pregunta, respuesta }`; el campo `enlace` es opcional y solo lo llevan
las que de verdad mandan a otra parte de la web:

```js
{ pregunta: "¿Cuánto se tarda en conseguir cita?",
  respuesta: "Entre cuatro y seis semanas...",
  enlace: { texto: "Ver huecos por cancelación", href: "#t-huecos" } }
```

Se despliegan con `<details>`/`<summary>` nativo: funcionan sin JavaScript,
el teclado y el lector de pantalla los entienden solos, y solo una pregunta
queda abierta a la vez sin una sola línea de script para conseguirlo.

### Los estados del flash

```js
estado: "libre"       // se puede reservar
estado: "reservado"   // se ve, con banda de cinta, sin botón
estado: "tatuado"     // se ve, con la esquina troquelada, sin botón
```

### La verificación de edad

Por defecto es una franja inferior que no tapa el contenido. Para convertirla
en un panel que bloquee la página entera:

```js
edad: { bloqueante: true, … }
```

La franja se recuerda 180 días en el navegador del visitante (`recordarDias`).

---

## 2. De dónde salen las imágenes

Todas están documentadas en **`assets/img/CREDITOS.json`**, que genera la
propia herramienta con autor, origen, enlace y proporción de cada una.

**Fotografía de obra y del taller: Unsplash.** Trece fotos de tatuaje y una del
puesto de trabajo. Se eligió fotografía real y no generada a propósito: el
público de esta demo son tatuadores, y una imagen generada falla justo en lo
que un tatuador mira primero — cómo se asienta la tinta en la piel, la
diferencia entre fresco y cicatrizado, el grosor real de una línea.

| Archivo | Autor |
|---|---|
| `hero`, `pl-001` | Eugene Chystiakov |
| `pl-002` | Lesia |
| `pl-003` | GRAHAM MANSFIELD |
| `pl-004` | Eva Greenberg |
| `pl-005` | Seyi Ariyo |
| `pl-006` | Haberdoedas |
| `pl-007` | Michael Starkie |
| `pl-008` | Jan Kopřiva |
| `pl-009` | Sofia Lasheva |
| `pl-010` | Raspopova Marina |
| `pl-011` | Ethan Rougon |
| `pl-012` | Stories & Ink Tattoo Care |
| `lugar` | Maxim Hopman |

**Los cuatro retratos de artista: generados con IA.** Aquí sí compensa: el
stock daba cuatro fotógrafos distintos con cuatro luces distintas y no parecían
del mismo estudio. Los originales están en `tools/originales/`.

**Los ocho flash: SVG dibujados para este proyecto** (`assets/flash/`). No son
stock por dos razones. Una, un flash es obra del estudio y una imagen prestada
se nota. Dos, el simulador de colocación pinta el diseño sobre un `canvas` y
luego deja descargarlo: si el diseño viniera de otro dominio el canvas quedaría
contaminado y `toBlob()` lanzaría una excepción, o sea, no habría descarga.

**El mapa corporal y la tesela de grano** también se generan aquí
(`tools/make-silueta.py`, `tools/make-grain.py`).

### Poner las fotos del estudio real

1. Deja los archivos en `tools/originales/`.
2. En `tools/fetch-images.py`, cambia la entrada de la foto para que apunte al
   archivo local en vez de al identificador de Unsplash:

```python
dict(archivo="pl-001", tipo="plancha", local="mi-foto.jpg",
     autor="Nombre del fotógrafo", fuente="Propia",
     alt="Lo que se ve en la foto, descrito de verdad."),
```

3. Ejecuta `python tools/fetch-images.py`. Genera las variantes WebP en todos
   los anchos y actualiza los créditos.
4. Copia el `alt` y la `proporcion` que quedan en `CREDITOS.json` a la entrada
   correspondiente de `js/content.js`.

El `alt` no es relleno: es lo que oye quien navega con lector de pantalla.
Describe lo que se ve, no repitas el título.

---

## 3. Desplegar en Vercel

No hay nada que compilar.

**Desde la web:** entra en [vercel.com/new](https://vercel.com/new), arrastra
la carpeta y listo. En «Framework Preset» deja **Other** y no toques los
campos de build.

**Desde la terminal:**

```bash
npx vercel --prod
```

El archivo `vercel.json` ya trae lo que hace falta: cabeceras de caché
inmutable de un año para `/assets/`, `cleanUrls` (las URL quedan sin `.html`) y
dos cabeceras de seguridad. Brotli y HTTP/2 los pone Vercel solo.

**Después de desplegar**, cambia el dominio en tres sitios de cada HTML:
`<link rel="canonical">`, `og:image` y `og:url`. Están al principio del
`<head>` y ahora apuntan a `nigredo.example`.

Cualquier alojamiento estático sirve igual: Netlify, Cloudflare Pages o
GitHub Pages. En ese caso replica a mano las cabeceras de `vercel.json`.

---

## 4. Adaptarla a un estudio real

En orden de importancia:

1. **`js/content.js` entero.** Es el 90 % del trabajo. Nombre, dirección,
   teléfono, WhatsApp, horarios, artistas, tarifas y textos.
2. **Las fotos** (apartado 2). Sin obra real la web no vende.
3. **Las tarifas del estimador.** `estimador.tarifaHora`, `minimoEstudio`,
   `horasPorSesion` y los factores de cada tamaño, estilo, zona y detalle. Los
   valores actuales son plausibles para Madrid en 2026, pero cada estudio tiene
   los suyos. Conviene sentarse con el tatuador y calcular tres o cuatro piezas
   reales hasta que el resultado le cuadre.
4. **El dominio** en los `canonical` y los `og:image`.
5. **`assets/img/og.png`**, que es la tarjeta que sale al compartir por
   WhatsApp. Se regenera con `python tools/make-og.py` (con el servidor local
   en marcha) después de tocar `tools/og.html`.
6. **El favicon**, en `assets/img/favicon.svg`.
7. **Los textos legales.** `pie.enlaces` apunta a `#`. Un estudio real necesita
   aviso legal, política de privacidad y de cookies de verdad. Esta demo no
   pone cookies ni analítica, así que el banner de cookies no hace falta
   mientras siga así.
8. **La afirmación sanitaria.** `pie.sanidad` dice «Centro autorizado por la
   Comunidad de Madrid». Eso hay que verificarlo con el estudio o quitarlo.

### Lo que hay que renombrar si cambia el nombre del estudio

- `studio.nombre` y `studio.nombreCompleto` en `content.js`.
- La clave de la verificación de edad en `js/core.js`: `nigredo:edad`.
- Los nombres de archivo descargables en `js/cuidados.js`
  (`cuidados-nigredo.ics`) y `js/simulador.js` (`colocacion-nigredo.png`).
- El identificador de los eventos del calendario en `js/cuidados.js`
  (`@nigredo`).

---

## 5. Las herramientas de `tools/`

Son de autoría, no de despliegue. Ninguna hace falta para que la web funcione.
Todas necesitan Python 3 con Pillow (`pip install pillow`).

| Herramienta | Qué hace | Cuándo ejecutarla |
|---|---|---|
| `fetch-images.py` | Descarga o lee las fotos, genera las variantes WebP y escribe los créditos | Al cambiar cualquier foto |
| `make-flash.py` | Dibuja los ocho flash en SVG | Al cambiar un diseño de flash |
| `make-silueta.py` | Genera el mapa corporal del estimador | Casi nunca |
| `make-grain.py` | Genera la tesela de grano y la incrusta en `css/base.css` | Casi nunca |
| `make-og.py` | Captura `tools/og.html` como imagen de compartir | Al cambiar la marca |
| `metricas-fallback.py` | Recalcula las métricas de las fuentes de reserva | Solo si se cambia una fuente |
| `sync-contenido.py` | Copia el texto de `content.js` dentro de los cinco HTML | **Siempre que cambies `content.js`** |

### `sync-contenido.py`, la que se usa a diario

Todo el texto sale de `content.js` y el navegador lo coloca al cargar. Eso, tal
cual, tiene tres costes: la página aparece vacía un instante y salta al
rellenarse, el texto no está en el código fuente —Google ejecuta JavaScript,
pero muchos otros rastreadores y previsualizadores no— y sin JavaScript no se
ve nada.

La herramienta abre cada página en Chrome, deja que el JavaScript termine y
guarda el resultado de vuelta en el HTML. A partir de ahí el texto viaja en el
código fuente y el navegador solo se ocupa de lo que es de verdad interactivo.

- **No es un paso de compilación.** Vercel sigue sirviendo archivos estáticos
  tal cual. Es una herramienta de autoría, como `fetch-images.py`.
- **Se puede ejecutar mil veces.** Vuelca siempre lo mismo mientras no cambies
  `content.js`. `--check` dice qué cambiaría sin tocar nada, y se le puede
  pasar el nombre de una página suelta: `python tools/sync-contenido.py index`.
- **No congela lo que depende de quién mira**: la franja de verificación de
  edad, los filtros de la galería, las posiciones de la retícula y lo que llega
  por la URL se limpian antes de guardar y los repone el navegador.
- **Los huecos por cancelación** quedan congelados en el día en que la
  ejecutaste. El visitante siempre ve lo correcto porque el JavaScript los
  recalcula, pero si cambias `huecos`, vuelve a ejecutarla.

La última merece una explicación, porque es la menos evidente y la más fácil de
romper sin querer. Las fuentes llevan `font-display: swap`: el navegador pinta
primero con la fuente del sistema y cambia cuando llega la real. Si las dos no
ocupan exactamente lo mismo, al cambiar se recoloca toda la página. En
`css/base.css` hay dos `@font-face` de reserva que no descargan nada — son
Times y Arial con las métricas reescaladas para ocupar lo mismo que Bodoni y
Archivo. **Si cambias una fuente, ejecuta la herramienta y pega los números
nuevos**, o el texto volverá a saltar al cargar.

---

## 6. Notas técnicas

**Fuentes.** Bodoni Moda (titulares, con eje óptico real) y Archivo (cuerpo y
cifras tabulares), variables, subseteadas al juego de caracteres que la web usa
de verdad y autoalojadas: 112 KB las dos. No hay ninguna petición a Google.

**Imágenes.** WebP en tres o cuatro anchos con `srcset`, `width` y `height`
siempre puestos, `loading="lazy"` en todo menos en la imagen de portada, que
va con `fetchpriority="high"`.

**JavaScript.** Cero dependencias. Nueve archivos, ~143 KB sin comprimir de los
cuales 28 son el contenido. Todo con `defer`.

**Accesibilidad.** Auditada con axe-core sobre las cinco páginas en escritorio
y móvil, incluidas las reglas de buenas prácticas: **cero infracciones**. Toda
la escalera de contraste está medida, no estimada. El rojo de la marca da
3,38:1 sobre el negro, así que nunca se usa como texto pequeño: cuando tiene
que llevar texto se convierte en bloque sólido con el texto calado en papel.

**Movimiento reducido.** `prefers-reduced-motion: reduce` se respeta de verdad:
se cortan desplazamientos, revelados y resortes, y se conservan opacidad y
color, que sí ayudan a entender lo que acaba de pasar. Cada módulo de
JavaScript consulta la misma media query, no solo la hoja de estilos.

**Privacidad.** Ni analítica, ni cookies, ni peticiones a terceros. La foto que
se sube al simulador no sale del navegador.
