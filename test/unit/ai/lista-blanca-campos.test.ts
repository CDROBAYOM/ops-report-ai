/**
 * Prueba de lista blanca de campos hacia la IA — ADR-003
 *
 * Fitness function: verifica que:
 * 1. Solo los campos autorizados salen del perímetro del sistema hacia el modelo.
 * 2. Toda respuesta del servicio de IA conserva valor_original, valor_normalizado
 *    y version_modelo para garantizar la auditabilidad.
 *
 * Si se agrega un campo no autorizado al payload o se omite un campo de
 * trazabilidad, el build falla.
 */

import { NormalizacionService } from "../../src/infrastructure/ai/normalizacion.service";

// ─── Lista blanca autorizada por ADR-003 ─────────────────────────────────────
const CAMPOS_AUTORIZADOS = new Set([
  "fecha_cruda",
  "contexto_fechas",
  "periodo_esperado",
]);

// ─── Campos de trazabilidad requeridos en la respuesta ───────────────────────
const CAMPOS_TRAZABILIDAD = ["valor_original", "valor_normalizado", "version_modelo"];

describe("ADR-003: lista blanca de campos hacia la IA", () => {
  let service: NormalizacionService;
  let payloadCapturado: Record<string, unknown> | null = null;

  beforeEach(() => {
    // Interceptamos el payload antes de que salga al modelo externo
    service = new NormalizacionService({
      onPayloadBuilt: (payload: Record<string, unknown>) => {
        payloadCapturado = payload;
      },
    });
  });

  afterEach(() => {
    payloadCapturado = null;
  });

  // ─── Regla 1: lista blanca ────────────────────────────────────────────────
  it("solo envía campos autorizados al modelo — ningún campo personal puede salir", async () => {
    await service.normalizarFecha("05/06/2025", [
      "03/06/2025",
      "10/06/2025",
      "17/06/2025",
    ]);

    expect(payloadCapturado).not.toBeNull();

    const camposEnPayload = Object.keys(payloadCapturado!);
    for (const campo of camposEnPayload) {
      expect(CAMPOS_AUTORIZADOS.has(campo)).toBe(true);
    }
  });

  it("no incluye campos de datos personales en el payload", async () => {
    const CAMPOS_PERSONALES = [
      "nombre",
      "cedula",
      "direccion",
      "telefono",
      "email",
      "id_credito",
      "numero_identificacion",
    ];

    await service.normalizarFecha("05/06/2025", ["03/06/2025"]);

    expect(payloadCapturado).not.toBeNull();

    for (const campoPersonal of CAMPOS_PERSONALES) {
      expect(payloadCapturado).not.toHaveProperty(campoPersonal);
    }
  });

  // ─── Regla 2: trazabilidad de la respuesta ────────────────────────────────
  it("conserva valor_original, valor_normalizado y version_modelo en la respuesta", async () => {
    const resultado = await service.normalizarFecha("05/06/2025", [
      "03/06/2025",
      "10/06/2025",
    ]);

    for (const campo of CAMPOS_TRAZABILIDAD) {
      expect(resultado).toHaveProperty(campo);
      expect((resultado as any)[campo]).not.toBeNull();
      expect((resultado as any)[campo]).not.toBeUndefined();
    }
  });

  it("el valor_original coincide exactamente con el input crudo", async () => {
    const valorCrudo = "05/06/2025";
    const resultado = await service.normalizarFecha(valorCrudo, []);

    expect((resultado as any).valor_original).toBe(valorCrudo);
  });

  // ─── Regla 3: confianza baja → señal de ambigüedad, no una fecha ─────────
  it("retorna señal de ambigüedad (sin fecha) cuando la confianza es baja", async () => {
    // Simulamos un contexto que hace imposible determinar el formato
    const servicioConBajaConfianza = new NormalizacionService({
      forceConfianza: "baja",
    });

    const resultado = await servicioConBajaConfianza.normalizarFecha(
      "01/02/2025", // ambiguo sin contexto
      []
    );

    expect((resultado as any).confianza).toBe("baja");
    expect((resultado as any).valor_normalizado).toBeNull();
  });
});
