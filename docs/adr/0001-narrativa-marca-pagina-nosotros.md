# ADR 0001 — Narrativa de marca para la página "Nosotros"

- **Estado:** Aceptado
- **Fecha:** 2026-06-16
- **Decisores:** Daniel Rodríguez (Procerus), cliente Grupo Casa Grande
- **Ámbito:** `src/pages/nosotros.astro` y, por extensión, el copy de marca del sitio

## Contexto

El sitio representa a **Grupo Casa Grande** (RIF J-50662883-0), una marca nueva.
Sin embargo, es la misma gente, la misma trayectoria y el mismo equipo que
**Corporación Casa Grande, C.A.** (RIF J-30876669-0), la entidad con +20 años
de operación en la industria de Guayana.

Existen dos fuentes documentales con información divergente:

- **Catálogo Casa Grande** (Corporación) — misión/visión orientadas a "venta de
  suministros de calidad", dirección Terrazas del Caroní, tabla RNC con +20 años
  de contratos (CVG, EDELCA, CORPOELEC 765 kV, PDVSA Boquerón).
- **PÁGINA WEB.pdf** (Grupo) — misión/visión/valores reescritos hacia
  "integrador de soluciones para la industria pesada", dirección Plaza
  Aeropuerto, email `grupocasagrandeint@gmail.com`.

El copy actual de `nosotros.astro` mezcla ambas entidades sin criterio: usa la
misión/visión/dirección/RIF viejos mientras se presenta como Grupo, e incluye
datos fabricados (clientes no documentados, cita inventada, horarios sin fuente)
y errores de fechas frente a la tabla RNC.

**Tensión central:** el activo de mayor valor —el track record de 20 años y el
certificado RNC vigente— pertenece *legalmente* a Corporación (J-30876669-0),
no a Grupo (J-50662883-0). Atribuir esa experiencia a Grupo sin matiz expone al
cliente ante una verificación de RIF en licitaciones o due diligence.

## Decisión

Adoptamos una narrativa de **evolución, no de reinicio**: Grupo Casa Grande es
la consolidación de la trayectoria de Corporación Casa Grande bajo una marca de
mayor alcance. El salto que estructura la historia es **de proveedor de
suministros a integrador de soluciones**.

### Principios de la narrativa

1. **Liderar con identidad presente, respaldar con trayectoria.** El hero
   comunica qué es Grupo Casa Grande hoy (integrador de soluciones para la
   industria pesada con +20 años de respaldo); el año de fundación es soporte,
   no titular.
2. **La continuidad como sección explícita y como fortaleza.** Se enfrenta de
   frente el tema de las dos entidades: "la misma gente, la misma palabra
   cumplida, ahora con más alcance". Desactiva la duda "¿quiénes son?" antes de
   que surja.
3. **La historia y el timeline son prueba, no identidad.** Cronología real;
   2025 se presenta como culminación ("consolidamos esto en Grupo Casa
   Grande"), no como línea nueva.
4. **Misión / Visión / Valores oficiales = los de PÁGINA WEB.pdf.** Reemplazan
   a los del catálogo, que contradicen el posicionamiento de "integrador".
5. **Fundadores = continuidad humana.** Las mismas dos personas detrás de ambas
   marcas son la prueba de que lo esencial no cambió.
6. **Datos de contacto = los nuevos** (Plaza Aeropuerto, email de Grupo).

### Atribución de la experiencia (Opción A — elegida)

La experiencia y el RNC se frasean como **heredados de forma explícita**:
"la trayectoria de Corporación Casa Grande, hoy bajo Grupo Casa Grande". El
certificado RNC se muestra a nombre de Corporación Casa Grande, C.A. (entidad
vigente del registro), no atribuido directamente a Grupo.

### Tono

Audiencia: procura industrial y jefes de planta. Registro de credibilidad fría
y específica, no de venta. Especificidad técnica > adjetivos. Cero relleno
emocional. Referencia de tono: "una hora de parada cuesta miles de dólares".

## Alternativas consideradas

- **Opción B — atribuir toda la experiencia a Grupo sin distinción.** Más limpia
  de leer, pero expuesta ante verificación de RIF. Descartada por riesgo legal/
  reputacional en licitaciones.
- **Tratar el sitio como rebrand puro (reinicio).** Desperdicia el activo de los
  20 años y obliga a Grupo a probarse desde cero. Descartada.
- **Mantener el copy mixto actual.** Incoherente y con datos fabricados.
  Descartada.

## Consecuencias

**Positivas**
- Transfiere credibilidad de Corporación a Grupo sin afirmaciones legalmente
  frágiles.
- Da coherencia entre posicionamiento ("integrador") y misión/visión/valores.
- Convierte la complejidad de las dos entidades en un mensaje de solidez.

**Negativas / costos**
- Requiere reescribir misión, visión, valores, hero, historia y datos de
  contacto en `nosotros.astro`.
- Obliga a eliminar datos fabricados (clientes Sidor/Alcasa/Venalum, cita del
  fundador, horarios) salvo que el cliente los confirme con fuente.
- El matiz de atribución ("hoy bajo Grupo Casa Grande") debe replicarse en otras
  páginas que citen experiencia o RNC para no contradecir esta decisión.

## Pendientes

- Confirmar si existe un RNC en trámite a nombre de Grupo (J-50662883-0) o si se
  mantiene el de Corporación como vigente.
- Validar con el cliente cualquier dato fabricado que se desee conservar
  (horarios de atención, clientes específicos).
