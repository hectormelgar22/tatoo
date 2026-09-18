#!/usr/bin/env python3
"""
NIGREDO · genera la silueta corporal del estimador.

Uso:  python tools/make-silueta.py

Es un mapa corporal, no una ilustracion: exactamente lo que usa un estudio en
la ficha de papel para marcar donde va la pieza. Cada zona es una region con
su `data-zona`, que coincide con los `id` de STUDIO.zonas, y el script de la
pagina la convierte en un control con teclado.

Se calcula en vez de dibujarse a ojo para que las dos figuras (delante y
detras) esten alineadas y sean simetricas de verdad. Una silueta torcida en
un formulario de presupuesto se lee como descuido.
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import io, os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(RAIZ, "assets", "img")
os.makedirs(DEST, exist_ok=True)

W, H = 420, 560          # lienzo
CX_F, CX_B = 108, 312    # ejes de la figura de delante y la de detras


def poly(pts):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def espejo(cx, pts):
    return [(2 * cx - x, y) for x, y in pts]


def region(cx, zona, pts, espejada=False, etiqueta=None):
    """Una region clicable. `espejada` dibuja tambien el lado contrario."""
    d = f'<polygon points="{poly(pts)}"/>'
    if espejada:
        d += f'<polygon points="{poly(espejo(cx, pts))}"/>'
    lab = etiqueta or zona
    return (f'<g class="silueta__zona" data-zona="{zona}" '
            f'role="radio" aria-checked="false" tabindex="-1" '
            f'aria-label="{lab}">{d}</g>\n')


def figura(cx, cara):
    """cara: 'frente' o 'espalda'."""
    o = []
    top = 34

    # --- cabeza y cuello: no son zonas seleccionables, solo dan la escala ---
    o.append(f'<g class="silueta__cuerpo">'
             f'<ellipse cx="{cx}" cy="{top + 26}" rx="25" ry="31"/></g>\n')

    # cuello (zona real: se tatua)
    o.append(region(cx, "cuello", [
        (cx - 13, top + 54), (cx + 13, top + 54), (cx + 15, top + 76), (cx - 15, top + 76)]))

    # --- hombros ---
    o.append(region(cx, "hombro", [
        (cx - 20, top + 76), (cx - 54, top + 88), (cx - 62, top + 118),
        (cx - 40, top + 120), (cx - 28, top + 92)], espejada=True))

    if cara == "frente":
        o.append(region(cx, "pecho", [
            (cx - 20, top + 78), (cx + 20, top + 78), (cx + 40, top + 120),
            (cx + 38, top + 150), (cx - 38, top + 150), (cx - 40, top + 120)]))
        o.append(region(cx, "abdomen", [
            (cx - 38, top + 152), (cx + 38, top + 152), (cx + 34, top + 216),
            (cx - 34, top + 216)]))
        # Franja del costado POR DENTRO del contorno del torso: si se sale,
        # la figura deja de leerse como un cuerpo.
        o.append(region(cx, "costillas", [
            (cx - 39, top + 124), (cx - 30, top + 126), (cx - 30, top + 188),
            (cx - 38, top + 186)], espejada=True))
    else:
        o.append(region(cx, "espalda", [
            (cx - 20, top + 78), (cx + 20, top + 78), (cx + 40, top + 120),
            (cx + 36, top + 214), (cx - 36, top + 214), (cx - 40, top + 120)]))

    # --- brazos: mismo trazado en las dos caras ---
    o.append(region(cx, "brazo", [
        (cx - 54, top + 90), (cx - 72, top + 104), (cx - 78, top + 168),
        (cx - 62, top + 172), (cx - 58, top + 116)], espejada=True))
    o.append(region(cx, "antebrazo", [
        (cx - 78, top + 170), (cx - 62, top + 174), (cx - 68, top + 246),
        (cx - 84, top + 244)], espejada=True))
    o.append(region(cx, "mano", [
        (cx - 84, top + 248), (cx - 67, top + 250), (cx - 65, top + 286),
        (cx - 86, top + 284)], espejada=True))

    # --- piernas ---
    o.append(region(cx, "muslo", [
        (cx - 34, top + 218), (cx - 3, top + 218), (cx - 4, top + 330),
        (cx - 32, top + 332)], espejada=True))
    o.append(region(cx, "gemelo", [
        (cx - 32, top + 334), (cx - 5, top + 332), (cx - 8, top + 434),
        (cx - 28, top + 436)], espejada=True))
    o.append(region(cx, "tobillo", [
        (cx - 28, top + 438), (cx - 9, top + 436), (cx - 8, top + 476),
        (cx - 30, top + 478)], espejada=True))

    etiqueta = "Delante" if cara == "frente" else "Detras"
    o.append(f'<text class="silueta__cara" x="{cx}" y="{H - 10}" '
             f'text-anchor="middle">{etiqueta}</text>\n')
    return "".join(o)


SVG = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"
     class="silueta" role="radiogroup" aria-label="Mapa corporal: elige la zona">
{figura(CX_F, "frente")}{figura(CX_B, "espalda")}</svg>
'''


def main():
    ruta = os.path.join(DEST, "silueta.svg")
    io.open(ruta, "w", encoding="utf-8").write(SVG)
    zonas = SVG.count('data-zona=')
    print(f"silueta.svg  {os.path.getsize(ruta)} bytes  ·  {zonas} regiones")


if __name__ == "__main__":
    main()
