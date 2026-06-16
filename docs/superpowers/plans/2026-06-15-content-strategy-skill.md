# content-strategy Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la skill `content-strategy`, que sintetiza material libre del cliente (PDFs, transcripciones, catálogos, brandboard) en una estrategia de contenido y arquitectura de información, emitiendo un JSON con esquema estable + un MD de justificación.

**Architecture:** Skill en formato Agent Skills (`SKILL.md` + `references/` + `scripts/`). La salida es un contrato JSON validable con un JSON Schema (draft 2020-12) verificado por un script Python (`jsonschema`). El campo `intencion` es un enum cerrado cuya única fuente de verdad se mantiene sincronizada entre `references/intenciones.md` y `references/schema.json` por un test. Entrada libre (sin contrato), salida estructurada.

**Tech Stack:** Markdown (Agent Skills), JSON Schema draft 2020-12, Python 3 + `jsonschema` 4.25, Bash, git.

**Repos involucrados:**
- Skill se crea en: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/` (los commits de implementación van a ESTE repo).
- Symlink de instalación: `~/.claude/skills/content-strategy`.
- Este plan y el spec viven en el repo web (`casa-grande/web`).

**Spec de referencia:** `docs/superpowers/specs/2026-06-15-content-strategy-skill-design.md`

---

## File Structure

Dentro de `web-skills/content-strategy/`:

- `SKILL.md` — frontmatter (name, description con triggers) + cuerpo: proceso paso a paso, manejo de entrada libre, manejo de incompletitud, instrucciones de salida.
- `references/intenciones.md` — enum de `intencion` (18 valores) con descripción. Fuente de verdad humana.
- `references/schema.json` — JSON Schema del contrato de salida. Fuente de verdad de máquina.
- `references/output-template.md` — plantilla del `.md` de justificación.
- `scripts/validate.py` — valida un JSON de estrategia contra `schema.json`. Usable en tests y en runtime (autochequeo de la skill).
- `scripts/check_enum_sync.py` — verifica que el enum de `intencion` coincida entre `intenciones.md` y `schema.json`.
- `tests/fixtures/valid.json` — ejemplo válido mínimo.
- `tests/fixtures/invalid-intencion.json` — ejemplo con `intencion` fuera del enum (debe fallar).
- `tests/fixtures/invalid-cliente-id.json` — ejemplo con `cliente_id` mal formado (debe fallar).

---

### Task 1: Scaffold del directorio de la skill + SKILL.md mínimo

**Files:**
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/SKILL.md`

- [ ] **Step 1: Crear el directorio y el frontmatter mínimo del SKILL.md**

Crear `content-strategy/SKILL.md` con SOLO el frontmatter por ahora (el cuerpo se escribe en Task 6):

```markdown
---
name: content-strategy
description: Use when defining a site's content strategy and information architecture from raw client material (PDFs, transcripts, catalogs, brandboard) - which pages exist, what sections each page has, in what order, navigation flow, and the target user profile by industry. Outputs a stable JSON contract plus an MD justification. Triggers - "estrategia de contenido", "arquitectura de información", "qué secciones", "estructura del sitio", "flujo de navegación", "qué páginas", "sitemap de contenido".
---

# Content Strategy

(cuerpo pendiente — Task 6)
```

- [ ] **Step 2: Verificar que el frontmatter parsea y el name coincide con el directorio**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
python3 -c "import re,sys; t=open('content-strategy/SKILL.md').read(); m=re.search(r'^name:\s*(\S+)', t, re.M); assert m and m.group(1)=='content-strategy', 'name mismatch'; print('frontmatter OK:', m.group(1))"
```
Expected: `frontmatter OK: content-strategy`

- [ ] **Step 3: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add content-strategy/SKILL.md && \
git commit -m "skill(content-strategy): scaffold SKILL.md frontmatter"
```

---

### Task 2: Enum de intenciones (`references/intenciones.md`)

