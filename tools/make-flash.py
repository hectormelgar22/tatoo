#!/usr/bin/env python3
"""
NIGREDO · genera los ocho flash como SVG dibujados a mano.

Uso:  python tools/make-flash.py

Se dibujan aqui y no se descargan de ningun sitio por dos razones:

1. Un flash es obra del estudio. Una foto de stock haciendo de diseno propio
   se nota a la legua.
2. El simulador de colocacion pinta el diseno sobre un canvas y luego deja
   descargar el resultado. Si el diseno viniera de otro dominio el canvas
   quedaria contaminado y `toBlob()` lanzaria una excepcion: no habria boton
   de descarga. Siendo del mismo origen, no hay problema.

Trazo en `currentColor`, asi que cada lamina hereda el color del sitio donde
se pinte: tinta sobre papel en la ficha, papel sobre tinta en el simulador.
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import io, os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(RAIZ, "assets", "flash")
os.makedirs(DEST, exist_ok=True)

VB = (0, 0, 200, 280)

CAB = (
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" '
  'fill="none" stroke="currentColor" stroke-width="2.4" '
  'stroke-linecap="round" stroke-linejoin="round" '
  'role="img" aria-label="{et}">\n<title>{et}</title>\n'
)

DIBUJOS = {}

# --- F-01 · Llave sin dientes ------------------------------------------------
DIBUJOS["f-01"] = ("Llave sin dientes", """
  <circle cx="100" cy="72" r="34"/>
  <circle cx="100" cy="72" r="19"/>
  <path d="M100 38v-14M100 106v128"/>
  <path d="M86 24h28M78 44l-11-9M122 44l11-9M78 100l-11 9M122 100l11 9"/>
  <path d="M100 196h26M100 216h18M100 234l-9 12M100 234l9 12"/>
  <path d="M100 150c-9 0-9 12 0 12s9-12 0-12z"/>
""")

# --- F-02 · Polilla menor ----------------------------------------------------
DIBUJOS["f-02"] = ("Polilla menor", """
  <path d="M100 96v92"/>
  <path d="M100 106c-16-26-44-42-62-34-16 7-14 34 2 52 15 17 40 22 60 10"/>
  <path d="M100 106c16-26 44-42 62-34 16 7 14 34-2 52-15 17-40 22-60 10"/>
  <path d="M100 152c-12 10-30 20-38 36-6 13 4 26 18 22 10-3 17-14 20-26"/>
  <path d="M100 152c12 10 30 20 38 36 6 13-4 26-18 22-10-3-17-14-20-26"/>
  <path d="M100 96c0-10-4-14-10-18M100 96c0-10 4-14 10-18"/>
  <circle cx="66" cy="120" r="5"/><circle cx="134" cy="120" r="5"/>
  <path d="M100 120v6M100 136v6"/>
""")

# --- F-03 · Daga corta -------------------------------------------------------
DIBUJOS["f-03"] = ("Daga corta", """
  <path d="M100 18l16 44v96h-32V62z"/>
  <path d="M100 18v140"/>
  <path d="M62 158h76"/>
  <path d="M62 158l-14 14M138 158l14 14"/>
  <path d="M90 172h20v52H90z"/>
  <path d="M90 186h20M90 200h20M90 214h20"/>
  <path d="M100 224v14"/>
  <circle cx="100" cy="250" r="12"/>
  <circle cx="100" cy="250" r="5"/>
""")

# --- F-04 · Ojo seccionado ---------------------------------------------------
DIBUJOS["f-04"] = ("Ojo seccionado", """
  <path d="M26 140c28-38 54-56 74-56s46 18 74 56c-28 38-54 56-74 56s-46-18-74-56z"/>
  <circle cx="100" cy="140" r="34"/>
  <circle cx="100" cy="140" r="15"/>
  <path d="M100 84v-24M100 196v24"/>
  <path d="M100 106v14M100 160v14"/>
  <path d="M60 118l-16-14M140 118l16-14M60 162l-16 14M140 162l16 14"/>
  <path d="M100 60v-16" stroke-dasharray="4 7"/>
  <path d="M100 236v-16" stroke-dasharray="4 7"/>
""")

# --- F-05 · Cerradura --------------------------------------------------------
DIBUJOS["f-05"] = ("Cerradura", """
  <path d="M100 26c34 0 56 24 56 60v140c0 18-22 28-56 28s-56-10-56-28V86c0-36 22-60 56-60z"/>
  <path d="M100 42c26 0 42 18 42 46v130"/>
  <path d="M100 42c-26 0-42 18-42 46v130"/>
  <circle cx="100" cy="126" r="22"/>
  <path d="M100 148l-11 46h22z"/>
  <path d="M58 218h84"/>
  <path d="M74 74l-12-12M126 74l12-12"/>
