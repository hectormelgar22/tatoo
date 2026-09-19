---
name: NIGREDO · Sistema Registro
description: Un estudio de tatuaje tratado como registro de obra grabado; cada pieza es una plancha numerada y citable.
colors:
  ink: "#0B0907"
  ink-field: "#12100C"
  ink-inset: "#181410"
  ink-deep: "#060505"
  paper: "#F4EFE6"
  paper-2: "#E7E0D3"
  paper-edge: "#CFC5B2"
  fg: "#EFE9DD"
  fg-2: "#BEB4A4"
  fg-3: "#948A7C"
  fg-mute: "#8A8074"
  fg-off: "#5C554B"
  plate-fg: "#12100C"
  plate-fg-2: "#4A443A"
  plate-fg-3: "#6E6759"
  lacre: "#C41E30"
  lacre-deep: "#8E1522"
  lacre-lit: "#D42234"
  rule: "#251E17"
  rule-lit: "#33291F"
  rule-fn: "#8A8074"
typography:
  display:
    fontFamily: "Bodoni Moda, Bodoni fallback, Times New Roman, serif"
    fontSize: "clamp(2.75rem, 1.55rem + 6vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.93
    letterSpacing: "-0.035em"
  display-2:
    fontFamily: "Bodoni Moda, Bodoni fallback, Times New Roman, serif"
    fontSize: "clamp(2rem, 1.3rem + 3.5vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.026em"
  display-3:
    fontFamily: "Bodoni Moda, Bodoni fallback, Times New Roman, serif"
    fontSize: "clamp(1.5rem, 1.16rem + 1.7vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.018em"
  lead:
    fontFamily: "Archivo, Archivo fallback, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.01rem + 0.28vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.006em"
  body:
    fontFamily: "Archivo, Archivo fallback, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0em"
  label:
    fontFamily: "Archivo, Archivo fallback, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.145em"
  cifra:
    fontFamily: "Bodoni Moda, Bodoni fallback, Times New Roman, serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.6vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.028em"
  marca:
    fontFamily: "Bodoni Moda, Bodoni fallback, Times New Roman, serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.04em"
  marca-lema:
    fontFamily: "Archivo, Archivo fallback, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.16em"
  micro:
    fontFamily: "Archivo, Archivo fallback, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  none: "0"
spacing:
  s1: "0.25rem"
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "4rem"
  s9: "6rem"
  s10: "8rem"
  s11: "12rem"
components:
  button-stamp:
    backgroundColor: "{colors.lacre}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
    height: "44px"
  button-stamp-active:
    backgroundColor: "{colors.lacre-deep}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
    height: "44px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.fg-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
    height: "44px"
  chip-pressed:
    backgroundColor: "{colors.lacre}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.ink-inset}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
    height: "44px"
  plate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.plate-fg}"
    rounded: "{rounded.none}"
    padding: "2rem"
---

## Overview

NIGREDO se construye como un **registro de obra grabado**: un atlas de láminas
numeradas, no una web de negocio local. La consecuencia práctica de esa idea es
que cada pieza terminada tiene un número de plancha (`PL. 007`) que es a la vez
identificador y dirección: abrirla cambia la URL, y esa URL vuelve a abrirla.
El estudio puede decir «mírate la plancha 7» y funciona.

El mundo visual es tinta, papel y un solo rojo con oficio. La tinta es un negro
**cálido** —hay más rojo que azul en las sombras— y no el gris azulado de
plantilla. El papel aparece **solo** donde vive la obra o un dato, y es lo único
que proyecta sombra, porque es lo único que está físicamente encima. Todo lo
demás va a hueso y se separa con un filete de un píxel.

El fondo oscuro no es una moda: el tráfico de un estudio de tatuaje llega desde
Instagram, o sea desde un móvil, muchas veces de noche.

## Colors

Estrategia: **neutros más un acento**, con el acento fuertemente racionado. La
fotografía de los tatuajes es lo único que aporta color a la página, y el marco
no compite con ella.

**Tinta.** `ink` es el suelo de página. `ink-field` para barras y paneles
elevados, `ink-inset` para campos hundidos (inputs, huecos), `ink-deep` para el
pozo del visor.

**Papel.** `paper` es la plancha. Aparece bajo una lámina de flash, bajo la
cifra del estimador y bajo un bloque de datos. Nunca como fondo de sección.

