/**
 * Minimal ESM resolver so the dev scripts in this folder can use the same
 * "@/..." import alias (and extensionless TS imports) as the Next.js app.
 * Next handles both itself via tsconfig paths; plain `node` does not.
 */
import { statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function resolveFile(base) {
  return [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]
    .find(isFile);
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const found = resolveFile(path.join(root, specifier.slice(2)));
    if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
  }
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const parentDir = path.dirname(new URL(context.parentURL).pathname);
    const found = resolveFile(path.resolve(parentDir, specifier));
    if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
