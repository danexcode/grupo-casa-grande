# Plan — Acomodar la página de Suministros

- **Fecha:** 2026-06-16
- **Archivo objetivo:** `src/pages/suministros.astro`
- **Fuentes de verdad:** [PÁGINA WEB.pdf](../../docs/PÁGINA%20WEB.pdf) · [Auditoría](auditoria-adr-0001.md) · [ADR 0001](adr/0001-narrativa-marca-pagina-nosotros.md)
- **Estado:** propuesto — requiere una decisión del cliente antes de ejecutar

## Problema

La página actual no coincide con el documento oficial ni en categorías, ni en marcas,
ni en cifras, y rebaja el posicionamiento de "integrador de equipos críticos" a
ferretería genérica (ver auditoría). Cifras infladas sin fuente: "+50 categorías",
"+1000 referencias", "+20 marcas".

## Decisión bloqueante (antes de tocar código)

El PDF rotula sus listas como *"Subcategorías sugeridas"* — es curaduría, no
necesariamente el inventario total. Hay que confirmar con la clienta:

> **¿Las 7 categorías del PDF son todo lo que manejan, o es solo una muestra de un
> catálogo más amplio?**

- **Escenario A — el PDF es el catálogo real:** rewrite a 7 categorías, eliminar cifras
  infladas. (Plan abajo, ruta A.)
- **Escenario B — manejan más:** pedir el listado real de categorías/marcas/referencias;
  conservar cifras solo si el cliente las respalda. El rewrite usa el listado real, pero
  igual se eliminan las marcas inventadas que no estén en ninguna fuente.

En ambos escenarios, los pasos 3–6 (marcas, cifras, posicionamiento, copy) aplican igual.

---

## Ruta A — rewrite contra el PDF (7 categorías reales)

### Paso 1 · Filtros (chips)
`suministros.astro:27-37` — reemplazar las 8 chips actuales (Eléctrico, Refrigeración,
Ferretería, Soldadura, Iluminación, Construcción, Seguridad, Herramientas) por las 7 reales:

1. Automatización y Control
2. Neumática y Fluidos
3. Herramientas y Calibración
4. Iluminación Industrial
5. Mantenimiento Mecánico
6. Tornillería y Fijación
7. Soldadura

### Paso 2 · Tarjetas de categoría
`suministros.astro:40-113` — sustituir las 8 tarjetas por estas 7, con los ítems del PDF:

| # | Categoría | Ítems (del PDF) |
|---|---|---|
| 01 | Automatización y Control Industrial | Controladores de turbinas · gobernadores de velocidad · sensores e interruptores |
| 02 | Neumática, Válvulas y Fluidos | Actuadores lineales · bombas neumáticas · compresores de aire |
| 03 | Herramientas Especializadas y Calibración | Torque y medición · equipos de oxicorte |
| 04 | Iluminación Industrial de Alta Potencia | Reflectores LED · luminarias Highbay |
| 05 | Mantenimiento Mecánico y Polímeros | Resinas epóxicas · absorbente de hidrocarburos |
| 06 | Fijación Estructural y Mecánica (Tornillería) | Tornillería estructural Grado 5/8, inox y galvanizada · anclajes de alta tensión · fijaciones para bridas y tuberías de alta presión |
| 07 | Aleaciones y Consumibles de Soldadura | Electrodos revestidos (aleaciones A/I) · TIG/MIG/Arco sumergido · oxicorte y preparación de superficies |

### Paso 3 · Productos estrella (sección nueva, opcional pero recomendada)
El PDF aporta "productos estrella" con marca y modelo — es el activo de credibilidad más
fuerte y hoy no se usa. Considerar añadir un bloque "Productos destacados":

- Control Digital Peak 150 para turbinas de vapor — **Woodward**
- Gobernador electrónico de velocidad **Trisen 310**
- Sensores e interruptores **Schmersal** (IP67)
- Actuador lineal **Valtek** 25 SQ.IN
- Bomba de achique sumergible neumática **ARO**
- Compresor reciprocante **Dewalt** 3.5 HP / 60 gal
- Llave dinamométrica **Stanley Proto** (3/4", 120-600 ft-lb)
- Equipo de oxicorte **Uniweld / Victor Medalist 350**
- Reflector LED 600W **Bilight** (Pluss y COB)

### Paso 4 · Grid de marcas
`suministros.astro:126-148` — reemplazar las 21 marcas (20 sin fuente) por las que sí
aparecen en el PDF: **Woodward, Trisen, Schmersal, Valtek, ARO, Dewalt, Stanley/Proto,
Uniweld, Victor Medalist, Bilight**.
- Si el cliente confirma más marcas reales (escenario B), agregarlas.
- No reponer logos solo para "llenar el grid".

### Paso 5 · Cifras
- `:12` "Más de 50 categorías y 20 marcas líderes" → "7 líneas de procura especializada"
  (o el número real del escenario B). Quitar "líderes" (frase genérica, copywriting).
- `:124`, `:155` "más de 1000 / +1000 referencias" → eliminar o reemplazar por una cifra
  con fuente. Si no hay fuente, frasear cualitativo: "amplio catálogo bajo pedido".
- `:122` "+20 marcas líderes" → número real de marcas mostradas.

### Paso 6 · Posicionamiento (copy)
- `:11` h1 "Suministros para la industria pesada de Guayana" → mantener, pero el subtítulo
  debe anclar el ángulo del ADR: procura de **equipos críticos** (turbinas, control,
  neumática), no ferretería. Apoyarse en la misión del PDF: *"procura especializada de
  equipos críticos"*.
- Coordinar con la skill `copywriting` para el h1/lede/CTA finales.

---

## Verificación (antes de dar por cerrado)

- [ ] Cada categoría mostrada existe en el PDF (o en el listado del cliente).
- [ ] Cada marca del grid rastrea a una fuente.
- [ ] Ninguna cifra ("categorías", "referencias", "marcas") sin respaldo documental.
- [ ] El posicionamiento dice "equipos críticos", no ferretería genérica (coherencia ADR).
- [ ] `npm run build` sin errores.
- [ ] Revisión visual en `:4321/suministros`.

## Fuera de alcance

- Páginas de categoría individual (`categoria`/`producto`) — se auditan aparte.
- Confirmación de las cifras de Experiencia/Servicios (hallazgo #3 de la auditoría).