**Texto.** Toda la escalera está medida sobre `ink`, no estimada:

| Token | Ratio | Uso |
|---|---|---|
| `fg` | 16,44:1 | Titulares y cuerpo principal |
| `fg-2` | 9,71:1 | Cuerpo secundario |
| `fg-3` | 5,86:1 | Metadatos y pies |
| `fg-mute` | 5,13:1 | Etiquetas y **filetes funcionales** |
| `fg-off` | 2,70:1 | **Solo** controles deshabilitados |

**La regla del lacre.** `lacre` da 3,38:1 sobre tinta: suficiente para un
componente de interfaz o un titular (WCAG 1.4.11 pide 3:1), insuficiente para
texto pequeño. De ahí sale la regla que gobierna el color en toda la web:

> El lacre aparece en tres sitios y en ninguno más:
> 1. **Lo que el usuario puede manipular**: botón, filtro activo, tirador, zona
>    elegida en la silueta, paso actual, página actual.
> 2. **El índice de una medida que acaba de cambiar**: la cifra viva del
>    estimador, la marca sobre una escala.
> 3. **Una advertencia sanitaria.** Única excepción, declarada a propósito para
>    que se note si alguien abre una cuarta.
>
> Nunca en un fondo, un filete de separación, un icono ni un titular.

Cuando el lacre tiene que llevar texto, **se vuelve bloque sólido y el texto se
cala en papel** (5,13:1). La restricción de accesibilidad y la estética
coinciden: un sello es exactamente eso.

**Filetes.** `rule` para separación decorativa, `rule-lit` sobre campo elevado y
`rule-fn` para bordes **funcionales** —el de un input, el de un botón—, que a
5,13:1 cumplen 1.4.11. Un filete decorativo no vale donde el borde es lo único
que dice dónde empieza un campo.

## Typography

**Bodoni Moda** para titulares y **Archivo** para todo lo demás. Ambas
variables, subseteadas y autoalojadas: 112 KB las dos juntas, sin ninguna
petición a terceros.

Bodoni no está elegida por ser una didona bonita: trae **eje óptico real**
(`opsz` de 6 a 96), así que su trazo fino engorda solo al reducir el cuerpo. Es
justo el problema que tiene una didona en una web. Se activa con
`font-optical-sizing: auto`.

**Tracking e interlineado son específicos de cada escalón.** Un único
`letter-spacing` global siempre está mal en algún punto de la escala: lo grande
se abre y lo pequeño se cierra. Negativo arriba (−0,035 em en display), neutro
en el cuerpo, positivo y muy abierto en las versalitas de ficha (+0,145 em). El
interlineado va al revés que el tamaño.

**Cifras tabulares en todo lo medible.** Precios, sesiones, horas, centímetros y
números de plancha llevan `tabular-nums lining-nums` para que cuadren en
columna. No hay fuente monoespaciada: el mono como disfraz de «técnico» es
justo lo que se quiso evitar.

**Fuentes de reserva con métricas ajustadas.** `css/base.css` declara dos
`@font-face` que no descargan nada: Times y Arial reescaladas para ocupar
exactamente lo mismo que Bodoni y Archivo. Sin eso, `font-display: swap`
recoloca toda la página al cargar. Los números se recalculan con
`tools/metricas-fallback.py` y **hay que rehacerlos si se cambia una fuente**.

Medida de lectura: 66 caracteres en cuerpo, 46 en entradillas.

**Cuatro escalones fuera de la escala general**, cada uno con un motivo:

- `cifra` — la horquilla de precio del estimador. Es el único número que manda
  en su propia plancha y necesita una escala propia; además es lo único que va
  en lacre a tamaño grande, donde 3,38:1 sí cumple.
- `marca` y `marca-lema` — la marca de la barra de navegación. Tamaño fijo, no
  fluido, porque de su altura se deriva la reserva de la barra y esa reserva no
  puede moverse con el viewport.
- `micro` — el número de orden sobre una miniatura de referencia arrastrable.
  Va encima de la imagen y no puede robarle sitio.

