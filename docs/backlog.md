# Backlog — Sitio Grupo Casa Grande

- **Actualizado:** 2026-06-16
- **Fuentes:** [Auditoría ADR 0001](auditoria-adr-0001.md) · [Plan Suministros](plan-suministros.md) · [ADR 0001](adr/0001-narrativa-marca-pagina-nosotros.md)
- **Convención de confianza:** [Seguro] / [Probable] / [Suposición]

---

## 🔴 Coherencia de contenido (riesgo legal/honestidad — ADR)

- [ ] **Experiencia y Servicios atribuyen el track record a Grupo sin matiz Corporación.**
  El ADR (Opción A) exige frasear la experiencia y el RNC como heredados de Corporación.
  - `experiencia.astro:21` "Quienes confían en nosotros desde hace años" — los 17
    contratos son de Corporación.
  - `servicios.astro` RNC card "Contratista del Estado · RNC vigente" sin matiz.
  - **[Seguro]** Es el riesgo que el ADR existe para evitar (verificación de RIF).

- [ ] **"+30 obras" en Experiencia aún sin unificar.**
  `experiencia.astro:11` dice "+30 obras" mientras la tabla y el home dicen 17. El "+30"
  sale del demo verbal de la clienta, sin respaldo documental. Unificar a 17 o conseguir
  fuente. **[Probable]** — *(Servicios ya corregido a 17.)*

- [ ] **Fecha de fundación de Grupo (2025) sin fuente.**
  `nosotros.astro` afirma "En 2025 esa trayectoria se consolida en Grupo Casa Grande";
  ningún documento fija ese año (inferido de la vigencia del RNC). Pedir al cliente la
  fecha del acta de constitución de Grupo (J-50662883-0), o reescribir sin año. **[Probable]**

---

## 🟠 Navegación / arquitectura — Suministros

- [ ] **Páginas de detalle por categoría (6 restantes).** Routing dinámico por slug ya
  montado: `src/pages/suministros/[categoria].astro` + `src/data/categorias.ts`.
  - [x] Infra de routing + "Automatización y Control" completa (tarjeta 01 enruta a
    `/suministros/automatizacion-y-control`).
  - Escribir las 6 restantes agregándolas al array de `categorias.ts` (Neumática,
    Herramientas y Calibración, Iluminación, Mantenimiento Mecánico, Tornillería, Soldadura
    — PDF + investigación) y cablear `data-href` en sus tarjetas de `suministros.astro`.

- [x] **Tarjeta de cotización apunta a WhatsApp** (resuelto) — `data-wa-msg` con mensaje de
  categoría no listada.

---

## 🟡 Conversión / integración pendiente (todo el sitio)

- [ ] **CTAs de WhatsApp sin cablear.** Botones `.btn.wa` y "Hablar con un asesor" son demo
  (sin deep link `wa.me`). Definir número y mensajes prellenados por contexto.
  Ver skill `whatsapp-conversion`.
- [ ] **Placeholders de imagen vacíos.** Tarjetas de categoría/producto, logos de marca
  (`data-brand` sin imagen), galería de Experiencia, fotos de fundadores. Sustituir por
  assets reales del cliente (ver `docs/ARCHIVO FOTOGRAFICO.pdf`).

---

## 🔵 Datos por confirmar con el cliente

- [ ] **Teléfono local 0286-9541122** — tomado de PÁGINA WEB.pdf, sin confirmar.
- [ ] **¿RNC propio de Grupo en trámite?** Hoy se atribuye a Corporación (correcto). Si
  Grupo saca el suyo, actualizar atribuciones. Pendiente del ADR.
- [ ] **Catálogo de suministros** — se asumió el PDF como inventario completo (ruta A). Si
  manejan más categorías/marcas, ampliar con el listado real.

---

## ⚪ Calidad / proceso

- [ ] **Skill `copywriting` sin pruebas de presión** con subagentes (recomendado por
  `writing-skills`).
- [ ] **Auditoría pre-launch** del sitio completo antes de publicar (skill `pre-launch-audit`):
  SEO, headers de seguridad, accesibilidad, enlaces rotos.
- [ ] **Tags del repo de skills sin pushear** a remoto (si existe).

---

## ✅ Hecho (referencia)

- Razón social unificada a Grupo Casa Grande, C.A.; RNC anotado a Corporación.
- Antigüedad unificada a "25 años" en home/nosotros/servicios.
- Suministros reescrito contra el PDF (7 categorías, marcas y productos reales,
  cifras infladas eliminadas, filtros quitados, tarjeta de cotización).
