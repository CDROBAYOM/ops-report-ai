# docs/architecture/01-context.md — Diagrama C4 Contexto

> **Nota:** este archivo es el punto de entrada al modelo C4. Los diagramas
> detallados viven en la herramienta Structurizr (ADR pendiente: architecture as code).
> Esta página enlaza los ADRs relacionados y describe el contexto del sistema.

---

## Sistema: ops-report-ai

**Propósito:** ingesta, normaliza y reporta datos operativos de fuentes heterogéneas
para que el equipo gerencial de CoopNorte tome decisiones con información confiable
y trazable.

### Diagrama de contexto (texto)

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Sistema externo                              │
│   SisCredito (legacy)  ──────→  Exportación Excel/CSV                │
└────────────────────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           ops-report-ai                               │
│                                                                       │
│   Ingesta → Normalización → Dominio → Reporte consolidado            │
│                   ↑                                                   │
│           Servicio de IA (normalización de fechas ambiguas)           │
└─────────────────────────────────────┬────────────────────────────────┘
                                      │
                                      ▼
                          Equipo gerencial (CoopNorte)
                          toma decisiones sobre cartera
```

### Actores

| Actor | Rol |
|---|---|
| SisCredito (legacy) | Fuente de datos — exporta Excel/CSV con formato variable |
| Equipo operativo | Define métricas y es responsable de cada dato (ADR-000) |
| Gerencia (don Carlos) | Consume el reporte consolidado para tomar decisiones |
| Servicio de IA externo | Asiste la normalización de fechas ambiguas (ADR-003) |

---

## ADRs relacionados con este diagrama

| ADR | Decisión |
|---|---|
| [ADR-000](../adr/ADR-000.md) | El negocio define métricas antes del desarrollo |
| [ADR-001](../adr/ADR-001.md) | Arquitectura hexagonal como estructura del sistema |
| [ADR-002](../adr/ADR-002.md) | Adaptador tolerante para fuentes heterogéneas |
| [ADR-003](../adr/ADR-003.md) | Alcance y límites del uso de IA |

**Siguiente nivel:** [C4 Contenedores](./02-containers.md)
