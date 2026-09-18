#!/usr/bin/env python3
"""
NIGREDO · descarga y prepara las imagenes de stock.

Uso:  python tools/fetch-images.py

Descarga cada foto de Unsplash una sola vez a un cache local, genera las
variantes WebP que usa la web y escribe assets/img/CREDITOS.json con el autor
y el enlace de cada una. Es una herramienta de desarrollo: la web desplegada
no la necesita, porque las imagenes se suben ya generadas.

Para sustituir una foto por la del estudio real: cambia la entrada en FOTOS
(o borra el bloque y pon tus propios archivos en assets/img/ con los mismos
nombres) y vuelve a ejecutarlo.

Requiere: pillow  ·  pip install pillow
"""
import sys

# La consola de Windows usa cp1252 y no sabe imprimir acentos ni flechas.
# Sin esto, la herramienta revienta al escribir su propio informe.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import io, json, os, subprocess, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(RAIZ, "tools", ".cache-img")
DEST = os.path.join(RAIZ, "assets", "img")
os.makedirs(CACHE, exist_ok=True)
os.makedirs(DEST, exist_ok=True)

# Anchos generados por tipo de imagen. El primero es el mayor.
ANCHOS = {
    "hero":    [1800, 1200, 840, 520],
    "plancha": [1500, 900, 720, 600, 380],
    "artista": [840, 560, 360],
    "lugar":   [1400, 900, 560],
}