`lacre-lit` (#D42234) es el lacre aclarado un 6 % y existe para una sola cosa:
el hover del botón estampado. No se usa en ningún otro sitio.

## Layout

**Un eje.** Un filete vertical recorre el documento entero a 9,5 rem del borde
y todo cuelga de él: a la izquierda el margen de ficha (número de plancha,
etiqueta, nota al margen), a la derecha la obra. La asimetría sale del eje, no
de decidir a ojo dónde poner cada cosa, y por eso aguanta cuando la página
crece. Por debajo de 960 px el eje desaparece y el margen se lee encima del
bloque: no hay sitio para dos columnas, y fingirlo es peor que quitarlo.

**Un solo ritmo vertical** en toda la web, con una escala de espacio de once
pasos, y siempre **más aire encima de un titular que debajo**: el espacio
pertenece a la sección que empieza.

**Proporciones rotas a propósito.** Las columnas van 7/3, 3/7 o 5/8. Nunca tres
columnas iguales.

**Reservas de altura.** El texto lo inyecta el script desde `content.js`, así
que los contenedores llegan vacíos. Las clases `.rsv-*` reservan su altura
derivándola de la propia escala tipográfica (tamaño × interlineado × líneas),
no con números a ojo: si cambian los tokens, la reserva se ajusta sola. Sin
esto, al rellenarse empujan hacia abajo todo lo que tienen debajo.

## Elevation & Depth

**Una sola sombra en toda la web, y solo bajo el papel.** La sombra no es un
efecto que se reparte por igual: existe donde algo está físicamente encima de
otra cosa. Aquí eso es la plancha de papel y nada más.

```css
--shadow-plate: 0 1px 2px rgba(0,0,0,.55), 0 10px 28px -8px rgba(0,0,0,.66);
--shadow-lift:  0 2px 5px rgba(0,0,0,.6),  0 26px 56px -16px rgba(0,0,0,.76);
```

Dos capas, con desplazamiento y desenfoque reales. Nada de halos sin
desplazamiento, que son decoración disfrazada de profundidad.

Todo lo demás va **a hueso**, separado por un filete de un píxel.

La barra de navegación es una **capa translúcida** (`backdrop-filter: blur(18px)`)
con el contenido pasando por debajo, no una tira opaca que se come una franja
fija de pantalla. Su filete inferior aparece solo cuando hay contenido debajo.
Con `prefers-reduced-transparency: reduce` se vuelve sólida.

**Grano.** Una tesela de 128 px incrustada como data URI en `css/base.css`, en
un pseudo-elemento fijo con `mix-blend-mode: overlay` al 4,2 % de opacidad. Va
incrustada y no como archivo suelto porque si llega por red llega tarde, y esa
capa recomponiéndose a destiempo se contabiliza como desplazamiento de
maquetación.

## Shapes

**Radio cero en todo el proyecto.** Un registro se imprime en papel cortado a
escuadra. No hay una sola esquina redondeada, ni en botones, ni en campos, ni en
láminas.

Las únicas formas no rectangulares son **marcas de estado**, y son físicas:

- **Troquel**: una esquina cortada con `clip-path`, para lo ya tatuado.
- **Banda de cinta**: trama diagonal, para lo reservado.
- **Cuadro lleno**: para lo disponible.

Se distinguen en escala de grises, con daltonismo y en una captura impresa: el
estado nunca depende solo del color.

## Components

**Botón estampado** (`.btn--stamp`). El único con relleno de color de toda la
web, y por eso se ve desde lejos. Al pulsar baja a `lacre-deep`.

**Botón de filete** (`.btn`). Borde funcional a 5,13:1, fondo transparente. Al
pasar el ratón, el borde se vuelve lacre.

**Todo lo pulsable baja a `scale(0.97)` en 120 ms al pulsar**, no al soltar: es
donde el usuario está mirando. Área táctil mínima de 44 px en todo.

**Chip de filtro.** Activo = manipulado por el usuario = lleva lacre. Los que no
darían resultado se ven pero no se pueden pulsar; ocultarlos haría saltar la
fila entera cada vez que cambia otro filtro.

**Campos.** El borde es funcional, no decorativo. En error, el lacre marca y
bordea pero **el mensaje se lee en papel**: un texto de error en rojo pequeño
sobre tinta no llegaría a 4,5:1.

**Número de plancha** (`.plate-no`). Texto en blanco a 16,44:1 con una marca de
índice en lacre al lado. El número no va en lacre porque a 11 px no cumpliría
contraste; la señal de «esto es una dirección viva» la lleva la marca, que como
gráfico solo necesita 3:1. Además es lo que hace una lámina de verdad: la tinta
roja es el sello, no el texto.

**Plancha** (`.plate`). La única superficie de papel del sistema.

**Foco.** Dos filetes de lacre a escuadra con `outline-offset: 3px`. Sobre un
bloque de lacre se invierte a papel. Nunca `:focus` sin `-visible`.

**Superficies del navegador.** Selección, cursor de texto, barra de scroll,
`::marker`, `accent-color`, el subrayado de los enlaces, el botón del selector
de archivo y el icono del calendario están todos vestidos. Es lo más barato que
separa una página construida de una página ensamblada, y lo que más se olvida.

**Motion.** Curvas fuertes, elegidas una a una:

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

Pulsar 120 ms · hover 160 ms · desplegables 200 ms · paneles 280 ms · revelado
de imagen 520 ms. Nada de interfaz pasa de 300 ms; el revelado de plancha es
material, no interfaz, y por eso puede durar más.

**El único momento de movimiento con autor** es ese revelado: una plancha se
descubre de arriba abajo con `clip-path`, como una lámina que se posa. El
contenido es visible por defecto: si el JavaScript falla, todo se ve igual.

**Acordeón de preguntas** (`.faq`). `<details>`/`<summary>` nativo, no un
widget de JavaScript: funciona sin script, el teclado y el lector de pantalla
lo entienden solo, y `name="faq"` deja una sola pregunta abierta sin una
línea de lógica propia. La animación es un `grid-template-rows` de 0fr a
1fr — los navegadores actuales tratan el contenido cerrado de `<details>`
con `content-visibility`, no con `display:none`, así que la transición corre
en los dos sentidos sin trucos de JavaScript para medir altura.

**Rejilla de redes** (`.ig__grid`). Contact sheet con filete recto entre
celdas, no un embed de Instagram. Un widget de verdad es script de terceros
con su propio permiso y su propio coste de CLS; esto es seis fotos reales
del registro que enlazan al perfil. TikTok no lleva fotos: es vídeo, y una
miniatura fingida habría sido mentir, así que es una nota franca en su
propia caja.

## Do's and Don'ts

**Hazlo así**

- Mide el contraste antes de fijar un color, no después.
- Si el lacre tiene que llevar texto, conviértelo en bloque sólido con el texto
  calado en papel.
- Cifras tabulares en todo lo medible.
- Tracking distinto en cada escalón de la escala.
- El estado, con una marca física además del color.
- Reserva la altura de lo que rellena el script, derivándola de los tokens.
- Viste las superficies que dibuja el navegador.
- Respuesta al pulsar, no al soltar. Hover detrás de `(hover: hover)`.
- Cuando dudes entre refinado y comprometido, comprométete.

**No lo hagas así**

- **Nada de radio.** Ni 2 px «para suavizar».
- **Ni una sombra fuera de la plancha.** Nada de halos sin desplazamiento.
- **El lacre no decora.** Si no responde al usuario y no mide nada, no lleva rojo.
- **Ni un solo icono de librería.** Las puntas, las flechas y las marcas están
  dibujadas con filetes y `clip-path`, en el mismo grosor que el resto.
- **Ni un glifo unicode haciendo de icono.**
- **Nada de mono como disfraz técnico.** Las cifras se alinean con `tnum`.
- **Ni antetítulos.** El titular se sostiene solo; las versalitas viven en el
  margen o en una cabecera de columna, no encima de un `h2`.
- **Ni tres tarjetas iguales con icono arriba.** Lo que parece una rejilla de
  tarjetas se resuelve como filas de un índice impreso.
- **Ni `transition: all`.** Propiedades nombradas una a una.
- **Ni `ease-in` en nada que entre.** Empieza lento justo cuando el usuario mira.
- **Nada de `columns` de CSS para mampostería.** Reordena visualmente sin
  reordenar el DOM: el tabulador salta en zigzag y el FLIP se vuelve imposible.
- **Ni un embed de red social de verdad.** Es script de un tercero, con su
  propio permiso y su propio coste de CLS. Si hay que enseñar redes, con
  fotos propias y un enlace de salida basta.
