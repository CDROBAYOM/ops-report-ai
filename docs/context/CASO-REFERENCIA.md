# Caso de referencia ficticio — Cooperativa Solidaria del Norte

> **Nota:** Este documento es un caso ficticio creado exclusivamente como contexto
> de referencia para el desarrollo y demostración del proyecto ops-report-ai.
> Cualquier similitud con organizaciones reales es coincidencia.

---

## El negocio

**Nombre:** Cooperativa Solidaria del Norte (CoopNorte)
**Tipo:** Cooperativa de ahorro y crédito
**Tamaño:** 45 empleados, 3.200 asociados activos
**Ubicación:** Bogotá, Colombia

CoopNorte ofrece créditos de libre inversión y cuentas de ahorro programado.
Creció de manera orgánica y su operación interna nunca fue rediseñada formalmente.
Hoy funciona, pero con fricción creciente en la gestión de información.

---

## El problema operativo

El gerente general, don Carlos Medina, necesita saber cada lunes si el índice
de mora de la cartera superó el umbral crítico del 4%.

Hoy ese dato llega así: Andrés, el jefe de cartera, exporta un Excel desde el
sistema legacy cada viernes y se lo envía por WhatsApp a Lucía, la asistente
administrativa. Lucía lo copia manualmente en un consolidado y se lo lleva
impreso a don Carlos el lunes.

El problema no es Lucía. Es que el archivo de Andrés cambia de formato
cada semana — fechas en un formato distinto, columnas con nombres diferentes,
a veces filas duplicadas. Lucía dedica entre 2 y 3 horas solo en limpiar
el archivo antes de poder copiar el dato.

**El costo real:** don Carlos toma la decisión más importante de la semana
con un dato que tiene 72 horas de antigüedad y que nadie verificó formalmente.

---

## La única pregunta que este sistema debe responder

> **¿El índice de mora de la cartera superó el 4% esta semana?**

Todo lo que construimos en este proyecto existe para responder esa pregunta
de forma confiable, automática y trazable.

---

## Fuente de datos

**Área:** Cartera
**Responsable del dato:** Andrés Vargas, Jefe de Cartera
**Formato de entrada:** Excel exportado desde sistema legacy (SisCredito v2.1)
**Frecuencia:** Semanal, cada viernes al cierre

**Problemas conocidos del archivo fuente:**
- Fechas en formato `dd/mm/yyyy` o `mm-dd-yyyy` sin consistencia
- Nombre de columnas varía entre exportaciones
- Registros duplicados cuando un crédito tiene más de una cuota vencida
- Celdas vacías en campos que deberían ser obligatorios
- Valores monetarios a veces con símbolo `$`, a veces sin él

---

## Las dos entidades del dominio

### ReporteCartera

Representa el estado de la cartera de créditos en una semana específica.
Es la entidad principal — todo el pipeline existe para producirla correctamente.

```
ReporteCartera
├── semana              fecha de inicio y cierre del período
├── carteraTotalVigente valor total de créditos activos
├── carteraEnMora       valor de créditos con cuotas vencidas
├── indiceMora          porcentaje: carteraEnMora / carteraTotalVigente
├── creditosNuevos      cantidad de créditos desembolsados en la semana
└── fuenteArchivo       nombre del archivo original procesado
```

### AlertaOperativa

Representa una condición de negocio que superó un umbral definido previamente.
El sistema genera la alerta — **nunca decide qué hacer con ella.**
Esa decisión es exclusivamente de don Carlos.

```
AlertaOperativa
├── tipo                clasificación de la alerta (mora | anomalia_dato)
├── semana              período al que corresponde
├── valorActual         el número que disparó la alerta
├── umbral              el límite definido por el negocio
├── descripcion         texto legible explicando qué ocurrió
└── requiereAccion      booleano — indica que hay una decisión humana pendiente
```

---

## Umbral definido por el negocio

| Métrica | Umbral | Consecuencia definida por el negocio |
|---|---|---|
| Índice de mora | > 4% | Don Carlos activa el comité de riesgo |
| Dato faltante o inconsistente | cualquiera | Alerta antes de generar el reporte |

---

## Lo que el sistema NO hace — límite explícito

- No decide si el índice de mora es aceptable o no
- No recomienda acciones ante una alerta
- No corrige datos incorrectos — alerta y detiene el procesamiento
- No reemplaza la validación humana del dato fuente
- No interpreta por qué subió la mora — solo reporta que subió

---

## Flujo esperado del sistema

```
Archivo Excel de Andrés
        ↓
Ingesta y validación de formato
        ↓
Normalización (fechas, valores, duplicados)
        ↓  ← IA asiste solo en este paso
¿Dato completo y consistente?
   NO → AlertaOperativa (anomalia_dato) → detener
   SÍ → construir ReporteCartera
        ↓
¿indiceMora > 4%?
   SÍ → AlertaOperativa (mora) + ReporteCartera
   NO → ReporteCartera
        ↓
Reporte disponible para don Carlos el viernes al cierre
```

---

> *Este caso define el contrato entre el negocio y el sistema.
> Cualquier decisión técnica debe justificarse en términos de
> ReporteCartera, AlertaOperativa o la pregunta que las une.*