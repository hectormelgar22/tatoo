/* =============================================================================
   NIGREDO · CONTENIDO
   -----------------------------------------------------------------------------
   TODO lo editable de la web vive en este objeto. Nombre, dirección, horarios,
   artistas, textos, tarifas del estimador, flash, cuidados y huecos libres.
   Para cambiar un precio no hay que abrir un solo HTML.

   Reglas para quien edite esto:
   · Las comillas y las comas importan. Si la web se queda en blanco, casi
     seguro falta una coma o sobra una.
   · Las rutas de imagen son relativas a la raíz del proyecto: assets/img/...
   · Los `slug` y los `id` son direcciones internas. Cambiarlos rompe enlaces
     ya publicados; cambiar el texto visible no rompe nada.
   ========================================================================== */

window.STUDIO = {

  /* ===========================================================================
     1. EL ESTUDIO
     ======================================================================== */
  studio: {
    nombre: "NIGREDO",
    nombreCompleto: "NIGREDO Tattoo Studio",
    /* Nigredo: la fase negra, el primer estadio de la Gran Obra alquímica.
       Aparece en la web como explicación, no como decoración.               */
    etimologia: "Nigredo. La fase negra. El primer estadio de la Gran Obra: " +
                "todo se descompone antes de volver a formarse.",

    lema: "Registro de obra en piel",
    descripcion: "Estudio de tatuaje en Malasaña. Cuatro artistas, " +
                 "cuatro lenguajes. Solo por cita.",

    direccion: {
      calle: "Calle Espíritu Santo 14",
      cp: "28004",
      ciudad: "Madrid",
      pais: "ES",
      barrio: "Malasaña",
      indicaciones: "Portal negro entre la cerrajería y el bar. Segundo piso, " +
                    "sin placa. Llama al telefonillo donde pone 2B.",
      metro: "Tribunal (L1, L10) a 4 min · Noviciado (L2) a 6 min",
      lat: 40.4257,
      lng: -3.7038
    },

    /* Dominio propio, sin barra final. Sale en los datos estructurados que
       lee Google. Tiene que coincidir con el dominio real: si aquí pone otra
       cosa, Google descarta la ficha del negocio.                          */
    web: "https://nigredo.example",        // ficticio: cambiar por el real

    telefono: "+34 910 00 00 00",          // ficticio: cambiar por el real
    telefonoLimpio: "34910000000",
    whatsapp: "34600000000",               // ficticio: solo dígitos, con prefijo
    email: "estudio@nigredo.example",      // ficticio
    instagram: "nigredo.tattoo",

    horario: [
      { dias: "Martes a viernes", abre: "12:00", cierra: "20:30" },
      { dias: "Sábado",           abre: "12:00", cierra: "18:00" },
      { dias: "Domingo y lunes",  abre: null,    cierra: null, nota: "Cerrado" }
    ],

    /* Para el JSON-LD de schema.org (días en inglés, formato 24 h). */
    horarioSchema: [
      { dias: ["Tuesday", "Wednesday", "Thursday", "Friday"], abre: "12:00", cierra: "20:30" },
      { dias: ["Saturday"], abre: "12:00", cierra: "18:00" }
    ],

    avisoCita: "Solo con cita previa. No atendemos sin reserva: si subes y no " +
               "has escrito antes, te vamos a decir que escribas.",

    /* Verificación de edad. bloqueante:false = franja inferior que no tapa el
       contenido ni penaliza el tiempo de carga. Ponlo a true si el estudio
       exige una pantalla completa antes de ver nada.                         */
    edad: {
      minima: 18,
      bloqueante: false,
      titulo: "Aquí se tatúa a partir de 18",
      texto: "En España no se puede tatuar a menores de edad sin autorización " +
             "de sus tutores y presencia el día de la cita. Si tienes menos de " +
             "18, escríbenos y te explicamos cómo se hace.",
      confirmar: "Tengo 18 o más",
      rechazar: "Tengo menos de 18",
      textoMenor: "Sin problema. Escríbenos por WhatsApp y te contamos qué " +
                  "papeles hacen falta y cómo venir acompañado. No vas a " +
                  "perder el sitio por preguntar.",
      recordarDias: 180
    },

    consentimiento: "He leído y entiendo que un tatuaje es permanente, que la " +
                    "cicatrización depende de los cuidados posteriores y que el " +
                    "estudio puede rechazar un diseño o una zona por criterio " +
                    "sanitario o artístico.",

    /* Aviso que acompaña a toda cifra de precio en la web. */
    avisoPresupuesto: "Orientativo. El precio final se cierra en persona, " +
                      "con el diseño delante y sobre tu piel."
  },

  /* ===========================================================================
     2. TEXTOS DE PÁGINA
     ======================================================================== */
  textos: {
    home: {
      titular: "Nada se forma sin deshacerse antes",
      entradilla: "Cuatro artistas en un segundo piso de Espíritu Santo. " +
                  "Cada pieza entra en el registro con un número, y ese número " +
                  "es su dirección para siempre.",
      declaracion: "No hacemos catálogo. Hacemos encargos.",
      sobreRegistro: "Cada trabajo terminado se ficha con un número de plancha. " +
                     "Sirve para hablar de él sin describirlo: dinos PL. 014 y " +
                     "sabemos exactamente de qué estamos hablando."
    },
    artistas: {
      titular: "Cuatro manos, cuatro idiomas",
      entradilla: "No somos intercambiables. Elegir artista es la primera " +
                  "decisión del tatuaje, y pesa más que la zona o el tamaño."
    },
    galeria: {
      titular: "El registro",
      entradilla: "Obra terminada, fichada por artista, estilo y zona. " +
                  "Cada plancha tiene su número y su enlace.",
      vacio: {
        titulo: "Ninguna plancha con ese cruce",
        texto: "La combinación de filtros que has elegido no existe todavía en " +
               "el registro. Prueba a quitar uno."
      }
    },
    flash: {
      titular: "Flash disponible",
      entradilla: "Diseños ya dibujados, a precio cerrado. Se tatúan una sola " +
                  "vez: cuando uno sale, sale del registro."
    },
    reservar: {
      titular: "Cuéntanos qué quieres",
      entradilla: "Seis pasos. Tarda dos minutos y nos ahorra a los dos cuatro " +
                  "días de mensajes. Al final te montamos el WhatsApp escrito.",
      cierre: "Contestamos en 48 h laborables. Si no ves respuesta, revisa la " +
              "carpeta de solicitudes de mensaje de Instagram."
    },
    cuidados: {
      titular: "Cómo se cura esto",
      entradilla: "Un tatuaje bien hecho se puede estropear en casa en tres " +
                  "días. Esto es lo que hay que hacer, día por día."
    },
    estimador: {
      titular: "Cuánto puede costar",
      entradilla: "La pregunta que más nos hacen. Esta es la respuesta " +
                  "aproximada, sin tener que escribir a nadie."
    },
    simulador: {
      titular: "Cómo te va a quedar",
      entradilla: "Sube una foto de la zona y coloca el diseño encima. " +
                  "Escala, gira y mueve hasta que te cuadre.",
      privacidad: "Tu foto no sale de este navegador. No se sube a ningún " +
                  "servidor, no la vemos y no se guarda al cerrar la pestaña."
    },
    huecos: {
      titular: "Huecos por cancelación",
      entradilla: "Alguien ha anulado. Si te pilla bien, es tuyo.",
      vacio: {
        titulo: "Ahora mismo no hay huecos",
        texto: "La agenda está cerrada estos días. Apúntate a la lista y te " +
               "avisamos en cuanto caiga una cancelación."
      }
    }
  },

  /* ===========================================================================
     3. ARTISTAS
     ======================================================================== */
  artistas: [
    {
      slug: "vera-mota",
      nombre: "Vera Mota",
      alias: "VM",
      estilo: "Blackwork / ornamental",
      estiloId: "blackwork",
      desde: 2014,
      tarifa: 120,                    // euros/hora
      minimo: 90,                     // mínimo de sesión
      titular: "Negro sólido y simetría",
      bio: "Trabaja con negro plano y geometría: ornamental, patrón repetido, " +
           "piezas que envuelven el miembro en vez de posarse encima. Dibuja " +
           "sobre el cuerpo antes de tatuar, siempre. No hace letras sueltas " +
           "ni reproduce diseños de otro artista.",
      acepta: "Piezas grandes de una sola pieza: manga, muslo, esternón, " +
              "espalda entera.",
      noAcepta: "Copias, letras sueltas, nombres.",
      instagram: "vera.mota.tattoo",
      retrato: "artista-vera", retratoRatio: 0.744,
      retratoAlt: "Tatuadora con el pelo recogido y guantes negros, sentada en " +
                  "su puesto, sosteniendo la máquina junto al hombro y mirando " +
                  "a cámara sin sonreír; detrás, láminas de flash enmarcadas " +
                  "en la pared.",
      agenda: "Abre agenda el primer lunes de cada mes."
    },
    {
      slug: "nacho-belmonte",
      nombre: "Nacho Belmonte",
      alias: "NB",
      estilo: "Realismo en negro y grises",
      estiloId: "realismo",
      desde: 2011,
      tarifa: 140,
      minimo: 120,
      titular: "Retrato, textura, materia",
      bio: "Quince años haciendo negro y grises. Retrato, animal, tejido, " +
           "piedra. Pide referencia fotográfica de calidad y no empieza sin " +
           "ella: de una foto mala no sale un buen retrato, por mucha mano que " +
           "le eches. Piezas de varias sesiones, casi siempre.",
      acepta: "Retrato, realismo animal, composiciones de varias sesiones.",
      noAcepta: "Realismo a color, piezas de menos de 10 cm.",
      instagram: "belmonte.bng",
      retrato: "artista-nacho", retratoRatio: 0.7434,
      retratoAlt: "Tatuador de barba corta y delantal de trabajo, de pie con " +
                  "los brazos cruzados y ambos antebrazos tatuados, mirando a " +
                  "cámara; al fondo la mesa con los tinteros y la pared de flash.",
      agenda: "Lista de espera de unas 8 semanas."
    },
    {
      slug: "lu-arrieta",
      nombre: "Lu Arrieta",
      alias: "LA",
      estilo: "Fineline / microrrealismo",
      estiloId: "fineline",
      desde: 2018,
      tarifa: 110,
      minimo: 80,
      titular: "Línea fina que aguanta",
      bio: "Fineline y microrrealismo, pero con criterio de durabilidad: " +
           "avisa cuando una pieza no va a aguantar diez años y propone cómo " +
           "ajustarla para que sí. Prefiere una línea un poco más gruesa hoy " +
           "que una mancha gris dentro de una década.",
      acepta: "Piezas pequeñas y medianas, botánica, objetos, líneas sueltas.",
      noAcepta: "Micro-lettering por debajo de 4 mm, dedos, palmas.",
      instagram: "lu.arrieta",
      retrato: "artista-lu", retratoRatio: 0.7434,
      retratoAlt: "Tatuadora joven sentada de lado sobre la camilla con los " +
                  "brazos cruzados sobre el respaldo, guantes negros y piezas " +
                  "de línea fina en los antebrazos, mirando a cámara; detrás, " +
                  "la pared de flash y la mesa de trabajo.",
      agenda: "Suele tener hueco en 2 o 3 semanas."
    },
    {
      slug: "tomas-ferrer",
      nombre: "Tomás Ferrer",
      alias: "TF",
      estilo: "Neotradicional a color",
      estiloId: "neotradicional",
      desde: 2016,
      tarifa: 125,
      minimo: 100,
      titular: "Color saturado, línea cerrada",
      bio: "Neotradicional: línea cerrada, paleta corta y saturada, sombra " +
           "que aguanta. Viene del cómic y se le nota en la composición. " +
           "Dibuja propuesta propia a partir de una idea; no tatúa un diseño " +
           "traído de fuera sin rehacerlo.",
      acepta: "Fauna, figura, objeto, piezas de color de una o dos sesiones.",
      noAcepta: "Pastel, acuarela, diseños cerrados de otro artista.",
      instagram: "tomasferrer.ink",
      retrato: "artista-tomas", retratoRatio: 0.7388,
      retratoAlt: "Tatuador con gorra plana y delantal, sentado ante su " +
                  "cuaderno de dibujo con la máquina en la mano derecha, " +
                  "levantando la vista hacia la cámara.",
      agenda: "Abre agenda cada dos meses por Instagram."
    }
  ],

  /* ===========================================================================
     4. TAXONOMÍAS · filtros de galería y pasos del estimador
     ======================================================================== */
  estilos: [
    { id: "blackwork",      nombre: "Blackwork",      factor: 1.00 },
    { id: "realismo",       nombre: "Realismo b/n",   factor: 1.25 },
    { id: "fineline",       nombre: "Fineline",       factor: 0.90 },
    { id: "neotradicional", nombre: "Neotradicional", factor: 1.10 },
    { id: "ornamental",     nombre: "Ornamental",     factor: 1.05 },
    { id: "lettering",      nombre: "Lettering",      factor: 0.85 }
  ],

  /* Zonas del cuerpo. `factor` sube donde se tatúa peor: hueso cerca, piel
     fina, más dolor, más tiempo. `dolor` es de 1 a 5 y solo informa.         */
  zonas: [
    { id: "antebrazo",  nombre: "Antebrazo",        factor: 1.00, dolor: 2 },
    { id: "brazo",      nombre: "Brazo / bíceps",   factor: 1.00, dolor: 2 },
    { id: "hombro",     nombre: "Hombro",           factor: 1.05, dolor: 2 },
    { id: "espalda",    nombre: "Espalda",          factor: 1.10, dolor: 3 },
    { id: "pecho",      nombre: "Pecho",            factor: 1.15, dolor: 4 },
    { id: "costillas",  nombre: "Costillas",        factor: 1.30, dolor: 5 },
    { id: "abdomen",    nombre: "Abdomen",          factor: 1.15, dolor: 4 },
    { id: "muslo",      nombre: "Muslo",            factor: 1.00, dolor: 2 },
    { id: "gemelo",     nombre: "Gemelo",           factor: 1.05, dolor: 3 },
    { id: "tobillo",    nombre: "Tobillo / pie",    factor: 1.25, dolor: 5 },
    { id: "cuello",     nombre: "Cuello",           factor: 1.30, dolor: 5 },
    { id: "mano",       nombre: "Mano / dedos",     factor: 1.30, dolor: 5 }
  ],

  /* ===========================================================================
     5. ESTIMADOR · todas las tarifas en un sitio
     ======================================================================== */
  estimador: {
    tarifaHora: 120,            // por defecto si no se elige artista
    minimoEstudio: 80,
    horasPorSesion: 3,
    horquilla: 0.15,            // ±15 % sobre el cálculo central
    redondeo: 10,               // los precios se redondean a múltiplos de 10

    /* Horas base según tamaño. La referencia visual la pinta la web
       comparando con objetos conocidos.                                      */
    tamanos: [
      { id: "xs",  nombre: "Hasta 5 cm",   detalle: "Como una moneda de 2 euros",  cm: 5,  horas: 1.0 },
      { id: "s",   nombre: "5 a 10 cm",    detalle: "Como una tarjeta de crédito", cm: 10, horas: 2.0 },
      { id: "m",   nombre: "10 a 18 cm",   detalle: "Como la palma de la mano",    cm: 18, horas: 3.5 },
      { id: "l",   nombre: "18 a 30 cm",   detalle: "Como un folio a lo ancho",    cm: 30, horas: 6.0 },
      { id: "xl",  nombre: "30 a 45 cm",   detalle: "Media manga o medio muslo",   cm: 45, horas: 11.0 },
      { id: "xxl", nombre: "Más de 45 cm", detalle: "Manga entera o espalda",      cm: 60, horas: 20.0 }
    ],

    detalle: [
      { id: "bajo",  nombre: "Simple",  descripcion: "Línea limpia, poco relleno", factor: 0.80 },
      { id: "medio", nombre: "Medio",   descripcion: "Sombra y algo de textura",   factor: 1.00 },
      { id: "alto",  nombre: "Cargado", descripcion: "Mucho detalle y textura",    factor: 1.35 }
    ],

    color: [
      { id: "negro", nombre: "Negro y grises", factor: 1.00 },
      { id: "color", nombre: "A color",        factor: 1.20 }
    ],

    cobertura: {
      factor: 1.40,
      sesionesExtra: 1,
      aviso: "Tapar un tatuaje antiguo obliga a diseñar sobre lo que ya hay. " +
             "Casi siempre pide una sesión más y una pieza más grande y más " +
             "oscura de lo que tenías pensado."
    },

    /* Lo que la web debe dejar claro pase lo que pase. */
    nota: "Este cálculo sale de nuestras tarifas reales por hora, pero no es " +
          "un presupuesto. Una foto de la zona y el diseño cambian el número."
  },

  /* ===========================================================================
     6. REGISTRO DE OBRA · la galería
        `img` es el nombre base; la web monta el srcset con los anchos que
        genera tools/fetch-images.py. `ratio` es ancho/alto y evita el salto
        de maquetación mientras la imagen carga.
     ======================================================================== */
  planchas: [
    { n: 1, artista: "vera-mota", estilo: "blackwork", zona: "espalda", ano: 2025,
      titulo: "Dorsal cerrado", sesiones: 4,
      img: "pl-001", ratio: 1.4006,
      alt: "Persona inclinada hacia delante quitándose una sudadera, con la " +
           "espalda cubierta por un trazado ornamental negro de bandas simétricas." },

    { n: 2, artista: "nacho-belmonte", estilo: "realismo", zona: "brazo", ano: 2024,
      titulo: "Rostro y ornamento", sesiones: 5,
      img: "pl-002", ratio: 1.7794,
      alt: "Manga de realismo en el brazo con un rostro femenino de mirada baja " +
           "rodeado de ornamento, resuelto en negro y grises con transiciones " +
           "muy suaves." },

    { n: 3, artista: "lu-arrieta", estilo: "fineline", zona: "brazo", ano: 2025,
      titulo: "Tres piezas, una lectura", sesiones: 2,
      img: "pl-003", ratio: 0.6673,
      alt: "Brazo con varias piezas de línea fina: una flor de tallo largo, una " +
           "corona pequeña sobre el hombro y una banda floral rodeando el bíceps." },

    { n: 4, artista: "tomas-ferrer", estilo: "neotradicional", zona: "brazo", ano: 2024,
      titulo: "Dragón a color", sesiones: 6,
      img: "pl-004", ratio: 1.5,
      alt: "Manga oriental a color cubriendo el brazo entero, con un dragón de " +
           "escamas rojas y naranjas de contorno cerrado sobre fondo de nubes " +
           "en gris." },

    { n: 5, artista: "vera-mota", estilo: "blackwork", zona: "brazo", ano: 2025,
      titulo: "Manga de punta a punta", sesiones: 5,
      img: "pl-005", ratio: 1.5,
      alt: "Brazo extendido en horizontal contra una pared blanca, cubierto de " +
           "punta a punta por una manga densa de negro con el ornamento " +
           "cerrando en la muñeca." },

    { n: 6, artista: "nacho-belmonte", estilo: "realismo", zona: "brazo", ano: 2025,
      titulo: "Ojo, a tamaño grande", sesiones: 3,
      img: "pl-006", ratio: 0.75,
      alt: "Ojo tatuado en realismo de negro y grises a gran escala, con las " +
           "pestañas trazadas una a una y el iris resuelto en degradado de " +
           "puntillismo." },

    { n: 7, artista: "lu-arrieta", estilo: "fineline", zona: "espalda", ano: 2025,
      titulo: "Pieza entre omóplatos", sesiones: 1,
      img: "pl-007", ratio: 0.8918,
      alt: "Espalda de una mujer en penumbra, con una pieza pequeña de línea " +
           "fina entre los omóplatos y flores secas prendidas en el pelo." },

    { n: 8, artista: "tomas-ferrer", estilo: "neotradicional", zona: "brazo", ano: 2023,
      titulo: "Rosas de línea gruesa", sesiones: 3,
      img: "pl-008", ratio: 0.6655,
      alt: "Brazo con piezas tradicionales a color, rosas rojas y hojas verdes " +
           "de línea gruesa, sobre un fondo turquesa desenfocado." },

    { n: 9, artista: "vera-mota", estilo: "blackwork", zona: "espalda", ano: 2024,
      titulo: "Bandada", sesiones: 2,
      img: "pl-009", ratio: 0.6667,
      alt: "Parte alta de una espalda con una escena de árbol y bandada de " +
           "pájaros en negro, las siluetas de las aves subiendo hacia el hombro." },

    { n: 10, artista: "lu-arrieta", estilo: "fineline", zona: "muslo", ano: 2025,
      titulo: "Rama en la cara externa", sesiones: 1,
      img: "pl-010", ratio: 0.7303,
      alt: "Rama floral de línea fina tatuada en la cara externa del muslo, con " +
           "una camisa amarilla apartada con la mano para dejarla a la vista." },

    { n: 11, artista: "lu-arrieta", estilo: "fineline", zona: "mano", ano: 2025,
      titulo: "Mariposa en el dorso", sesiones: 1,
      img: "pl-011", ratio: 0.6667,
      alt: "Mano sosteniendo unas gafas por la patilla, con una mariposa de " +
           "línea fina tatuada en el dorso, sobre fondo gris liso." },

    { n: 12, artista: "tomas-ferrer", estilo: "neotradicional", zona: "mano", ano: 2024,
      titulo: "Golondrinas y rosas", sesiones: 4,
      img: "pl-012", ratio: 1.0,
      alt: "Brazos y manos cruzados cubiertos de piezas tradicionales a color: " +
           "golondrinas, rosas y hojas de contorno negro grueso sobre piel morena." }
  ],

  /* ===========================================================================
     7. FLASH · estado: libre | reservado | tatuado
     ======================================================================== */
  flash: [
    { id: "F-01", titulo: "Llave sin dientes", artista: "vera-mota", precio: 180, cm: 9,
      estado: "libre", svg: "assets/flash/f-01.svg",
      alt: "Diseño flash de una llave antigua sin dientes, en negro sólido con el ojo ornamentado." },
    { id: "F-02", titulo: "Polilla menor", artista: "lu-arrieta", precio: 150, cm: 7,
      estado: "libre", svg: "assets/flash/f-02.svg",
      alt: "Diseño flash de una polilla pequeña de línea fina con las alas abiertas y simétricas." },
    { id: "F-03", titulo: "Daga corta", artista: "tomas-ferrer", precio: 220, cm: 12,
      estado: "reservado", svg: "assets/flash/f-03.svg",
      alt: "Diseño flash de una daga corta de línea cerrada con la empuñadura decorada." },
    { id: "F-04", titulo: "Ojo seccionado", artista: "nacho-belmonte", precio: 260, cm: 11,
      estado: "libre", svg: "assets/flash/f-04.svg",
      alt: "Diseño flash de un ojo dibujado como lámina anatómica, con el corte vertical marcado." },
    { id: "F-05", titulo: "Cerradura", artista: "vera-mota", precio: 170, cm: 8,
      estado: "tatuado", svg: "assets/flash/f-05.svg",
      alt: "Diseño flash de una cerradura ornamental de negro sólido y contorno simétrico." },
    { id: "F-06", titulo: "Rama de tres", artista: "lu-arrieta", precio: 130, cm: 6,
      estado: "libre", svg: "assets/flash/f-06.svg",
      alt: "Diseño flash de una rama con tres hojas de trazo muy fino, ligeramente curvada." },
    { id: "F-07", titulo: "Luna en cuarto", artista: "tomas-ferrer", precio: 190, cm: 10,
      estado: "tatuado", svg: "assets/flash/f-07.svg",
      alt: "Diseño flash de una luna en cuarto creciente con el perfil marcado y sombra interior." },
    { id: "F-08", titulo: "Caracola seccionada", artista: "nacho-belmonte", precio: 240, cm: 13,
      estado: "libre", svg: "assets/flash/f-08.svg",
      alt: "Diseño flash de una caracola cortada por la mitad, con la espiral y los " +
           "tabiques internos a la vista y una escala gráfica al pie." }
  ],

  /* ===========================================================================
     8. CUIDADOS · la línea de tiempo
     ======================================================================== */
  cuidados: {
    fases: [
      {
        id: "dia-0", etiqueta: "Día 0", titulo: "El día de la sesión",
        resumen: "Sales con film o con segunda piel. Ni lo toques todavía.",
        hacer: [
          "Si llevas film normal: quítalo a las 3 o 4 horas, no antes.",
          "Lava con agua templada y jabón neutro, con la mano limpia, sin esponja.",
          "Seca dando toquecitos con papel de cocina. Nunca con la toalla del baño.",
          "Capa muy fina de crema. Si brilla, has puesto de más."
        ],
        evitar: [
          "Alcohol, esa noche no.",
          "Gimnasio, sauna y piscina.",
          "Dormir sobre la zona sin nada encima."
        ],
        alarma: []
      },
      {
        id: "dia-1-3", etiqueta: "Días 1 a 3", titulo: "Supura y escuece",
        resumen: "Suelta plasma y tinta. Es normal y es asqueroso.",
        hacer: [
          "Lavar 2 o 3 veces al día, siempre con las manos limpias.",
          "Crema en capa fina después de cada lavado.",
          "Ropa holgada y de algodón sobre la zona."
        ],
        evitar: [
          "Rascarse, aunque pique.",
          "Baño de inmersión, piscina, mar.",
          "Sol directo sobre la zona.",
          "Cremas con perfume o vaselina espesa."
        ],
        alarma: [
          "Rojo que se extiende más de 2 cm alrededor del tatuaje.",
          "Fiebre."
        ]
      },
      {
        id: "dia-4-7", etiqueta: "Días 4 a 7", titulo: "Empieza la costra",
        resumen: "Se seca y tira. Aquí es donde la gente lo estropea.",
        hacer: [
          "Seguir lavando e hidratando, igual que antes.",
          "Dejar que la costra caiga sola."
        ],
        evitar: [
          "Arrancar costra. Te llevas la tinta con ella.",
          "Frotar con la toalla.",
          "Afeitar la zona."
        ],
        alarma: [
          "Pus amarillo o verde.",
          "Dolor que va a más en vez de a menos."
        ]
      },
      {
        id: "dia-8-14", etiqueta: "Días 8 a 14", titulo: "Pica y se pela",
        resumen: "Parece una quemadura del sol curándose. Va bien.",
        hacer: [
          "Hidratar cuando notes tirantez.",
          "Dar palmaditas si pica. No rascar."
        ],
        evitar: [
          "Piscina y mar todavía.",
          "Sol directo.",
          "Sesión de deporte que roce la zona."
        ],
        alarma: [
          "Ampollas.",
          "Zonas que siguen en carne viva pasados 12 días."
        ]
      },
      {
        id: "dia-15-30", etiqueta: "Días 15 a 30", titulo: "Cierra la piel",
        resumen: "Por fuera está curado. Por dentro todavía no.",
        hacer: [
          "Hidratación diaria.",
          "Empezar a usar protección 50 si vas a dar el sol."
        ],
        evitar: [
          "Bronceado y cabina.",
          "Juzgar el resultado: aún no está asentado."
        ],
        alarma: [
          "Relieve rojo permanente en las líneas (posible queloide)."
        ]
      },
      {
        id: "mes-2", etiqueta: "Mes 2 en adelante", titulo: "Ya es tuyo",
        resumen: "Curado. Ahora solo hay que no quemarlo.",
        hacer: [
          "Protección 50 siempre que le dé el sol. Es lo único que decide cómo se ve dentro de diez años.",
          "Hidratar de vez en cuando.",
          "Si algo ha quedado flojo, escríbenos: el repaso entra en el precio durante 3 meses."
        ],
        evitar: [
          "Sol sin protección. En serio."
        ],
        alarma: []
      }
    ],

    recordatorios: {
      titulo: "Recordatorios de cuidados",
      texto: "Descarga un archivo de calendario con los avisos de cada fase. " +
             "Se abre en el calendario que ya usas: no hace falta instalar nada " +
             "ni darnos tu correo.",
      boton: "Descargar recordatorios (.ics)",
      hitos: [
        { dias: 0,  titulo: "Primer lavado del tatuaje",
          nota: "Agua templada, jabón neutro, capa fina de crema." },
        { dias: 1,  titulo: "Lavar e hidratar 2-3 veces",
          nota: "Va a supurar. Es normal." },
        { dias: 4,  titulo: "Empieza la costra: no tocar",
          nota: "Arrancar costra se lleva la tinta." },
        { dias: 8,  titulo: "Va a picar: palmaditas, no rascar",
          nota: "Nada de piscina ni mar." },
        { dias: 15, titulo: "Piel cerrada: empezar con protección 50",
          nota: "Por dentro todavía se está asentando." },
        { dias: 30, titulo: "Curado. Revisa si hay que repasar algo",
          nota: "El repaso entra en el precio durante 3 meses." }
      ]
    },

    urgencia: {
      titulo: "Cuándo llamar al médico y no a nosotros",
      texto: "Fiebre, rojo que se extiende, pus amarillo o verde, dolor que va " +
             "a más pasado el tercer día. Eso no lo arregla un tatuador: " +
             "centro de salud. Y avísanos después."
    }
  },

  /* ===========================================================================
     9. HUECOS POR CANCELACIÓN
        Fechas en formato AAAA-MM-DD. Los pasados se ocultan solos.
     ======================================================================== */
  huecos: [
    { fecha: "2026-09-24", hora: "16:00", duracion: "3 h", artista: "lu-arrieta",
      nota: "Hueco de tarde. Entra una pieza de hasta 12 cm." },
    { fecha: "2026-09-26", hora: "12:00", duracion: "5 h", artista: "vera-mota",
      nota: "Sesión larga. Ideal para arrancar una pieza grande." },
    { fecha: "2026-10-02", hora: "17:30", duracion: "2 h", artista: "tomas-ferrer",
      nota: "Corto: flash o pieza pequeña a color." }
  ],

  listaEspera: {
    titulo: "Lista de cancelaciones",
    texto: "Si no te cuadra ninguno, déjanos tu disponibilidad. Cuando alguien " +
           "anule y encaje contigo, te escribimos a ti primero.",
    aviso: "No mandamos nada más. Ni promociones, ni novedades, ni felicitaciones."
  },

  /* ===========================================================================
     10. PIE Y LEGAL
     ======================================================================== */
  pie: {
    creditos: "Estudio ficticio construido como demostración.",
    enlaces: [
      { texto: "Aviso legal", href: "#" },
      { texto: "Privacidad",  href: "#" },
      { texto: "Cookies",     href: "#" }
    ],
    sanidad: "Centro autorizado por la Comunidad de Madrid. Material de un " +
             "solo uso. Tinta con ficha técnica disponible en el estudio."
  }
};
