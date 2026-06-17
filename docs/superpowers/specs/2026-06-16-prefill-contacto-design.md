# Spec — Mensajes precargados según el botón de origen

- **Fecha:** 2026-06-16
- **Estado:** aprobado (diseño) — pendiente de implementación
- **Ámbito:** `src/layouts/Layout.astro`, `src/pages/contacto.astro`, botones en
  `servicios.astro`, `suministros.astro` y CTAs de WhatsApp del sitio.

## Objetivo

Cuando el usuario llega a Contacto (o abre WhatsApp) desde un botón específico, el
destino debe llegar **precargado con un mensaje referente a ese servicio, categoría o
producto** — para que el prospecto no escriba desde cero y Grupo reciba el contexto.

Dos destinos, dos mecanismos:
1. **Formulario de contacto** — se precarga el radio "Tipo de requerimiento" y el textarea.
2. **WhatsApp** — se precarga el texto del chat vía `wa.me/<num>?text=`.

## Mecanismo

### A. Botones → formulario (`data-go="contacto"`)

Se añaden dos atributos **opcionales** al botón:

| Atributo | Valores | Efecto |
|---|---|---|
| `data-tipo` | `serv` · `sum` · `ambos` | preselecciona el radio del formulario |
| `data-ref` | texto libre (etiqueta) | el "qué": nombre del servicio, categoría o `marca · modelo` |

El handler de `Layout.astro` (que hoy hace `window.location.href = routes[go]`) pasa a
construir la URL con query string cuando existan esos atributos:

```
/contacto?tipo=serv&ref=Proyectos%20El%C3%A9ctricos%20e%20Iluminaci%C3%B3n%20Industrial
```

`ref` se codifica con `encodeURIComponent`. Si el botón no trae `data-tipo`/`data-ref`,
navega como hoy (sin query).

### B. Página de contacto — lectura

Script en `contacto.astro` que corre al cargar:

1. Lee `tipo` y `ref` de `URLSearchParams`.
2. Si `tipo` ∈ {serv, sum, ambos}: marca ese `input[name="tipo"]` (`.checked = true`) y
   mueve la clase `.checked` del `<label>` (replicando el comportamiento del radio-row).
3. Si hay `ref`: construye el mensaje desde la plantilla del `tipo` (ver abajo) y lo asigna
   al `textarea.value`.
   - **Seguridad:** se asigna por `.value` (propiedad), nunca `innerHTML`. `ref` se
     `decodeURIComponent` y se recorta a 160 caracteres. Sin riesgo de inyección.
4. Sin params → el formulario queda en su estado por defecto actual.

### C. Botones de WhatsApp (`.btn.wa`, FAB, CTA header)

Atributo opcional `data-wa-msg="<texto>"`. El handler de `.btn.wa` arma
`${WA}?text=${encodeURIComponent(msg)}`; los `<a>` (FAB, CTA header) reciben el `href` ya
construido en el script. Sin atributo → mensaje genérico por defecto.

## Mensajes (copy)

Redactados con la skill `copywriting`: claridad, voz humana, sin frases prohibidas. Los
envía el **prospecto**, en primera persona, dejando espacio para el detalle.

### Formulario (textarea)

| `tipo` | Plantilla (con `ref`) |
|---|---|
| `serv` | `Quiero cotizar el servicio de {ref}. Mi requerimiento:` |
| `sum` | `Quiero cotizar {ref}. Cantidad y detalles:` |
| `ambos` / sin `ref` | *(textarea vacío, placeholder actual)* |

`sum` usa una sola plantilla para categoría y producto; la diferencia vive en `ref`
(categoría = nombre de línea, p. ej. "Neumática, Válvulas y Fluidos"; producto =
`marca · modelo`, p. ej. "Woodward · Control Digital Peak 150").

### WhatsApp (`data-wa-msg`)

| Contexto | Mensaje |
|---|---|
| Suministros (hero, cta-band, tarjeta cotización) | `Hola, Grupo Casa Grande. Quiero cotizar suministros industriales.` |
| Servicios (cta-band) | `Hola, Grupo Casa Grande. Quiero cotizar un servicio industrial.` |
| Genérico (FAB, header, home) | `Hola, Grupo Casa Grande. Quiero hacer una consulta.` |

## Cobertura de botones

| Página | Botón | Destino | Atributos |
|---|---|---|---|
| servicios | 4× "Solicitar cotización" | form | `data-go=contacto data-tipo=serv data-ref="<título servicio>"` |
| suministros | 8× "Cotizar" (productos) | form | `data-go=contacto data-tipo=sum data-ref="<marca · modelo>"` |
| suministros | tarjeta "Cotizar por WhatsApp" | WhatsApp | `.btn`→ wa; `data-wa-msg` suministros *(resuelve backlog #3)* |
| suministros | hero "Cotizar por WhatsApp" | WhatsApp | `data-wa-msg` suministros |
| suministros | hero "Hablar con un asesor" | WhatsApp | `data-wa-msg` suministros |
| suministros | cta-band "Pregúntenos" | WhatsApp | `data-wa-msg` suministros |
| servicios | cta-band "Hablemos por WhatsApp" | WhatsApp | `data-wa-msg` servicios |
| global | FAB / CTA header | WhatsApp | `data-wa-msg` genérico (o default) |

**Fuera de alcance:** las 7 tarjetas de categoría de suministros siguen yendo a su página
de detalle (`data-go=categoria`), no a contacto — es otro pendiente del backlog.

## Archivos a tocar

- `src/layouts/Layout.astro` — handler `data-go` (append query) y handler `.btn.wa`
  (`data-wa-msg`); construir `href` de FAB/CTA si llevan mensaje.
- `src/pages/contacto.astro` — script lector de query + plantillas de mensaje.
- `src/pages/servicios.astro` — `data-tipo`/`data-ref` en los 4 botones + `data-wa-msg` en cta-band.
- `src/pages/suministros.astro` — `data-go`+`data-tipo`+`data-ref` en los 8 productos;
  `data-wa-msg` en hero/cta-band/tarjeta cotización; la tarjeta de cotización pasa de
  `data-go=contacto` a botón WhatsApp.

## Verificación

- [ ] Clic en cada servicio → `/contacto` con radio "Servicios" marcado y textarea con el
  nombre correcto.
- [ ] Clic en un producto → radio "Suministros" + textarea con `marca · modelo`.
- [ ] Botón WhatsApp → abre `wa.me` con el `text` correcto (revisar encoding de tildes/ñ).
- [ ] Sin query params, `/contacto` se ve idéntico a hoy.
- [ ] `ref` con caracteres especiales no rompe el textarea (asignación por `.value`).
- [ ] `npm run build` sin errores.

## Decisiones registradas

- **Query string** sobre sessionStorage: legible, compartible, sobrevive a "abrir en
  pestaña nueva".
- **Una sola plantilla `sum`** para categoría y producto (`Quiero cotizar {ref}. Cantidad
  y detalles:`) — evita una rama extra sin perder claridad.
- **Mensajes editables**: son punto de partida, el usuario los completa.
