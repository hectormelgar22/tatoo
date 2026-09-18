/* =============================================================================
   NIGREDO · SOLICITUD DE CITA
   Seis pasos que obligan a dar lo que hace falta, y al final un mensaje de
   WhatsApp ya escrito y ordenado. Sin backend: el mensaje viaja en la URL.

   Lo que cambia el negocio no es el formulario, es que el estudio reciba
   siempre los mismos campos en el mismo orden. Un "hola info" cuesta cuatro
   dias de ida y vuelta; esto cuesta dos minutos al cliente.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, $$ = N.$$, esc = N.esc;

  var raiz = $("[data-solicitud]");
  if (!raiz) return;

  var d = {
    idea: "", zona: "", tamano: "", estilo: "", color: "negro", cobertura: false,
    refs: [], dias: [], franja: "", desde: "", presupuesto: "", artista: "",
    flash: "", consiente: false, estimacion: null
  };

  var PASOS = [
    { id: "idea",      titulo: "La idea" },
    { id: "pieza",     titulo: "Zona y tamaño" },
    { id: "refs",      titulo: "Referencias" },
    { id: "cuando",    titulo: "Cuándo puedes" },
    { id: "cuanto",    titulo: "Presupuesto y artista" },
    { id: "revisar",   titulo: "Revisar y enviar" }
  ];
  var paso = 0;

  var DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var FRANJAS = [
    { id: "manana", nombre: "Mañanas", detalle: "12:00 – 15:00" },
    { id: "tarde",  nombre: "Tardes",  detalle: "15:00 – 20:30" },
    { id: "igual",  nombre: "Me da igual", detalle: "Lo que haya" }
  ];

  /* --- utilidades ------------------------------------------------------------- */

  function porId(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }
  function nombreTamano(id) { var t = porId(S.estimador.tamanos, id); return t ? t.nombre : ""; }

  function error(campo, texto) {
    var f = $('[data-campo="' + campo + '"]', raiz);
    if (!f) return;
    f.setAttribute("data-invalid", "");
    var control = f.querySelector("input, textarea, select");
    if (control) control.setAttribute("aria-invalid", "true");
    var p = f.querySelector(".field__error");
    if (!p) {
      p = document.createElement("p");
      p.className = "field__error";
      p.id = "err-" + campo;
      f.appendChild(p);
      if (control) control.setAttribute("aria-describedby", p.id);
    }
    p.textContent = texto;
  }
  function limpiarErrores() {
    $$("[data-campo]", raiz).forEach(function (f) {
      f.removeAttribute("data-invalid");
      var c = f.querySelector("input, textarea, select");
      if (c) { c.removeAttribute("aria-invalid"); c.removeAttribute("aria-describedby"); }
      var p = f.querySelector(".field__error");
      if (p) p.remove();
    });
    var cons = $("[data-consiente-caja]", raiz);
    if (cons) cons.removeAttribute("data-invalid");
    var consErr = $("[data-consiente-error]", raiz);
    if (consErr) { consErr.textContent = ""; consErr.hidden = true; }
  }

  /* --- validacion por paso ------------------------------------------------------ */

  function validar() {
    limpiarErrores();
    var p = PASOS[paso].id;
    var fallos = [];

    if (p === "idea") {
      if (d.idea.trim().length < 25) {
        error("idea", "Cuéntanos un poco más. Con dos palabras no podemos " +
          "proponerte nada: qué quieres, por qué y de qué tamaño lo imaginas.");
        fallos.push("idea");
      }
    }
    if (p === "pieza") {
      if (!d.zona) { error("zona", "Elige una zona, aunque luego la cambiemos en persona."); fallos.push("zona"); }
      if (!d.tamano) { error("tamano", "Elige un tamaño aproximado."); fallos.push("tamano"); }
    }
    if (p === "cuando") {
      if (!d.dias.length) { error("dias", "Marca al menos un día."); fallos.push("dias"); }
      if (!d.franja) { error("franja", "Mañanas, tardes o lo que haya."); fallos.push("franja"); }
    }
    if (p === "cuanto") {
      var v = Number(d.presupuesto);
      if (!d.presupuesto || isNaN(v) || v < S.estimador.minimoEstudio) {
        error("presupuesto", "Pon una cifra, aunque sea aproximada. Nuestro mínimo " +
          "de estudio son " + N.euros(S.estimador.minimoEstudio) + ", así que por " +
          "debajo de ahí no podemos.");
        fallos.push("presupuesto");
      }
    }
    if (p === "revisar") {
      if (!d.consiente) {
        var caja = $("[data-consiente-caja]", raiz);
        if (caja) caja.setAttribute("data-invalid", "");
        /* Marcar el borde no basta: quien pulsa "abrir WhatsApp" y no ve pasar
           nada cree que la web esta rota. El aviso dice que falta y por que. */
        var avisoCons = $("[data-consiente-error]", raiz);
        if (avisoCons) {
          avisoCons.textContent = "Para mandar la solicitud tienes que leer y " +
            "aceptar el consentimiento. Es un requisito legal, no un trámite nuestro.";
          avisoCons.hidden = false;
        }
        fallos.push("consiente");
      }
    }

    if (fallos.length) {
      var primero = $('[data-campo="' + fallos[0] + '"] input, [data-campo="' + fallos[0] + '"] textarea, [data-campo="' + fallos[0] + '"] select', raiz)
        || $("[data-consiente]", raiz);
      if (primero) primero.focus();
    }
    return fallos.length === 0;
  }

  /* --- referencias --------------------------------------------------------------- */

  var MAX_REFS = 6;

  function pintarRefs() {
    var caja = $("[data-refs]", raiz);
    if (!caja) return;
    caja.innerHTML = d.refs.map(function (r, i) {
      return '<figure class="ref" draggable="true" data-ref="' + i + '" tabindex="0"' +
        ' role="listitem" aria-label="Referencia ' + (i + 1) + ' de ' + d.refs.length +
        '. Arrastra o usa Control con las flechas para reordenar.">' +
        '<img src="' + esc(r.url) + '" alt="Referencia ' + (i + 1) + ' que has subido">' +
        '<span class="ref__orden">' + (i + 1) + "</span>" +
        '<button class="ref__quitar" type="button" data-quitar="' + i + '">' +
          '<span class="visually-hidden">Quitar la referencia ' + (i + 1) + "</span></button>" +
      "</figure>";
    }).join("");
    var cuenta = $("[data-refs-cuenta]", raiz);
    if (cuenta) {
      cuenta.textContent = d.refs.length
        ? d.refs.length + " de " + MAX_REFS + ". La primera es la principal."
        : "Ninguna todavía. No son obligatorias, pero ayudan mucho.";
    }
  }

  function anadirRefs(archivos) {
    var libres = MAX_REFS - d.refs.length;
    Array.prototype.slice.call(archivos, 0, libres).forEach(function (f) {
      if (!/^image\//.test(f.type)) return;
      d.refs.push({ nombre: f.name, url: URL.createObjectURL(f) });
    });
    pintarRefs();
  }

  function moverRef(de, a) {
    if (a < 0 || a >= d.refs.length) return;
    var x = d.refs.splice(de, 1)[0];
    d.refs.splice(a, 0, x);
    pintarRefs();
    var nuevo = $('[data-ref="' + a + '"]', raiz);
    if (nuevo) nuevo.focus();
  }

  /* --- pintado de pasos ----------------------------------------------------------- */

  function campo(id, etiqueta, control, ayuda) {
    return '<div class="field" data-campo="' + id + '">' +
      '<label class="field__label" for="sol-' + id + '">' + esc(etiqueta) + "</label>" +
      control +
      (ayuda ? '<p class="field__hint">' + esc(ayuda) + "</p>" : "") +
    "</div>";
  }

  function pintarPaso() {
    var p = PASOS[paso];
    var c = "";

    if (p.id === "idea") {
      c = campo("idea", "¿Qué quieres tatuarte?",
        '<textarea class="textarea" id="sol-idea" rows="6" data-in="idea" ' +
        'placeholder="Por ejemplo: una polilla de línea fina en el antebrazo interno, ' +
        'unos 8 cm, mirando hacia la muñeca. Es por mi abuela, que las coleccionaba.">' +
        esc(d.idea) + "</textarea>",
        "Cuanto más concreto, menos vueltas. Si no lo tienes claro del todo, " +
        "dinos lo que sí sabes y lo que no.");

      if (d.flash) {
        var f = null;
        for (var i = 0; i < S.flash.length; i++) if (S.flash[i].id === d.flash) f = S.flash[i];
        if (f) {
          c = '<div class="salida" style="margin-bottom:var(--s5)">' +
            '<p class="label" style="color:var(--plate-fg-3)">Vienes por un flash</p>' +
            '<p class="d4" style="margin-top:var(--s2)">' + esc(f.id) + " · " + esc(f.titulo) + "</p>" +
            '<p class="sm" style="margin-top:var(--s2);color:var(--plate-fg-2)">' +
              esc(N.artistaPor(f.artista).nombre) + " · " + f.cm + " cm · " +
              esc(N.euros(f.precio)) + " cerrado</p></div>" + c;
        }
      }
    }

    if (p.id === "pieza") {
      c = campo("zona", "¿Dónde va?",
          '<select class="select" id="sol-zona" data-in="zona">' +
            '<option value="">Elige zona</option>' +
            S.zonas.map(function (o) {
              return '<option value="' + esc(o.id) + '"' + (d.zona === o.id ? " selected" : "") +
                ">" + esc(o.nombre) + "</option>";
            }).join("") + "</select>") +
        campo("tamano", "¿De qué tamaño, más o menos?",
          '<select class="select" id="sol-tamano" data-in="tamano">' +
            '<option value="">Elige tamaño</option>' +
            S.estimador.tamanos.map(function (o) {
              return '<option value="' + esc(o.id) + '"' + (d.tamano === o.id ? " selected" : "") +
                ">" + esc(o.nombre) + " · " + esc(o.detalle) + "</option>";
            }).join("") + "</select>") +
        campo("estilo", "¿Estilo?",
          '<select class="select" id="sol-estilo" data-in="estilo">' +
            '<option value="">Aún no lo sé</option>' +
            S.estilos.map(function (o) {
              return '<option value="' + esc(o.id) + '"' + (d.estilo === o.id ? " selected" : "") +
                ">" + esc(o.nombre) + "</option>";
            }).join("") + "</select>") +
        '<div class="ops ops--2" style="margin-top:var(--s5)">' +
          S.estimador.color.map(function (o) {
            return '<label class="op"><input type="radio" name="sol-color" value="' + esc(o.id) +
              '" data-in="color"' + (d.color === o.id ? " checked" : "") + ">" +
              '<span class="op__caja"><span class="op__t">' + esc(o.nombre) + "</span></span></label>";
          }).join("") +
        "</div>" +
        '<label class="consiente" style="margin-top:var(--s5)">' +
          '<input type="checkbox" data-in="cobertura"' + (d.cobertura ? " checked" : "") + ">" +
          "<span>Es para tapar un tatuaje que ya tengo.</span></label>";
    }

    if (p.id === "refs") {
      c = '<div class="soltar" data-soltar tabindex="0" role="button" ' +
            'aria-label="Añadir referencias desde tu dispositivo">' +
            '<p class="sm">Arrastra imágenes aquí o pulsa para elegirlas</p>' +
            '<p class="xs">Hasta ' + MAX_REFS + '. JPG, PNG o WebP.</p>' +
          "</div>" +
          '<input type="file" accept="image/*" multiple data-refs-input hidden>' +
          '<p class="field__hint" data-refs-cuenta style="margin-top:var(--s3)"></p>' +
          '<div class="refs" data-refs role="list"></div>' +
          '<p class="xs fg-3" style="margin-top:var(--s4);max-width:52ch">' +
            'Las imágenes no se envían solas: WhatsApp no deja adjuntarlas desde ' +
            'un enlace. El mensaje dirá cuántas traes y tú las sueltas en el chat ' +
            'justo después. Te lo recordamos al final.</p>';
    }

    if (p.id === "cuando") {
      c = '<div class="field" data-campo="dias">' +
            '<p class="field__label" id="lab-dias">¿Qué días te vienen bien?</p>' +
            '<div class="ops ops--3" role="group" aria-labelledby="lab-dias">' +
              DIAS.map(function (dia) {
                return '<label class="op"><input type="checkbox" value="' + esc(dia) +
                  '" data-in="dias"' + (d.dias.indexOf(dia) !== -1 ? " checked" : "") + ">" +
                  '<span class="op__caja"><span class="op__t">' + esc(dia) + "</span></span></label>";
              }).join("") +
            "</div></div>" +
          '<div class="field" data-campo="franja" style="margin-top:var(--s5)">' +
            '<p class="field__label" id="lab-franja">¿A qué hora?</p>' +
            '<div class="ops ops--3" role="radiogroup" aria-labelledby="lab-franja">' +
              FRANJAS.map(function (f) {
                return '<label class="op"><input type="radio" name="sol-franja" value="' + esc(f.id) +
                  '" data-in="franja"' + (d.franja === f.id ? " checked" : "") + ">" +
                  '<span class="op__caja"><span class="op__t">' + esc(f.nombre) + "</span>" +
                  '<span class="op__d num">' + esc(f.detalle) + "</span></span></label>";
              }).join("") +
            "</div></div>" +
          campo("desde", "A partir de cuándo",
            '<input class="input num" id="sol-desde" type="date" data-in="desde" value="' +
              esc(d.desde) + '">',
            "Déjalo vacío si te vale cualquier fecha.");
    }

    if (p.id === "cuanto") {
      c = campo("presupuesto", "Tu presupuesto máximo",
          '<input class="input num" id="sol-presupuesto" type="number" inputmode="numeric" ' +
          'min="' + S.estimador.minimoEstudio + '" step="10" data-in="presupuesto" ' +
          'placeholder="400" value="' + esc(d.presupuesto) + '">',
          "En euros, para la pieza entera. No es para apretarte: es para no " +
          "proponerte algo que no te encaja.") +
        campo("artista", "Artista, si tienes preferencia",
          '<select class="select" id="sol-artista" data-in="artista">' +
            '<option value="">El que mejor encaje</option>' +
            S.artistas.map(function (a) {
              return '<option value="' + esc(a.slug) + '"' + (d.artista === a.slug ? " selected" : "") +
                ">" + esc(a.nombre) + " · " + esc(a.estilo) + "</option>";
            }).join("") + "</select>",
          "Si no lo sabes, déjanos elegir: por estilo casi siempre está claro.");

      if (d.estimacion && d.estimacion.completo) {
        c += '<div class="salida" style="margin-top:var(--s6)">' +
          '<p class="label" style="color:var(--plate-fg-3)">Lo que dijo el estimador</p>' +
          '<p class="salida__cifra">' + esc(N.euros(d.estimacion.bajo)) + " – " +
            esc(N.euros(d.estimacion.alto)) + "</p>" +
          '<p class="salida__aviso">' + d.estimacion.sesiones +
            (d.estimacion.sesiones === 1 ? " sesión" : " sesiones") +
            ". " + esc(S.studio.avisoPresupuesto) + "</p></div>";
      }
    }

    if (p.id === "revisar") {
      c = '<dl class="resumen">' + resumenFilas().map(function (f) {
            return '<div class="resumen__fila"><dt>' + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>";
          }).join("") + "</dl>" +
        '<label class="consiente" data-consiente-caja style="margin-top:var(--s6)">' +
          '<input type="checkbox" data-consiente data-in="consiente"' +
            (d.consiente ? " checked" : "") + ">" +
          "<span>" + esc(S.studio.consentimiento) + "</span></label>" +
        '<p class="field__error" data-consiente-error role="alert" hidden></p>' +
        (d.refs.length
          ? '<p class="sm fg-2" style="margin-top:var(--s5);max-width:52ch">' +
            "Acuérdate: al abrir WhatsApp, suelta tus " + d.refs.length +
            " imágenes en el chat justo después de mandar el mensaje.</p>"
          : "") +
        '<p class="xs fg-3" style="margin-top:var(--s4);max-width:52ch">' +
          esc(S.textos.reservar.cierre) + "</p>";
    }

    $("[data-paso-sol]", raiz).innerHTML =
      '<h3 class="paso__pregunta">' + esc(p.titulo) + "</h3>" + c;

    $$("[data-marca-sol]", raiz).forEach(function (m, i) {
      m.toggleAttribute("data-hecho", i < paso);
      m.toggleAttribute("data-actual", i === paso);
    });
    $("[data-cuenta-sol]", raiz).textContent = "Paso " + (paso + 1) + " de " + PASOS.length;
    $("[data-atras-sol]", raiz).disabled = paso === 0;
    $("[data-siguiente-sol]", raiz).hidden = paso === PASOS.length - 1;
    $("[data-enviar]", raiz).hidden = paso !== PASOS.length - 1;

    if (p.id === "refs") { pintarRefs(); conectarRefs(); }
  }

  function resumenFilas() {
    var z = porId(S.zonas, d.zona), e = porId(S.estilos, d.estilo);
    var a = d.artista ? N.artistaPor(d.artista) : null;
    var fr = porId(FRANJAS, d.franja);
    var filas = [
      ["Idea", d.idea.trim() || "—"],
      ["Zona", z ? z.nombre : "—"],
      ["Tamaño", nombreTamano(d.tamano) || "—"],
      ["Estilo", e ? e.nombre : "Sin decidir"],
      ["Tinta", d.color === "color" ? "A color" : "Negro y grises"]
    ];
    if (d.cobertura) filas.push(["Cobertura", "Sí, tapa un tatuaje anterior"]);
    if (d.flash) filas.push(["Flash", d.flash]);
    filas.push(["Disponible", (d.dias.length ? d.dias.join(", ") : "—") +
      (fr ? " · " + fr.nombre.toLowerCase() : "") +
      (d.desde ? " · desde el " + N.fechaLarga(d.desde) : "")]);
    filas.push(["Presupuesto", d.presupuesto ? N.euros(Number(d.presupuesto)) + " máximo" : "—"]);
    filas.push(["Artista", a ? a.nombre : "El que mejor encaje"]);
    filas.push(["Referencias", d.refs.length ? d.refs.length + " imágenes" : "Ninguna"]);
    return filas;
  }

  /* --- referencias: arrastre y teclado --------------------------------------------- */

  function conectarRefs() {
    var zona = $("[data-soltar]", raiz);
    var input = $("[data-refs-input]", raiz);
    var caja = $("[data-refs]", raiz);
    if (!zona || !input || !caja) return;

    zona.addEventListener("click", function () { input.click(); });
    zona.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); input.click(); }
    });
    input.addEventListener("change", function () { anadirRefs(this.files); this.value = ""; });

    ["dragenter", "dragover"].forEach(function (t) {
      zona.addEventListener(t, function (ev) { ev.preventDefault(); zona.setAttribute("data-encima", ""); });
    });
    ["dragleave", "drop"].forEach(function (t) {
      zona.addEventListener(t, function () { zona.removeAttribute("data-encima"); });
    });
    zona.addEventListener("drop", function (ev) {
      ev.preventDefault();
      if (ev.dataTransfer && ev.dataTransfer.files) anadirRefs(ev.dataTransfer.files);
    });

    caja.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-quitar]");
      if (!b) return;
      var i = Number(b.dataset.quitar);
      URL.revokeObjectURL(d.refs[i].url);
      d.refs.splice(i, 1);
      pintarRefs();
    });

    /* Reordenar arrastrando. En movil el drag-and-drop de HTML no existe, asi
       que ademas hay teclado: Control con las flechas.                       */
    var origen = null;
    caja.addEventListener("dragstart", function (ev) {
      var f = ev.target.closest("[data-ref]");
      if (!f) return;
      origen = Number(f.dataset.ref);
      f.setAttribute("data-arrastrando", "");
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData("text/plain", String(origen));
    });
    caja.addEventListener("dragover", function (ev) {
      ev.preventDefault();
      var f = ev.target.closest("[data-ref]");
      $$("[data-ref]", caja).forEach(function (x) { x.removeAttribute("data-encima"); });
      if (f) f.setAttribute("data-encima", "");
    });
    caja.addEventListener("drop", function (ev) {
      ev.preventDefault();
      var f = ev.target.closest("[data-ref]");
      if (f && origen !== null) moverRef(origen, Number(f.dataset.ref));
      origen = null;
    });
    caja.addEventListener("dragend", function () {
      $$("[data-ref]", caja).forEach(function (x) {
        x.removeAttribute("data-encima"); x.removeAttribute("data-arrastrando");
      });
      origen = null;
    });

    caja.addEventListener("keydown", function (ev) {
      var f = ev.target.closest("[data-ref]");
      if (!f || !(ev.ctrlKey || ev.metaKey)) return;
      var i = Number(f.dataset.ref);
      if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") { ev.preventDefault(); moverRef(i, i - 1); }
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") { ev.preventDefault(); moverRef(i, i + 1); }
    });
  }

  /* --- mensaje de WhatsApp ---------------------------------------------------------- */

  function mensaje() {
    var l = [];
    l.push("SOLICITUD DE CITA · " + S.studio.nombre);
    l.push("");
    resumenFilas().forEach(function (f) {
      if (f[0] === "Idea") { l.push("IDEA"); l.push(f[1]); l.push(""); return; }
      l.push(f[0].toUpperCase() + ": " + f[1]);
    });
    if (d.estimacion && d.estimacion.completo) {
      l.push("");
      l.push("ESTIMADOR DE LA WEB: " + N.euros(d.estimacion.bajo) + " – " +
        N.euros(d.estimacion.alto) + ", " + d.estimacion.sesiones +
        (d.estimacion.sesiones === 1 ? " sesión" : " sesiones"));
    }
    if (d.refs.length) {
      l.push("");
      l.push("(Te mando " + d.refs.length + " referencias justo después de este mensaje.)");
    }
    l.push("");
    l.push("He leído y acepto el consentimiento informado de la web.");
    return l.join("\n");
  }

  /* --- montaje ----------------------------------------------------------------------- */

  raiz.innerHTML =
    '<div class="pasos">' +
      '<div class="pasos__barra" aria-hidden="true">' +
        PASOS.map(function () { return '<span class="pasos__marca" data-marca-sol></span>'; }).join("") +
      "</div>" +
      '<div class="paso" data-paso-sol></div>' +
      '<div class="pasos__pie">' +
        '<p class="pasos__cuenta" data-cuenta-sol role="status"></p>' +
        '<div class="pasos__nav">' +
          '<button class="btn" type="button" data-atras-sol>Atrás</button>' +
          '<button class="btn btn--stamp" type="button" data-siguiente-sol>Siguiente</button>' +
          '<button class="btn btn--stamp" type="button" data-enviar hidden>Abrir WhatsApp con todo escrito</button>' +
        "</div>" +
      "</div>" +
    "</div>";

  $("[data-atras-sol]", raiz).addEventListener("click", function () {
    if (paso > 0) { paso--; pintarPaso(); }
  });
  $("[data-siguiente-sol]", raiz).addEventListener("click", function () {
    if (!validar()) return;
    if (paso < PASOS.length - 1) { paso++; pintarPaso(); }
  });

  $("[data-enviar]", raiz).addEventListener("click", function () {
    if (!validar()) return;
    var url = "https://wa.me/" + S.studio.whatsapp + "?text=" + encodeURIComponent(mensaje());
    window.open(url, "_blank", "noopener");
  });

  raiz.addEventListener("input", recoger);
  raiz.addEventListener("change", recoger);

  function recoger(ev) {
    var t = ev.target;
    var k = t.getAttribute("data-in");
    if (!k) return;
    if (k === "dias") {
      d.dias = $$('[data-in="dias"]:checked', raiz).map(function (x) { return x.value; });
    } else if (t.type === "checkbox") {
      d[k] = t.checked;
    } else {
      d[k] = t.value;
    }
  }

  /* --- entradas desde otras partes de la web ------------------------------------------ */

  var q = new URLSearchParams(location.search);
  if (q.get("artista") && N.artistaPor(q.get("artista"))) d.artista = q.get("artista");
  if (q.get("flash")) {
    d.flash = q.get("flash");
    for (var i = 0; i < S.flash.length; i++) {
      if (S.flash[i].id === d.flash) {
        var f = S.flash[i];
        d.idea = "Quiero el flash " + f.id + ", " + f.titulo + ", tal cual está dibujado.";
        d.artista = f.artista;
        d.presupuesto = String(f.precio);
        break;
      }
    }
  }
  if (q.get("hueco")) {
    var partes = q.get("hueco").split("_");
    d.desde = partes[0] || "";
    d.idea = d.idea || "Vengo por el hueco libre del " + (partes[0] || "") +
      (partes[1] ? " a las " + partes[1] : "") + ".";
  }

  /* El estimador manda aqui lo que ya ha contestado el usuario. Repetir las
     mismas preguntas dos veces es la forma mas rapida de perder a alguien.   */
  window.addEventListener("nigredo:estimacion", function (ev) {
    var e = ev.detail.est, c = ev.detail.calculo;
    if (e.zona) d.zona = e.zona;
    if (e.tamano) d.tamano = e.tamano;
    if (e.estilo) d.estilo = e.estilo;
    if (e.color) d.color = e.color;
    if (e.artista) d.artista = e.artista;
    d.cobertura = !!e.cobertura;
    d.estimacion = c;
    if (c && c.completo && !d.presupuesto) d.presupuesto = String(c.alto);
    pintarPaso();
  });

  pintarPaso();
})();