""")

# --- F-06 · Rama de tres -----------------------------------------------------
DIBUJOS["f-06"] = ("Rama de tres", """
  <path d="M100 258c0-56 6-104 20-146 10-30 22-52 34-66"/>
  <path d="M112 186c-18-4-32-16-36-32 18-2 34 6 42 20"/>
  <path d="M122 134c-16-8-26-24-24-42 16 6 28 20 30 38"/>
  <path d="M136 90c-12-12-16-30-10-46 14 10 20 28 18 46"/>
  <path d="M154 46c-9 2-15 8-18 16"/>
""")

# --- F-07 · Luna en cuarto ---------------------------------------------------
DIBUJOS["f-07"] = ("Luna en cuarto", """
  <path d="M132 34a108 108 0 100 212 92 92 0 010-212z"/>
  <path d="M132 58a84 84 0 100 164"/>
  <circle cx="84" cy="106" r="10"/>
  <circle cx="68" cy="160" r="6"/>
  <circle cx="94" cy="196" r="8"/>
  <path d="M158 62l6-14M170 92l16-6M170 188l16 6M158 218l6 14"/>
""")

# --- F-08 · Caracola seccionada ----------------------------------------------
# Espiral logaritmica r = a*e^(bt), calculada y encajada por caja envolvente en
# la lamina: una concha real sigue esa curva y el ojo lo nota aunque no sepa
# por que. Trazarla a mano da siempre una espiral de Arquimedes, que es otra
# cosa y se ve mecanica.
DIBUJOS["f-08"] = ("Caracola seccionada", """
  <path d="M75.0 155.4L75.0 155.2L75.1 154.9L75.1 154.7L75.1 154.4L75.1 154.1L75.1 153.8L75.0 153.6L74.9 153.3L74.8 153.0L74.7 152.7L74.6 152.5L74.4 152.2L74.3 151.9L74.1 151.7L73.8 151.5L73.6 151.2L73.3 151.0L73.1 150.8L72.8 150.6L72.4 150.5L72.1 150.3L71.8 150.2L71.4 150.1L71.0 150.0L70.6 150.0L70.2 149.9L69.8 149.9L69.4 150.0L69.0 150.0L68.6 150.1L68.2 150.2L67.7 150.4L67.3 150.6L66.9 150.8L66.5 151.0L66.1 151.3L65.8 151.6L65.4 152.0L65.1 152.3L64.7 152.7L64.4 153.2L64.2 153.6L63.9 154.1L63.7 154.6L63.5 155.2L63.4 155.7L63.3 156.3L63.2 156.9L63.2 157.5L63.2 158.1L63.3 158.7L63.4 159.4L63.5 160.0L63.7 160.6L63.9 161.3L64.2 161.9L64.6 162.5L65.0 163.1L65.4 163.7L65.9 164.3L66.4 164.8L67.0 165.3L67.6 165.8L68.3 166.2L69.0 166.6L69.7 167.0L70.5 167.3L71.3 167.5L72.2 167.7L73.1 167.9L74.0 168.0L74.9 168.0L75.8 168.0L76.8 167.9L77.8 167.7L78.7 167.5L79.7 167.1L80.6 166.7L81.6 166.3L82.5 165.8L83.4 165.1L84.3 164.5L85.1 163.7L85.9 162.9L86.7 162.0L87.4 161.0L88.0 160.0L88.6 158.9L89.2 157.8L89.6 156.5L90.0 155.3L90.3 154.0L90.5 152.6L90.6 151.3L90.6 149.9L90.5 148.4L90.3 147.0L90.0 145.5L89.6 144.1L89.1 142.6L88.5 141.2L87.8 139.7L86.9 138.3L86.0 137.0L84.9 135.7L83.7 134.4L82.5 133.2L81.1 132.1L79.6 131.0L78.0 130.1L76.3 129.2L74.6 128.4L72.7 127.8L70.8 127.3L68.8 126.9L66.7 126.6L64.6 126.5L62.5 126.5L60.3 126.6L58.1 127.0L55.9 127.5L53.7 128.1L51.5 128.9L49.3 129.9L47.1 131.1L45.0 132.4L43.0 133.9L41.0 135.5L39.1 137.3L37.3 139.3L35.7 141.5L34.1 143.8L32.7 146.2L31.4 148.8L30.3 151.5L29.4 154.4L28.6 157.3L28.1 160.3L27.7 163.5L27.6 166.7L27.7 170.0L28.0 173.3L28.5 176.6L29.3 180.0L30.4 183.3L31.7 186.7L33.3 190.0L35.1 193.2L37.2 196.4L39.5 199.5L42.1 202.4L44.9 205.2L48.0 207.9L51.3 210.4L54.8 212.7L58.6 214.8L62.6 216.7L66.7 218.3L71.1 219.6L75.6 220.7L80.3 221.4L85.0 221.9L89.9 222.0L94.9 221.8L100.0 221.2L105.0 220.2L110.1 218.9L115.2 217.2L120.3 215.1L125.3 212.7L130.2 209.8L134.9 206.6L139.5 202.9L144.0 198.9L148.2 194.5L152.2 189.7L155.9 184.6L159.3 179.1L162.4 173.3L165.1 167.2L167.4 160.8L169.3 154.2L170.8 147.3L171.9 140.2L172.4 132.9L172.4 125.4L171.9 117.8L170.9 110.2L169.3 102.4L167.2 94.7L164.4 87.0L161.1 79.4L157.2 71.8L152.7 64.5L147.6 57.3L141.9 50.4L135.7 43.7L128.8 37.4L121.5 31.5L113.5 26.0"/>
  <path d="M75.0 155.4L75.0 155.2L75.1 155.0L75.1 154.7L75.1 154.5L75.1 154.3L75.1 154.0L75.0 153.8L75.0 153.5L74.9 153.3L74.8 153.0L74.7 152.8L74.6 152.5L74.5 152.3L74.3 152.1L74.2 151.8L74.0 151.6L73.8 151.4L73.6 151.2L73.3 151.0L73.1 150.8L72.8 150.7L72.5 150.5L72.2 150.4L71.9 150.3L71.6 150.2L71.3 150.1L70.9 150.0L70.6 150.0L70.2 149.9L69.9 149.9L69.5 150.0L69.1 150.0L68.8 150.1L68.4 150.2L68.0 150.3L67.6 150.4L67.3 150.6L66.9 150.8L66.6 151.0L66.2 151.3L65.9 151.5L65.5 151.8L65.2 152.1L64.9 152.5L64.6 152.9L64.4 153.3L64.2 153.7L63.9 154.1L63.7 154.6L63.6 155.0L63.4 155.5L63.3 156.0L63.2 156.6L63.2 157.1L63.2 157.7L63.2 158.2L63.3 158.8L63.4 159.3L63.5 159.9L63.6 160.5L63.9 161.0L64.1 161.6L64.4 162.2L64.7 162.7L65.1 163.2L65.5 163.8L65.9 164.3L66.4 164.7L66.9 165.2L67.4 165.6L68.0 166.0L68.6 166.4L69.3 166.8L70.0 167.1L70.7 167.3L71.4 167.6L72.2 167.7L73.0 167.9L73.8 168.0L74.6 168.0L75.4 168.0L76.3 167.9L77.1 167.8L78.0 167.6L78.9 167.4L79.7 167.1L80.6 166.8L81.4 166.4L82.3 165.9L83.1 165.4L83.9 164.8L84.6 164.2L85.4 163.5L86.1 162.7L86.8 161.9L87.4 161.0L88.0 160.1L88.5 159.1L89.0 158.1L89.4 157.1L89.8 156.0L90.1 154.8L90.3 153.6L90.5 152.4L90.6 151.2L90.6 149.9L90.5 148.7L90.4 147.4L90.2 146.1L89.8 144.7L89.4 143.4L88.9 142.1L88.4 140.8L87.7 139.6L86.9 138.3L86.1 137.1L85.1 135.9L84.1 134.8L83.0 133.7L81.8 132.6L80.5 131.7L79.2 130.7L77.7 129.9L76.2 129.1L74.6 128.5L73.0 127.9L71.3 127.4L69.5 127.0L67.7 126.7L65.8 126.5L63.9 126.4L62.0 126.5L60.0 126.7L58.1 127.0L56.1 127.4L54.1 128.0L52.1 128.7L50.1 129.5L48.2 130.5L46.3 131.6L44.4 132.8L42.6 134.2L40.8 135.7L39.2 137.3L37.5 139.1L36.0 141.0L34.6 143.0L33.3 145.1L32.1 147.4L31.0 149.8L30.1 152.2L29.2 154.8L28.6 157.4L28.1 160.2L27.8 163.0L27.6 165.8L27.6 168.7L27.8 171.7L28.2 174.7L28.8 177.7L29.5 180.7L30.5 183.7L31.7 186.7L33.1 189.6L34.7 192.6L36.5 195.4L38.5 198.2L40.7 200.9L43.1 203.5L45.7 206.0" opacity=".8"/>
  <path d="M64.5 162.4L68.5 158.4M78.5 167.5L74.5 160.7M90.6 150.3L79.8 153.2M71.5 127.4L71.5 143.2M33.3 145.2L54.9 151.0M43.5 203.9L59.3 176.5M127.5 211.4L95.9 179.8M168.5 99.4L113.7 131.0"/>
  <circle cx="71.5" cy="155.4" r="2.6"/>
  <path d="M52 250h96M52 244v12M148 244v12M100 246v10"/>
""")


def main():
    total = 0
    for nombre, (etiqueta, cuerpo) in DIBUJOS.items():
        svg = CAB.format(et=etiqueta) + cuerpo.rstrip() + "\n</svg>\n"
        ruta = os.path.join(DEST, nombre + ".svg")
        io.open(ruta, "w", encoding="utf-8").write(svg)
        peso = os.path.getsize(ruta)
        total += peso
        print(f"  {nombre}.svg  {etiqueta:22s} {peso:5d} bytes")
    print(f"\n{len(DIBUJOS)} laminas · {total} bytes en total")


if __name__ == "__main__":
    main()