**Files:**
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/references/intenciones.md`

- [ ] **Step 1: Escribir el archivo del enum**

Crear `content-strategy/references/intenciones.md`. El parser de Task 4 extrae el token entre backticks de la PRIMERA columna de cada fila de la tabla, así que el formato de la tabla es contractual:

```markdown
# Enum de `intencion`

Vocabulario controlado para `seccion.intencion`. Fuente de verdad humana; debe coincidir con el enum de `references/schema.json` (verificado por `scripts/check_enum_sync.py`).

Cerrado pero ampliable: agregar un valor es cambio menor; renombrar o eliminar es cambio mayor (rompe estrategias existentes y su mapeo futuro a bloques).

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
```

- [ ] **Step 2: Verificar que se extraen exactamente 18 valores**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
python3 -c "import re; rows=re.findall(r'^\|\s*\`([a-z0-9-]+)\`\s*\|', open('content-strategy/references/intenciones.md').read(), re.M); print(len(rows), 'valores'); assert len(rows)==18, rows"
```
Expected: `18 valores`

- [ ] **Step 3: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add content-strategy/references/intenciones.md && \
git commit -m "skill(content-strategy): add intencion enum reference"
```

---

### Task 3: JSON Schema del contrato + validador + fixtures (TDD)

**Files:**
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/scripts/validate.py`
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/tests/fixtures/valid.json`
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/tests/fixtures/invalid-intencion.json`
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/tests/fixtures/invalid-cliente-id.json`
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/references/schema.json`

- [ ] **Step 1: Escribir el fixture válido (la prueba)**

Crear `content-strategy/tests/fixtures/valid.json`:

```json
{
  "meta": {
    "cliente": "Casa Grande",
    "cliente_id": "c_00142",
    "generado_por": "skill:content-strategy",
    "fecha": "2026-06-15",
    "version": 1,
    "fuentes": ["carol_1_transcripcion.md", "Catalogo Casa Grande.md"],
    "supuestos": ["tipo_negocio inferido como B2B industrial desde la transcripción"],
    "vacios": ["no hay colorimetría confirmada"]
  },
  "usuario_objetivo": {
    "perfiles": [
      {
        "nombre": "Comprador industrial",
        "contexto": "Empresa o industria que necesita suministros y mantenimiento",
        "necesidad": "Proveedor confiable con experiencia comprobada",
        "objecion": "¿Pueden con contratos grandes y serios?",
        "job_to_be_done": "Encontrar y cotizar un proveedor formal sin perder tiempo"
      }
    ],
    "nivel_conciencia": "consciente-solucion",
    "dispositivo_dominante": "escritorio"
  },
  "objetivo_conversion": {
    "primario": "Solicitud de cotización por WhatsApp",
    "secundarios": ["Llamada telefónica", "Envío de formulario"]
  },
  "paginas": [
    {
      "pagina": "home",
      "ruta": "/",
      "tipo": "unica",
      "objetivo": "Comunicar qué es Casa Grande y llevar a cotizar",
      "prioridad": 1,
      "secciones": [
        {
          "orden": 1,
          "intencion": "hero-propuesta-valor",
          "objetivo": "Establecer la propuesta de valor en el primer vistazo",
          "contenido_esperado": "Titular con +20 años y 100% de contratos ejecutados, CTA a WhatsApp",
          "cta": "Cotizar por WhatsApp",
          "justificacion": "El usuario llega consciente de su necesidad; necesita confianza inmediata"
        },
        {
          "orden": 2,
          "intencion": "servicios-resumen",
          "objetivo": "Mostrar el alcance de servicios antes que la historia",
          "contenido_esperado": "4 servicios englobados con enlace al detalle",
          "cta": null,
          "justificacion": "El cliente B2B prioriza qué ofreces sobre tu trayectoria; la historia va después"
        }
      ]
    }
  ],
  "flujo_navegacion": {
    "entradas": ["home", "servicios"],
    "rutas_a_conversion": ["home -> servicios -> contacto (WhatsApp)"],
    "jerarquia_nav": ["Nosotros", "Suministros", "Servicios", "Experiencia", "Contacto"]
  }
}
```

