# Auditoría contra ADR 0001 — Experiencia, Servicios, Suministros

- **Fecha:** 2026-06-16
- **Auditor:** Procerus
- **Ámbito:** `src/pages/experiencia.astro`, `src/pages/servicios.astro`, `src/pages/suministros.astro`
- **Referencia:** [ADR 0001 — Narrativa de marca](adr/0001-narrativa-marca-pagina-nosotros.md)
- **Estado:** abierta — hallazgos sin corregir al momento de redactar

## Resumen

Las tres páginas se auditaron contra la decisión del ADR (Opción A: la experiencia
y el RNC son **heredados de Corporación Casa Grande, C.A.**, no atribuibles a Grupo
sin matiz). Suministros está esencialmente conforme; Experiencia y Servicios
violan la atribución y arrastran una inconsistencia de cifras.

Convención de confianza: **[Seguro]** prueba sólida · **[Probable]** inferencia
fuerte · **[Suposición]** completando información faltante.

---

## 🔴 Críticos — contradicen el ADR

### 1. Experiencia atribuye el track record a Grupo, sin el matiz "heredado de Corporación"
El ADR (Opción A, líneas 60-65; consecuencia líneas 96-97) exige replicar el matiz
*"trayectoria de Corporación, hoy bajo Grupo"* en toda página que cite experiencia o RNC.
- `experiencia.astro:21` → "Quienes confían en nosotros **desde hace años**" — los 17
  contratos RNC son de Corporación; Grupo es marca nueva. Es la afirmación legalmente
  frágil que el ADR descartó (Opción B). **[Seguro]**
- La voz de toda la página ("nosotros", "+30 obras ejecutadas") implica que Grupo
  ejecutó esos contratos.
- *Único acierto:* la ficha RNC (`:229`) sí muestra a Corporación como razón social —
  pero el resto de la página la contradice.

### 2. Servicios repite el problema de atribución
- `servicios.astro:91-92` → "Contratista del Estado · RNC vigente / Treinta contratos
  ejecutados" — atribuido implícitamente a Grupo, sin matiz Corporación. **[Seguro]**

---

## 🟠 Inconsistencia de cifras — riesgo de honestidad (regla central del ADR)

### 3. "+30 obras" / "treinta contratos" vs. 17 reales del RNC
- `experiencia.astro:11` → "+30 obras"; pero la tabla (`:69`, `:211`) y los chips dicen
  **17 contratos**. La misma página se contradice.
- `servicios.astro:87,92` → "+30 OBRAS", "Treinta contratos".
- El home dice "Ver los **17** contratos".
- **Origen del "+30":** el demo verbal de la clienta en la transcripción
  (`carol_1_transcripcion.md`: *"más de 35 trabajos 100%"*) — **no el RNC**. Es una
  afirmación del cliente **sin respaldo documental**; 17 es la única cifra con fuente
  (comprobante RNC Nº 1462945308766690240). **[Probable]**
- *Acción:* unificar a 17, o conseguir del cliente la fuente de las obras fuera del RNC.

---

## 🟡 Capacidades sin respaldo documental

### 4. Servicio 03 "Instalaciones eléctricas BT/MT/AT"
- `servicios.astro:58-65` — único servicio sin lista "Experiencia comprobable"; usa
  "Capacidad técnica" con claims ("Personal calificado en MT y AT", "Equipos
  certificados para trabajo en altura"). Ningún contrato RNC respalda instalaciones
  eléctricas (la tabla es mantenimiento de corredores y HVAC). **[Probable]** Verificar
  o suavizar.

### 5. Suministros — cifras sin fuente
- `suministros.astro:12` → "Más de 50 categorías"; `:124`, `:155` → "más de 1000
  referencias". Números redondos sin respaldo visible. **[Suposición]** Confirmar con catálogo.
- `:122` → "+20 marcas" — el grid tiene 21 logos, consistente. OK.

---

## 🟢 Conforme al ADR

- **Suministros** encaja con el posicionamiento "integrador/proveedor"; no hace claims
  de entidad ni RNC. Limpio salvo cifras (#5).
- Clientes en Experiencia y Servicios (CORPOELEC, CVG, EDELCA, PDVSA Boquerón) **sí**
  rastrean a la tabla RNC. No hay rastro de los clientes fabricados que el ADR mandó
  eliminar (Sidor/Alcasa/Venalum). **[Seguro]**
- Ficha RNC de Experiencia muestra a Corporación correctamente (`:229`).

---

## Hallazgo adicional — fecha de fundación de Grupo no documentada

Investigación sobre el "2025" que el copy de Nosotros usa como año de consolidación de
Grupo (`nosotros.astro`: *"En 2025 esa trayectoria se consolida en Grupo Casa Grande"*):

**Ningún documento fija 2025 como fundación de Grupo.** Las menciones de "2025" son:

| Fuente | Qué dice "2025" | ¿Fundación de Grupo? |
|---|---|---|
| PÁGINA WEB.pdf (oficial Grupo) | Solo RIF `J-50662883-0` en membrete, sin fecha | ❌ |
| Catálogo / RNC | `30/06/2025–30/06/2026` = vigencia del RNC | ❌ |
| wireframe 01-nosotros | timeline `2001 ── 2008 ── 2015 ── 2025` | hito, no fundación |
| Transcripción (carol_1) | No menciona año de registro de la nueva empresa | ❌ |

El "2025" del copy es **[Probable]** una inferencia tomada de la vigencia del RNC
(fecha del certificado de Corporación, no acta de constitución de Grupo). No tiene fuente.

La transcripción sí valida la Opción A del ADR — la clienta reconoce que la experiencia
*"está a nombre de Corporación"* y el riesgo de *"decir que trabajé con PDVSA con Grupo,
cuando no fue así"* — pero **no fija un año**.

*Acción:* pedir al cliente la fecha del acta de constitución de Grupo, o reescribir sin
año ("esa trayectoria se consolida hoy en Grupo Casa Grande").

---

## Prioridad de corrección

1. **#1 y #2 (atribución)** — exponen al cliente en una verificación de RIF; es el riesgo
   que el ADR existe para evitar.
2. **#3 (30 vs 17)** — la incoherencia más visible; fácil de cerrar unificando a 17.
3. **Fecha de fundación** — pendiente de dato del cliente.
4. **#4, #5** — validar capacidades y cifras con el cliente.
