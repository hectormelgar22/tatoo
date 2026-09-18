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

  var HERRAMIENTAS = [
    { n: "I",   titulo: S.textos.estimador.titular,  href: "reservar.html#estimador",
      texto: S.textos.estimador.entradilla, ir: "Calcular" },
    { n: "II",  titulo: S.textos.simulador.titular,  href: "reservar.html#simulador",
      texto: S.textos.simulador.entradilla, ir: "Probar" },
    { n: "III", titulo: S.textos.flash.titular,      href: "galeria.html#flash",
      texto: S.textos.flash.entradilla, ir: "Ver flash" },
    { n: "IV",  titulo: S.textos.cuidados.titular,   href: "cuidados.html",
      texto: S.textos.cuidados.entradilla, ir: "Leer" }
  ];

  set("[data-indice]",
    '<div class="indice">' +
    HERRAMIENTAS.map(function (h) {
      return '<a class="indice__fila" href="' + esc(h.href) + '">' +
        '<span class="plate-no indice__num">' + esc(h.n) + "</span>" +
        '<span class="indice__titulo">' + esc(h.titulo) + "</span>" +
        '<span class="indice__texto">' + esc(h.texto) + "</span>" +
        '<span class="indice__ir">' + esc(h.ir) + "</span>" +
      "</a>";
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
          '<a class="btn" href="reservar.html?hueco=' + esc(h.fecha) + "_" + esc(h.hora) +
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
