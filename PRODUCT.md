# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vanilla HTML + CSS + JavaScript. No framework, no CSS framework, no jQuery. CSS custom properties for the token layer. Multi-file structure (`index.html`, `artistas.html`, `galeria.html`, `reservar.html`, `cuidados.html`, plus `/css`, `/js`, `/assets`). Must deploy to Vercel with **no build step**. Decided by the user in the brief.

## Users

Dos audiencias, y la segunda es la que paga:

1. **Cliente final del estudio** — 22-40 años, urbano, Madrid centro. Llega desde Instagram, casi siempre desde el móvil. Valora el criterio artístico por encima del precio. Antes de escribir quiere saber tres cosas: quién le va a tatuar, cuánto le va a costar más o menos, y cómo le va a quedar. Hoy resuelve todo eso por DM, mal.
2. **Dueño de un estudio de tatuajes real** — es a quien se le enseña esta demo para venderle una web. Juzga la pieza con ojo de artista: si el diseño está por debajo de su propio trabajo, no compra. *(Inferido del brief: el usuario declara que la web es una pieza comercial.)*

## Product Purpose

Web demo de un estudio ficticio (NIGREDO Tattoo Studio, calle Espíritu Santo 14, Malasaña, Madrid) que funciona a la vez como pieza de venta. Éxito = un tatuador la ve y piensa que está a la altura de lo que él hace, y entiende de inmediato que le quita trabajo de encima.

## Positioning

No es una web de negocio local con horarios y un formulario de contacto. Es una **herramienta de filtrado y cualificación**: convierte los mensajes basura de Instagram ("hola info", "cuánto me costaría") en solicitudes estructuradas con idea, zona, tamaño, referencias, disponibilidad y presupuesto. Cada función existe porque resuelve una pérdida concreta de tiempo o dinero del estudio.

## Operating Context

- 4 tatuadores con estilos diferenciados: blackwork/ornamental, realismo en negro y grises, fineline/microrrealismo, neotradicional a color.
- El tráfico entra por Instagram → móvil primero, siempre.
- Sin backend. Las solicitudes salen por WhatsApp prellenado. Todo el estado vive en cliente.
- Contenido editable por el cliente desde un único objeto `STUDIO` en `js/content.js`: nombre, artistas, precios, horarios, textos, tarifas del estimador. Nadie debe tocar HTML para cambiar un precio.

## Capabilities and Constraints

Ocho funciones, todas obligatorias:

1. **Estimador de presupuesto** — pasos: tamaño (con referencia visual comparativa), zona sobre silueta corporal interactiva, estilo, color/negro, detalle, cobertura. Salida: horquilla + nº de sesiones + duración. Marcado como orientativo. Tarifas en `content.js`.
2. **Simulador de colocación** — el usuario sube foto de su cuerpo, elige un flash del estudio o sube su diseño, y escala / rota / mueve / ajusta opacidad. Canvas o CSS transforms, todo en cliente, con descarga del resultado.
3. **Guía de cuidados interactiva** — timeline día 0 / 1-3 / 4-7 / 8-14 / 15-30 / mes 2+. Qué hacer, qué evitar, señales de alarma. Genera un `.ics` descargable con los hitos.
4. **Galería filtrable** — filtros combinables (artista × estilo × zona), masonry, lightbox con teclado y swipe, transiciones FLIP.
5. **Flash disponibles** — estado disponible / reservado / tatuado, precio cerrado visible, reserva que precarga el diseño en el formulario.
6. **Solicitud de cita** — por pasos, obliga a dar lo necesario, subida de referencias con previsualización y reordenación por drag. Genera mensaje de WhatsApp estructurado.
7. **Verificación de edad y consentimiento** — en España no se tatúa a menores de 18 sin autorización. Gate discreto en primera visita + checkbox de consentimiento informado en reserva.
8. **Aviso de hueco por cancelación** — huecos libres próximos + lista de espera.

Restricciones duras:
- Lighthouse 95+ en rendimiento y accesibilidad. Sin eso, no está terminado.
- Peso bajo: WebP, lazy loading, `font-display: swap`, subsetting de fuentes.
- Responsive real de 320px a 2560px, móvil primero.
- Áreas táctiles ≥ 44px.
- Contraste WCAG AA mínimo sobre fondo oscuro.
- SEO local: meta tags, Open Graph con imagen propia, JSON-LD `TattooParlor` con dirección, horarios y teléfono.
- `prefers-reduced-motion: reduce` respetado en serio.

## Brand Commitments

- Nombre: **NIGREDO Tattoo Studio**. (Nigredo = la fase negra, la putrefacción, el primer estadio de la Gran Obra alquímica. El nombre ya trae una carga simbólica que el diseño puede explotar.)
- Todo el contenido en **español de España**. Cero lorem ipsum. Voz directa, seca, sin cursilería. Nada de "Bienvenidos a nuestra web".
- Prohibiciones visuales explícitas del usuario: tarjetas con radio grande y sombra suave, iconos genéricos de librería, secciones de "nuestros valores" en tres columnas, carruseles de testimonios con estrellas, CTA morado, hero con foto de stock de gente sonriendo, `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`.
- Referencias mentales pinchadas por el usuario: catálogo de galería de arte, fanzine, editorial de moda en blanco y negro.

## Evidence on Hand

Ninguna. El estudio es **ficticio**: no hay fotos propias, ni testimonios reales, ni métricas. Las imágenes saldrán de Unsplash/Pexels (tatuajes blackwork, estudio, material, retratos) o de placeholders SVG diseñados a propósito. El README debe documentar el origen de cada imagen para poder sustituirla. **No inventar reseñas, premios, cifras de clientes ni prensa.**

## Product Principles

1. **Cada función responde a una pérdida real del estudio.** Si no quita trabajo o no gana dinero, no entra.
2. **La obra manda.** El diseño enmarca las fotos de los tatuajes; nunca compite con ellas.
3. **El móvil es el sitio principal, no la versión reducida.** El tráfico viene de Instagram.
4. **Filtrar antes que convertir.** Es mejor una solicitud completa que diez mensajes vacíos.
5. **El cliente edita contenido, no código.** Un precio se cambia en `content.js` o el proyecto ha fallado.

## Accessibility & Inclusion

WCAG AA sobre fondo oscuro, navegación completa por teclado con foco visible y diseñado, alt text real y descriptivo, `prefers-reduced-motion` respetado de verdad, áreas táctiles ≥44px, estados vacíos/error/carga diseñados. Lighthouse de accesibilidad 95+ es condición de entrega.
