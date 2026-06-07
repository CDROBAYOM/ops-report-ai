# Cómo contribuir a este proyecto

## Antes de abrir una rama

Cada cambio en este repositorio debe poder responder una pregunta simple:

> ¿Qué decisión de negocio justifica este cambio?

Si la respuesta es solo técnica, el cambio necesita más contexto antes de comenzar.

## Convención de ramas

| Prefijo | Uso |
|---|---|
| `docs/` | Documentación, ADRs, README |
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de comportamiento |
| `refactor/` | Mejora sin cambio de comportamiento |
| `chore/` | Configuración, dependencias |

## Convención de commits

Formato: `tipo: descripción en minúsculas`

Ejemplos:
- `docs: agregar ADR-001 arquitectura hexagonal`
- `feat: ingesta de archivos CSV desde directorio local`
- `fix: normalización de fechas con formato dd/mm/yyyy`

## Pull Requests

Todo merge a `main` requiere un PR — aunque seas el único colaborador.
El título del PR describe el impacto en el negocio, no la implementación técnica.

Ejemplo correcto: `Permite ingestar reportes desde Excel sin intervención manual`
Ejemplo incorrecto: `Agrega parser de xlsx con ExcelJS`