/* =============================================================================
   NIGREDO · REGISTRO
   Filtros combinables, mamposteria posicionada con transform, visor con
   teclado y gesto, y hoja de flash.

   Idea de fondo: cada plancha tiene un numero y ese numero es una direccion.
   Abrir PL. 007 cambia la URL a #pl-007, y esa URL abre esa plancha. El
   estudio puede decir "mirate la plancha 7" y funciona.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, $$ = N.$$, esc = N.esc;

  /* Solo se ofrecen las opciones que existen de verdad en el registro. La
     lista completa de zonas la necesita el estimador, que pregunta por todo
     el cuerpo; un filtro con seis casillas muertas es ruido, no informacion. */
  function conObra(lista, campo) {
    var hay = S.planchas.map(function (p) { return p[campo]; });
    return lista.filter(function (o) { return hay.indexOf(o.id) !== -1; });
  }

  var EJES = [
    { id: "artista", etiqueta: "Artista", campo: "artista",
      opciones: conObra(S.artistas.map(function (a) {
        return { id: a.slug, nombre: a.nombre };
      }), "artista") },
    { id: "estilo",  etiqueta: "Estilo",  campo: "estilo",  opciones: conObra(S.estilos, "estilo") },
    { id: "zona",    etiqueta: "Zona",    campo: "zona",    opciones: conObra(S.zonas, "zona") }
  ];

  /* Se selecciona con OR dentro de un eje y AND entre ejes: "Vera o Lu,
     ademas de blackwork" es lo que espera cualquiera que haya usado filtros.  */
  var sel = { artista: [], estilo: [], zona: [] };

  var cajaFiltros = $("[data-filtros]");
  var caja = $("[data-masonry]");
  var cuenta = $("[data-cuenta]");
  var vacio = $("[data-vacio]");
  if (!caja) return;

  /* --- pintado inicial de planchas ------------------------------------------ */

  /* Las primeras planchas entran en pantalla nada mas cargar, asi que no
     pueden ser perezosas: si lo son, el navegador las pide tarde y una de
     ellas acaba siendo el elemento LCP a cuatro segundos.

     Solo la primera lleva prioridad alta: tres compitiendo se retrasan entre
     ellas y ninguna llega antes. Las otras dos salen de la carga perezosa
     pero con prioridad normal.                                            */
  var ANSIOSAS = 3;

  caja.innerHTML = S.planchas.map(function (p, i) {
    var a = N.artistaPor(p.artista);
    return '<article class="plancha" id="pl-' + String(p.n).padStart(3, "0") + '"' +
        ' data-n="' + p.n + '"' +
        ' data-artista="' + esc(p.artista) + '"' +
        ' data-estilo="' + esc(p.estilo) + '"' +
        ' data-zona="' + esc(p.zona) + '">' +
      '<button class="plancha__boton" type="button" data-abrir="' + p.n + '">' +
        '<span class="plancha__lamina">' +
          N.imgHTML({
            base: p.img, tipo: "plancha", alt: p.alt, ratio: p.ratio,
            eager: i < ANSIOSAS, prioridad: i === 0,
            sizes: "(min-width: 56rem) 30vw, (min-width: 34rem) 44vw, 86vw"
          }) +
        "</span>" +
        '<span class="plancha__pie">' +
          '<span class="plate-no">' + N.plancha(p.n) + "</span>" +
          '<span class="plancha__titulo">' + esc(p.titulo) + "</span>" +
          '<span class="plancha__meta">' + esc(a.nombre) + " · " +
            esc(N.nombreDe(S.estilos, p.estilo)) + " · " +
            esc(N.nombreDe(S.zonas, p.zona)) + "</span>" +
        "</span>" +
      "</button></article>";
  }).join("");

  var items = $$(".plancha", caja);

  /* --- filtros --------------------------------------------------------------- */

  function pasa(p, saltarEje) {
    return EJES.every(function (e) {
      if (e.id === saltarEje) return true;
      return !sel[e.id].length || sel[e.id].indexOf(p[e.campo]) !== -1;
    });
  }
  function visibles() { return S.planchas.filter(function (p) { return pasa(p); }); }

  function pintarFiltros() {
    cajaFiltros.innerHTML = EJES.map(function (e) {
      return '<div class="filtros__grupo" role="group" aria-labelledby="f-' + e.id + '">' +
        '<p class="label" id="f-' + e.id + '">' + esc(e.etiqueta) + "</p>" +
        '<div class="filtros__chips">' +
          e.opciones.map(function (o) {
            /* La cuenta ignora su propio eje: al lado de "Vera Mota" interesa
               cuantas habria si la anadieras, no cuantas hay ahora.           */
            var n = S.planchas.filter(function (p) {
              return p[e.campo] === o.id && pasa(p, e.id);
            }).length;
            var puesto = sel[e.id].indexOf(o.id) !== -1;
            return '<button class="chip" type="button" aria-pressed="' + puesto + '"' +
              ' data-eje="' + e.id + '" data-valor="' + esc(o.id) + '"' +
              (n === 0 && !puesto ? ' data-sin-obra disabled' : "") + ">" +
              esc(o.nombre) + ' <span class="chip__count">' + n + "</span></button>";
          }).join("") +
        "</div></div>";
    }).join("");
  }

  function alternarFiltro(eje, valor) {
    var i = sel[eje].indexOf(valor);
    if (i === -1) sel[eje].push(valor); else sel[eje].splice(i, 1);
    aplicar();
  }

  function limpiar() {
    EJES.forEach(function (e) { sel[e.id] = []; });
    aplicar();
  }

  cajaFiltros.addEventListener("click", function (ev) {
    var b = ev.target.closest(".chip");
    if (b && !b.disabled) alternarFiltro(b.dataset.eje, b.dataset.valor);
  });

  $$("[data-limpiar]").forEach(function (b) {
    b.addEventListener("click", limpiar);
  });

  /* --- URL ------------------------------------------------------------------- */
  /* Un registro filtrado tambien es una direccion: se puede mandar por
     WhatsApp y el otro ve exactamente lo mismo.                               */

  function urlADatos() {
    var q = new URLSearchParams(location.search);
    EJES.forEach(function (e) {
      var v = q.get(e.id);
      sel[e.id] = v ? v.split(",").filter(Boolean) : [];
    });
  }
  function datosAUrl() {
    var q = new URLSearchParams();
    EJES.forEach(function (e) { if (sel[e.id].length) q.set(e.id, sel[e.id].join(",")); });
    var s = q.toString();
    history.replaceState(null, "", (s ? "?" + s : location.pathname) + location.hash);
  }

  /* --- mamposteria ------------------------------------------------------------ */

  function numColumnas(ancho) {
    if (ancho < 460) return 1;
    if (ancho < 900) return 2;
    return 3;
  }

  function colocar(animar) {
    var ancho = caja.clientWidth;
    if (!ancho) return;
    /* A partir de aqui la retícula la gobierna este script. Se marca antes de
       medir para que las alturas se lean ya con las planchas absolutas.      */
    caja.setAttribute("data-colocada", "");
    var gap = parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5;
    var cols = numColumnas(ancho);
    var colW = Math.floor((ancho - gap * (cols - 1)) / cols);
    var alturas = new Array(cols).fill(0);

    caja.toggleAttribute("data-animar", !!animar && !N.quieto());

    var pasan = visibles().map(function (p) { return p.n; });

    items.forEach(function (el) {
      var visible = pasan.indexOf(Number(el.dataset.n)) !== -1;
      el.toggleAttribute("data-oculta", !visible);
      /* `inert` saca el nodo del foco y del arbol de accesibilidad de una vez.
         Con solo opacidad seguiria siendo tabulable e invisible: lo peor.     */
      el.toggleAttribute("inert", !visible);
      if (!visible) return;

      el.style.width = colW + "px";
      var alto = el.offsetHeight;
      var c = alturas.indexOf(Math.min.apply(null, alturas));
      var x = Math.round(c * (colW + gap));
      var y = Math.round(alturas[c]);
      el.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      alturas[c] = y + alto + gap;
    });

    caja.style.height = (Math.max.apply(null, alturas) - gap) + "px";
  }

  function aplicar() {
    pintarFiltros();
    datosAUrl();
    var v = visibles();
    if (cuenta) {
      cuenta.innerHTML = "<b>" + v.length + "</b> de " + S.planchas.length +
        (S.planchas.length === 1 ? " plancha" : " planchas");
    }
    var hayFiltro = EJES.some(function (e) { return sel[e.id].length; });
    if (vacio) vacio.hidden = v.length !== 0;
    caja.hidden = v.length === 0;
    $$("[data-limpiar]").forEach(function (b) { b.hidden = !hayFiltro; });
    if (v.length) colocar(true);
  }

  /* Recolocar al cambiar de ancho, pero solo cuando el cambio importa: las
     barras del navegador movil disparan resize constantemente.               */
  var t = null, anchoPrevio = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === anchoPrevio) return;
    anchoPrevio = window.innerWidth;
    clearTimeout(t);
    t = setTimeout(function () { colocar(false); }, 120);
  });

  /* Las imagenes cargan perezosas y cambian la altura al llegar: hay que
     recolocar cuando lo hacen, o las columnas quedan solapadas.              */
  $$("img", caja).forEach(function (im) {
    if (im.complete) return;
    im.addEventListener("load", function () { colocar(false); }, { once: true });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { colocar(false); });
  }

  /* --- visor ------------------------------------------------------------------ */

  var dlg = $("[data-visor]");
  var lamina = $("[data-visor-lamina]");
  var fichaT = $("[data-visor-titulo]");
  var fichaD = $("[data-visor-datos]");
  var pos = $("[data-visor-pos]");
  var btnPrev = $("[data-prev]");
  var btnNext = $("[data-next]");
  var orden = [];
  var idx = -1;

  function pintarVisor() {
    var p = orden[idx];
    if (!p) return;
    var a = N.artistaPor(p.artista);
    lamina.innerHTML = N.imgHTML({
      base: p.img, tipo: "plancha", alt: p.alt, ratio: p.ratio,
      sizes: "92vw", eager: true
    });
    fichaT.innerHTML = '<span class="plate-no">' + N.plancha(p.n) + "</span> " + esc(p.titulo);
    fichaD.innerHTML =
      '<span class="label">' + esc(a.nombre) + "</span>" +
      '<span class="label">' + esc(N.nombreDe(S.estilos, p.estilo)) + "</span>" +
      '<span class="label">' + esc(N.nombreDe(S.zonas, p.zona)) + "</span>" +
      '<span class="label num">' + esc(p.ano) + "</span>" +
      '<span class="label num">' + p.sesiones + (p.sesiones === 1 ? " sesion" : " sesiones") + "</span>";
    pos.textContent = (idx + 1) + " / " + orden.length;
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === orden.length - 1;
    history.replaceState(null, "", location.pathname + location.search +
      "#pl-" + String(p.n).padStart(3, "0"));
  }

  function abrir(n) {
    orden = visibles();
    idx = orden.findIndex(function (p) { return p.n === n; });
    if (idx === -1) { orden = S.planchas.slice(); idx = orden.findIndex(function (p) { return p.n === n; }); }
    if (idx === -1) return;
    pintarVisor();
    if (!dlg.open) dlg.showModal();
  }

  function mover(paso) {
    var siguiente = idx + paso;
    if (siguiente < 0 || siguiente >= orden.length) return false;
    idx = siguiente;
    pintarVisor();
    return true;
  }

  caja.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-abrir]");
    if (b) abrir(Number(b.dataset.abrir));
  });

  /* Los botones cubren media escena cada uno, asi que un deslizamiento acaba
     soltando el dedo encima de uno y el navegador dispara tambien su `click`:
     la plancha avanzaria dos veces. Esta bandera la levanta el gesto.       */
  var huboArrastre = false;

  btnPrev.addEventListener("click", function () { if (!huboArrastre) mover(-1); });
  btnNext.addEventListener("click", function () { if (!huboArrastre) mover(1); });

  dlg.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowLeft") { ev.preventDefault(); mover(-1); }
    if (ev.key === "ArrowRight") { ev.preventDefault(); mover(1); }
    if (ev.key === "Home") { ev.preventDefault(); idx = 0; pintarVisor(); }
    if (ev.key === "End") { ev.preventDefault(); idx = orden.length - 1; pintarVisor(); }
  });

  dlg.addEventListener("close", function () {
    lamina.innerHTML = "";
    history.replaceState(null, "", location.pathname + location.search);
    var vuelta = $("#pl-" + String((orden[idx] || {}).n || 0).padStart(3, "0") + " [data-abrir]");
    if (vuelta) vuelta.focus();
  });

  /* Clic en el fondo cierra. Se compara contra la caja, no contra el dialog,
     porque el area del <dialog> ocupa toda la pantalla.                      */
  dlg.addEventListener("click", function (ev) {
    if (ev.target === dlg) dlg.close();
  });

  /* --- gesto de arrastre ------------------------------------------------------ */
  /* Sigue el dedo 1:1, con resistencia progresiva en los extremos, y al soltar
     decide con la velocidad proyectada, no solo con la distancia: un gesto
     corto y rapido tiene que bastar.                                          */

  (function gesto() {
    var escena = $("[data-visor-escena]");
    if (!escena || !window.PointerEvent) return;

    var activo = false, id = null, x0 = 0, t0 = 0, dx = 0, ancho = 1;
    var hist = [];

    function gomaElastica(sobra, dim) {
      return (sobra * dim * 0.55) / (dim + 0.55 * Math.abs(sobra));
    }

    escena.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      activo = true; id = e.pointerId;
      huboArrastre = false;
      x0 = e.clientX; t0 = performance.now(); dx = 0;
      ancho = escena.clientWidth || 1;
      hist = [{ x: e.clientX, t: t0 }];
      lamina.style.transition = "none";
      /* La captura NO se pide aqui. Mientras hay captura, el navegador manda
         el `click` al elemento que captura en vez de al que se pulso, y los
         botones de pasar plancha —que ocupan media escena— no lo recibirian
         nunca. Se pide en cuanto el dedo se mueve de verdad.                */
    });

    escena.addEventListener("pointermove", function (e) {
      if (!activo || e.pointerId !== id) return;
      dx = e.clientX - x0;
      /* A partir de unos pocos pixeles esto ya es un arrastre, no un toque. */
      if (Math.abs(dx) > 8 && !huboArrastre) {
        huboArrastre = true;
        try { escena.setPointerCapture(id); } catch (err) { /* el puntero ya se fue */ }
      }
      /* En el primero y en el ultimo no hay a donde ir: se frena, no se choca. */
      var tope = (dx > 0 && idx === 0) || (dx < 0 && idx === orden.length - 1);
      var d = tope ? gomaElastica(dx, ancho) : dx;
      hist.push({ x: e.clientX, t: performance.now() });
      if (hist.length > 6) hist.shift();
      lamina.style.transform = "translate3d(" + d + "px,0,0)";
    });

    function soltar(e) {
      if (!activo || e.pointerId !== id) return;
      activo = false;
      if (huboArrastre) {
        try { escena.releasePointerCapture(id); } catch (err) { /* ya liberado */ }
      }

      var ult = hist[hist.length - 1], pri = hist[0];
      var dt = Math.max(1, ult.t - pri.t);
      var v = (ult.x - pri.x) / dt * 1000;           // px/s

      /* Proyeccion de inercia: a donde iria el gesto si se dejara correr. */
      var proyectado = dx + (v / 1000) * 0.998 / (1 - 0.998);
      var salta = Math.abs(proyectado) > ancho * 0.28;
      var paso = salta ? (proyectado > 0 ? -1 : 1) : 0;

      lamina.style.transition = N.quieto()
        ? "none"
        : "transform 260ms " + "cubic-bezier(0.23, 1, 0.32, 1)";

      if (paso && mover(paso)) {
        lamina.style.transition = "none";
        lamina.style.transform = "translate3d(" + (paso > 0 ? ancho * 0.3 : -ancho * 0.3) + "px,0,0)";
        requestAnimationFrame(function () {
          lamina.style.transition = N.quieto() ? "none" : "transform 260ms cubic-bezier(0.23, 1, 0.32, 1)";
          lamina.style.transform = "translate3d(0,0,0)";
        });
      } else {
        lamina.style.transform = "translate3d(0,0,0)";
      }
      dx = 0;
    }

    escena.addEventListener("pointerup", soltar);
    escena.addEventListener("pointercancel", soltar);
  })();

  /* --- hoja de flash ---------------------------------------------------------- */

  var hoja = $("[data-flash]");
  /* Si la hoja ya viene montada en el HTML (volcada por
     tools/sync-contenido.py), no hay nada que hacer: repintarla obligaria a
     bajar otra vez las ocho laminas por nada.                              */
  if (hoja && hoja.querySelector(".flash")) hoja = null;
  if (hoja) {
    var ETIQUETA = { libre: "Libre", reservado: "Reservado", tatuado: "Tatuado" };

    Promise.all(S.flash.map(function (f) {
      return fetch(f.svg).then(function (r) { return r.ok ? r.text() : ""; }).catch(function () { return ""; });
    })).then(function (svgs) {
      hoja.innerHTML = S.flash.map(function (f, i) {
        var a = N.artistaPor(f.artista);
        var libre = f.estado === "libre";
        var dibujo = svgs[i] ||
          '<span class="xs fg-3">No se ha podido cargar la lámina</span>';
        return '<article class="flash" data-estado="' + esc(f.estado) + '" id="' + esc(f.id) + '">' +
          '<div class="flash__lamina" role="img" aria-label="' + esc(f.alt) + '">' + dibujo + "</div>" +
          '<div class="flash__ficha">' +
            '<p class="flash__cab">' +
              '<span class="plate-no">' + esc(f.id) + "</span>" +
              '<span class="flash__precio">' + esc(N.euros(f.precio)) + "</span>" +
            "</p>" +
            '<p class="flash__titulo">' + esc(f.titulo) + "</p>" +
            '<p class="flash__meta">' + esc(a.nombre) + " · " + f.cm + " cm</p>" +
            '<p class="flash__pie">' +
              '<span class="mark mark--' + esc(f.estado) + '">' + esc(ETIQUETA[f.estado]) + "</span>" +
              (libre
                ? '<a class="btn btn--stamp" href="reservar.html?flash=' + esc(f.id) + '">Reservar</a>'
                : "") +
            "</p>" +
          "</div></article>";
      }).join("");
    });
  }

  /* --- arranque ---------------------------------------------------------------- */

  urlADatos();
  aplicar();
  requestAnimationFrame(function () { colocar(false); });

  /* Si la URL trae una plancha, se abre. Esto es lo que hace que el numero
     sirva para algo: PL. 007 es una direccion, no una etiqueta.              */
  var m = /^#pl-(\d{1,3})$/.exec(location.hash);
  if (m) {
    var destino = document.getElementById("pl-" + m[1].padStart(3, "0"));
    if (destino) {
      destino.scrollIntoView({ block: "center" });
      abrir(Number(m[1]));
    }
  }
})();
