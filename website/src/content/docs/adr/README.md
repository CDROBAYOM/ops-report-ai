---
title: "ADR Index — ops-report-ai"
---

# ADR Index — ops-report-ai

Registro de todas las decisiones arquitectónicas del proyecto.
Convención de nombres: `NNNN-titulo-en-kebab.md` (ej. `0001-arquitectura-hexagonal.md`).

Ciclo de estados: `propuesto → aceptado → reemplazado-por-ADR-00X | obsoleto`

---

## Índice

| # | Título | Estado | Fecha | Revisar en | Fitness function |
|---|---|---|---|---|---|
| [ADR-000](./ADR-000.md) | El negocio define métricas, modelo y responsabilidad antes del desarrollo | ✅ aceptado | 2026-06-01 | 2026-12-01 | `config/metrics.schema.json` en CI |
| [ADR-001](./ADR-001.md) | Arquitectura hexagonal (Ports & Adapters) | ✅ aceptado | 2026-06-01 | 2026-12-01 | `dependency-cruiser`: dominio sin infraestructura ni `@nestjs/*` |
| [ADR-002](./ADR-002.md) | Ingesta desde fuentes heterogéneas con adaptador tolerante | ✅ aceptado | 2026-06-01 | 2026-12-01 | Pruebas de contrato por tipo de fuente |
| [ADR-003](./ADR-003.md) | Alcance y límites del uso de IA en la normalización | ✅ aceptado | 2026-06-01 | 2026-12-01 | Prueba de lista blanca de campos y conservación del valor original |

---

## Template

Para crear un nuevo ADR usa [template.md](./template.md).

## Cómo actualizar este índice

Cada vez que se crea, acepta, reemplaza u obsoleta un ADR:

1. Agrega o actualiza la fila correspondiente en la tabla de arriba.
2. Actualiza el campo `status` en el front matter YAML del archivo.
3. Si un ADR reemplaza a otro, actualiza el estado del ADR anterior a `reemplazado-por-ADR-00X`.
