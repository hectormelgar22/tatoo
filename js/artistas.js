/* =============================================================================
   NIGREDO · ARTISTAS
   Una ficha por artista, con lo que acepta y lo que no. Decir que no por
   escrito ahorra mas tiempo que cualquier otra cosa de esta web.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, esc = N.esc;

  var host = $("[data-artistas]");
  if (!host) return;

  host.innerHTML = S.artistas.map(function (a, i) {
    var suyas = S.planchas.filter(function (p) { return p.artista === a.slug; });

    var tira = suyas.length
      ? '<ul class="tira" role="list">' + suyas.slice(0, 4).map(function (p, i) {
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
              "</span>" +
            "</a></li>";
        }).join("") + "</ul>" +
        '<p style="margin-top:var(--s5)"><a class="btn btn--quiet" href="galeria.html?artista=' +
          esc(a.slug) + '">Todo lo suyo en el registro</a></p>'
      : '<div class="state">' +
          '<p class="state__title">Todavía sin planchas</p>' +
          '<p class="state__text">Acaba de entrar en el estudio y no tiene obra fichada ' +
            'aquí. Escríbenos y te enseñamos su carpeta.</p>' +
        "</div>";

    return '<article class="ficha" id="' + esc(a.slug) + '">' +
      '<div class="reg">' +
        '<div class="reg__margin"><p class="plate-no">' + esc(a.alias) + "</p></div>" +
        '<div class="reg__body">' +
          '<div class="ficha__cab">' +
            '<figure class="ficha__retrato" data-revelar>' +
              N.imgHTML({
                base: a.retrato, tipo: "artista", alt: a.retratoAlt, ratio: a.retratoRatio,
                /* El primer retrato esta a la vista nada mas cargar. */
                eager: i === 0,
                sizes: "(min-width: 48rem) 17rem, 100vw"
              }) +
            "</figure>" +
            "<div>" +
              '<h2 class="d2 ficha__nombre">' + esc(a.nombre) + "</h2>" +
              '<div class="ficha__meta">' +
                '<span class="label">' + esc(a.estilo) + "</span>" +
                '<span class="label num">Desde ' + esc(a.desde) + "</span>" +
                '<span class="label num">' + esc(N.euros(a.tarifa)) + " / hora</span>" +
              "</div>" +
              '<p class="statement" style="margin-top:var(--s5);max-width:20ch">' +
                esc(a.titular) + "</p>" +
              '<p class="body fg-2" style="margin-top:var(--s5)">' + esc(a.bio) + "</p>" +
              '<p style="margin-top:var(--s5)">' +
                '<a class="btn btn--stamp" href="reservar.html?artista=' + esc(a.slug) + '">' +
                  "Pedir cita con " + esc(a.nombre.split(" ")[0]) + "</a></p>" +
            "</div>" +
          "</div>" +

          '<dl class="ficha__datos">' +
            '<div class="ficha__dato"><dt>Hace</dt><dd>' + esc(a.acepta) + "</dd></div>" +
            '<div class="ficha__dato"><dt>No hace</dt><dd>' + esc(a.noAcepta) + "</dd></div>" +
            '<div class="ficha__dato"><dt>Agenda</dt><dd>' + esc(a.agenda) +
              '<br><span class="num">Mínimo ' + esc(N.euros(a.minimo)) + "</span></dd></div>" +
          "</dl>" +

          '<div class="ficha__obra">' +
            '<p class="label" style="margin-bottom:var(--s4)">En el registro</p>' +
            tira +
          "</div>" +
        "</div>" +
      "</div></article>";
  }).join("");

  N.revelar();

  /* Si se llega con un artista en el ancla, se lleva el foco a su ficha: el
     lector de pantalla tiene que enterarse de que la pagina ya salto.        */
  if (location.hash) {
    var destino = document.getElementById(location.hash.slice(1));
    if (destino) {
      destino.setAttribute("tabindex", "-1");
      destino.scrollIntoView();
      destino.focus({ preventScroll: true });
    }
  }
})();