- [ ] **Step 2: Escribir el validador**

Crear `content-strategy/scripts/validate.py`:

```python
#!/usr/bin/env python3
"""Valida un JSON de estrategia de contenido contra references/schema.json.

Uso: python3 scripts/validate.py <archivo.json>
Salida: exit 0 si valida, exit 1 con errores impresos si no.
"""
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

SCHEMA_PATH = Path(__file__).resolve().parent.parent / "references" / "schema.json"


def main(argv):
    if len(argv) != 2:
        print("uso: python3 scripts/validate.py <archivo.json>", file=sys.stderr)
        return 2
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    data = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: list(e.path))
    if errors:
        for e in errors:
            loc = "/".join(str(p) for p in e.path) or "(raíz)"
            print(f"INVALID en {loc}: {e.message}", file=sys.stderr)
        return 1
    print("VALID")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 3: Correr el validador contra el fixture válido para verificar que FALLA (schema no existe aún)**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
python3 scripts/validate.py tests/fixtures/valid.json
```
Expected: FALLA con error de archivo no encontrado (`schema.json` aún no existe) — confirma que la prueba ejercita el schema.

- [ ] **Step 4: Escribir el JSON Schema (implementación mínima)**

Crear `content-strategy/references/schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://procerus.dev/schemas/content-strategy.json",
  "title": "Content Strategy",
  "type": "object",
  "additionalProperties": false,
  "required": ["meta", "usuario_objetivo", "objetivo_conversion", "paginas", "flujo_navegacion"],
  "properties": {
    "meta": {
      "type": "object",
      "additionalProperties": false,
      "required": ["cliente", "generado_por", "fecha", "version", "fuentes", "supuestos", "vacios"],
      "properties": {
        "cliente": { "type": "string", "minLength": 1 },
        "cliente_id": { "type": "string", "pattern": "^c_[0-9]{5}$" },
        "generado_por": { "const": "skill:content-strategy" },
        "fecha": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
        "version": { "type": "integer", "minimum": 1 },
        "fuentes": { "type": "array", "minItems": 1, "items": { "type": "string" } },
        "supuestos": { "type": "array", "items": { "type": "string" } },
        "vacios": { "type": "array", "items": { "type": "string" } }
      }
    },
    "usuario_objetivo": {
      "type": "object",
      "additionalProperties": false,
      "required": ["perfiles", "nivel_conciencia", "dispositivo_dominante"],
      "properties": {
        "perfiles": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["nombre", "contexto", "necesidad", "objecion", "job_to_be_done"],
            "properties": {
              "nombre": { "type": "string", "minLength": 1 },
              "contexto": { "type": "string" },
              "necesidad": { "type": "string" },
              "objecion": { "type": "string" },
              "job_to_be_done": { "type": "string" }
            }
          }
        },
        "nivel_conciencia": { "enum": ["inconsciente", "consciente-problema", "consciente-solucion"] },
        "dispositivo_dominante": { "enum": ["movil", "escritorio"] }
      }
    },
    "objetivo_conversion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["primario", "secundarios"],
      "properties": {
        "primario": { "type": "string", "minLength": 1 },
        "secundarios": { "type": "array", "items": { "type": "string" } }
      }
    },
    "paginas": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["pagina", "ruta", "tipo", "objetivo", "prioridad", "secciones"],
        "properties": {
          "pagina": { "type": "string", "minLength": 1 },
          "ruta": { "type": "string", "pattern": "^/" },
          "tipo": { "enum": ["unica", "template"] },
          "objetivo": { "type": "string" },
          "prioridad": { "type": "integer", "minimum": 1 },
          "secciones": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": ["orden", "intencion", "objetivo", "contenido_esperado", "cta", "justificacion"],
              "properties": {
                "orden": { "type": "integer", "minimum": 1 },
                "intencion": {
                  "enum": [
                    "hero-propuesta-valor",
                    "prueba-social",
                    "servicios-resumen",
                    "servicio-detalle",
                    "catalogo-vitrina",
                    "razones-elegirnos",
                    "experiencia-proyectos",
                    "sobre-nosotros",
                    "linea-tiempo",
                    "equipo",
                    "proceso-como-trabajamos",
                    "testimonios",
                    "certificaciones-alianzas",
                    "cobertura-area-servicio",
                    "cta-conversion",
                    "contacto",
                    "faq",
                    "cierre-cta"
                  ]
                },
                "objetivo": { "type": "string" },
                "contenido_esperado": { "type": "string" },
                "cta": { "type": ["string", "null"] },
                "justificacion": { "type": "string", "minLength": 1 }
              }
            }
          }
        }
      }
    },
    "flujo_navegacion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["entradas", "rutas_a_conversion", "jerarquia_nav"],
      "properties": {
        "entradas": { "type": "array", "items": { "type": "string" } },
        "rutas_a_conversion": { "type": "array", "items": { "type": "string" } },
        "jerarquia_nav": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

- [ ] **Step 5: Correr el validador contra el fixture válido para verificar que PASA**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
python3 scripts/validate.py tests/fixtures/valid.json
```
Expected: `VALID` (exit 0)

