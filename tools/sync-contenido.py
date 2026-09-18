#!/usr/bin/env python3
"""
NIGREDO · vuelca el contenido de content.js dentro del HTML.

Uso:  python tools/sync-contenido.py          (todas las páginas)
      python tools/sync-contenido.py index    (solo una)
      python tools/sync-contenido.py --check   (no escribe; solo dice qué cambiaría)

QUÉ HACE Y POR QUÉ
------------------
Todo el texto de la web sale de js/content.js, así que el HTML se publica con
los huecos vacíos y el navegador los rellena. Eso tiene tres costes:

1. La página pinta vacía y salta al rellenarse. Es un desplazamiento de
   maquetación, y CLS es una de las métricas con las que Google posiciona.
2. El texto no está en el código fuente. Google ejecuta JavaScript, pero
   muchos otros rastreadores y previsualizadores no.
3. Sin JavaScript la web no muestra nada.

Esta herramienta abre cada página en un navegador, deja que el JavaScript haga
su trabajo, y guarda el resultado de vuelta en el archivo HTML. A partir de ahí
el contenido está en el código fuente y el navegador solo se encarga de lo que
es de verdad interactivo.

NO es un paso de compilación. Vercel sigue sirviendo archivos estáticos tal
cual. Es una herramienta de autoría, como fetch-images.py: se ejecuta cuando
cambias content.js, igual que fetch-images.py se ejecuta cuando cambias una
foto.

ES IDEMPOTENTE. Todos los módulos de JavaScript reemplazan el contenido de su
contenedor (`innerHTML = ...`), nunca lo añaden. Volver a ejecutarla sobre una
página ya volcada da el mismo resultado, y si has editado content.js, el nuevo.

LO QUE NO SE VUELCA
-------------------
Hay cosas que dependen de quién mira y cuándo, y volcarlas sería congelarlas:

· La franja de verificación de edad, que depende de si esa persona ya contestó.
· El estado en vivo de la galería: posiciones de la mampostería, filtros
  aplicados, qué plancha está revelada.
· Lo que viene de la URL (?flash=, ?artista=, ?hueco=).

Todo eso se limpia antes de guardar y lo vuelve a poner el navegador.

AVISO SOBRE LOS HUECOS LIBRES
-----------------------------
La portada oculta los huecos por cancelación cuya fecha ya pasó. Al volcar, esa
lista queda congelada en el día en que ejecutaste la herramienta. El JavaScript
la recalcula al cargar, así que el visitante siempre ve lo correcto, pero el
código fuente puede quedarse desfasado. Si cambias `huecos`, vuelve a ejecutar.

Requiere: Chrome o Edge instalado. Nada más.
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import http.server
import os
import re
import socketserver
import subprocess
import threading
import time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUERTO = 8781
PAGINAS = ["index", "galeria", "artistas", "cuidados", "reservar"]

NAVEGADORES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]


def navegador():
    for c in NAVEGADORES:
        if os.path.exists(c):
            return c
    sys.exit("No encuentro Chrome ni Edge. Instala uno de los dos y vuelve a intentarlo.")


# --- servidor temporal --------------------------------------------------------

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def arrancar_servidor():
    os.chdir(RAIZ)
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(("127.0.0.1", PUERTO), Silencioso)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


# --- limpieza del DOM volcado -------------------------------------------------
# Cada regla quita algo que depende de quién mira o de en qué momento, y que el
# navegador vuelve a poner al cargar. Si añades una, explica por qué aquí.

# Si el volcado contiene alguno de estos textos, algo que se carga de forma
# asincrona no llego a tiempo y la pagina esta incompleta. Volcarla asi
# congelaria un mensaje de error en el codigo fuente.
INCOMPLETO = [
    "No se ha podido cargar la l",   # laminas de flash
    "No se ha podido cargar el mapa",  # mapa corporal del estimador
]


LIMPIEZAS = [
    # La franja de edad depende de localStorage de cada visitante.
    (r'<aside class="edad[^"]*"[\s\S]*?</aside>\s*', "", "franja de edad"),

    # El centinela del borde de scroll lo crea el script; volcarlo no aporta.
    (r'<div aria-hidden="true" class="nav__centinela"></div>\s*', "", "centinela de scroll"),

    # Posiciones de la mampostería: se recalculan según el ancho de pantalla.
    (r'(<article class="plancha"[^>]*?) style="[^"]*"', r"\1", "posiciones de mampostería"),
    (r'(<div class="masonry"[^>]*?) style="height: [^"]*"', r"\1", "altura de mampostería"),
    (r' data-colocada=""', "", "marca de retícula colocada"),
    (r' data-animar=""', "", "marca de animación"),

    # Estado del revelado de plancha: es de scroll, no de contenido.
    (r' data-revelar="(?:espera|hecho)"', " data-revelar", "estado del revelado"),
    (r'(<[^>]*data-revelar[^>]*?) style="transition-delay: [^"]*"', r"\1", "retardos del revelado"),

    # `inert` lo pone el filtrado de la galería.
    (r' inert=""', "", "atributo inert"),
]


def limpiar(html):
    quitados = []
    for patron, reemplazo, nombre in LIMPIEZAS:
        html, n = re.subn(patron, reemplazo, html)
        if n:
            quitados.append(f"{nombre} ({n})")
    return html, quitados


def normalizar(html):
    """Para comparar dos versiones sin que el espacio en blanco moleste."""
    return re.sub(r"\s+", " ", html).strip()


# --- volcado ------------------------------------------------------------------

def una_pasada(nombre):
    """Un volcado del navegador. Puede salir incompleto: hay contenido que
    llega por `fetch` (las láminas de flash) y a veces no da tiempo."""
    return subprocess.run(
        [navegador(), "--headless=new", "--disable-gpu", "--no-sandbox",
         "--virtual-time-budget=9000", "--dump-dom",
         f"http://127.0.0.1:{PUERTO}/{nombre}.html"],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    ).stdout


def volcar(nombre, comprobar=False):
    destino = os.path.join(RAIZ, nombre + ".html")
    if not os.path.exists(destino):
        print(f"  {nombre}.html no existe, se salta")
        return False

    # Se vuelca hasta que dos pasadas seguidas coinciden. Sin esto, el
    # resultado depende de si las peticiones asíncronas llegaron a tiempo, y
    # la herramienta escribiría una versión distinta cada vez.
    intentos, previo, salida = [], None, None
    for _ in range(4):
        actual = una_pasada(nombre)
        if actual and "</html>" in actual and not any(x in actual for x in INCOMPLETO):
            intentos.append(actual)
            if previo is not None and normalizar(previo) == normalizar(actual):
                salida = actual
                break
            previo = actual

    if salida is None:
        if not intentos:
            print(f"  {nombre}.html: el navegador no devolvió nada. ¿Lo bloquea el antivirus?")
            return False
        # Ninguna pareja coincidió: se queda la más completa y se avisa.
        salida = max(intentos, key=len)
        print(f"  {nombre}.html: las pasadas no coincidieron; se usa la más completa.")

    if any(x in salida for x in INCOMPLETO):
        print(f"  {nombre}.html: el volcado salió incompleto en los cuatro intentos. No se toca.")
        return False

    # Nada del volcado puede llevar la dirección de este servidor. Si la lleva,
    # es que algún script compone una URL con `location.origin`, y volcarla
    # publicaría la web apuntando a un localhost que no existe fuera de aquí.
    if f"127.0.0.1:{PUERTO}" in salida:
        print(f"  {nombre}.html: el volcado lleva la dirección del servidor local.")
        print("      Algún script usa location.origin. Debe salir de content.js. No se toca.")
        return False

    # Comprobación de que el JavaScript llegó a ejecutarse: si la barra sigue
    # vacía, algo falló y volcar la página así la dejaría peor que antes.
    if 'class="nav__marca"' not in salida:
        print(f"  {nombre}.html: el script no llegó a rellenar la página. No se toca.")
        return False

    limpio, quitados = limpiar(salida)
    if not limpio.startswith("<!DOCTYPE"):
        limpio = "<!DOCTYPE html>\n" + limpio

    # Aviso para quien abra el archivo: el texto de aquí es una copia.
    aviso = (
        "<!DOCTYPE html>\n"
        "<!-- El texto de esta página se vuelca desde js/content.js con\n"
        "     python tools/sync-contenido.py\n"
        "     Edítalo allí, no aquí: al volver a volcar se sobrescribe. -->"
    )
    limpio = limpio.replace("<!DOCTYPE html>", aviso, 1)
    limpio = limpio.rstrip() + "\n"

    antes = open(destino, encoding="utf-8").read()
    if normalizar(antes) == normalizar(limpio):
        print(f"  {nombre}.html sin cambios")
        return False

    crece = len(limpio) - len(antes)
    detalle = f"{len(antes):,} → {len(limpio):,} bytes ({crece:+,})".replace(",", ".")
    if comprobar:
        print(f"  {nombre}.html cambiaría · {detalle}")
        return True

    open(destino, "w", encoding="utf-8", newline="\n").write(limpio)
    print(f"  {nombre}.html volcado · {detalle}")
    if quitados:
        print(f"      limpiado: {', '.join(quitados)}")
    return True


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    comprobar = "--check" in sys.argv
    paginas = args or PAGINAS

    srv = arrancar_servidor()
    time.sleep(0.4)
    print(("Comprobando" if comprobar else "Volcando") +
          f" el contenido de content.js en {len(paginas)} página(s)\n")
    try:
        cambiadas = sum(volcar(p, comprobar) for p in paginas)
    finally:
        srv.shutdown()

    print()
    if comprobar:
        print(f"{cambiadas} página(s) cambiarían. Ejecuta sin --check para escribirlas.")
    elif cambiadas:
        print(f"{cambiadas} página(s) actualizadas. El contenido ya está en el código fuente.")
    else:
        print("Todo estaba al día.")


if __name__ == "__main__":
    main()