# -----------------------------------------------------------------------------
# id      : identificador de la foto en Unsplash
# archivo : nombre base con el que se guarda en assets/img/
# tipo    : que juego de anchos usa
# autor   : para los creditos del README
# alt     : texto alternativo REAL, describiendo lo que se ve en la foto.
#           No es decorativo: es lo que oye quien navega con lector de pantalla.
# -----------------------------------------------------------------------------
FOTOS = [
  dict(archivo="hero", tipo="hero", id="photo-1557130641-1b14718f096a",
       autor="Eugene Chystiakov", link="https://unsplash.com/es/fotos/tatuaje-de-espalda-negra-w8fulqCkj8w",
       alt="Espalda tatuada por completo con una pieza ornamental de negro sólido y simetría "
           "axial, fotografiada a contraluz contra una persiana de lamas horizontales."),

  dict(archivo="pl-001", tipo="plancha", id="photo-1557130680-0f816eef4743",
       autor="Eugene Chystiakov", link="https://unsplash.com/es/fotos/foto-en-escala-de-grises-de-un-hombre-con-chaqueta-udEtTnAcSD8",
       alt="Persona inclinada hacia delante quitandose una sudadera, con la espalda cubierta "
           "por un trazado ornamental negro de bandas simétricas."),

  dict(archivo="pl-002", tipo="plancha", id="photo-1665085326630-b01fea9a613d",
       autor="Lesia", link="https://unsplash.com/es/fotos/una-persona-con-un-tatuaje-en-el-brazo-tPT7knlCgQM",
       alt="Manga de realismo en el brazo con un rostro femenino de mirada baja rodeado de "
           "ornamento, resuelto en negro y grises con transiciones muy suaves."),

  dict(archivo="pl-003", tipo="plancha", id="photo-1651692883249-ed36b3523419",
       autor="GRAHAM MANSFIELD", link="https://unsplash.com/es/fotos/una-persona-con-tatuajes-en-el-brazo-w-yKyCMPw-I",
       alt="Brazo con varias piezas de línea fina: una flor de tallo largo, una corona "
           "pequeña sobre el hombro y una banda floral rodeando el bíceps."),

  dict(archivo="pl-004", tipo="plancha", id="photo-1778837224447-8f3b265035eb",
       autor="Eva Greenberg", link="https://unsplash.com/es/fotos/primer-plano-de-un-colorido-tatuaje-de-dragon-en-un-brazo-LvivLeKw4zs",
       alt="Manga oriental a color cubriendo el brazo entero, con un dragón de escamas "
           "rojas y naranjas de contorno cerrado sobre fondo de nubes en gris."),

  dict(archivo="pl-005", tipo="plancha", id="photo-1604374376934-2df6fad6519b",
       autor="Seyi Ariyo", link="https://unsplash.com/es/fotos/tatuaje-tribal-negro-y-marron-LEjVES-wIIc",
       alt="Brazo extendido en horizontal contra una pared blanca, cubierto de punta a "
           "punta por una manga densa de negro con el ornamento cerrando en la muñeca."),

  dict(archivo="pl-006", tipo="plancha", id="photo-1775135436883-56af5c10a476",
       autor="Haberdoedas", link="https://unsplash.com/es/fotos/tatuaje-detallado-en-blanco-y-negro-de-un-ojo-D2y8vWUm0LA",
       alt="Ojo tatuado en realismo de negro y grises a gran escala, con las pestañas "
           "trazadas una a una y el iris resuelto en degradado de puntillismo."),

  dict(archivo="pl-007", tipo="plancha", id="photo-1667498235434-cdad5f6337ab",
       autor="Michael Starkie", link="https://unsplash.com/es/fotos/una-mujer-con-flores-en-el-pelo-dBLIMAc3YaE",
       alt="Espalda de una mujer en penumbra, con una pieza pequeña de línea fina entre los "
           "omóplatos y flores secas prendidas en el pelo."),

  dict(archivo="pl-008", tipo="plancha", id="photo-1558355637-e991f0422e08",
       autor="Jan Kopřiva", link="https://unsplash.com/es/fotos/tatuaje-floral-negro-y-rojo-nKkVIIr7jnU",
       alt="Brazo con piezas tradicionales a color, rosas rojas y hojas verdes de línea "
           "gruesa, sobre un fondo turquesa desenfocado."),

  dict(archivo="pl-009", tipo="plancha", id="photo-1740239986116-6c04b956f9d3",
       autor="Sofia Lasheva", link="https://unsplash.com/es/fotos/una-mujer-con-un-tatuaje-en-la-espalda-w0_eIbiEyaE",
       alt="Parte alta de una espalda con una escena de arbol y bandada de pájaros en negro, "
           "las siluetas de las aves subiendo hacia el hombro."),

  dict(archivo="pl-010", tipo="plancha", id="photo-1596896734952-c4c1cd2efe0f",
       autor="Raspopova Marina", link="https://unsplash.com/es/fotos/mujer-en-camisa-abotonada-naranja-con-tatuaje-floral-negro-en-la-espalda-Rfp27flla_I",
       alt="Rama floral de línea fina tatuada en la cara externa del muslo, con una camisa "
           "amarilla apartada con la mano para dejarla a la vista."),

  dict(archivo="pl-011", tipo="plancha", id="photo-1635527948959-1b47e7903cb9",
       autor="Ethan Rougon", link="https://unsplash.com/es/fotos/una-mano-sosteniendo-un-par-de-gafas-con-un-tatuaje-UJSFe5VoNFs",
       alt="Mano sosteniendo unas gafas por la patilla, con una mariposa de línea fina "
           "tatuada en el dorso, sobre fondo gris liso."),

  dict(archivo="pl-012", tipo="plancha", id="photo-1601848714157-d845bb5c11ff",
       autor="Stories & Ink Tattoo Care", link="https://unsplash.com/es/fotos/persona-con-tatuaje-negro-y-rojo-en-la-pierna-derecha-kZuIc5Jtmfc",
       alt="Brazos y manos cruzados cubiertos de piezas tradicionales a color: golondrinas, "
           "rosas y hojas de contorno negro grueso sobre piel morena."),

  dict(archivo="artista-vera", tipo="artista", local="retrato-vera.jpg", recortarMarco=True,
       autor="Generada con IA para esta demostracion", fuente="Imagen generada",
       alt="Tatuadora con el pelo recogido y guantes negros, sentada en su puesto, "
           "sosteniendo la maquina junto al hombro y mirando a cámara sin sonreír; "
           "detras, laminas de flash enmarcadas en la pared."),

  dict(archivo="artista-nacho", tipo="artista", local="retrato-nacho.jpg", recortarMarco=True,
       autor="Generada con IA para esta demostracion", fuente="Imagen generada",
       alt="Tatuador de barba corta y delantal de trabajo, de pie con los brazos "
           "cruzados y ambos antebrazos tatuados, mirando a cámara; al fondo la mesa "
           "con los tinteros y la pared de flash."),

  dict(archivo="artista-lu", tipo="artista", local="retrato-lu.jpg", recortarMarco=True,
       autor="Generada con IA para esta demostración", fuente="Imagen generada",
       alt="Tatuadora joven sentada de lado sobre la camilla con los brazos cruzados "
           "sobre el respaldo, guantes negros y piezas de línea fina en los antebrazos, "
           "mirando a cámara; detrás, la pared de flash y la mesa de trabajo."),

  dict(archivo="artista-tomas", tipo="artista", local="retrato-tomas.jpg", recortarMarco=True,
       autor="Generada con IA para esta demostracion", fuente="Imagen generada",
       alt="Tatuador con gorra plana y delantal, sentado ante su cuaderno de dibujo con "
           "la maquina en la mano derecha, levantando la vista hacia la cámara."),

  dict(archivo="lugar", tipo="lugar", id="photo-1605647533135-51b5906087d0",
       autor="Maxim Hopman", link="https://unsplash.com/es/fotos/un-hombre-con-tatuajes-en-el-brazo-sosteniendo-un-cigarrillo-52Kf36w124Y",
       alt="Puesto de trabajo en blanco y negro: una mano enguantada y tatuada sostiene "
           "una cazoleta de tinta sobre la mesa preparada, con la persiana filtrando la "
           "luz y un retrato enmarcado al fondo."),
]


