/* =============================================================================
   NIGREDO · PORTADA
   Rellena la portada desde el objeto STUDIO. Todo el texto visible sale de
   js/content.js; aqui no hay copy escrito a mano.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, esc = N.esc;

  function set(sel, html) { var n = $(sel); if (n) n.innerHTML = html; }

  /* --- portada -------------------------------------------------------------- */

  set("[data-hero-titular]", esc(S.textos.home.titular));

  set("[data-hero-margen]",
    '<p class="plate-no">Reg. ' + esc(S.artistas.reduce(function (m, a) {
      return Math.min(m, a.desde);
    }, 9999)) + '</p>' +
    '<p class="marginalia only-desk" style="margin-top:var(--s3)">' +
      esc(S.studio.etimologia) + "</p>");

  set("[data-hero-intro]",
    '<p class="lead" style="max-width:34ch">' + esc(S.textos.home.entradilla) + "</p>" +
    '<div class="hero__acciones">' +
      '<a class="btn btn--stamp" href="reservar.html">Pedir cita</a>' +
      '<a class="btn" href="galeria.html">Ver el registro</a>' +
    "</div>" +
    '<p class="xs fg-3" style="margin-top:var(--s5);max-width:38ch">' +
      esc(S.studio.avisoCita) + "</p>");

  set("[data-hero-pie]",
    '<span class="plate-no">' + N.plancha(1) + "</span>" +
    '<span>' + esc(S.planchas[0].titulo) + "</span>" +
    '<span>' + esc(N.artistaPor(S.planchas[0].artista).nombre) + "</span>" +
    '<span class="num">' + esc(S.planchas[0].ano) + "</span>");

  /* --- el registro ---------------------------------------------------------- */

  set("[data-reg-titular]", esc(S.textos.home.declaracion));
  set("[data-reg-texto]", esc(S.textos.home.sobreRegistro));

  /* Tira de cuatro planchas recientes. Proporciones distintas a proposito:
     es una tira de registro, no una rejilla de miniaturas cuadradas.         */
  var recientes = S.planchas.slice().sort(function (a, b) {
    return b.ano - a.ano || b.n - a.n;
  }).slice(0, 4);

  set("[data-reg-tira]",
    '<ul class="tira" role="list">' +
    recientes.map(function (p, i) {
      var a = N.artistaPor(p.artista);
      return '<li class="tira__item">' +
        '<a class="tira__enlace" href="galeria.html#pl-' + String(p.n).padStart(3, "0") + '">' +
          '<span class="tira__lamina" data-revelar data-revelar-orden="' + i + '">' +
            N.imgHTML({
              base: p.img, tipo: "plancha", alt: p.alt, ratio: p.ratio,
              sizes: "(min-width: 60rem) 22vw, (min-width: 40rem) 44vw, 78vw"
            }) +
          "</span>" +
          '<span class="tira__pie">' +
            '<span class="plate-no">' + N.plancha(p.n) + "</span>" +
            '<span class="tira__titulo">' + esc(p.titulo) + "</span>" +
            '<span class="tira__meta">' + esc(a.nombre) + "</span>" +
          "</span>" +
        "</a></li>";
    }).join("") +
    "</ul>" +
    '<p style="margin-top:var(--s5)"><a class="btn" href="galeria.html">' +
      'Las ' + S.planchas.length + ' planchas</a></p>');

  /* --- artistas ------------------------------------------------------------- */

  set("[data-art-titular]", esc(S.textos.artistas.titular));
  set("[data-art-entradilla]", esc(S.textos.artistas.entradilla));

  set("[data-art-lista]",
    S.artistas.map(function (a) {
      var suyas = S.planchas.filter(function (p) { return p.artista === a.slug; }).length;
      return '<article class="firma">' +
        '<a class="firma__retrato" href="artistas.html#' + esc(a.slug) + '" tabindex="-1" aria-hidden="true">' +
          N.imgHTML({
            base: a.retrato, tipo: "artista", alt: "", ratio: a.retratoRatio,
            sizes: "(min-width: 48rem) 11rem, 100vw"
          }) +
        "</a>" +
        '<div class="firma__texto">' +
          '<h3 class="firma__nombre"><a href="artistas.html#' + esc(a.slug) + '">' +
            esc(a.nombre) + "</a></h3>" +
          '<div class="firma__meta">' +
            '<span class="label">' + esc(a.estilo) + "</span>" +
            '<span class="label num">Desde ' + esc(a.desde) + "</span>" +
            '<span class="label num">' + suyas + " en el registro</span>" +
          "</div>" +
          '<p class="firma__bio">' + esc(a.titular) + ". " + esc(a.acepta) + "</p>" +
        "</div>" +
      "</article>";
    }).join(""));

  /* --- indice de herramientas ------------------------------------------------ */

  /* Cada herramienta lleva su propio dibujo, trazado con la misma pluma que el
     resto del sitio: una escala graduada, dos laminas superpuestas, un pliego
     de flash y una linea de tiempo. No son iconos de libreria; son el aparato
     que representa cada herramienta, y la marca de indice en lacre senala el
     punto que importa.                                                       */
  var DIBUJOS = {
    /* Escala graduada: lo que hace el estimador es medir. */
    estimador:
      '<svg viewBox="0 0 120 56" fill="none" aria-hidden="true">' +
        '<path d="M6 40h108" stroke="currentColor" stroke-width="1"/>' +
        '<path d="M6 40V24M28 40v-9M50 40v-9M72 40v-9M94 40v-9M114 40V24" ' +
          'stroke="currentColor" stroke-width="1"/>' +
        '<path class="util__marca" d="M72 46V16" stroke-width="3" stroke-linecap="square"/>' +
      "</svg>",
    /* Dos laminas: la foto debajo, el diseno encima y movible. */
    simulador:
      '<svg viewBox="0 0 120 56" fill="none" aria-hidden="true">' +
        '<rect x="6" y="8" width="72" height="42" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="46" y="20" width="60" height="30" stroke="currentColor" ' +
          'stroke-width="1" stroke-dasharray="4 4"/>' +
        '<path class="util__marca" d="M76 35h18M88 29l6 6-6 6" stroke-width="2" ' +
          'stroke-linecap="square" fill="none"/>' +
      "</svg>",
    /* Pliego de flash: las ocho laminas, una ya fuera del registro. */
    flash:
      '<svg viewBox="0 0 120 56" fill="none" aria-hidden="true">' +
        '<rect x="6" y="8" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="34" y="8" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="62" y="8" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="90" y="8" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="6" y="32" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="34" y="32" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
        '<rect class="util__marca--relleno" x="62" y="32" width="22" height="18" stroke-width="1"/>' +
        '<rect x="90" y="32" width="22" height="18" stroke="currentColor" stroke-width="1"/>' +
      "</svg>",
    /* Linea de tiempo: dia 0 marcado, el resto por venir. */
    cuidados:
      '<svg viewBox="0 0 120 56" fill="none" aria-hidden="true">' +
        '<path d="M6 29h108" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="33" cy="29" r="4" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="60" cy="29" r="4" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="87" cy="29" r="4" stroke="currentColor" stroke-width="1"/>' +
        '<path class="util__marca" d="M6 21v16" stroke-width="3" stroke-linecap="square"/>' +
      "</svg>"
  };

  var HERRAMIENTAS = [
    { n: "I",   dib: "estimador", titulo: S.textos.estimador.titular,  href: "reservar.html#estimador",
      texto: S.textos.estimador.entradilla, ir: "Calcular" },
    { n: "II",  dib: "simulador", titulo: S.textos.simulador.titular,  href: "reservar.html#simulador",
      texto: S.textos.simulador.entradilla, ir: "Probar" },
    { n: "III", dib: "flash",     titulo: S.textos.flash.titular,      href: "galeria.html#flash",
      texto: S.textos.flash.entradilla, ir: "Ver flash" },
    { n: "IV",  dib: "cuidados",  titulo: S.textos.cuidados.titular,   href: "cuidados.html",
      texto: S.textos.cuidados.entradilla, ir: "Leer" }
  ];

  set("[data-indice]",
    '<div class="utiles">' +
    HERRAMIENTAS.map(function (h) {
      return '<a class="util" href="' + esc(h.href) + '">' +
        '<span class="util__cabecera">' +
          '<span class="plate-no util__num">' + esc(h.n) + "</span>" +
          '<span class="util__dibujo">' + (DIBUJOS[h.dib] || "") + "</span>" +
        "</span>" +
        '<span class="util__titulo">' + esc(h.titulo) + "</span>" +
        '<span class="util__texto">' + esc(h.texto) + "</span>" +
        '<span class="util__ir">' + esc(h.ir) + '<i aria-hidden="true"></i></span>' +
      "</a>";
    }).join("") +
    "</div>");

  /* --- redes sociales --------------------------------------------------------- */
  /* No hay embed de verdad: el widget de Instagram y el de TikTok son script
     externo, piden su propio token y su propio permiso, y le clavan CLS y
     peso a una pagina que ha costado sudor dejar en 0. En su lugar, un
     adelanto honesto hecho con las mismas fotos del registro: si alguien
     pincha, va al perfil real, no a una demo que finge estar en directo.     */

  set("[data-redes-titular]", esc(S.textos.redes.titular));
  set("[data-redes-entradilla]", esc(S.textos.redes.entradilla));

  /* Ni la plancha de portada ni las cuatro de la tira: son planchas que no
     se han enseñado todavia en esta pagina.                                  */
  var paraRedes = S.planchas.filter(function (p) {
    return p.n !== S.planchas[0].n && recientes.indexOf(p) === -1;
  }).slice(0, 6);

  var igEnlace = "https://instagram.com/" + S.studio.instagram;
  var ttEnlace = "https://www.tiktok.com/@" + S.studio.tiktok;

  set("[data-redes-cuerpo]",
    '<div class="cols cols--73">' +
      '<div>' +
        '<p class="label">Instagram</p>' +
        (paraRedes.length
          ? '<ul class="ig__grid" role="list" style="margin-top:var(--s3)">' +
            paraRedes.map(function (p) {
              var a = N.artistaPor(p.artista);
              return '<li>' +
                '<a class="ig__foto" href="' + esc(igEnlace) + '" rel="noopener" ' +
                  'aria-label="' + esc(p.titulo) + ", de " + esc(a.nombre) +
                  '. Abre el perfil de Instagram.">' +
                  N.imgHTML({
                    base: p.img, tipo: "plancha", alt: "", ratio: p.ratio,
                    sizes: "(min-width: 60rem) 11vw, 30vw"
                  }) +
                "</a></li>";
            }).join("") +
            "</ul>"
          : "") +
        '<a class="btn btn--stamp" style="margin-top:var(--s5)" href="' + esc(igEnlace) +
          '" rel="noopener">Seguir en Instagram</a>' +
        '<p class="xs fg-3" style="margin-top:var(--s3);max-width:40ch">' +
          esc(S.textos.redes.disclaimer) + "</p>" +
      "</div>" +
      '<div class="tiktok">' +
        '<p class="label">TikTok</p>' +
        '<p class="body fg-2" style="margin-top:var(--s3)">' +
          esc(S.textos.redes.tiktokTexto) + "</p>" +
        '<a class="btn btn--stamp" style="margin-top:var(--s4)" href="' + esc(ttEnlace) +
          '" rel="noopener">Seguir en TikTok</a>' +
      "</div>" +
    "</div>");

  /* --- preguntas frecuentes ---------------------------------------------------- */
  /* <details>/<summary> nativo: teclado, foco y el aria-expanded del boton de
     resumen vienen gratis, y sigue funcionando entero sin JavaScript. El
     desplegado unico (una pregunta abierta a la vez) lo da `name`, tambien
     sin JavaScript.                                                          */

  set("[data-faq-titular]", esc(S.textos.faq.titular));
  set("[data-faq-entradilla]", esc(S.textos.faq.entradilla));

  set("[data-faq-lista]",
    '<div class="faq">' +
    S.preguntas.map(function (q, i) {
      return '<details class="faq__item" name="faq"' + (i === 0 ? " open" : "") + '>' +
        '<summary class="faq__pregunta">' +
          "<span>" + esc(q.pregunta) + "</span>" +
          '<span class="faq__marca" aria-hidden="true"></span>' +
        "</summary>" +
        '<div class="faq__interior"><div class="faq__respuesta">' +
          '<p class="body fg-2">' + esc(q.respuesta) + "</p>" +
          (q.enlace
            ? '<a class="faq__enlace" href="' + esc(q.enlace.href) + '">' + esc(q.enlace.texto) + "</a>"
            : "") +
        "</div></div>" +
      "</details>";
    }).join("") +
    "</div>");

  /* --- huecos por cancelacion ------------------------------------------------ */

  set("[data-huecos-titular]", esc(S.textos.huecos.titular));

  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  var libres = S.huecos.filter(function (h) {
    return new Date(h.fecha + "T00:00:00") >= hoy;
  });

  if (libres.length) {
    set("[data-huecos-entradilla]", esc(S.textos.huecos.entradilla));
    set("[data-huecos-lista]",
      libres.map(function (h) {
        var a = N.artistaPor(h.artista);
        return '<div class="hueco">' +
          '<p class="hueco__cuando num"><b>' + esc(N.fechaLarga(h.fecha)) + "</b><br>" +
            esc(h.hora) + " · " + esc(h.duracion) + "</p>" +
          '<p class="hueco__nota">' + esc(a.nombre) + ". " + esc(h.nota) + "</p>" +
          '<a class="btn btn--stamp" href="reservar.html?hueco=' + esc(h.fecha) + "_" + esc(h.hora) +
            '">Lo quiero</a>' +
        "</div>";
      }).join("") +
      '<p style="margin-top:var(--s5)"><a class="btn btn--quiet" href="reservar.html#espera">' +
        esc(S.listaEspera.titulo) + "</a></p>");
  } else {
    /* Estado vacio con salida, no una seccion que desaparece. */
    set("[data-huecos-entradilla]", "");
    set("[data-huecos-lista]",
      '<div class="state">' +
        '<p class="state__title">' + esc(S.textos.huecos.vacio.titulo) + "</p>" +
        '<p class="state__text">' + esc(S.textos.huecos.vacio.texto) + "</p>" +
        '<a class="btn" href="reservar.html#espera">' + esc(S.listaEspera.titulo) + "</a>" +
      "</div>");
  }

  /* --- el sitio --------------------------------------------------------------- */

  var d = S.studio.direccion;
  var mapa = "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(d.calle + ", " + d.cp + " " + d.ciudad);

  set("[data-lugar]",
    '<figure class="lugar__foto" data-revelar>' +
      N.imgHTML({
        base: "lugar", tipo: "lugar", ratio: 1.5005,
        alt: "Puesto de trabajo en blanco y negro: una mano enguantada y tatuada " +
             "sostiene una cazoleta de tinta sobre la mesa preparada, con la persiana " +
             "filtrando la luz y un retrato enmarcado al fondo.",
        sizes: "(min-width: 48rem) 42vw, 100vw"
      }) +
    "</figure>" +
    '<div class="lugar__texto">' +
      '<h2 class="d3" id="t-sitio">Espiritu Santo 14</h2>' +
      '<p class="body fg-2" style="margin-top:var(--s4)">' + esc(d.indicaciones) + "</p>" +
      '<p class="sm fg-3" style="margin-top:var(--s4)">' + esc(d.metro) + "</p>" +
      '<div class="hero__acciones">' +
        '<a class="btn" href="' + esc(mapa) + '" rel="noopener">Abrir en el mapa</a>' +
        '<a class="btn btn--quiet" href="tel:+' + esc(S.studio.telefonoLimpio) + '">' +
          esc(S.studio.telefono) + "</a>" +
      "</div>" +
    "</div>");

  /* core.js monta el revelado antes de que esto inyecte nada, asi que las
     planchas recien creadas necesitan su propio pase.                        */
  N.revelar();
})();
