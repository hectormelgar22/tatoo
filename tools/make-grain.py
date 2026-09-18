#!/usr/bin/env python3
"""
NIGREDO · genera la tesela de grano y la incrusta en css/base.css.

Uso:  python tools/make-grain.py

Una tesela de 128 px que se repite en un pseudo-elemento fijo con
`mix-blend-mode: overlay`. El gris medio es neutro y las desviaciones empujan
luz y sombra, asi que el grano funciona igual sobre tinta que sobre papel.

Dos decisiones que parecen raras y no lo son:

· El ruido se cuantiza a siete niveles. El ruido puro no comprime y la tesela
  pesaria cuatro veces mas sin que se note ninguna diferencia.

· Va incrustada en el CSS como data URI en vez de ser un archivo suelto. Si
  llega por red, llega tarde; y como la capa del grano es fija y lleva
  mix-blend-mode, al componerse a destiempo Chrome contabiliza el viewport
  entero como desplazado. Medido: CLS de 1,0, que es la peor nota posible.
  Incrustada ya esta ahi en el primer pintado, y ademas ahorra una peticion.

Escribe entre los marcadores GRANO:INICIO y GRANO:FIN de css/base.css.
Requiere: pillow
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import base64, io, os, random
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(RAIZ, "css", "base.css")
INICIO = "/* GRANO:INICIO */"
FIN = "/* GRANO:FIN */"

N, NIVELES, AMPLITUD = 128, 7, 26
random.seed(1875)

paso = AMPLITUD / (NIVELES - 1)
img = Image.new("L", (N, N))
px = img.load()
for y in range(N):
    for x in range(N):
        v = random.gauss(0, AMPLITUD / 2.6)
        q = round(v / paso) * paso
        px[x, y] = int(max(0, min(255, 128 + q)))

buf = io.BytesIO()
img.convert("RGB").save(buf, "WEBP", quality=75, method=6)
datos = base64.b64encode(buf.getvalue()).decode("ascii")

css = io.open(CSS, encoding="utf-8").read()
a = css.index(INICIO)
b = css.index(FIN)
bloque = INICIO + '\n  background-image: url("data:image/webp;base64,' + datos + '");\n  ' + FIN
io.open(CSS, "w", encoding="utf-8").write(css[:a] + bloque + css[b + len(FIN):])

print(f"grano incrustado en css/base.css  ·  {len(buf.getvalue())} bytes  ->  "
      f"{len(datos)} en base64  ·  {N}x{N}, {NIVELES} niveles")