def origen(foto):
    """Devuelve la ruta del original, venga de Unsplash o del disco.

    Para poner las fotos del estudio real: deja el archivo en
    tools/originales/ y pon `local="nombre.jpg"` en vez de `id="photo-..."`.
    """
    if foto.get("local"):
        ruta = os.path.join(RAIZ, "tools", "originales", foto["local"])
        if not os.path.exists(ruta):
            raise SystemExit(f"Falta el original {foto['local']} de {foto['archivo']}")
        return ruta

    crudo = os.path.join(CACHE, foto["id"] + ".jpg")
    if os.path.exists(crudo) and os.path.getsize(crudo) > 20000:
        return crudo
    url = f"https://images.unsplash.com/{foto['id']}?w=2000&q=88&fm=jpg"
    subprocess.run(["curl", "-sL", "--fail", "-o", crudo, url], check=False)
    if not os.path.exists(crudo) or os.path.getsize(crudo) < 20000:
        raise SystemExit(f"No se pudo descargar {foto['archivo']} ({foto['id']})")
    return crudo


def recortar_marco(im, umbral=232, tope=0.18):
    """Quita el marco claro uniforme que traen muchas imagenes generadas.

    Avanza desde cada borde mientras la fila o la columna entera siga siendo
    casi blanca. Se para al 18 % de la dimension para no comerse una foto que
    de verdad tenga fondo blanco.
    """
    g = im.convert("L")
    w, h = g.size
    px = g.load()
    def fila_clara(y):
        return all(px[x, y] >= umbral for x in range(0, w, max(1, w // 60)))
    def col_clara(x):
        return all(px[x, y] >= umbral for y in range(0, h, max(1, h // 60)))

    arriba = 0
    while arriba < h * tope and fila_clara(arriba): arriba += 1
    abajo = h
    while abajo > h * (1 - tope) and fila_clara(abajo - 1): abajo -= 1
    izq = 0
    while izq < w * tope and col_clara(izq): izq += 1
    der = w
    while der > w * (1 - tope) and col_clara(der - 1): der -= 1

    if (izq, arriba, der, abajo) == (0, 0, w, h):
        return im, False
    return im.crop((izq, arriba, der, abajo)), True


def generar(foto):
    crudo = origen(foto)
    im = Image.open(crudo).convert("RGB")
    if foto.get("recortarMarco"):
        im, hubo = recortar_marco(im)
        if hubo:
            print(f"    (marco recortado -> {im.size[0]}x{im.size[1]})")
    anchos = ANCHOS[foto["tipo"]]
    salidas = []
    for w in anchos:
        if w > im.width:
            w = im.width
        h = round(im.height * w / im.width)
        chico = im.resize((w, h), Image.LANCZOS)
        nombre = f"{foto['archivo']}-{w}.webp"
        ruta = os.path.join(DEST, nombre)
        chico.save(ruta, "WEBP", quality=62, method=6)
        salidas.append((nombre, w, h, os.path.getsize(ruta)))
    return im.size, salidas


def main():
    creditos, total = [], 0
    for foto in FOTOS:
        (ow, oh), salidas = generar(foto)
        peso = sum(s[3] for s in salidas)
        total += peso
        mayor = salidas[0]
        creditos.append({
            "archivo": foto["archivo"],
            "alt": foto["alt"],
            "autor": foto["autor"],
            "fuente": foto.get("fuente", "Unsplash"),
            "enlace": foto.get("link", ""),
            "proporcion": round(mayor[1] / mayor[2], 4),
            "anchos": [s[1] for s in salidas],
        })
        print(f"  {foto['archivo']:16s} {ow}x{oh} -> {len(salidas)} webp  {peso/1024:6.0f} KB")
    ruta = os.path.join(DEST, "CREDITOS.json")
    io.open(ruta, "w", encoding="utf-8").write(
        json.dumps(creditos, ensure_ascii=False, indent=2))
    print(f"\n{len(FOTOS)} fotos · {total/1024:.0f} KB en total · creditos en {ruta}")


if __name__ == "__main__":
    main()
