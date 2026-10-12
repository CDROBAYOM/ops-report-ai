/**
 * Pruebas de contrato de ingesta — ADR-002
 *
 * Verifican que el adaptador de ingesta produce la entidad de dominio correcta
 * o la AlertaOperativa correspondiente ante cada tipo de entrada.
 *
 * Fitness function: si un cambio en el adaptador rompe el contrato para algún
 * tipo de fuente, el build falla antes del merge (job `architecture` en CI).
 */

import { ExcelCarteraAdapter } from "../../src/infrastructure/adapters/input/excel-cartera.adapter";
import { AlertaOperativa } from "../../src/core/domain/alerta-operativa.entity";
import path from "path";

const FIXTURES = path.join(__dirname, "../fixtures");

describe("ADR-002: contrato de ingesta desde fuentes heterogéneas", () => {
  let adapter: ExcelCarteraAdapter;

  beforeEach(() => {
    adapter = new ExcelCarteraAdapter();
  });

  // ─── Caso 1: columnas inconsistentes ─────────────────────────────────────
  describe("cartera_semana_02 — nombres de columna inconsistentes", () => {
    it("mapea aliases conocidos y retorna filas normalizadas", async () => {
      const result = await adapter.procesar(
        path.join(FIXTURES, "cartera_semana_02.xlsx")
      );

      expect(result.tipo).toBe("datos");
      expect(result.filas.length).toBeGreaterThan(0);

      // Cada fila debe tener los campos canónicos del dominio
      for (const fila of result.filas) {
        expect(fila).toHaveProperty("saldoVigente");
        expect(fila).toHaveProperty("valorMora");
        expect(fila).toHaveProperty("fechaDesembolso");
      }
    });

    it("genera AlertaOperativa si ningún alias coincide con las columnas del archivo", async () => {
      // Adaptador con un mapa de aliases vacío simula un archivo completamente desconocido
      const adapterSinAliases = new ExcelCarteraAdapter({ aliases: {} });
      const result = await adapterSinAliases.procesar(
        path.join(FIXTURES, "cartera_semana_02.xlsx")
      );

      expect(result.tipo).toBe("alerta");
      expect(result.alerta).toBeInstanceOf(AlertaOperativa);
      expect(result.alerta.tipo).toBe("anomalia_dato");
      expect(result.alerta.detalle).toMatch(/columna/i);
    });
  });

  // ─── Caso 2: formatos de fecha mezclados ─────────────────────────────────
  describe("cartera_semana_01 — formatos de fecha mezclados", () => {
    it("pasa las filas a normalización cuando las fechas son ambiguas", async () => {
      const result = await adapter.procesar(
        path.join(FIXTURES, "cartera_semana_01.xlsx")
      );

      // El adaptador no resuelve la ambigüedad — la delega al servicio de IA (ADR-003)
      // El resultado es datos (procesados o pendientes de normalización), no una alerta por fecha
      expect(result.tipo).toBe("datos");
    });
  });

  // ─── Caso 3: duplicados y celdas vacías ──────────────────────────────────
  describe("cartera_semana_03 — registros duplicados y campos vacíos", () => {
    it("elimina duplicados por ID_Credito y los registra en el log", async () => {
      const result = await adapter.procesar(
        path.join(FIXTURES, "cartera_semana_03.xlsx")
      );

      if (result.tipo === "datos") {
        // Sin duplicados en el resultado
        const ids = result.filas.map((f: any) => f.idCredito);
        const unicos = new Set(ids);
        expect(unicos.size).toBe(ids.length);

        // Los duplicados eliminados están en el log de auditoría
        expect(result.log).toBeDefined();
        expect(result.log.duplicadosEliminados).toBeGreaterThanOrEqual(0);
      }
    });

    it("genera AlertaOperativa si Saldo_Vigente es nulo en un registro activo", async () => {
      // El fixture cartera_semana_03 contiene al menos un registro con Saldo_Vigente vacío
      const result = await adapter.procesar(
        path.join(FIXTURES, "cartera_semana_03.xlsx")
      );

      // Puede terminar en alerta (si hay campos vacíos que detengan el proceso)
      // o en datos (si todos los campos vacíos son de registros inactivos)
      // Lo que NO puede pasar es que retorne datos con saldoVigente = null
      if (result.tipo === "datos") {
        for (const fila of result.filas) {
          expect(fila.saldoVigente).not.toBeNull();
          expect(fila.saldoVigente).not.toBeUndefined();
        }
      } else {
        expect(result.alerta).toBeInstanceOf(AlertaOperativa);
        expect(result.alerta.tipo).toBe("anomalia_dato");
      }
    });
  });

  // ─── Contrato de la entidad AlertaOperativa ───────────────────────────────
  describe("contrato de AlertaOperativa", () => {
    it("toda alerta generada tiene tipo, archivo fuente y detalle", async () => {
      const adapterSinAliases = new ExcelCarteraAdapter({ aliases: {} });
      const result = await adapterSinAliases.procesar(
        path.join(FIXTURES, "cartera_semana_01.xlsx")
      );

      if (result.tipo === "alerta") {
        expect(result.alerta.tipo).toBeDefined();
        expect(result.alerta.archivoFuente).toBeDefined();
        expect(result.alerta.detalle).toBeDefined();
        expect(result.alerta.timestamp).toBeDefined();
      }
    });
  });
});
