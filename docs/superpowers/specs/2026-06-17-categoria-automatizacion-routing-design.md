# Spec — Página de categoría por slug + "Automatización y Control Industrial"

- **Fecha:** 2026-06-17
- **Estado:** aprobado (diseño) — pendiente de implementación
- **Ámbito:** `src/pages/suministros/`, `src/data/categorias.ts` (nuevo),
  `src/layouts/Layout.astro`, `src/pages/suministros.astro`.

## Objetivo

1. Convertir la página de categoría (hoy estática y desactualizada — "Eléctrico" con
   marcas que ya eliminamos) en una **ruta dinámica por slug** que sirva a las 7 categorías
   de Suministros desde un único template data-driven.
2. Escribir a fondo solo **"Automatización y Control Industrial"** en esta tanda; el routing
   queda listo para que las otras 6 se agreguen llenando el data file.

## Arquitectura de routing

### Ruta dinámica
`src/pages/suministros/[categoria].astro` con `getStaticPaths()` que genera una página por
cada entrada del data file:

```ts
export function getStaticPaths() {
  return categorias.map((cat) => ({ params: { categoria: cat.slug }, props: { cat } }));
}
const { cat } = Astro.props;
```

- Solo se construyen las categorías presentes en el array. Hoy: 1 (`automatizacion-y-control`).
- URL resultante: `/suministros/automatizacion-y-control`.
- El archivo actual `src/pages/suministros/categoria.astro` **se elimina**; su layout se
  migra al template dinámico.

### Data file
`src/data/categorias.ts` — fuente única de verdad del contenido por categoría:

```ts
export interface Producto { brand: string; nombre: string; spec: string; }
export interface Subcategoria { titulo: string; items: string; }
export interface Categoria {
  slug: string;
  num: string;            // "01"
  titulo: string;
  lede: string;
  subcategorias: Subcategoria[];
  productos: Producto[];
  marcas: string[];
  waMsg: string;          // mensaje prellenado de WhatsApp
}
export const categorias: Categoria[] = [ /* automatizacion-y-control */ ];
```

### Navegación desde Suministros
- En `Layout.astro`, el handler de `[data-go]` se extiende: si el elemento tiene
  `data-href`, navega a esa ruta literal (`window.location.href = el.dataset.href`). Esto
  permite slugs arbitrarios sin ampliar el mapa `routes`.
- En `suministros.astro`, la tarjeta de categoría 01 (Automatización) pasa de
  `data-go="categoria"` a `data-href="/suministros/automatizacion-y-control"`.
- Las otras 6 tarjetas **siguen sin enrutar** hasta que se escriba su página (backlog).

## Contenido — Automatización y Control Industrial

Fuente: PÁGINA WEB.pdf (categoría 1) + investigación web (specs reales). Tono copywriting:
claridad fría, específico, sin relleno.

- **slug:** `automatizacion-y-control` · **num:** `01`
- **título:** Automatización y Control Industrial
- **lede:** *Controladores de turbina, gobernadores de velocidad y sensores de seguridad
  para plantas que no pueden parar. Trabajamos con Woodward, Tri-Sen, Schmersal y Siemens.*

**Subcategorías (4):**
| Título | Items |
|---|---|
| Controladores de Turbinas | Control digital · arranque y protección |
| Gobernadores de Velocidad | Electrónicos · control en cascada |
| Sensores e Interruptores | Seguridad · enclavamiento · IP67 |
| Controladores Lógicos (PLC) | PLC compactos · módulos de E/S · PROFINET |

**Productos destacados (4):**
| Marca | Producto | Spec |
|---|---|---|
| Woodward | Control Digital Peak 150 | Turbinas de vapor de una válvula. Entrada 4–20 mA, gabinete NEMA 4X, prueba de sobrevelocidad. |
| Tri-Sen | 310SV | Controlador configurable: arranque, velocidad y protección, con control en cascada de presión/flujo. |
| Schmersal | Sensores IP67 | Interruptores de seguridad y enclavamiento, grado IP67, –25 a 60 °C, para guardas de máquina. |
| Siemens | SIMATIC S7-1200 | PLC compacto con PROFINET integrado, E/S analógicas y control PID embebido. |

**Marcas (4):** Woodward · Tri-Sen · Schmersal · Siemens.

**CTA / cotización:** los botones de WhatsApp de la página usan
`data-wa-msg="Hola, Grupo Casa Grande. Quiero cotizar Automatización y Control Industrial."`
(mismo mecanismo de la feature de prefill ya implementada).

**Categorías relacionadas:** los chips enlazan a `/suministros` por ahora (las páginas
hermanas aún no existen). Cuando se escriban, apuntarán a sus slugs.

**Imágenes:** se mantienen como placeholders (`.ph`) — assets reales pendientes (backlog).

## Flag de honestidad

El PDF no menciona PLC ni Siemens en esta categoría. Se agregan (subcategoría "Controladores
Lógicos" + producto SIMATIC S7-1200 + marca Siemens) por confirmación del cliente de que
Siemens es una marca real que maneja. Es una excepción consciente a la fuente documental,
consistente con el logo de Siemens ya agregado en `suministros.astro`.

## Archivos a tocar

| Archivo | Cambio |
|---|---|
| `src/data/categorias.ts` | **nuevo** — interfaces + array con "Automatización y Control" |
| `src/pages/suministros/[categoria].astro` | **nuevo** — template dinámico (migra el layout del actual) |
| `src/pages/suministros/categoria.astro` | **eliminar** |
| `src/layouts/Layout.astro` | handler `data-go` soporta `data-href` |
| `src/pages/suministros.astro` | tarjeta 01 → `data-href="/suministros/automatizacion-y-control"` |

## Verificación

- [ ] `/suministros/automatizacion-y-control` construye y renderiza el contenido correcto.
- [ ] Clic en la tarjeta "Automatización y Control" desde `/suministros` navega a su slug.
- [ ] Las 4 subcategorías, 4 productos y 4 marcas aparecen, sin placeholders de texto viejos.
- [ ] Los botones WhatsApp abren `wa.me` con el mensaje de la categoría.
- [ ] No queda referencia a `/suministros/categoria` (ruta vieja) en el sitio.
- [ ] `npm run build` sin errores; no se generan rutas para las 6 categorías sin datos.

## Fuera de alcance

- Contenido de las otras 6 categorías (se agregan al data file en tandas siguientes).
- Enrutar las tarjetas 02–07 de `suministros.astro`.
- Assets de imagen reales.
