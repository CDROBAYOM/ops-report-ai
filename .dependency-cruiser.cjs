/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /**
     * ADR-001 — Regla 1: el dominio no puede importar desde infraestructura.
     * El corazón del sistema no conoce ni Excel, ni IA, ni bases de datos.
     */
    {
      name: "adr-001-domain-no-infraestructura",
      severity: "error",
      comment:
        "ADR-001: el módulo core/domain no puede depender de infrastructure. " +
        "Si necesitas algo de infraestructura en el dominio, el diseño está roto.",
      from: { path: "^src/core/domain" },
      to: { path: "^src/infrastructure" },
    },

    /**
     * ADR-001 — Regla 2: el dominio no puede importar paquetes de NestJS.
     * El dominio es POJO puro — no conoce el framework.
     */
    {
      name: "adr-001-domain-no-nestjs",
      severity: "error",
      comment:
        "ADR-001: el módulo core/domain no puede depender de @nestjs/*. " +
        "Las entidades y puertos del dominio son independientes del framework.",
      from: { path: "^src/core/domain" },
      to: { path: "^@nestjs/" },
    },

    /**
     * ADR-001 — Regla 3: sin ciclos de dependencia en ninguna capa.
     * Un ciclo es siempre una señal de que las responsabilidades están mal asignadas.
     */
    {
      name: "adr-001-no-ciclos",
      severity: "error",
      comment:
        "ADR-001: dependencias circulares prohibidas. " +
        "Si A depende de B y B depende de A, hay una responsabilidad mal asignada.",
      from: {},
      to: { circular: true },
    },
  ],

  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
