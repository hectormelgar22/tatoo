#!/usr/bin/env python3
"""
NIGREDO · genera la imagen de Open Graph.

Uso:  python tools/make-og.py     (con el servidor local en marcha)

Captura tools/og.html a 1200x630 con Chrome en modo headless y la guarda en
assets/img/og.png. Se monta con el HTML y las fuentes de la propia web, asi que
la tarjeta que sale en WhatsApp o Twitter usa el mismo Bodoni, el mismo negro
calido y el mismo lacre que el sitio.
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import os, subprocess, sys, glob

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(RAIZ, "assets", "img", "og.png")
URL = "http://localhost:5173/tools/og.html"

CANDIDATOS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
]

def navegador():
    for c in CANDIDATOS:
        if os.path.exists(c):
            return c
    sys.exit("No encuentro Chrome ni Edge. Abre tools/og.html y captura a mano a 1200x630.")

def main():
    subprocess.run([
        navegador(), "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--force-device-scale-factor=1", "--virtual-time-budget=6000",
        f"--screenshot={DEST}", "--window-size=1200,630", URL
    ], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if not os.path.exists(DEST):
        sys.exit("No se generó la imagen. ¿Está el servidor local en marcha?")
    print(f"og.png  {os.path.getsize(DEST)/1024:.0f} KB")

if __name__ == "__main__":
    main()
