/* =============================================================================
   NIGREDO · ESTIMADOR
   Seis preguntas y una horquilla. Todas las tarifas salen de
   STUDIO.estimador: aqui no hay ni un numero escrito a mano.

   La cifra se recalcula en cada cambio y se ve entera desde el primer paso,
   aunque todavia le falten datos. Esconder el resultado hasta el final
   convierte un calculo en una encuesta.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, $$ = N.$$, esc = N.esc;

  var raiz = $("[data-estimador]");
  if (!raiz) return;
  var E = S.estimador;

  /* --- estado --------------------------------------------------------------- */

  var est = {
    tamano: null, zona: null, estilo: null,
    color: "negro", detalle: "medio", cobertura: false, artista: ""
  };

  var PASOS = [
    { id: "tamano",  pregunta: "¿De qué tamaño?",
      ayuda: "La medida más larga de la pieza. Si dudas, tira por lo alto: " +
             "casi todo el mundo se queda corto al calcularlo." },
    { id: "zona",    pregunta: "¿Dónde va?",
      ayuda: "Toca la zona en el mapa. Hay sitios que cuestan más porque se " +
             "tatuan peor: hueso cerca, piel fina, más tiempo por sesión." },
    { id: "estilo",  pregunta: "¿En qué estilo?",
      ayuda: "Si no lo tienes claro, mira el registro y dinos qué plancha te gusta." },
    { id: "detalle", pregunta: "¿Cuánto detalle?",
      ayuda: "No es lo mismo una línea limpia que una pieza cargada de textura, " +
             "aunque midan lo mismo." },
    { id: "color",   pregunta: "¿Negro o color?",
      ayuda: "El color pide más pasadas y más tiempo de curado entre capas." },
    { id: "extra",   pregunta: "¿Tapa algo que ya tienes?",
      ayuda: "Y si tienes artista en mente, dilo: cada uno tiene su tarifa." }
  ];

  var paso = 0;

  /* --- calculo -------------------------------------------------------------- */

  function porId(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }

  function calcular() {
    var t = porId(E.tamanos, est.tamano);
    if (!t) return null;

    var z = porId(S.zonas, est.zona);
    var e = porId(S.estilos, est.estilo);
    var d = porId(E.detalle, est.detalle);
    var c = porId(E.color, est.color);
    var a = est.artista ? N.artistaPor(est.artista) : null;

    var horas = t.horas
      * (e ? e.factor : 1)
      * (d ? d.factor : 1)
      * (z ? z.factor : 1)
      * (c ? c.factor : 1)
      * (est.cobertura ? E.cobertura.factor : 1);

    var tarifa = a ? a.tarifa : E.tarifaHora;
    var minimo = a ? a.minimo : E.minimoEstudio;
    var central = horas * tarifa;

    var r = function (v) { return Math.round(v / E.redondeo) * E.redondeo; };
    var bajo = Math.max(minimo, r(central * (1 - E.horquilla)));
    var alto = Math.max(bajo + E.redondeo, r(central * (1 + E.horquilla)));

    var sesiones = Math.max(1, Math.ceil(horas / E.horasPorSesion))
      + (est.cobertura ? E.cobertura.sesionesExtra : 0);

    return {
      bajo: bajo, alto: alto, horas: horas, sesiones: sesiones,
      tarifa: tarifa, artista: a,
      completo: !!(est.tamano && est.zona && est.estilo)
    };
  }

  /* --- pintado de cada paso --------------------------------------------------- */

  function opcion(nombre, valor, titulo, detalle, puesto, extra) {
    return '<label class="op">' +
      '<input type="radio" name="' + nombre + '" value="' + esc(valor) + '"' +
        (puesto ? " checked" : "") + ">" +
      '<span class="op__caja">' +
        '<span class="op__t">' + esc(titulo) + "</span>" +
        (detalle ? '<span class="op__d">' + esc(detalle) + "</span>" : "") +
        (extra || "") +
      "</span></label>";
  }

  function pintarTamano() {
    var maxCm = E.tamanos[E.tamanos.length - 1].cm;
    return '<div class="ops ops--2">' + E.tamanos.map(function (t) {
      /* Barra proporcional: no es escala real (imposible en pantalla) pero si
         comparativa, que es lo que ayuda a decidir.                          */
      var ancho = Math.round(t.cm / maxCm * 100);
      var barra = '<span class="op__escala" style="width:' + ancho + '%"></span>';
      return opcion("tamano", t.id, t.nombre, t.detalle, est.tamano === t.id, barra);
    }).join("") + "</div>";
  }

  function pintarZona() {
    var z = porId(S.zonas, est.zona);
    return '<div class="silueta-caja">' +
      '<div data-silueta><div class="skeleton" style="aspect-ratio:420/560"></div></div>' +
      '<div class="silueta__leyenda">' +
        '<p class="silueta__elegida" data-zona-elegida>' +
          (z ? "Zona: <b>" + esc(z.nombre) + "</b>" : "Todavía no has elegido zona.") +
        "</p>" +
        '<div class="dolor" data-dolor></div>' +
        '<p class="xs fg-3">La escala de dolor es orientativa y muy personal. ' +
          'Sirve para saber a qué atenerte, no para echarte atrás.</p>' +
        '<div class="field"><label class="field__label" for="zona-lista">O elígela de la lista</label>' +
          '<select class="select" id="zona-lista" data-zona-lista>' +
            '<option value="">—</option>' +
            S.zonas.map(function (o) {
              return '<option value="' + esc(o.id) + '"' +
                (est.zona === o.id ? " selected" : "") + ">" + esc(o.nombre) + "</option>";
            }).join("") +
          "</select></div>" +
      "</div></div>";
  }

  function pintarPaso() {
    var p = PASOS[paso];
    var cuerpo = "";

    if (p.id === "tamano") cuerpo = pintarTamano();

    if (p.id === "zona") cuerpo = pintarZona();

    if (p.id === "estilo") {
      /* Un nombre de estilo no dice nada a quien no esta metido en esto.
         Cada opcion ensena una plancha de verdad de ese estilo y lleva al
         registro ya filtrado, que es donde estan todas.                     */
      cuerpo = '<div class="ops ops--2 ops--muestras">' + S.estilos.map(function (o) {
        var quien = S.artistas.filter(function (a) { return a.estiloId === o.id; });
        var suyas = S.planchas.filter(function (pl) { return pl.estilo === o.id; });
        var ej = suyas[0];

        var lamina = ej
          ? N.imgHTML({
              base: ej.img, tipo: "plancha", ratio: ej.ratio,
              alt: "Ejemplo de " + o.nombre.toLowerCase() + ": " + ej.titulo.toLowerCase() + ".",
              sizes: "(min-width: 34rem) 7rem, 26vw"
            })
          : '<span class="muestra__sin" aria-hidden="true"></span>';

        var caja =
          '<span class="op__caja op__caja--muestra">' +
            '<span class="muestra__lamina">' + lamina + "</span>" +
            '<span class="muestra__texto">' +
              '<span class="op__t">' + esc(o.nombre) + "</span>" +
              '<span class="op__d">' +
                esc(quien.length ? quien.map(function (a) { return a.nombre; }).join(", ") : "Varios") +
              "</span>" +
            "</span>" +
          "</span>";

        var pie = suyas.length
          ? '<a class="muestra__ver" href="galeria.html?estilo=' + esc(o.id) + '">' +
              "Ver " + suyas.length + (suyas.length === 1 ? " plancha" : " planchas") +
              " en el registro</a>"
          : '<span class="muestra__ver muestra__ver--vacio">Todavía sin obra en el registro</span>';

        return '<div class="muestra">' +
          '<label class="op">' +
            '<input type="radio" name="estilo" value="' + esc(o.id) + '"' +
              (est.estilo === o.id ? " checked" : "") + ">" +
            caja +
          "</label>" + pie +
        "</div>";
      }).join("") + "</div>";
    }

    if (p.id === "detalle") {
      cuerpo = '<div class="ops ops--3">' + E.detalle.map(function (o) {
        return opcion("detalle", o.id, o.nombre, o.descripcion, est.detalle === o.id);
      }).join("") + "</div>";
    }

    if (p.id === "color") {
      cuerpo = '<div class="ops ops--2">' + E.color.map(function (o) {
        return opcion("color", o.id, o.nombre,
          o.id === "color" ? "Más pasadas, más tiempo" : "Lo que más hacemos",
          est.color === o.id);
      }).join("") + "</div>";
    }

    if (p.id === "extra") {
      cuerpo =
        '<label class="consiente" style="max-width:34rem">' +
          '<input type="checkbox" data-cobertura' + (est.cobertura ? " checked" : "") + ">" +
          "<span>" + esc(E.cobertura.aviso) + "</span>" +
        "</label>" +
        '<div class="field" style="margin-top:var(--s5);max-width:22rem">' +
          '<label class="field__label" for="est-artista">Artista, si ya lo sabes</label>' +
          '<select class="select" id="est-artista" data-artista>' +
            '<option value="">Cualquiera del estudio</option>' +
            S.artistas.map(function (a) {
              return '<option value="' + esc(a.slug) + '"' +
                (est.artista === a.slug ? " selected" : "") + ">" +
                esc(a.nombre) + " · " + esc(N.euros(a.tarifa)) + "/h</option>";
            }).join("") +
          "</select>" +
          '<p class="field__hint">Cambia la tarifa por hora del cálculo.</p>' +
        "</div>";
    }

    $("[data-paso]").innerHTML =
      '<h3 class="paso__pregunta">' + esc(p.pregunta) + "</h3>" +
      '<p class="paso__ayuda">' + esc(p.ayuda) + "</p>" +
      cuerpo;

    $$("[data-marca]").forEach(function (m, i) {
      m.toggleAttribute("data-hecho", i < paso);
      m.toggleAttribute("data-actual", i === paso);
    });
    $("[data-cuenta-paso]").textContent = "Paso " + (paso + 1) + " de " + PASOS.length;
    $("[data-atras]").disabled = paso === 0;
    $("[data-siguiente]").hidden = paso === PASOS.length - 1;
    $("[data-a-solicitud]").hidden = paso !== PASOS.length - 1;

    if (p.id === "zona") montarSilueta();
    pintarDolor();
  }

  /* --- mapa corporal ---------------------------------------------------------- */

  var svgCache = null;

  function montarSilueta() {
    var hueco = $("[data-silueta]");
    if (!hueco) return;

    var poner = function (texto) {
      hueco.innerHTML = texto;
      var svg = hueco.querySelector("svg");
      if (!svg) return;
      var zonas = Array.prototype.slice.call(svg.querySelectorAll("[data-zona]"));

      /* Etiqueta legible: el SVG trae el id, no el nombre en castellano. */
      zonas.forEach(function (g) {
        g.setAttribute("aria-label", N.nombreDe(S.zonas, g.dataset.zona));
      });

      function marcar(id) {
        est.zona = id;
        zonas.forEach(function (g) {
          var on = g.dataset.zona === id;
          g.setAttribute("aria-checked", String(on));
          g.tabIndex = on ? 0 : -1;
        });
        /* Si no hay ninguna puesta, la primera tiene que ser alcanzable. */
        if (!id && zonas.length) zonas[0].tabIndex = 0;
        var sel = $("[data-zona-lista]");
        if (sel) sel.value = id || "";
        var z = porId(S.zonas, id);
        var et = $("[data-zona-elegida]");
        if (et) et.innerHTML = z ? "Zona: <b>" + esc(z.nombre) + "</b>"
                                 : "Todavía no has elegido zona.";
        pintarDolor();
        pintarSalida();
      }

      svg.addEventListener("click", function (ev) {
        var g = ev.target.closest("[data-zona]");
        if (g) marcar(g.dataset.zona);
      });
      svg.addEventListener("keydown", function (ev) {
        var g = ev.target.closest("[data-zona]");
        if (!g) return;
        if (ev.key === " " || ev.key === "Enter") { ev.preventDefault(); marcar(g.dataset.zona); return; }
        var orden = zonas.filter(function (x, i, arr) {
          return arr.findIndex(function (y) { return y.dataset.zona === x.dataset.zona; }) === i;
        });
        var i = orden.findIndex(function (x) { return x.dataset.zona === g.dataset.zona; });
        var d = null;
        if (ev.key === "ArrowRight" || ev.key === "ArrowDown") d = (i + 1) % orden.length;
        if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") d = (i - 1 + orden.length) % orden.length;
        if (d === null) return;
        ev.preventDefault();
        marcar(orden[d].dataset.zona);
        orden[d].focus();
      });

      var lista = $("[data-zona-lista]");
      if (lista) lista.addEventListener("change", function () { marcar(this.value); });

      marcar(est.zona);
    };

    if (svgCache) { poner(svgCache); return; }
    fetch("assets/img/silueta.svg")
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (t) { svgCache = t; poner(t); })
      .catch(function () {
        /* Sin el mapa el paso sigue siendo utilizable: queda la lista. */
        hueco.innerHTML = '<p class="xs fg-3">No se ha podido cargar el mapa ' +
          'corporal. Usa la lista de la derecha.</p>';
      });
  }

  function pintarDolor() {
    var caja = $("[data-dolor]");
    if (!caja) return;
    var z = porId(S.zonas, est.zona);
    if (!z) { caja.innerHTML = ""; return; }
    var marcas = "";
    for (var i = 1; i <= 5; i++) marcas += "<i" + (i <= z.dolor ? " data-on" : "") + "></i>";
    caja.innerHTML = '<span class="label">Dolor</span>' +
      '<span class="dolor__marcas" role="img" aria-label="' + z.dolor + ' de 5">' +
      marcas + "</span>";
  }

  /* --- salida ----------------------------------------------------------------- */

  function pintarSalida() {
    var caja = $("[data-salida]");
    var r = calcular();

    if (!r || !r.completo) {
      caja.innerHTML =
        '<p class="label" style="color:var(--plate-fg-3)">Horquilla estimada</p>' +
        '<p class="salida__cifra" style="color:var(--plate-fg-3)">—</p>' +
        '<p class="salida__aviso">Elige al menos tamaño, zona y estilo y aquí ' +
          'aparece la cifra. Se actualiza sola con cada cambio.</p>';
      return;
    }

    var tiempo = r.horas < 1
      ? "menos de 1 h"
      : (Math.round(r.horas * 10) / 10).toString().replace(".", ",") + " h";

    caja.innerHTML =
      '<p class="label" style="color:var(--plate-fg-3)">Horquilla estimada</p>' +
      '<p class="salida__cifra">' + esc(N.euros(r.bajo)) + " – " + esc(N.euros(r.alto)) + "</p>" +
      '<dl class="salida__reparto">' +
        '<div class="salida__fila"><dt>Sesiones</dt><dd>' + r.sesiones +
          (r.sesiones === 1 ? " sesión" : " sesiones") + "</dd></div>" +
        '<div class="salida__fila"><dt>Tiempo de aguja</dt><dd>' + esc(tiempo) + "</dd></div>" +
        '<div class="salida__fila"><dt>Tarifa aplicada</dt><dd>' + esc(N.euros(r.tarifa)) + " / hora</dd></div>" +
        (r.artista ? '<div class="salida__fila"><dt>Artista</dt><dd>' + esc(r.artista.nombre) + "</dd></div>" : "") +
      "</dl>" +
      '<p class="salida__aviso">' + esc(E.nota) + " " + esc(S.studio.avisoPresupuesto) + "</p>";
  }

  /* --- montaje ----------------------------------------------------------------- */

  raiz.innerHTML =
    '<div class="pasos">' +
      '<div class="pasos__barra" aria-hidden="true">' +
        PASOS.map(function () { return '<span class="pasos__marca" data-marca></span>'; }).join("") +
      "</div>" +
      '<div class="paso" data-paso></div>' +
      '<div class="pasos__pie">' +
        '<p class="pasos__cuenta" data-cuenta-paso role="status"></p>' +
        '<div class="pasos__nav">' +
          '<button class="btn" type="button" data-atras>Atrás</button>' +
          '<button class="btn btn--stamp" type="button" data-siguiente>Siguiente</button>' +
          '<a class="btn btn--stamp" href="#solicitud" data-a-solicitud hidden>Pedir cita con estos datos</a>' +
        "</div>" +
      "</div>" +
    "</div>";

  $("[data-atras]").addEventListener("click", function () {
    if (paso > 0) { paso--; pintarPaso(); }
  });
  $("[data-siguiente]").addEventListener("click", function () {
    if (paso < PASOS.length - 1) { paso++; pintarPaso(); }
  });

  /* Un solo escuchador en la raiz: los controles se repintan en cada paso y
     colgarles escuchadores uno a uno los perderia.                          */
  raiz.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.name === "tamano") est.tamano = t.value;
    if (t.name === "estilo") est.estilo = t.value;
    if (t.name === "detalle") est.detalle = t.value;
    if (t.name === "color") est.color = t.value;
    if (t.hasAttribute("data-cobertura")) est.cobertura = t.checked;
    if (t.hasAttribute("data-artista")) est.artista = t.value;
    pintarSalida();
  });

  /* El estimador y la solicitud comparten datos: lo que elijas aqui entra
     prellenado alli, que es justo lo que evita repetirse.                   */
  $("[data-a-solicitud]").addEventListener("click", function () {
    window.dispatchEvent(new CustomEvent("nigredo:estimacion", {
      detail: { est: est, calculo: calcular() }
    }));
  });

  pintarPaso();
  pintarSalida();

  /* Si se llega desde una ficha de artista, ya viene elegido. */
  var q = new URLSearchParams(location.search);
  if (q.get("artista") && N.artistaPor(q.get("artista"))) {
    est.artista = q.get("artista");
    pintarSalida();
  }
})();
