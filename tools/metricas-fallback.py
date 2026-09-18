#!/usr/bin/env python3
"""
NIGREDO · recalcula las metricas de las fuentes de reserva.

Uso:  python tools/metricas-fallback.py

Compara las tablas de Bodoni Moda y Archivo con las de Times New Roman y
Arial, y escupe los porcentajes de `size-adjust`, `ascent-override`,
`descent-override` y `line-gap-override` que hay que pegar en css/base.css.

Sirve para que el cambio de la fuente de sistema a la real no mueva ni un
pixel. Sin esto, `font-display: swap` recoloca toda la pagina al cargar y el
CLS se va a 1,0.

Solo hay que volver a ejecutarlo si se cambia alguna de las dos fuentes.
Requiere: fonttools  ·  pip install fonttools brotli
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import os, sys
from fontTools.ttLib import TTFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def metricas(ruta, peso=None):
    f = TTFont(ruta, fontNumber=0)
    # Una fuente variable mide distinto en cada peso, y su instancia por
    # defecto no tiene por que ser la que usa la web. Archivo viene con
    # wght=600 por defecto y el cuerpo del sitio se pinta a 400: calcular
    # sobre el defecto da un 8 % de error y el texto salta igual.
    if peso is not None and "fvar" in f:
        from fontTools.varLib import instancer
        f = instancer.instantiateVariableFont(f, {"wght": peso}, inplace=False)
    upm = f["head"].unitsPerEm
    hhea, os2 = f["hhea"], f["OS/2"]
    asc, desc, gap = os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap
    if not (getattr(os2, "fsSelection", 0) & (1 << 7)):
        asc, desc, gap = hhea.ascent, hhea.descent, hhea.lineGap
    cmap, hmtx = f.getBestCmap(), f["hmtx"]
    anchos = [hmtx.metrics[cmap[ord(c)]][0]
              for c in "abcdefghijklmnopqrstuvwxyz " if ord(c) in cmap]
    return dict(asc=asc / upm, desc=desc / upm, gap=gap / upm,
                ancho=sum(anchos) / len(anchos) / upm)

WIN = r"C:\Windows\Fonts"
# El peso es el que usa la web de verdad: titulares a 500, cuerpo a 400.
PARES = [
    ("Bodoni fallback", os.path.join(RAIZ, "assets/fonts/bodoni-moda-var.woff2"),
     os.path.join(WIN, "times.ttf"), 500),
    ("Archivo fallback", os.path.join(RAIZ, "assets/fonts/archivo-var.woff2"),
     os.path.join(WIN, "arial.ttf"), 400),
]

for nombre, real, reserva, peso in PARES:
    if not os.path.exists(reserva):
        sys.exit(f"No encuentro {reserva}. En macOS o Linux usa la ruta de Times/Arial de tu sistema.")
    r, f = metricas(real, peso), metricas(reserva)
    aj = r["ancho"] / f["ancho"]
    print(f"\n@font-face {{ /* {nombre} */")
    print(f"  size-adjust: {aj * 100:.2f}%;")
    print(f"  ascent-override: {r['asc'] / aj * 100:.2f}%;")
    print(f"  descent-override: {abs(r['desc']) / aj * 100:.2f}%;")
    print(f"  line-gap-override: {r['gap'] / aj * 100:.2f}%;")
    print("}")
