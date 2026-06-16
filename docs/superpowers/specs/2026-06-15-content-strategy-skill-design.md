# Diseño: Skill `content-strategy`

> **Estado:** aprobado para plan **Owner:** Daniel Rodriguez **Fecha:** 2026-06-15

## Resumen

Skill que genera la **estrategia de contenido y arquitectura de información** de un sitio a partir de material libre suministrado por el cliente (PDFs, transcripciones, catálogos, brandboard, wireframes). Decide qué páginas existen, qué secciones lleva cada una, en qué orden, con qué justificación, y cómo fluye la navegación hacia la conversión — partiendo de un entendimiento del usuario potencial según el rubro.

**Entrada libre, salida estructurada.** No hay contrato de entrada: el cliente manda lo que tenga. La salida sí es un contrato estable: un JSON abstracto + un MD de justificación.

**Posición en el pipeline:** Fase 2, **antes** de la Hoja de Requerimientos y del pipeline de copy. Su salida es el insumo estratégico que un humano (o una skill futura `requirements-builder`) traduce a `bloque_id` + `variante` concretos del catálogo `@procerus/blocks`.

## Problema que resuelve

Un sitio puede verse correcto y tener el contenido mal estructurado: la segunda sección del home podría deber ser servicios y no la línea de tiempo. Hoy la infraestructura de Procerus tiene contratos para datos de negocio, marca, imágenes y copy, pero **la decisión de qué páginas y secciones existen y por qué** no está cubierta por ninguna skill. La Hoja de Requerimientos se describe como "generada por la herramienta interna" sin generador real. Esta skill produce la capa estratégica upstream de esa hoja.

## No-objetivos (YAGNI)

- **No** emite `bloque_id`/`variante` concretos del catálogo (decisión: salida abstracta, desacoplada del versionado de `@procerus/blocks`).
- **No** genera `sitemap.xml`, meta tags ni JSON-LD — eso es de `technical-seo`.
- **No** hace investigación web del rubro — razona del material suministrado.
- **No** define un esquema de entrada ni valida contra contrato de entrada.
- **No** genera copy final — define intención y contenido *esperado*, no el texto aprobado.

## Entrada

La skill recibe **una ruta a una carpeta** y lee todo lo legible dentro:

- Formatos: `.pdf`, `.md`, `.txt`, transcripciones, wireframes.
- Clasifica cada fuente por su contenido: transcripción / catálogo / marca / wireframe / datos de negocio / otro.
- Cuando un PDF pesado tiene gemelo `.md`, prefiere el `.md` (ej. `Catalogo Casa Grande.md` sobre el PDF de 30 MB).
- PDFs se leen con el tool Read por rango de páginas.

**Manejo de incompletitud (regla central):** el cliente suele mandar información parcial. La skill nunca rellena datos faltantes como si fueran ciertos. Todo lo deducido se etiqueta como supuesto y todo lo ausente se registra como vacío.

## Salida

Dos archivos, nombrados por `cliente_id` cuando se conoce (si no, por nombre comercial en kebab):

1. `content-strategy.json` — contrato abstracto (esquema abajo). Lenguaje común con el resto de la infraestructura.
2. `content-strategy.md` — justificación legible: fuentes usadas, mapa de conocimiento (qué sé / qué falta / qué asumo), perfil de usuario, sitemap razonado, justificación de cada sección, flujo de navegación, y diagnóstico de auditoría si hubo sitio existente.

El `.json` representa siempre la estrategia **ideal/propuesta**. La auditoría del sitio actual vive solo en el `.md` como diagnóstico "actual vs propuesto".

## Proceso (paso a paso de la skill)

1. **Inventario de fuentes** — listar y clasificar los archivos de la carpeta.
2. **Ingesta** — leer cada fuente; construir base de conocimiento interna del negocio.
3. **Mapa de conocimiento** — consolidar *qué sé / qué falta / qué asumo*. Alimenta `meta` del JSON y una sección del MD.
4. **Perfil de usuario potencial** — razonar del rubro, tipo de negocio y ubicación: contexto, necesidad, objeción, job-to-be-done, nivel de conciencia.
5. **Objetivo de conversión** — primario y secundarios.
6. **Sitemap** — qué páginas existen y por qué cada una.
7. **Secciones por página** — para cada página: intención semántica, orden, contenido esperado, CTA y justificación de la decisión.
8. **Flujo de navegación y coherencia entre páginas** — entradas, rutas hacia conversión, jerarquía del nav; verificar que no se repita contenido y que haya narrativa progresiva.
9. **Auditoría (condicional)** — si se apunta a un sitio existente, comparar su estructura contra la propuesta y escribir el diagnóstico en el MD.
10. **Emitir** `.json` + `.md`.

## Esquema del JSON de salida (contrato nuevo)

