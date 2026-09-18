/* =============================================================================
   NIGREDO · NUCLEO
   Lo que comparten todas las paginas: imagenes responsive, navegacion, pie,
   datos estructurados, verificacion de edad y el revelado de plancha.
   Se carga con `defer`, asi que el DOM ya existe cuando corre.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO;
  if (!S) { console.error("NIGREDO: falta js/content.js"); return; }

  /* --- utilidades ---------------------------------------------------------- */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Una sola fuente de verdad para "el usuario no quiere movimiento". Se
     consulta en vivo, no una vez al cargar: se puede cambiar sin recargar.   */
  var mqQuieto = window.matchMedia("(prefers-reduced-motion: reduce)");
  function quieto() { return mqQuieto.matches; }

  /* Mismos anchos que genera tools/fetch-images.py. Si cambian alli, cambian
     aqui: es la unica duplicacion del proyecto y esta anotada a proposito.   */
  var ANCHOS = {
    hero:    [1800, 1200, 840, 520],
    plancha: [1500, 900, 720, 600, 380],
    artista: [840, 560, 360],
    lugar:   [1400, 900, 560]
  };

  /* Devuelve el <img> completo. `ratio` evita el salto de layout: la caja
     reserva su altura antes de que la imagen llegue.                         */
  function imgHTML(o) {
    var anchos = ANCHOS[o.tipo] || ANCHOS.plancha;
    var srcset = anchos.map(function (w) {
      return "assets/img/" + o.base + "-" + w + ".webp " + w + "w";
    }).join(", ");
    var menor = anchos[anchos.length - 1];
    var alto = o.ratio ? Math.round(1000 / o.ratio) : null;
    return '<img src="assets/img/' + o.base + "-" + menor + '.webp"' +
      ' srcset="' + srcset + '"' +
      ' sizes="' + (o.sizes || "100vw") + '"' +
      ' alt="' + esc(o.alt) + '"' +
      (alto ? ' width="1000" height="' + alto + '"' : "") +
      ' loading="' + (o.eager ? "eager" : "lazy") + '"' +
      ' decoding="' + (o.eager ? "sync" : "async") + '"' +
      (o.prioridad || (o.eager && o.prioridad === undefined) ? ' fetchpriority="high"' : "") +
      (o.clase ? ' class="' + o.clase + '"' : "") + ">";
  }

  function artistaPor(slug) {
    for (var i = 0; i < S.artistas.length; i++) {
      if (S.artistas[i].slug === slug) return S.artistas[i];
    }
    return null;
  }
  function nombreDe(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i].nombre;
    return id;
  }
  function plancha(n) { return "PL. " + String(n).padStart(3, "0"); }

  function euros(n) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency", currency: "EUR", maximumFractionDigits: 0
    }).format(n);
  }

  function fechaLarga(iso) {
    var d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long", day: "numeric", month: "long"
    }).format(d);
  }

  /* --- navegacion ---------------------------------------------------------- */

  var PAGINAS = [
    { href: "index.html",    texto: "Portada" },
    { href: "artistas.html", texto: "Artistas" },
    { href: "galeria.html",  texto: "Registro" },
    { href: "cuidados.html", texto: "Cuidados" },
    { href: "reservar.html", texto: "Pedir cita" }
  ];

  function montarNav() {
    var host = $("[data-nav]");
    if (!host) return;
    var actual = location.pathname.split("/").pop() || "index.html";

    var enlaces = PAGINAS.map(function (p) {
      var esActual = p.href === actual;
      var esCita = p.href === "reservar.html";
      return '<li><a href="' + p.href + '"' +
        (esActual ? ' aria-current="page"' : "") +
        ' class="nav__link' + (esCita ? " nav__link--cita" : "") + '">' +
        esc(p.texto) + "</a></li>";
    }).join("");

    host.innerHTML =
      '<a class="nav__marca" href="index.html">' +
        '<span class="nav__nombre">' + esc(S.studio.nombre) + "</span>" +
        '<span class="nav__lema">' + esc(S.studio.lema) + "</span>" +
      "</a>" +
      '<button class="nav__abrir" type="button" aria-expanded="false" aria-controls="nav-menu">' +
        '<span class="nav__abrir-txt">Menu</span>' +
        '<span class="nav__abrir-barras" aria-hidden="true"><i></i><i></i></span>' +
      "</button>" +
      '<nav id="nav-menu" class="nav__menu" aria-label="Principal">' +
        '<ul class="nav__lista" role="list">' + enlaces + "</ul>" +
      "</nav>";

    var boton = $(".nav__abrir", host);
    var menu = $(".nav__menu", host);

    function cerrar() {
      boton.setAttribute("aria-expanded", "false");
      document.documentElement.removeAttribute("data-menu");
    }
    function alternar() {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", String(!abierto));
      if (abierto) document.documentElement.removeAttribute("data-menu");
      else document.documentElement.setAttribute("data-menu", "");
    }
    boton.addEventListener("click", alternar);
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
        cerrar(); boton.focus();
      }
    });
    /* Al pasar a ancho de escritorio el menu deja de ser un cajon. */
    window.matchMedia("(min-width: 60rem)").addEventListener("change", cerrar);

    /* Borde de scroll: la barra se separa del contenido solo cuando hay
       contenido debajo, en vez de llevar un filete permanente.               */
    var centinela = $(".nav__centinela");
    if (!centinela) {
      centinela = document.createElement("div");
      centinela.setAttribute("aria-hidden", "true");
      centinela.className = "nav__centinela";
      host.parentNode.insertBefore(centinela, host);
    }
    new IntersectionObserver(function (entradas) {
      host.toggleAttribute("data-flotando", !entradas[0].isIntersecting);
    }, { rootMargin: "0px" }).observe(centinela);
  }

  /* --- pie ----------------------------------------------------------------- */

  function montarPie() {
    var host = $("[data-pie]");
    if (!host) return;
    var d = S.studio.direccion;

    var horas = S.studio.horario.map(function (h) {
      return '<div class="pie__hora"><dt>' + esc(h.dias) + "</dt>" +
        '<dd class="num">' + (h.abre ? esc(h.abre) + "–" + esc(h.cierra) : esc(h.nota || "Cerrado")) +
        "</dd></div>";
    }).join("");

    var legales = S.pie.enlaces.map(function (e) {
      return '<li><a href="' + esc(e.href) + '">' + esc(e.texto) + "</a></li>";
    }).join("");

    host.innerHTML =
      '<div class="reg">' +
        '<div class="reg__margin"><p class="label">Colofon</p></div>' +
        '<div class="reg__body pie__cuerpo">' +
          '<div class="pie__bloque">' +
            '<h2 class="d4">' + esc(S.studio.nombreCompleto) + "</h2>" +
            '<address class="pie__dir sm fg-2">' +
              esc(d.calle) + "<br>" + esc(d.cp) + " " + esc(d.ciudad) + " · " + esc(d.barrio) + "<br>" +
              '<a href="tel:+' + esc(S.studio.telefonoLimpio) + '" class="num">' + esc(S.studio.telefono) + "</a><br>" +
              '<a href="https://instagram.com/' + esc(S.studio.instagram) + '" rel="noopener">@' + esc(S.studio.instagram) + "</a>" +
            "</address>" +
          "</div>" +
          '<div class="pie__bloque">' +
            '<p class="label">Horario</p>' +
            '<dl class="pie__horas sm">' + horas + "</dl>" +
          "</div>" +
          '<div class="pie__bloque">' +
            '<p class="label">Sanidad</p>' +
            '<p class="xs fg-3">' + esc(S.pie.sanidad) + "</p>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="reg pie__base">' +
        '<div class="reg__margin"></div>' +
        '<div class="reg__body pie__legal">' +
          '<p class="xs fg-3">' + esc(S.pie.creditos) + "</p>" +
          '<ul class="pie__legales xs" role="list">' + legales + "</ul>" +
        "</div>" +
      "</div>";
  }

  /* --- datos estructurados ------------------------------------------------- */

  function montarSchema() {
    var d = S.studio.direccion;
    /* El dominio sale de content.js, no de location.origin: si saliera de ahi,
       tools/sync-contenido.py congelaria en el codigo fuente la direccion del
       servidor local con el que se volco la pagina.                        */
    var base = String(S.studio.web || location.origin).replace(/\/+$/, "");
    var datos = {
      "@context": "https://schema.org",
      "@type": "TattooParlor",
      name: S.studio.nombreCompleto,
      description: S.studio.descripcion,
      url: base + "/",
      telephone: S.studio.telefono,
      image: base + "/assets/img/hero-1200.webp",
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: d.calle,
        postalCode: d.cp,
        addressLocality: d.ciudad,
        addressCountry: d.pais
      },
      geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
      openingHoursSpecification: S.studio.horarioSchema.map(function (h) {
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.dias, opens: h.abre, closes: h.cierra
        };
      }),
      sameAs: ["https://instagram.com/" + S.studio.instagram],
      employee: S.artistas.map(function (a) {
        return { "@type": "Person", name: a.nombre, jobTitle: a.estilo };
      })
    };
    /* Esta funcion anade, no reemplaza. En una pagina pre-renderizada por
       tools/sync-contenido.py el bloque ya viene en el HTML, y sin esta
       guarda acabaria habiendo dos.                                        */
    var previo = $('script[type="application/ld+json"]');
    var s = previo || document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(datos);
    if (!previo) document.head.appendChild(s);
  }

  /* --- verificacion de edad ------------------------------------------------ */
  /* Franja inferior, no pantalla completa: no tapa el contenido, no retrasa
     el primer pintado y no penaliza el rebote del trafico de Instagram. El
     consentimiento que importa de verdad esta en el formulario de reserva.
     Con `bloqueante: true` en content.js pasa a ser un panel modal.          */

  var CLAVE_EDAD = "nigredo:edad";

  function edadGuardada() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE_EDAD) || "null");
      if (!v || !v.hasta || Date.now() > v.hasta) return null;
      return v.ok;
    } catch (e) { return null; }
  }
  function guardarEdad(ok) {
    try {
      localStorage.setItem(CLAVE_EDAD, JSON.stringify({
        ok: ok, hasta: Date.now() + S.studio.edad.recordarDias * 864e5
      }));
    } catch (e) { /* navegacion privada: no pasa nada, se vuelve a preguntar */ }
  }

  function montarEdad() {
    var cfg = S.studio.edad;
    if (edadGuardada() !== null) return;

    var caja = document.createElement("aside");
    caja.className = "edad" + (cfg.bloqueante ? " edad--modal" : "");
    caja.setAttribute("aria-labelledby", "edad-t");
    if (cfg.bloqueante) { caja.setAttribute("role", "dialog"); caja.setAttribute("aria-modal", "true"); }
    else { caja.setAttribute("role", "region"); caja.setAttribute("aria-label", "Verificacion de edad"); }

    caja.innerHTML =
      '<div class="edad__caja">' +
        '<p class="plate-no">Aviso</p>' +
        '<h2 class="d4" id="edad-t">' + esc(cfg.titulo) + "</h2>" +
        '<p class="sm fg-2 edad__texto">' + esc(cfg.texto) + "</p>" +
        '<div class="edad__botones">' +
          '<button class="btn btn--stamp" type="button" data-si>' + esc(cfg.confirmar) + "</button>" +
          '<button class="btn btn--quiet" type="button" data-no>' + esc(cfg.rechazar) + "</button>" +
        "</div>" +
      "</div>";

    document.body.appendChild(caja);

    var antes = document.activeElement;

    /* Insertar un nodo cuando la pagina ya esta pintada puede provocar un
       salto de maquetacion. Aqui entra durante el primer layout y lo unico
       que espera al momento de calma es el `data-visible`, que solo mueve un
       transform: eso no toca el layout de nadie.                            */
    var revelar = function () {
      caja.setAttribute("data-visible", "");
      /* Lo saben el resto de piezas fijas de la pantalla, que se apartan. */
      document.documentElement.setAttribute("data-edad", "");
      if (cfg.bloqueante) {
        document.documentElement.setAttribute("data-bloqueado", "");
        $("[data-si]", caja).focus();
      }
    };
    if ("requestIdleCallback" in window) requestIdleCallback(revelar, { timeout: 2200 });
    else setTimeout(revelar, 900);

    function cerrar() {
      caja.removeAttribute("data-visible");
      document.documentElement.removeAttribute("data-edad");
      document.documentElement.removeAttribute("data-bloqueado");
      var fin = function () { caja.remove(); };
      if (quieto()) fin();
      else caja.addEventListener("transitionend", fin, { once: true });
      if (antes && antes.focus) antes.focus();
    }

    $("[data-si]", caja).addEventListener("click", function () {
      guardarEdad(true); cerrar();
    });

    $("[data-no]", caja).addEventListener("click", function () {
      guardarEdad(false);
      var cuerpo = $(".edad__caja", caja);
      cuerpo.innerHTML =
        '<p class="plate-no">Aviso</p>' +
        '<h2 class="d4">' + esc(cfg.tituloMenor) + "</h2>" +
        '<p class="sm fg-2 edad__texto">' + esc(cfg.textoMenor) + "</p>" +
        '<div class="edad__botones">' +
          '<a class="btn btn--stamp" href="https://wa.me/' + esc(S.studio.whatsapp) +
            '" rel="noopener">Escribir por WhatsApp</a>' +
          '<button class="btn btn--quiet" type="button" data-cerrar>Entendido</button>' +
        "</div>";
      cuerpo.querySelector("h2").setAttribute("id", "edad-t");
      $("[data-cerrar]", caja).addEventListener("click", cerrar);
      $("[data-cerrar]", caja).focus();
    });
  }

  /* --- revelado de plancha ------------------------------------------------- */
  /* El unico momento de movimiento con autor de la web: una plancha se asienta
     al entrar en pantalla. Se descubre de arriba abajo con clip-path, como
     una lamina que se posa sobre el papel, y la marca del margen se traza a
     la vez. No hay parallax, no hay scrolljacking, y el contenido es visible
     por defecto: si el JavaScript falla, todo se ve igual.                   */

  var observadorRevelado = null;

  function montarRevelado() {
    if (quieto() || !("IntersectionObserver" in window)) return;

    if (!observadorRevelado) {
      observadorRevelado = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          var n = e.target;
          /* Escalonado corto entre hermanos: 45 ms, nunca mas. */
          var i = Number(n.getAttribute("data-revelar-orden") || 0);
          n.style.transitionDelay = Math.min(i * 45, 180) + "ms";
          n.setAttribute("data-revelar", "hecho");
          observadorRevelado.unobserve(n);
        });
      /* El umbral tiene que ser 0. El estado de espera oculta la lamina con
         `clip-path: inset(0 0 100% 0)`, y IntersectionObserver aplica el
         recorte antes de medir: el area visible es siempre cero, asi que
         ninguna fraccion mayor que 0 se alcanza nunca y la lamina se queda
         escondida para siempre. Con 0 basta con que los rectangulos se
         toquen, y el margen inferior se encarga de que no sea demasiado
         pronto.                                                             */
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    }

    /* Solo los que todavia no tienen estado: asi se puede volver a llamar
       despues de inyectar contenido sin reiniciar lo que ya se revelo.       */
    var alto = window.innerHeight || 800;
    $$("[data-revelar]:not([data-revelar='espera']):not([data-revelar='hecho'])")
      .forEach(function (n) {
        /* Lo que ya esta en pantalla al cargar no se oculta para volver a
           mostrarlo: con el contenido volcado en el HTML eso seria un
           parpadeo, no un revelado. Se marca como hecho y en paz.           */
        if (n.getBoundingClientRect().top < alto) {
          n.setAttribute("data-revelar", "hecho");
          return;
        }
        n.setAttribute("data-revelar", "espera");
        observadorRevelado.observe(n);
      });
  }

  /* --- boton flotante de WhatsApp ------------------------------------------ */
  /* El canal por el que escribe de verdad la gente. El dibujo es de la casa:
     un bocadillo de esquina recta, como todo aqui, con el auricular dentro.
     Lo que lo hace reconocible es la palabra que lleva al lado.              */

  function montarWhatsapp() {
    var cfg = S.studio.botonWhatsapp;
    if (!cfg || !cfg.activo || !S.studio.whatsapp) return;
    /* Esto va antes de la salida de abajo: en una pagina ya volcada el boton
       existe pero la marca haria falta igual, y el pie la necesita para
       apartar sus enlaces legales.                                          */
    document.documentElement.setAttribute("data-wasap-activo", "");
    /* Si ya viene volcado en el HTML por tools/sync-contenido.py, no se
       duplica.                                                              */
    if ($("[data-wasap]")) return;

    var a = document.createElement("a");
    a.className = "wasap";
    a.setAttribute("data-wasap", "");
    a.href = "https://wa.me/" + S.studio.whatsapp +
      (cfg.mensaje ? "?text=" + encodeURIComponent(cfg.mensaje) : "");
    a.target = "_blank";
    a.rel = "noopener";
    /* El nombre accesible empieza por el texto visible: quien navega por voz
       dice "WhatsApp" y el navegador encuentra este enlace.                 */
    a.setAttribute("aria-label", cfg.etiqueta + ": " + cfg.titulo +
      " (se abre en una pestaña nueva)");
    a.innerHTML =
      '<svg class="wasap__marca" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M3 21V4h18v13H7.5L3 21Z" stroke="currentColor" stroke-width="1.6" ' +
          'stroke-linejoin="round"/>' +
        '<path d="M9 8.2c0 3.1 2.7 5.8 5.8 5.8l1-1.6-2-1.1-.9.9a5.6 5.6 0 0 1-2.1-2.1l.9-.9' +
          '-1.1-2L9 8.2Z" fill="currentColor"/>' +
      "</svg>" +
      '<span class="wasap__texto">' + esc(cfg.etiqueta) + "</span>";
    document.body.appendChild(a);
  }

  /* --- arranque ------------------------------------------------------------ */

  montarNav();
  montarPie();
  montarSchema();
  montarRevelado();

  montarWhatsapp();
  montarEdad();

  /* Se expone lo minimo para las paginas que lo necesitan. */
  window.NIGREDO = {
    $: $, $$: $$, esc: esc, quieto: quieto, mqQuieto: mqQuieto,
    imgHTML: imgHTML, artistaPor: artistaPor, nombreDe: nombreDe,
    plancha: plancha, euros: euros, fechaLarga: fechaLarga,
    /* Las paginas la llaman despues de inyectar planchas nuevas. */
    revelar: montarRevelado
  };
})();