- [ ] **Step 6: Escribir fixtures inválidos (pruebas negativas)**

Crear `content-strategy/tests/fixtures/invalid-intencion.json` — copia de `valid.json` pero con la primera sección usando un `intencion` fuera del enum:

```json
{
  "meta": {
    "cliente": "Test",
    "generado_por": "skill:content-strategy",
    "fecha": "2026-06-15",
    "version": 1,
    "fuentes": ["x.md"],
    "supuestos": [],
    "vacios": []
  },
  "usuario_objetivo": {
    "perfiles": [
      { "nombre": "X", "contexto": "x", "necesidad": "x", "objecion": "x", "job_to_be_done": "x" }
    ],
    "nivel_conciencia": "consciente-solucion",
    "dispositivo_dominante": "escritorio"
  },
  "objetivo_conversion": { "primario": "x", "secundarios": [] },
  "paginas": [
    {
      "pagina": "home",
      "ruta": "/",
      "tipo": "unica",
      "objetivo": "x",
      "prioridad": 1,
      "secciones": [
        {
          "orden": 1,
          "intencion": "seccion-bonita-de-arriba",
          "objetivo": "x",
          "contenido_esperado": "x",
          "cta": null,
          "justificacion": "x"
        }
      ]
    }
  ],
  "flujo_navegacion": { "entradas": [], "rutas_a_conversion": [], "jerarquia_nav": [] }
}
```

Crear `content-strategy/tests/fixtures/invalid-cliente-id.json` — copia de `valid.json` reducida pero con `cliente_id` mal formado:

```json
{
  "meta": {
    "cliente": "Test",
    "cliente_id": "00142",
    "generado_por": "skill:content-strategy",
    "fecha": "2026-06-15",
    "version": 1,
    "fuentes": ["x.md"],
    "supuestos": [],
    "vacios": []
  },
  "usuario_objetivo": {
    "perfiles": [
      { "nombre": "X", "contexto": "x", "necesidad": "x", "objecion": "x", "job_to_be_done": "x" }
    ],
    "nivel_conciencia": "consciente-solucion",
    "dispositivo_dominante": "escritorio"
  },
  "objetivo_conversion": { "primario": "x", "secundarios": [] },
  "paginas": [
    {
      "pagina": "home",
      "ruta": "/",
      "tipo": "unica",
      "objetivo": "x",
      "prioridad": 1,
      "secciones": [
        {
          "orden": 1,
          "intencion": "hero-propuesta-valor",
          "objetivo": "x",
          "contenido_esperado": "x",
          "cta": null,
          "justificacion": "x"
        }
      ]
    }
  ],
  "flujo_navegacion": { "entradas": [], "rutas_a_conversion": [], "jerarquia_nav": [] }
}
```

