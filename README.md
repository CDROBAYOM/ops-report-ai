# ops-report-ai

## ¿De qué trata este proyecto?

Este proyecto nació de un problema que se repite en empresas medianas y pequeñas:

Cada área tiene su propio número. Nadie coincide. Se discute durante veinte minutos cuál es la cifra correcta. Y al final la decisión se toma igual — con el dato de alguien, sin saber si es el correcto.

No es un problema de tecnología. Es un problema de diseño: nunca se definió qué dato importa, quién es responsable de él, con qué frecuencia se actualiza y para qué decisión específica se necesita.

**ops-report-ai** demuestra cómo resolver ese problema de raíz — antes de automatizar cualquier cosa.

---

## El problema que resuelve

Una pyme típica gestiona su operación entre Excel compartidos, mensajes de WhatsApp y correos con archivos adjuntos. El resultado es siempre el mismo:

- Cada área trabaja con su propia versión de la realidad
- Nadie es dueño del dato — todos actualizan, nadie es responsable
- Alguien dedica horas cada semana a consolidar manualmente lo que debería fluir solo
- Las decisiones se toman con información de días atrás, cuando el negocio ya cambió

El costo no es solo tiempo perdido. Es el costo de decidir mal — o de no decidir a tiempo.

---

## Lo que este proyecto no es

Este proyecto **no es un software listo para instalar** en tu empresa.

Es una demostración documentada de cómo un arquitecto aborda este problema: qué preguntas hace antes de escribir una línea de código, qué decisiones toma y por qué, y dónde está el límite entre lo que puede resolver la tecnología y lo que debe resolver el negocio primero.

---

## El límite crítico de la inteligencia artificial

La IA puede normalizar datos desordenados, clasificar información y generar resúmenes automáticos.

Lo que la IA **no puede hacer** — y este proyecto lo demuestra con claridad — es decidir qué dato es el correcto, qué métrica importa para tu negocio ni para qué decisión específica necesitás ese reporte.

Esas respuestas no viven en el código. Viven en el negocio. Y deben estar claras antes de automatizar cualquier cosa.

> Automatizar un proceso mal definido solo produce el mismo error más rápido.

---

## Cómo está estructurado este proyecto

Cada etapa del desarrollo está documentada en lenguaje de negocio, no solo técnico. Encontrarás:

- **ADRs (Architecture Decision Records):** las decisiones de diseño más importantes, explicadas en términos de impacto para el negocio — no solo para el equipo técnico
- **Casos de uso reales:** situaciones concretas que justifican cada funcionalidad construida
- **Límites explícitos:** qué resuelve este sistema y qué deliberadamente queda fuera del alcance

---

## Las tres preguntas que este proyecto responde primero

Antes de diseñar cualquier solución, hay que poder responder con precisión:

1. **¿Para qué decisión necesita este reporte el gerente?**
   No qué datos existen, sino qué decisión concreta depende de ellos.

2. **¿Quién valida que el dato es correcto?**
   Un nombre y un rol — no "el área de operaciones".

3. **¿Cómo vamos a medir que el problema mejoró?**
   Una métrica concreta antes de empezar, no una sensación al final.

---

## ¿A quién está dirigido este proyecto?

**Si eres un gerente o dueño de una pyme** y te reconociste en el problema de arriba, este proyecto muestra la diferencia entre contratar a alguien que te vende una herramienta y contratar a alguien que primero entiende tu problema.

**Si sos desarrollador o arquitecto**, encontrarás aquí un ejemplo concreto de cómo documentar decisiones técnicas con criterio de negocio — no solo con criterio de código.

---

## Decisiones de arquitectura (ADRs)

| ADR | Decisión | Estado | Fitness function |
|---|---|---|---|
| [ADR-000](docs/adr/ADR-000.md) | El negocio define métricas, modelo y responsabilidad antes del desarrollo | ✅ aceptado | `config/metrics.schema.json` validado en CI |
| [ADR-001](docs/adr/ADR-001.md) | Arquitectura hexagonal (Ports & Adapters) | ✅ aceptado | `dependency-cruiser`: dominio sin infraestructura ni `@nestjs/*`, sin ciclos |
| [ADR-002](docs/adr/ADR-002.md) | Ingesta desde fuentes heterogéneas con adaptador tolerante | ✅ aceptado | Pruebas de contrato por tipo de fuente en `test/integration/ingesta/` |
| [ADR-003](docs/adr/ADR-003.md) | Alcance y límites del uso de IA en la normalización | ✅ aceptado | Prueba de lista blanca de campos en `test/unit/ai/` |

📋 [Ver índice completo de ADRs](docs/adr/README.md)

## Arquitectura (diagramas C4)

- [C4 Contexto](docs/architecture/01-context.md) — actores y flujos del sistema
- [C4 Contenedores](docs/architecture/02-containers.md) — componentes internos y puertos

---

## Autor

**David Robayo**
