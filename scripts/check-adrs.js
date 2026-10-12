#!/usr/bin/env node
/**
 * scripts/check-adrs.js — Fase 4: Control de calidad de los propios ADRs
 *
 * Verifica en cada ADR de docs/adr/:
 *   1. Front matter YAML presente y con todos los campos obligatorios.
 *   2. El valor de `status` pertenece al vocabulario permitido.
 *   3. Las secciones obligatorias están presentes.
 *   4. Los enlaces internos (relativos) no están rotos.
 *   5. Todo ADR en estado `aceptado` tiene sección de verificación.
 *
 * Ejecutado por el job `architecture` en GitHub Actions.
 * Salida: lista de errores por archivo. Exit code 1 si hay algún error.
 */

const fs = require("fs");
const path = require("path");

// ─── Configuración ────────────────────────────────────────────────────────────

const ADR_DIR = path.join(__dirname, "..", "docs", "adr");

const ESTADOS_VALIDOS = new Set([
  "propuesto",
  "aceptado",
  "obsoleto",
]);
// "reemplazado-por-ADR-00X" se valida con regex

const FRONT_MATTER_CAMPOS = [
  "status",
  "date",
  "decision-makers",
  "consulted",
  "revisar-en",
];

const SECCIONES_OBLIGATORIAS = [
  "## Contexto y problema",
  "## Drivers de decisión",
  "## Opciones consideradas",
  "## Decisión",
  "## Comparación de opciones",
  "## Consecuencias",
  "## Verificación",
  "## Riesgos y cumplimiento",
  "## Relacionado",
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

function parseFrontMatter(content) {
  // YAML front matter delimitado por --- al inicio del archivo
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  const fields = {};
  for (const line of raw.split(/\r?\n/)) {
    // Ignorar líneas de listas (- item) que no son claves
    if (line.trimStart().startsWith("-") && !line.includes(":")) continue;
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    if (!key || key.startsWith(" ") || key.startsWith("-")) continue;
    // Eliminar comentario inline (#) respetando que puede haber # dentro de strings
    let value = line.slice(colonIdx + 1).trim();
    // Si el valor es un array YAML en línea [a, b] o string sin #, procesar normal
    if (!value.startsWith("[") && !value.startsWith('"') && !value.startsWith("'")) {
      value = value.replace(/\s+#.*$/, "").trim();
    }
    if (key) fields[key] = value;
  }
  return fields;
}

function isValidStatus(status) {
  if (!status) return false;
  if (ESTADOS_VALIDOS.has(status)) return true;
  if (/^reemplazado-por-ADR-\d+$/.test(status)) return true;
  return false;
}

function checkLinks(content, filePath) {
  const errors = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[2];
    // Solo verificar enlaces relativos (no externos, no anclas puras)
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) continue;
    // Quitar fragmento (#sección)
    const hrefPath = href.split("#")[0];
    if (!hrefPath) continue;
    const resolved = path.resolve(path.dirname(filePath), hrefPath);
    if (!fs.existsSync(resolved)) {
      errors.push(`  Enlace roto: "${href}" → ${resolved}`);
    }
  }
  return errors;
}

// ─── Verificación principal ───────────────────────────────────────────────────

const files = fs.readdirSync(ADR_DIR).filter(
  (f) => f.endsWith(".md") && f !== "README.md" && f !== "template.md"
);

let totalErrors = 0;
const report = [];

for (const file of files) {
  const filePath = path.join(ADR_DIR, file);
  const content = fs.readFileSync(filePath, "utf8");
  const errors = [];

  // 1. Front matter presente
  const frontMatter = parseFrontMatter(content);
  if (!frontMatter) {
    errors.push("  ✗ Front matter YAML ausente (debe empezar con ---)");
  } else {
    // 2. Campos obligatorios del front matter
    for (const campo of FRONT_MATTER_CAMPOS) {
      if (!frontMatter[campo]) {
        errors.push(`  ✗ Front matter: campo obligatorio ausente o vacío: "${campo}"`);
      }
    }

    // 2b. Estado válido
    if (frontMatter.status && !isValidStatus(frontMatter.status)) {
      errors.push(
        `  ✗ Front matter: estado inválido "${frontMatter.status}". ` +
        `Valores permitidos: ${[...ESTADOS_VALIDOS].join(", ")}, reemplazado-por-ADR-NNN`
      );
    }
  }

  // 3. Secciones obligatorias
  for (const seccion of SECCIONES_OBLIGATORIAS) {
    if (!content.includes(seccion)) {
      errors.push(`  ✗ Sección obligatoria ausente: "${seccion}"`);
    }
  }

  // 4. Enlaces internos sin romper
  const linkErrors = checkLinks(content, filePath);
  errors.push(...linkErrors);

  // 5. ADR aceptado debe tener sección de verificación con contenido
  if (frontMatter && isValidStatus(frontMatter.status) && frontMatter.status === "aceptado") {
    const verificacionIdx = content.indexOf("## Verificación");
    if (verificacionIdx === -1) {
      errors.push("  ✗ ADR aceptado sin sección de Verificación");
    } else {
      // Verificar que la sección no está vacía (tiene al menos una línea de contenido)
      const afterVerificacion = content.slice(verificacionIdx + "## Verificación".length);
      const nextSection = afterVerificacion.search(/^## /m);
      const verificacionContent = nextSection >= 0
        ? afterVerificacion.slice(0, nextSection).trim()
        : afterVerificacion.trim();
      if (verificacionContent.length < 20) {
        errors.push("  ✗ La sección Verificación de un ADR aceptado está vacía o es insuficiente");
      }
    }
  }

  if (errors.length > 0) {
    report.push(`\n❌ ${file}`);
    report.push(...errors);
    totalErrors += errors.length;
  } else {
    report.push(`✅ ${file}`);
  }
}

// ─── Reporte ─────────────────────────────────────────────────────────────────

console.log("\n=== Calidad de ADRs ===\n");
for (const line of report) {
  console.log(line);
}

if (totalErrors > 0) {
  console.log(`\n✗ ${totalErrors} error(es) encontrado(s) en los ADRs.`);
  console.log("El build falla hasta que todos los ADRs cumplan los criterios de calidad.\n");
  process.exit(1);
} else {
  console.log(`\n✓ Todos los ADRs cumplen los criterios de calidad.\n`);
  process.exit(0);
}
