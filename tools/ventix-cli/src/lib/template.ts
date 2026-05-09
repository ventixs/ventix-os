/**
 * Trivial `{{var}}` template renderer. Avoids pulling in handlebars/eta
 * for the small set of substitutions Phase 0 needs.
 */
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type TemplateVars = Readonly<Record<string, string>>;

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Located via the CLI source directory layout. */
export function templatesRoot(): string {
  return join(__dirname, '..', 'templates');
}

export function renderString(input: string, vars: TemplateVars): string {
  return input.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in vars)) {
      throw new Error(`[TEMPLATE_VAR_MISSING] '${key}' was used in template but not provided`);
    }
    return vars[key] as string;
  });
}

/**
 * Recursively render every file under `srcDir` into `destDir`. Files ending
 * in `.tmpl` have their suffix stripped after substitution; other files are
 * rendered as-is (variable substitution still applied).
 */
export function renderTemplateTree(
  srcDir: string,
  destDir: string,
  vars: TemplateVars,
): { written: string[] } {
  const written: string[] = [];
  if (!existsSync(srcDir)) {
    throw new Error(`[TEMPLATE_DIR_MISSING] no template directory at ${srcDir}`);
  }
  walk(srcDir, (file) => {
    const rel = relative(srcDir, file);
    const outRel = rel.endsWith('.tmpl') ? rel.slice(0, -5) : rel;
    const dest = join(destDir, outRel);
    mkdirSync(dirname(dest), { recursive: true });
    const content = readFileSync(file, 'utf8');
    writeFileSync(dest, renderString(content, vars));
    written.push(dest);
  });
  return { written };
}

function walk(dir: string, visit: (file: string) => void): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, visit);
    else visit(full);
  }
}
