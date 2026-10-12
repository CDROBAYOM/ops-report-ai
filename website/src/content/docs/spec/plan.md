---
title: "Plan: llevar todos los ADR al nuevo formato"
---

# Plan: llevar todos los ADR al nuevo formato

**Esfuerzo total estimado:** 15-20 horas (≈2 fines de semana).
**Orden:** primero el molde, luego los ADRs, luego la automatización.

---

## Fase 0: Preparación (1 h)

- [x] Guardar `ADR-000.md` como `docs/adr/template.md`, con placeholders.
- [x] Convención de nombres: `NNNN-titulo-en-kebab.md` (ej. `0001-arquitectura-hexagonal.md`).
- [x] Crear `docs/adr/README.md` como índice: número, título, estado, fecha y fitness function asociada.
- [x] Acordar el ciclo de estados: `propuesto → aceptado → reemplazado-por-ADR-00X / obsoleto`.

## Fase 1: Auditoría (1 h)

Revisar cada ADR existente contra esta lista y anotar las brechas:

| Criterio | 000 | 001 | 002 | 003 |
|---|---|---|---|---|
| Front matter YAML (estado, fecha ISO, decisores, revisar-en) | ✅ | ✅ | ✅ | ✅ |
| Contexto y drivers | ✅ | ✅ | ✅ | ✅ |
| Opciones con pros y contras | ✅ | ✅ | ✅ | ✅ |
| Decisión en voz neutra (2-3 líneas) | ✅ | ✅ | ✅ | ✅ |
| Consecuencias negativas con mitigación | ✅ | ✅ | ✅ | ✅ |
| Verificación (fitness function o revisión manual explícita) | ✅ | ✅ | ✅ | ✅ |
| Riesgos y cumplimiento | ✅ | ✅ | ✅ | ✅ |
| Tabla de relacionados y enlaces a C4 | ✅ | ✅ | ✅ | ✅ |

## Fase 2: Reescritura (≈2 h por ADR)

| ADR | Foco al reescribir | Verificación objetivo |
|---|---|---|
| **001 Hexagonal** | Comparar con capas tradicionales y otras opciones; fijar reglas de dependencia | dependency-cruiser: dominio sin infraestructura ni `@nestjs/*`, sin ciclos |
| **002 Ingesta** | Comparar enfoques por fuente (CSV, Excel, webhook); idempotencia y manejo de errores | Pruebas de contrato por tipo de fuente |
| **003 Límites de la IA** | Qué campos pueden salir al modelo, trazabilidad, minimización, Ley 1581 | Prueba de lista blanca de campos y de conservación del valor original |

✅ **ADR-001** reescrito con front matter YAML, decisión en voz neutra, comparación de opciones, fitness function.
✅ **ADR-002** reescrito con front matter YAML, flujo explícito, comparación de opciones, fitness function.
✅ **ADR-003** reescrito con front matter YAML, lista blanca de campos, política de expansión, fitness function.

**Regla de cada reescritura:** la decisión se entiende en 30 segundos, y la sección de verificación se limita a *regla, mecanismo y efecto* (el detalle vive en el código).

## Fase 3: Fitness functions en el repo (3-4 h)

1. [x] `.dependency-cruiser.cjs` con las 3 reglas de ADR-001.
2. [x] `config/metrics.schema.json` y `config/metrics.yaml` de ejemplo (ADR-000).
3. [x] Pruebas de contrato de ingesta en `test/integration/ingesta/` (ADR-002).
4. [x] Prueba de lista blanca de campos hacia la IA en `test/unit/ai/` (ADR-003).
5. [x] Job `architecture` en `.github/workflows/architecture.yml` como requisito de merge.

## Fase 4: Control de calidad de los propios ADRs (1-2 h)

Script `scripts/check-adrs.js` que verifica en cada ADR:

- [x] Front matter completo y estado válido.
- [x] Secciones obligatorias presentes.
- [x] Enlaces internos sin romper.
- [x] Todo ADR en estado `aceptado` tiene sección de verificación (automática o revisión manual declarada).

## Fase 5: Conexión con C4 y portafolio (2 h)

- [x] Diagramas C4 creados: `docs/architecture/01-context.md` y `docs/architecture/02-containers.md`.
- [x] Cada ADR enlaza su diagrama C4 (sección `## Relacionado`).
- [x] Tabla "ADR → fitness function" en el README principal.
- [ ] Captura de un build fallando por violar una regla, como evidencia. *(pendiente: requiere que el código fuente exista para ejecutar dependency-cruiser)*

## Fase 6: ADRs nuevos recomendados (opcional, 1-2 h cada uno)

- [ ] Gobernanza de la arquitectura con fitness functions.
- [ ] Architecture as code con Structurizr (modelo C4 versionado).
- [ ] Modelo de seguridad y tratamiento de datos personales.

---

## Definición de terminado (por ADR)

- [x] Cumple todos los criterios de la tabla de auditoría.
- [x] Verificación automática funcionando (`scripts/check-adrs.js` pasa con exit 0).
- [x] Enlazado desde el índice y desde su diagrama C4.
- [x] Revisado en voz neutra, sin narrativa de blog.

## Cómo avanzar sin atascarte

Trabaja **un ADR a la vez, de principio a fin** (reescritura + fitness function) en lugar de reescribir todos y automatizar al final. Cada ADR terminado ya es publicable.

## Siguiente paso inmediato

~~Reescribir **ADR-001** (arquitectura hexagonal) con su regla de dependency-cruiser.~~

✅ **Todas las fases 0-5 completadas.** Siguiente: crear el código fuente para poder ejecutar `npm run arch:deps` y capturar evidencia de build fallando (Fase 5, último ítem).