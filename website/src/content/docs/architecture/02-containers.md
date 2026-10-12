---
title: "docs/architecture/02-containers.md — Diagrama C4 Contenedores"
---

# docs/architecture/02-containers.md — Diagrama C4 Contenedores

> **Nota:** este archivo describe los contenedores (procesos/servicios) del sistema.
> Corresponde al nivel 2 del modelo C4.

---

## Contenedores de ops-report-ai

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ops-report-ai                                   │
│                                                                              │
│  ┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────┐ │
│  │   Adaptador entrada  │    │   Capa de aplicación │    │ Adaptador salida│ │
│  │  excel-cartera.      │───▶│  ProcesarReporte     │───▶│ reporte-json.   │ │
│  │  adapter.ts          │    │  Cartera.usecase.ts  │    │ adapter.ts      │ │
│  └─────────────────────┘    └──────────┬───────────┘    └─────────────────┘ │
│           │                            │                                     │
│           │                    ┌───────▼──────────┐                         │
│           │                    │   Capa de dominio │                         │
│           │                    │  ReporteCartera   │                         │
│           │                    │  AlertaOperativa  │                         │
│           │                    └───────────────────┘                         │
│           │                                                                  │
│  ┌────────▼────────────┐                                                     │
│  │  Servicio de IA      │  (solo normalización de fechas — ADR-003)          │
│  │  normalizacion.      │                                                    │
│  │  service.ts          │                                                    │
│  └─────────────────────┘                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Responsabilidades por contenedor

| Contenedor | Capa | Responsabilidad | ADR |
|---|---|---|---|
| `excel-cartera.adapter.ts` | Infraestructura | Lectura, mapeo de aliases y validación del archivo fuente | ADR-002 |
| `normalizacion.service.ts` | Infraestructura / IA | Normalización de fechas ambiguas con nivel de confianza | ADR-003 |
| `ProcesarReporteCartera` (use case) | Aplicación | Orquesta el flujo: recibe datos validados, construye entidades, devuelve resultado | ADR-001 |
| `ReporteCartera` / `AlertaOperativa` | Dominio | Entidades puras de negocio sin dependencias externas | ADR-001 |
| `reporte-json.adapter.ts` | Infraestructura | Serialización y persistencia del resultado | ADR-001 |

## Puertos (interfaces del dominio)

| Puerto | Dirección | Implementado por |
|---|---|---|
| `IIngestaCartera` | Entrada | `excel-cartera.adapter.ts` |
| `IReporteOutput` | Salida | `reporte-json.adapter.ts` |
| `INormalizacionService` | Salida | `normalizacion.service.ts` |

---

## ADRs relacionados con este diagrama

| ADR | Decisión |
|---|---|
| [ADR-001](../adr/ADR-001.md) | Arquitectura hexagonal — estructura y reglas de dependencia |
| [ADR-002](../adr/ADR-002.md) | Adaptador de entrada — mapeo de aliases y validación |
| [ADR-003](../adr/ADR-003.md) | Servicio de IA — alcance acotado a normalización de fechas |

**Nivel anterior:** [C4 Contexto](./01-context.md)