- [ ] **Step 7: Verificar que ambos fixtures inválidos FALLAN**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
python3 scripts/validate.py tests/fixtures/invalid-intencion.json; echo "exit=$?"; \
python3 scripts/validate.py tests/fixtures/invalid-cliente-id.json; echo "exit=$?"
```
Expected: ambos imprimen `INVALID ...` y `exit=1`. El primero por `intencion` fuera del enum; el segundo por `cliente_id` que no cumple `^c_[0-9]{5}$`.

- [ ] **Step 8: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add content-strategy/references/schema.json content-strategy/scripts/validate.py content-strategy/tests/fixtures && \
git commit -m "skill(content-strategy): add output JSON schema + validator + fixtures"
```

---

### Task 4: Test de sincronía del enum entre `intenciones.md` y `schema.json`

**Files:**
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/scripts/check_enum_sync.py`

- [ ] **Step 1: Escribir el test de sincronía**

Crear `content-strategy/scripts/check_enum_sync.py`:

```python
#!/usr/bin/env python3
"""Verifica que el enum de `intencion` coincida entre intenciones.md y schema.json.

Salida: exit 0 si coinciden, exit 1 con el diff si no.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "references" / "intenciones.md"
SCHEMA = ROOT / "references" / "schema.json"


def enum_from_md():
    rows = re.findall(r"^\|\s*`([a-z0-9-]+)`\s*\|", MD.read_text(encoding="utf-8"), re.M)
    return rows


def enum_from_schema():
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    return (
        schema["properties"]["paginas"]["items"]["properties"]["secciones"]["items"]
        ["properties"]["intencion"]["enum"]
    )


def main():
    md = enum_from_md()
    sch = enum_from_schema()
    if md == sch:
        print(f"enum sincronizado ({len(md)} valores)")
        return 0
    print("DESINCRONIZADO", file=sys.stderr)
    print("solo en intenciones.md:", sorted(set(md) - set(sch)), file=sys.stderr)
    print("solo en schema.json:", sorted(set(sch) - set(md)), file=sys.stderr)
    if set(md) == set(sch):
        print("(mismos valores, distinto orden)", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Correr el test de sincronía y verificar que PASA**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
python3 scripts/check_enum_sync.py
```
Expected: `enum sincronizado (18 valores)` (exit 0)

- [ ] **Step 3: Verificar que el test DETECTA una desincronía (prueba del test)**

Run (introduce un valor extra temporal en el schema, corre, y revierte):
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
cp references/schema.json /tmp/schema.bak.json && \
python3 -c "import json,io; p='references/schema.json'; d=json.load(open(p)); d['properties']['paginas']['items']['properties']['secciones']['items']['properties']['intencion']['enum'].append('valor-falso'); json.dump(d, open(p,'w'), ensure_ascii=False, indent=2)" && \
python3 scripts/check_enum_sync.py; echo "exit=$?"; \
mv /tmp/schema.bak.json references/schema.json && \
python3 scripts/check_enum_sync.py
```
Expected: la corrida del medio imprime `DESINCRONIZADO` y `exit=1`; la última (tras revertir) vuelve a `enum sincronizado (18 valores)`.

- [ ] **Step 4: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add content-strategy/scripts/check_enum_sync.py && \
git commit -m "skill(content-strategy): add enum sync check"
```

---

### Task 5: Plantilla del MD de justificación (`references/output-template.md`)

**Files:**
- Create: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/references/output-template.md`

- [ ] **Step 1: Escribir la plantilla**

Crear `content-strategy/references/output-template.md`:

```markdown
# Estrategia de contenido — {{cliente}}

> Generado por skill:content-strategy · {{fecha}} · versión {{version}}

## Fuentes usadas

{{lista de archivos leídos de la carpeta de entrada}}

## Mapa de conocimiento

- **Qué sé:** {{hechos confirmados extraídos de las fuentes}}
- **Qué falta:** {{información ausente — corresponde a meta.vacios}}
- **Qué asumo:** {{deducciones marcadas como supuesto — corresponde a meta.supuestos}}

## Perfil del usuario potencial

{{por cada perfil: nombre, contexto, necesidad, objeción, job-to-be-done}}

Nivel de conciencia: {{nivel}} · Dispositivo dominante: {{dispositivo}}

## Objetivo de conversión

- Primario: {{primario}}
- Secundarios: {{secundarios}}

## Sitemap razonado

{{por cada página: nombre, ruta, por qué existe}}

## Secciones por página

{{por cada página, por cada sección en orden: intención, objetivo, contenido esperado, CTA y justificación de por qué va aquí y en este orden}}

## Flujo de navegación

- Entradas: {{entradas}}
- Rutas a conversión: {{rutas_a_conversion}}
- Jerarquía del nav: {{jerarquia_nav}}

## Diagnóstico: sitio actual vs propuesto (solo si se auditó un sitio existente)

{{diferencias detectadas, ej: "la 2.ª sección del home es línea de tiempo; debería ser servicios-resumen porque el usuario B2B prioriza alcance sobre trayectoria"}}
```

- [ ] **Step 2: Verificar que la plantilla cubre las secciones obligatorias**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
for s in "Fuentes usadas" "Mapa de conocimiento" "Perfil del usuario" "Objetivo de conversión" "Sitemap razonado" "Secciones por página" "Flujo de navegación" "Diagnóstico"; do \
  grep -q "$s" references/output-template.md && echo "OK: $s" || { echo "FALTA: $s"; exit 1; }; \
done
```
Expected: 8 líneas `OK: ...`

- [ ] **Step 3: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add content-strategy/references/output-template.md && \
git commit -m "skill(content-strategy): add MD justification template"
```

---

### Task 6: Cuerpo del SKILL.md (proceso completo)

**Files:**
- Modify: `/home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy/SKILL.md`

- [ ] **Step 1: Reemplazar el placeholder del cuerpo por el proceso completo**

Reemplazar la línea `(cuerpo pendiente — Task 6)` (dejando el frontmatter intacto) por:

````markdown
# Content Strategy

## Overview

Genera la **estrategia de contenido y arquitectura de información** de un sitio a partir del material libre que el cliente tenga a mano (PDFs, transcripciones, catálogos, brandboard, wireframes). Decide qué páginas existen, qué secciones lleva cada una, en qué orden, con qué justificación, y cómo fluye la navegación hacia la conversión — partiendo del entendimiento del usuario potencial según el rubro.

**Entrada libre, salida estructurada.** No hay contrato de entrada: el cliente manda lo que tenga, frecuentemente incompleto. La salida sí es estable: un JSON validado contra `references/schema.json` + un MD de justificación.

**Posición en el pipeline:** se ejecuta antes de la Hoja de Requerimientos y del pipeline de copy. Su salida es el insumo estratégico que un humano (o una skill futura) traduce a `bloque_id` + `variante` concretos.

## Regla central: honestidad sobre la incompletitud

El cliente casi nunca manda todo. **Nunca inventes datos faltantes como si fueran ciertos.**
- Lo que deduces → va en `meta.supuestos` y en el MD bajo "Qué asumo".
- Lo que falta → va en `meta.vacios` y en el MD bajo "Qué falta".
- Solo lo confirmado por una fuente cuenta como hecho.

## Entrada

Recibes una **ruta a una carpeta**. Lee todo lo legible dentro:
- `.md`, `.txt`, transcripciones: leer directo.
- `.pdf`: leer con el tool Read por rango de páginas. Si un PDF pesado tiene gemelo `.md` (ej. un catálogo), prefiere el `.md`.
- Clasifica cada fuente por su contenido: transcripción / catálogo / marca / wireframe / datos de negocio / otro.

## Proceso

1. **Inventario de fuentes** — lista y clasifica los archivos de la carpeta.
2. **Ingesta** — lee cada fuente; construye una base de conocimiento interna del negocio.
3. **Mapa de conocimiento** — consolida *qué sé / qué falta / qué asumo*. Alimenta `meta` del JSON y el MD.
4. **Perfil de usuario potencial** — razona del rubro, tipo de negocio y ubicación: contexto, necesidad, objeción, job-to-be-done, nivel de conciencia. No uses investigación web; razona del material.
5. **Objetivo de conversión** — define primario y secundarios.
6. **Sitemap** — decide qué páginas existen y por qué cada una.
7. **Secciones por página** — para cada página, define secciones con `intencion` (del enum de `references/intenciones.md`), `orden`, objetivo, contenido esperado, CTA y **justificación** de la decisión.
8. **Flujo de navegación y coherencia** — entradas, rutas hacia conversión, jerarquía del nav; verifica que no se repita contenido y que haya narrativa progresiva entre páginas.
9. **Auditoría (condicional)** — si te apuntan a un sitio existente, compara su estructura contra la propuesta y escribe el diagnóstico en el MD (no en el JSON).
10. **Emitir** los dos archivos.

## Salida

Dos archivos, nombrados por `cliente_id` cuando se conoce; si no, por nombre comercial en kebab-case:
- `content-strategy.json` — sigue `references/schema.json`. Representa siempre la estrategia ideal/propuesta.
- `content-strategy.md` — sigue `references/output-template.md`.

`intencion` debe pertenecer al enum de `references/intenciones.md`. `meta.generado_por` es siempre `"skill:content-strategy"`. Si conoces el `cliente_id`, usa el formato `c_XXXXX`; si no, omite el campo.

## Autochequeo obligatorio antes de entregar

Valida el JSON contra el esquema. No entregues si no pasa:

```bash
python3 scripts/validate.py <ruta-al-json-generado>
```

Debe imprimir `VALID`. Si imprime `INVALID`, corrige el JSON y vuelve a validar.

## Referencias

- `references/intenciones.md` — enum de `intencion` (fuente de verdad).
- `references/schema.json` — contrato de salida.
- `references/output-template.md` — plantilla del MD.
- `scripts/validate.py` — validador del JSON.
````

- [ ] **Step 2: Verificar que el SKILL.md tiene frontmatter válido y las secciones clave**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
python3 -c "import re; t=open('SKILL.md').read(); assert re.search(r'^name:\s*content-strategy', t, re.M); assert 'pendiente' not in t, 'placeholder sin reemplazar'; [t.index(s) for s in ['## Entrada','## Proceso','## Salida','Autochequeo']]; print('SKILL.md OK')"
```
Expected: `SKILL.md OK`

- [ ] **Step 3: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add content-strategy/SKILL.md && \
git commit -m "skill(content-strategy): write full skill body"
```

---

### Task 7: Instalación (symlink) y registro en la suite

**Files:**
- Create (symlink): `~/.claude/skills/content-strategy`
- Modify: `/home/danexcode/Documents/Procerus/Procerus/web-skills/README.md`

- [ ] **Step 1: Crear el symlink de instalación**

Run:
```bash
ln -s /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy /home/danexcode/.claude/skills/content-strategy
```

- [ ] **Step 2: Verificar que el symlink resuelve al SKILL.md**

Run:
```bash
test -f /home/danexcode/.claude/skills/content-strategy/SKILL.md && echo "symlink OK" || echo "symlink ROTO"
```
Expected: `symlink OK`

- [ ] **Step 3: Registrar la skill en el README de la suite**

En `web-skills/README.md`, en la tabla "Pipeline", agregar una fila ANTES de `astro-landing` (la estrategia es upstream de la construcción). Reemplazar la fila existente:

```markdown
| 1 | `brand-identity` | Nuevo cliente: definir/extraer marca → tokens Tailwind 4 |
```

por:

```markdown
| 1 | `brand-identity` | Nuevo cliente: definir/extraer marca → tokens Tailwind 4 |
| 1.5 | `content-strategy` | Estrategia de contenido y arquitectura de información desde material libre del cliente |
```

- [ ] **Step 4: Verificar el registro**

Run:
```bash
grep -q "content-strategy" /home/danexcode/Documents/Procerus/Procerus/web-skills/README.md && echo "README OK"
```
Expected: `README OK`

- [ ] **Step 5: Commit**

```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills && \
git add README.md && \
git commit -m "skill(content-strategy): register skill in suite README"
```

> Nota: el symlink en `~/.claude/skills/` no se commitea (vive fuera del repo).

---

### Task 8: Prueba de aceptación end-to-end contra `casa-grande/docs/`

Esta tarea ejecuta la skill como la usaría el usuario y valida la salida. Es manual (la generación la hace el modelo leyendo la skill), pero el resultado se verifica con el validador.

**Files:**
- Create (salida de prueba): `/tmp/content-strategy-acceptance/content-strategy.json`
- Create (salida de prueba): `/tmp/content-strategy-acceptance/content-strategy.md`

- [ ] **Step 1: Ejecutar la skill sobre los docs reales**

Invocar la skill `content-strategy` apuntando a `/home/danexcode/Documents/Procerus/casa-grande/docs/`, escribiendo la salida en `/tmp/content-strategy-acceptance/`. Seguir el proceso del `SKILL.md`: inventario → ingesta (incluye `carol_1_transcripcion.md`, `Catalogo Casa Grande.md`, `Branboard_GrupoCasaGrande.pdf`, `PÁGINA WEB.pdf`, `wireframes/`) → estrategia.

- [ ] **Step 2: Validar el JSON generado contra el esquema**

Run:
```bash
cd /home/danexcode/Documents/Procerus/Procerus/web-skills/content-strategy && \
python3 scripts/validate.py /tmp/content-strategy-acceptance/content-strategy.json
```
Expected: `VALID`

- [ ] **Step 3: Verificar los criterios de aceptación del spec (caso Casa Grande)**

Confirmar manualmente en la salida:
- `usuario_objetivo.perfiles` describe un comprador B2B industrial (no consumidor de Instagram).
- `objetivo_conversion.primario` es una cotización por WhatsApp.
- `paginas` describe un sitio multipágina (web corporativa), no una landing de una sola página.
- Existe al menos una sección con `justificacion` que argumenta el orden (ej. servicios antes que historia/línea de tiempo).
- `meta.fuentes` lista los archivos leídos y `meta.supuestos`/`meta.vacios` no están vacíos si hubo deducciones o faltantes (ej. colorimetría no confirmada).

Run (chequeos automáticos de apoyo):
```bash
cd /tmp/content-strategy-acceptance && \
python3 -c "import json; d=json.load(open('content-strategy.json')); assert len(d['meta']['fuentes'])>=2; assert len(d['paginas'])>=2; assert any(s['justificacion'] for p in d['paginas'] for s in p['secciones']); print('aceptación OK')"
```
Expected: `aceptación OK`

- [ ] **Step 4: Verificar que el MD sigue la plantilla**

Run:
```bash
cd /tmp/content-strategy-acceptance && \
for s in "Mapa de conocimiento" "Perfil del usuario" "Objetivo de conversión" "Sitemap razonado" "Secciones por página" "Flujo de navegación"; do \
  grep -q "$s" content-strategy.md && echo "OK: $s" || { echo "FALTA: $s"; exit 1; }; \
done
```
Expected: 6 líneas `OK: ...`

> Esta tarea no commitea nada: la salida en `/tmp/` es artefacto de prueba, no parte de la skill.

---

## Notas de ejecución

- Todos los commits de implementación van al repo `web-skills` (`/home/danexcode/Documents/Procerus/Procerus/web-skills/`), que está en su propia rama git. Confirmar la rama actual antes de commitear; si es la rama por defecto y el usuario prefiere aislar, crear una rama `feat/content-strategy` primero.
- El symlink de Task 7 vive fuera de cualquier repo y no se versiona.
- Considerar bump de versión + entrada en `CHANGELOG.md` de la suite al finalizar (fuera de alcance de este plan; coordinar con el mantenimiento SemVer descrito en el README).