```json
{
  "meta": {
    "cliente": "",
    "cliente_id": "c_XXXXX",
    "generado_por": "skill:content-strategy",
    "fecha": "YYYY-MM-DD",
    "version": 1,
    "fuentes": ["archivo-1.md", "archivo-2.pdf"],
    "supuestos": ["tipo_negocio inferido como B2B industrial desde la transcripción"],
    "vacios": ["no hay colorimetría confirmada", "faltan certificaciones específicas"]
  },
  "usuario_objetivo": {
    "perfiles": [
      {
        "nombre": "",
        "contexto": "",
        "necesidad": "",
        "objecion": "",
        "job_to_be_done": ""
      }
    ],
    "nivel_conciencia": "inconsciente|consciente-problema|consciente-solucion",
    "dispositivo_dominante": "movil|escritorio"
  },
  "objetivo_conversion": {
    "primario": "",
    "secundarios": []
  },
  "paginas": [
    {
      "pagina": "home",
      "ruta": "/",
      "tipo": "unica|template",
      "objetivo": "",
      "prioridad": 1,
      "secciones": [
        {
          "orden": 1,
          "intencion": "hero-propuesta-valor",
          "objetivo": "",
          "contenido_esperado": "",
          "cta": "",
          "justificacion": ""
        }
      ]
    }
  ],
  "flujo_navegacion": {
    "entradas": [],
    "rutas_a_conversion": [],
    "jerarquia_nav": []
  }
}
```

### Convenciones reusadas (lenguaje común)

- `meta.cliente_id` en formato `c_XXXXX` (igual que datos-de-negocio, brand-identity, copy aprobado).
- `pagina` y `ruta` con la misma semántica que la Hoja de Requerimientos y el copy aprobado.
- `orden` por sección, para que `pagina` + `orden` empaten luego con el copy aprobado y la hoja.

### Enum de `intencion` (vocabulario controlado)

Curado dentro de la skill para que el mapeo futuro a bloques sea determinista. Cerrado pero ampliable (agregar valor = cambio menor; renombrar/eliminar = cambio mayor).

| `intencion` | Propósito de la sección |
|-------------|-------------------------|
| `hero-propuesta-valor` | Apertura: quién es y qué ofrece, con CTA principal |
| `prueba-social` | Logos de clientes, métricas de confianza, sellos |
| `servicios-resumen` | Panorama de servicios/categorías, sin profundizar |
| `servicio-detalle` | Desarrollo profundo de un servicio individual |
| `catalogo-vitrina` | Muestra de productos/categorías sin e-commerce (vitrina, no carrito) |
| `razones-elegirnos` | Diferenciadores: experiencia, tecnología, certificaciones |
| `experiencia-proyectos` | Casos/proyectos ejecutados como evidencia |
| `sobre-nosotros` | Historia, misión, visión, fundadores |
| `linea-tiempo` | Trayectoria cronológica del negocio |
| `equipo` | Personas detrás del negocio |
| `proceso-como-trabajamos` | Pasos del servicio o de la compra |
| `testimonios` | Citas de clientes |
| `certificaciones-alianzas` | Acreditaciones, alianzas, proveedores representados |
| `cobertura-area-servicio` | Zonas geográficas atendidas |
| `cta-conversion` | Bloque dedicado a empujar la conversión (WhatsApp/formulario) |
| `contacto` | Datos de contacto, formulario, mapa, horario |
| `faq` | Preguntas frecuentes |
| `cierre-cta` | CTA final de cierre de página |

> El enum se define en `references/intenciones.md` dentro de la skill y se mantiene ahí como fuente de verdad.

## Ubicación e instalación

- Vive en `Procerus/web-skills/content-strategy/` (junto a las otras skills propias de la suite).
- Symlink en `~/.claude/skills/content-strategy`.
- `SKILL.md` con frontmatter `name` + `description` con triggers en español ("estrategia de contenido", "arquitectura de información", "qué secciones", "estructura del sitio", "flujo de navegación") consistente con el resto de la suite.
- `references/intenciones.md` con el enum y su descripción.

## Casos de aceptación

1. **Caso Casa Grande:** apuntar la skill a `casa-grande/docs/` produce un `content-strategy.json` que identifica usuario B2B industrial, conversión = cotización por WhatsApp, sitemap multipágina (web corporativa, no landing), y secciones del home con justificación; más un `content-strategy.md` que cita las fuentes y lista supuestos/vacíos (ej. colorimetría no confirmada).
2. **Entrada incompleta:** con solo un PDF de catálogo, la skill genera estrategia parcial y registra explícitamente todo lo asumido y lo faltante; no inventa datos como ciertos.
3. **Auditoría:** apuntando a un sitio existente, el MD incluye un diagnóstico "actual vs propuesto" señalando, por ejemplo, que la segunda sección del home debería ser servicios y no la línea de tiempo.
4. **Validez de salida:** el JSON respeta el esquema, todo `intencion` pertenece al enum, y `meta.cliente_id` cumple `c_XXXXX` cuando se conoce.
