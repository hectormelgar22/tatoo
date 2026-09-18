/* =============================================================================
   NIGREDO · CUIDADOS
   Linea de tiempo navegable (patron de pestanas ARIA) y generador de archivo
   .ics con los hitos, para que el calendario del cliente avise por si solo.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var $ = N.$, $$ = N.$$, esc = N.esc;

  var C = S.cuidados;
  var pista = $("[data-linea]");
  var panels = $("[data-fases]");
  if (!pista || !panels) return;

  /* --- pestanas ------------------------------------------------------------- */

  pista.innerHTML = C.fases.map(function (f, i) {
    return '<button class="linea__hito" role="tab" type="button"' +
      ' id="hito-' + esc(f.id) + '"' +
      ' aria-controls="fase-' + esc(f.id) + '"' +
      ' aria-selected="' + (i === 0) + '"' +
      ' tabindex="' + (i === 0 ? "0" : "-1") + '">' +
      esc(f.etiqueta) + "</button>";
  }).join("");

  function listaHTML(titulo, items, clase) {
    if (!items || !items.length) return "";
    return "<div>" +
      '<p class="label">' + esc(titulo) + "</p>" +
      '<ul class="lista lista--' + clase + '" role="list">' +
        items.map(function (t) { return "<li><span>" + esc(t) + "</span></li>"; }).join("") +
      "</ul></div>";
  }

  panels.innerHTML = C.fases.map(function (f, i) {
    return '<section class="fase" role="tabpanel"' +
      ' id="fase-' + esc(f.id) + '"' +
      ' aria-labelledby="hito-' + esc(f.id) + '"' +
      ' tabindex="0"' + (i === 0 ? "" : " hidden") + ">" +
      '<h3 class="visually-hidden">' + esc(f.etiqueta) + " · " + esc(f.titulo) + "</h3>" +
      '<p class="fase__resumen">' + esc(f.resumen) + "</p>" +
      '<div class="fase__cols">' +
        listaHTML("Hacer", f.hacer, "hacer") +
        listaHTML("Evitar", f.evitar, "evitar") +
        listaHTML("Señal de alarma", f.alarma, "alarma") +
      "</div></section>";
  }).join("");

  var hitos = $$(".linea__hito", pista);
  var fases = $$(".fase", panels);

  function elegir(i, mover) {
    hitos.forEach(function (h, j) {
      var activo = i === j;
      h.setAttribute("aria-selected", String(activo));
      h.tabIndex = activo ? 0 : -1;
      fases[j].hidden = !activo;
    });
    if (mover) {
      hitos[i].focus();
      /* Se centra el hito elegido dentro de su carril, sin mover la pagina. */
      hitos[i].scrollIntoView({ block: "nearest", inline: "center",
        behavior: N.quieto() ? "auto" : "smooth" });
    }
  }

  pista.addEventListener("click", function (ev) {
    var b = ev.target.closest(".linea__hito");
    if (b) elegir(hitos.indexOf(b), false);
  });

  /* Flechas, Inicio y Fin: es lo que espera quien navega con teclado en un
     grupo de pestanas, y no cuesta nada darlo.                              */
  pista.addEventListener("keydown", function (ev) {
    var i = hitos.indexOf(document.activeElement);
    if (i === -1) return;
    var n = hitos.length, d = null;
    if (ev.key === "ArrowRight") d = (i + 1) % n;
    if (ev.key === "ArrowLeft") d = (i - 1 + n) % n;
    if (ev.key === "Home") d = 0;
    if (ev.key === "End") d = n - 1;
    if (d === null) return;
    ev.preventDefault();
    elegir(d, true);
  });

  /* --- archivo .ics ---------------------------------------------------------- */

  function dosDigitos(n) { return String(n).padStart(2, "0"); }

  function fechaICS(d) {
    return d.getUTCFullYear() + dosDigitos(d.getUTCMonth() + 1) + dosDigitos(d.getUTCDate());
  }
  function selloICS(d) {
    return fechaICS(d) + "T" + dosDigitos(d.getUTCHours()) +
      dosDigitos(d.getUTCMinutes()) + dosDigitos(d.getUTCSeconds()) + "Z";
  }

  /* El formato exige escapar estos cuatro caracteres. Sin esto, una coma en
     una nota parte el campo y el evento entra roto o no entra.               */
  function escICS(s) {
    return String(s)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  /* Plegado a 75 octetos con continuacion por espacio, como manda el RFC.
     Se cuenta en bytes, no en caracteres: una tilde ocupa dos.              */
  function plegar(linea) {
    var bytes = new TextEncoder().encode(linea);
    if (bytes.length <= 75) return linea;
    var out = [], trozo = "", len = 0, limite = 75;
    for (var i = 0; i < linea.length; i++) {
      var c = linea[i];
      var b = new TextEncoder().encode(c).length;
      if (len + b > limite) {
        out.push(trozo);
        trozo = " " + c;
        len = 1 + b;
        limite = 74;
      } else {
        trozo += c;
        len += b;
      }
    }
    out.push(trozo);
    return out.join("\r\n");
  }

  function construirICS(inicio) {
    var ahora = new Date();
    var l = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//" + S.studio.nombre + "//Cuidados//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:" + escICS(C.recordatorios.titulo + " · " + S.studio.nombre)
    ];

    C.recordatorios.hitos.forEach(function (h, i) {
      var d = new Date(inicio.getTime());
      d.setUTCDate(d.getUTCDate() + h.dias);
      var fin = new Date(d.getTime());
      fin.setUTCDate(fin.getUTCDate() + 1);

      l.push("BEGIN:VEVENT");
      l.push("UID:nigredo-cuidados-" + h.dias + "-" + inicio.getTime() + "-" + i + "@nigredo");
      l.push("DTSTAMP:" + selloICS(ahora));
      l.push("DTSTART;VALUE=DATE:" + fechaICS(d));
      l.push("DTEND;VALUE=DATE:" + fechaICS(fin));
      l.push("SUMMARY:" + escICS(h.titulo));
      l.push("DESCRIPTION:" + escICS(h.nota + "\n\n" + S.studio.nombreCompleto +
        " · " + S.studio.direccion.calle + ", " + S.studio.direccion.ciudad));
      l.push("TRANSP:TRANSPARENT");
      /* Aviso a las 10:00 del propio dia, no a medianoche. */
      l.push("BEGIN:VALARM");
      l.push("TRIGGER:PT10H");
      l.push("ACTION:DISPLAY");
      l.push("DESCRIPTION:" + escICS(h.titulo));
      l.push("END:VALARM");
      l.push("END:VEVENT");
    });

    l.push("END:VCALENDAR");
    return l.map(plegar).join("\r\n") + "\r\n";
  }

  var campoFecha = $("[data-ics-fecha]");
  var botonICS = $("[data-ics]");
  var avisoICS = $("[data-ics-aviso]");

  if (campoFecha) {
    var hoy = new Date();
    campoFecha.value = hoy.getFullYear() + "-" + dosDigitos(hoy.getMonth() + 1) +
      "-" + dosDigitos(hoy.getDate());
    campoFecha.max = new Date(hoy.getTime() + 180 * 864e5).toISOString().slice(0, 10);
  }

  if (botonICS) {
    botonICS.addEventListener("click", function () {
      var v = campoFecha && campoFecha.value;
      if (!v) {
        avisoICS.textContent = "Pon la fecha de tu sesión y te montamos los avisos.";
        campoFecha.focus();
        return;
      }
      var partes = v.split("-");
      var inicio = new Date(Date.UTC(+partes[0], +partes[1] - 1, +partes[2]));

      var blob = new Blob([construirICS(inicio)], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "cuidados-nigredo.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      /* Sin revocar, el blob se queda en memoria toda la sesion. */
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);

      avisoICS.textContent = C.recordatorios.hitos.length +
        " avisos descargados. Ábrelo y se añaden a tu calendario.";
    });
  }
})();

/* Textos de la seccion, tambien desde content.js. */
(function () {
  var S = window.STUDIO, N = window.NIGREDO;
  if (!S || !N) return;
  var set = function (sel, html) { var n = N.$(sel); if (n) n.innerHTML = html; };
  set("[data-urgencia]",
    '<p class="alarma__titulo">' + N.esc(S.cuidados.urgencia.titulo) + "</p>" +
    "<p>" + N.esc(S.cuidados.urgencia.texto) + "</p>");
  set("[data-rec-titulo]", N.esc(S.cuidados.recordatorios.titulo));
  set("[data-rec-texto]", N.esc(S.cuidados.recordatorios.texto));
  var b = N.$("[data-ics]");
  if (b) b.textContent = S.cuidados.recordatorios.boton;
})();
