/* =============================================================================
   NIGREDO · SIMULADOR DE COLOCACION
   Sube una foto de la zona, pon un diseno encima y muevelo, escalalo, giralo
   y ajusta la opacidad hasta que cuadre.

   Todo ocurre en el navegador: la foto nunca sale de aqui. El arrastre va con
   transforms (GPU, sin repintar nada) y el canvas solo se toca al descargar,
   que es la unica vez que hace falta rasterizar.

   Los flash son SVG de este mismo dominio, asi que el canvas no se contamina
   y `toBlob()` funciona. Con un diseno de otro origen, no habria descarga.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, $$ = N.$$, esc = N.esc;

  var raiz = $("[data-simulador]");
  if (!raiz) return;

  var ANCHO_BASE = 0.34;   // el diseno ocupa este ancho de la escena a escala 1

  var st = { x: 0, y: 0, escala: 1, giro: 0, opacidad: 0.85 };
  var urlFoto = null;
  var urlPropio = null;
  var svgActual = null;    // texto del SVG del flash elegido
  var imgPropio = null;    // Image si el usuario sube su diseno

  /* --- montaje ---------------------------------------------------------------- */

  var libres = S.flash.filter(function (f) { return f.estado !== "tatuado"; });

  raiz.innerHTML =
    '<div class="sim">' +
      '<div>' +
        '<div class="sim__escena" data-escena>' +
          '<div class="sim__vacio" data-vacio>' +
            '<p class="sm">Aún no hay foto.</p>' +
            '<p class="xs">Sube una del brazo, la pierna o la espalda y coloca el ' +
              'diseño encima.</p>' +
          "</div>" +
        "</div>" +
        '<p class="sim__privacidad" style="margin-top:var(--s4)"><span>' +
          esc(S.textos.simulador.privacidad) + "</span></p>" +
      "</div>" +

      '<div class="sim__mandos">' +
        '<div class="field">' +
          '<label class="field__label" for="sim-foto">1 · Tu foto</label>' +
          '<input class="input" id="sim-foto" type="file" accept="image/*" data-foto>' +
          '<p class="field__hint">Con buena luz y la zona lo más plana posible.</p>' +
        "</div>" +

        "<div>" +
          '<p class="label" style="margin-bottom:var(--s3)">2 · El diseño</p>' +
          '<div class="sim__flashes" data-flashes>' +
            libres.map(function (f, i) {
              return '<button class="sim__flash" type="button" data-flash="' + esc(f.id) + '"' +
                ' aria-pressed="' + (i === 0) + '" title="' + esc(f.titulo) + '">' +
                '<span class="visually-hidden">' + esc(f.titulo) + "</span></button>";
            }).join("") +
          "</div>" +
          '<div class="field" style="margin-top:var(--s4)">' +
            '<label class="field__label" for="sim-propio">O sube el tuyo</label>' +
            '<input class="input" id="sim-propio" type="file" accept="image/png,image/svg+xml,image/webp" data-propio>' +
            '<p class="field__hint">Mejor un PNG con fondo transparente.</p>' +
          "</div>" +
        "</div>" +

        "<div>" +
          '<p class="label" style="margin-bottom:var(--s3)">3 · Ajusta</p>' +
          '<div class="sim__mando">' +
            '<span class="sim__fila"><label for="sim-escala">Tamaño</label>' +
              '<span class="val" data-val-escala>100 %</span></span>' +
            '<input id="sim-escala" type="range" min="20" max="260" value="100" data-escala>' +
          "</div>" +
          '<div class="sim__mando">' +
            '<span class="sim__fila"><label for="sim-giro">Giro</label>' +
              '<span class="val" data-val-giro>0°</span></span>' +
            '<input id="sim-giro" type="range" min="-180" max="180" value="0" data-giro>' +
          "</div>" +
          '<div class="sim__mando">' +
            '<span class="sim__fila"><label for="sim-opacidad">Opacidad</label>' +
              '<span class="val" data-val-opacidad>85 %</span></span>' +
            '<input id="sim-opacidad" type="range" min="15" max="100" value="85" data-opacidad>' +
          "</div>" +
          '<p class="xs fg-3">Arrastra el diseño para moverlo. Con ratón vale ' +
            'con arrastrar en cualquier punto de la foto; con el dedo, agárralo ' +
            'y pellizca con dos dedos para escalar y girar.</p>' +
        "</div>" +

        '<div class="pasos__nav">' +
          '<button class="btn btn--stamp" type="button" data-descargar disabled>Descargar</button>' +
          '<button class="btn" type="button" data-centrar>Centrar</button>' +
        "</div>" +
        '<p class="xs fg-3" role="status" data-sim-aviso></p>' +
      "</div>" +
    "</div>";

  var escena = $("[data-escena]", raiz);
  var vacio = $("[data-vacio]", raiz);
  var aviso = $("[data-sim-aviso]", raiz);
  var btnDescargar = $("[data-descargar]", raiz);
  var pieza = null;

  /* --- laminas de flash -------------------------------------------------------- */

  /* Aqui si hay que pedirlas por red: este modulo reconstruye su propio DOM
     al arrancar, asi que lo que hubiera volcado en el HTML ya no esta.      */
  var svgs = {};
  Promise.all(libres.map(function (f) {
    return fetch(f.svg).then(function (r) { return r.ok ? r.text() : ""; })
      .catch(function () { return ""; });
  })).then(function (textos) {
    libres.forEach(function (f, i) {
      svgs[f.id] = textos[i];
      var b = $('[data-flash="' + f.id + '"]', raiz);
      if (b && textos[i]) b.insertAdjacentHTML("afterbegin", textos[i]);
    });
    if (libres.length) elegirFlash(libres[0].id);
  });

  function elegirFlash(id) {
    svgActual = svgs[id] || null;
    imgPropio = null;
    $$("[data-flash]", raiz).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.flash === id));
    });
    pintarPieza();
  }

  $("[data-flashes]", raiz).addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-flash]");
    if (b) elegirFlash(b.dataset.flash);
  });

  /* --- pieza sobre la foto ------------------------------------------------------ */

  function pintarPieza() {
    if (!urlFoto) return;
    if (!pieza) {
      pieza = document.createElement("div");
      pieza.className = "sim__pieza";
      pieza.setAttribute("aria-hidden", "true");
      escena.appendChild(pieza);
    }
    if (imgPropio) {
      pieza.innerHTML = '<img src="' + esc(imgPropio.src) + '" alt="">';
    } else if (svgActual) {
      pieza.innerHTML = svgActual;
      var s = pieza.querySelector("svg");
      if (s) { s.removeAttribute("role"); s.removeAttribute("aria-label"); s.style.color = "#111"; }
    }
    aplicar();
  }

  function aplicar() {
    if (!pieza) return;
    pieza.style.transform =
      "translate(-50%,-50%) translate3d(" + st.x + "px," + st.y + "px,0)" +
      " rotate(" + st.giro + "deg) scale(" + st.escala + ")";
    pieza.style.opacity = st.opacidad;
  }

  /* --- mandos ------------------------------------------------------------------- */

  function conectarRango(sel, salida, aplicarValor, formato) {
    var r = $(sel, raiz), v = $(salida, raiz);
    r.addEventListener("input", function () {
      aplicarValor(Number(r.value));
      v.textContent = formato(Number(r.value));
      aplicar();
    });
    return r;
  }

  var rEscala = conectarRango("[data-escala]", "[data-val-escala]",
    function (n) { st.escala = n / 100; }, function (n) { return n + " %"; });
  var rGiro = conectarRango("[data-giro]", "[data-val-giro]",
    function (n) { st.giro = n; }, function (n) { return n + "°"; });
  conectarRango("[data-opacidad]", "[data-val-opacidad]",
    function (n) { st.opacidad = n / 100; }, function (n) { return n + " %"; });

  $("[data-centrar]", raiz).addEventListener("click", function () {
    st.x = 0; st.y = 0; st.giro = 0; st.escala = 1;
    rEscala.value = 100; rGiro.value = 0;
    $("[data-val-escala]", raiz).textContent = "100 %";
    $("[data-val-giro]", raiz).textContent = "0°";
    aplicar();
  });

  /* --- foto ---------------------------------------------------------------------- */

  $("[data-foto]", raiz).addEventListener("change", function () {
    var f = this.files && this.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      aviso.textContent = "Eso no es una imagen. Sube un JPG, un PNG o un HEIC.";
      return;
    }
    if (urlFoto) URL.revokeObjectURL(urlFoto);
    urlFoto = URL.createObjectURL(f);

    var img = new Image();
    img.className = "sim__foto";
    img.alt = "Foto de la zona del cuerpo que has subido.";
    img.onload = function () {
      vacio.hidden = true;
      var vieja = escena.querySelector(".sim__foto");
      if (vieja) vieja.remove();
      escena.insertBefore(img, escena.firstChild);
      /* Con foto cargada ya hay algo que arrastrar: la escena lo anuncia. */
      escena.setAttribute("data-listo", "");
      btnDescargar.disabled = false;
      aviso.textContent = "";
      pintarPieza();
    };
    img.onerror = function () {
      aviso.textContent = "No se ha podido abrir esa imagen. Prueba con otra.";
    };
    img.src = urlFoto;
  });

  $("[data-propio]", raiz).addEventListener("change", function () {
    var f = this.files && this.files[0];
    if (!f) return;
    if (urlPropio) URL.revokeObjectURL(urlPropio);
    urlPropio = URL.createObjectURL(f);
    var img = new Image();
    img.onload = function () {
      imgPropio = img;
      svgActual = null;
      $$("[data-flash]", raiz).forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      pintarPieza();
    };
    img.onerror = function () { aviso.textContent = "Ese archivo no se puede usar como diseño."; };
    img.src = urlPropio;
  });

  /* --- gesto: arrastrar, y pellizcar con dos dedos -------------------------------- */

  (function gesto() {
    var punteros = new Map();
    var inicio = null;

    function centro() {
      var ps = Array.from(punteros.values());
      if (ps.length === 1) return { x: ps[0].x, y: ps[0].y, d: 0, a: 0 };
      var dx = ps[1].x - ps[0].x, dy = ps[1].y - ps[0].y;
      return {
        x: (ps[0].x + ps[1].x) / 2,
        y: (ps[0].y + ps[1].y) / 2,
        d: Math.hypot(dx, dy),
        a: Math.atan2(dy, dx) * 180 / Math.PI
      };
    }

    /* Sin esto, presionar sobre la foto o sobre un diseno propio arranca el
       arrastre nativo de imagenes del navegador y el gesto se muere ahi.    */
    escena.addEventListener("dragstart", function (e) { e.preventDefault(); });

    escena.addEventListener("pointerdown", function (e) {
      if (!urlFoto) return;
      /* Con el dedo, solo se arrastra agarrando el diseno. Si la escena
         entera capturase el gesto, no se podria pasar de largo esta seccion
         en el movil: ocupa casi toda la pantalla.                          */
      if (e.pointerType === "touch" && !e.target.closest(".sim__pieza")) return;
      e.preventDefault();
      escena.setPointerCapture(e.pointerId);
      punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
      var c = centro();
      inicio = { c: c, x: st.x, y: st.y, escala: st.escala, giro: st.giro };
      if (pieza) pieza.setAttribute("data-agarrada", "");
    });

    escena.addEventListener("pointermove", function (e) {
      if (!punteros.has(e.pointerId) || !inicio) return;
      punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
      var c = centro();

      /* Movimiento 1:1 con el centro del gesto: el diseno se queda pegado. */
      st.x = inicio.x + (c.x - inicio.c.x);
      st.y = inicio.y + (c.y - inicio.c.y);

      if (punteros.size === 2 && inicio.c.d > 0) {
        st.escala = Math.min(2.6, Math.max(0.2, inicio.escala * (c.d / inicio.c.d)));
        st.giro = inicio.giro + (c.a - inicio.c.a);
        /* Los mandos reflejan el gesto: un control y un gesto que dicen cosas
           distintas es peor que no tener el control.                         */
        rEscala.value = Math.round(st.escala * 100);
        rGiro.value = Math.round(((st.giro + 180) % 360 + 360) % 360 - 180);
        $("[data-val-escala]", raiz).textContent = Math.round(st.escala * 100) + " %";
        $("[data-val-giro]", raiz).textContent = Math.round(st.giro) + "°";
      }
      aplicar();
    });

    function soltar(e) {
      punteros.delete(e.pointerId);
      if (punteros.size === 0) {
        inicio = null;
        if (pieza) pieza.removeAttribute("data-agarrada");
      }
      else { var c = centro(); inicio = { c: c, x: st.x, y: st.y, escala: st.escala, giro: st.giro }; }
    }
    escena.addEventListener("pointerup", soltar);
    escena.addEventListener("pointercancel", soltar);
  })();

  /* --- descarga ------------------------------------------------------------------- */

  function svgAImagen(texto) {
    return new Promise(function (ok, mal) {
      /* Se fija un tamano explicito: sin width/height el navegador no sabe a
         que resolucion rasterizar el SVG y en Firefox sale en blanco.        */
      var t = texto.replace(/<svg /, '<svg width="800" height="1120" ');
      var blob = new Blob([t], { type: "image/svg+xml;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); ok(im); };
      im.onerror = function () { URL.revokeObjectURL(url); mal(); };
      im.src = url;
    });
  }

  btnDescargar.addEventListener("click", function () {
    var foto = escena.querySelector(".sim__foto");
    if (!foto) return;
    btnDescargar.disabled = true;
    aviso.textContent = "Montando la imagen…";

    var caja = escena.getBoundingClientRect();
    var ESC = 2;                                  // exporta al doble para que no salga blanda
    var W = Math.round(caja.width * ESC), H = Math.round(caja.height * ESC);
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var cx = cv.getContext("2d");

    /* Se reproduce el recorte de `object-fit: cover` a mano: es la unica
       forma de que lo descargado sea lo que se ve en pantalla.              */
    var rw = foto.naturalWidth / foto.naturalHeight;
    var rc = W / H;
    var dw, dh, dx, dy;
    if (rw > rc) { dh = H; dw = H * rw; dx = (W - dw) / 2; dy = 0; }
    else { dw = W; dh = W / rw; dx = 0; dy = (H - dh) / 2; }
    cx.drawImage(foto, dx, dy, dw, dh);

    var listo = imgPropio ? Promise.resolve(imgPropio)
              : (svgActual ? svgAImagen(svgActual) : Promise.resolve(null));

    listo.then(function (im) {
      if (im) {
        var anchoPieza = caja.width * ANCHO_BASE * ESC;
        var altoPieza = anchoPieza * (im.naturalHeight / im.naturalWidth);
        cx.save();
        cx.globalAlpha = st.opacidad;
        cx.translate(W / 2 + st.x * ESC, H / 2 + st.y * ESC);
        cx.rotate(st.giro * Math.PI / 180);
        cx.scale(st.escala, st.escala);
        cx.drawImage(im, -anchoPieza / 2, -altoPieza / 2, anchoPieza, altoPieza);
        cx.restore();
      }

      cv.toBlob(function (blob) {
        if (!blob) {
          aviso.textContent = "No se ha podido generar la imagen en este navegador. " +
            "Haz una captura de pantalla: se ve igual.";
          btnDescargar.disabled = false;
          return;
        }
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "colocacion-nigredo.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        aviso.textContent = "Descargada. Mándanosla con la solicitud si quieres.";
        btnDescargar.disabled = false;
      }, "image/png");
    }).catch(function () {
      aviso.textContent = "No se ha podido montar el diseño sobre la foto.";
      btnDescargar.disabled = false;
    });
  });

  /* Si se llega desde un flash concreto, ya viene puesto. */
  var q = new URLSearchParams(location.search);
  if (q.get("flash")) {
    var espera = setInterval(function () {
      if (!Object.keys(svgs).length) return;
      clearInterval(espera);
      if (svgs[q.get("flash")]) elegirFlash(q.get("flash"));
    }, 120);
    setTimeout(function () { clearInterval(espera); }, 4000);
  }
})();
