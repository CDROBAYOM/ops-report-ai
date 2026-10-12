---
title: "ADR-NNNN: {{titulo}}"
status: propuesto # propuesto | aceptado | reemplazado-por-ADR-00X | obsoleto
date: YYYY-MM-DD
decision-makers: [Nombre / rol]
consulted: [Equipos consultados]
revisar-en: YYYY-MM-DD
---

# ADR-NNNN: {{titulo}}

## Contexto y problema

<!--
¿Qué situación o problema obliga a tomar esta decisión?
¿Qué pasa si no se decide?
-->

## Drivers de decisión

- **Driver 1:** descripción
- **Driver 2:** descripción

## Opciones consideradas

1. **Opción A** — descripción breve (opción elegida)
2. **Opción B** — descripción breve
3. **Opción C** — descripción breve

## Decisión

<!--
Una sola declaración en voz neutra, 2-3 líneas máximo.
"Se decide la opción N porque..."
-->

## Comparación de opciones

| Opción | A favor | En contra |
|---|---|---|
| 1. {{opción elegida}} | … | … |
| 2. {{opción B}} | … | … |
| 3. {{opción C}} | … | … |

## Consecuencias

**Positivas**

- …

**Negativas y mitigación**

| Consecuencia negativa | Mitigación |
|---|---|
| … | … |

## Verificación (fitness function)

<!--
Regla ejecutable que certifica que la decisión se cumple en el código.
Formato: Regla → Mecanismo → Efecto.
El detalle técnico vive en el código, no aquí.
-->

- **Regla:** …
- **Mecanismo:** …
- **Efecto:** …

## Riesgos y cumplimiento

- …

## Relacionado

| ADR | Relación |
|---|---|
| ADR-000 | … |

**Diagramas:** [C4 Contexto](../architecture/01-context.md) · [C4 Contenedores](../architecture/02-containers.md)