/* =============================================================================
   NIGREDO · LISTA DE CANCELACIONES
   Formulario corto: nombre, telefono y cuando puedes. Sale por el mismo canal.
   ========================================================================== */

(function () {
  "use strict";
  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, $$ = N.$$, esc = N.esc;

  var raiz = $("[data-espera]");
  if (!raiz) return;

  raiz.innerHTML =
    '<p class="body fg-2" style="max-width:52ch">' + esc(S.listaEspera.texto) + "</p>" +
    '<p class="xs fg-3" style="margin-top:var(--s3)">' + esc(S.listaEspera.aviso) + "</p>" +
    '<div style="margin-top:var(--s6);max-width:34rem">' +
      '<div class="field" data-campo="esp-nombre">' +
        '<label class="field__label" for="esp-nombre">Tu nombre</label>' +
        '<input class="input" id="esp-nombre" type="text" autocomplete="name" data-esp="nombre">' +
      "</div>" +
      '<div class="field" data-campo="esp-aviso">' +
        '<label class="field__label" for="esp-aviso">\u00BFCon cu\u00E1nto margen puedes venir?</label>' +
        '<select class="select" id="esp-aviso" data-esp="margen">' +
          '<option value="El mismo d\u00EDa">El mismo d\u00EDa</option>' +
          '<option value="Con un d\u00EDa">Con un d\u00EDa de aviso</option>' +
          '<option value="Con una semana">Con una semana</option>' +
        "</select>" +
      "</div>" +
      '<div class="field" data-campo="esp-idea">' +
        '<label class="field__label" for="esp-idea">Qu\u00E9 te quieres hacer</label>' +
        '<textarea class="textarea" id="esp-idea" rows="3" data-esp="idea" ' +
          'placeholder="Una l\u00EDnea basta. Si ya nos escribiste antes, dilo."></textarea>' +
      "</div>" +
      '<button class="btn btn--stamp btn--wide" type="button" style="margin-top:var(--s5)" data-esp-enviar>' +
        "Apuntarme por WhatsApp</button>" +
      '<p class="xs fg-3" role="status" style="margin-top:var(--s3)" data-esp-aviso></p>' +
    "</div>";

  $("[data-esp-enviar]", raiz).addEventListener("click", function () {
    var v = {};
    $$("[data-esp]", raiz).forEach(function (c) { v[c.getAttribute("data-esp")] = c.value.trim(); });

    var f = $('[data-campo="esp-nombre"]', raiz);
    f.removeAttribute("data-invalid");
    var err = f.querySelector(".field__error");
    if (err) err.remove();

    if (!v.nombre) {
      f.setAttribute("data-invalid", "");
      var p = document.createElement("p");
      p.className = "field__error";
      p.textContent = "Dinos c\u00F3mo te llamas, aunque sea solo el nombre.";
      f.appendChild(p);
      $("#esp-nombre", raiz).focus();
      return;
    }

    var texto = [
      "LISTA DE CANCELACIONES \u00B7 " + S.studio.nombre,
      "",
      "NOMBRE: " + v.nombre,
      "MARGEN: " + v.margen,
      "IDEA: " + (v.idea || "A\u00FAn por concretar")
    ].join("\n");

    window.open("https://wa.me/" + S.studio.whatsapp + "?text=" + encodeURIComponent(texto),
      "_blank", "noopener");
    $("[data-esp-aviso]", raiz).textContent =
      "Abierto WhatsApp con el mensaje escrito. Solo tienes que darle a enviar.";
  });
})();
