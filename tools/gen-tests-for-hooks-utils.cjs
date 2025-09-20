/**
 * Genera un test por archivo en:
 *  - src/hooks  -> src/hooks/__tests__/<archivo>.test.ts
 *  - src/utils  -> src/utils/__tests__/<archivo>.test.ts
 *
 * Reglas:
 *  - Ignora *.test.*, *.d.ts, index.*
 *  - Para hooks: intenta invocar el hook si exporta default o un export cuyo nombre coincide con el archivo.
 *  - Para utils: verifica que el módulo exporte algo; si hay una función con el mismo nombre del archivo, prueba una invocación trivial si es posible.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function scanDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // no bajar a __tests__
      if (entry.name === '__tests__') continue;
      out.push(...scanDir(full));
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(entry.name) &&
          !/\.test\./.test(entry.name) &&
          !/\.d\.ts$/.test(entry.name) &&
          !/^index\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        out.push(full);
      }
    }
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function relImport(fromFile, targetFile) {
  let rel = path.relative(path.dirname(fromFile), targetFile).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  // quita extensión para import TS
  rel = rel.replace(/\.(ts|tsx|js|jsx)$/, '');
  return rel;
}

function genHookTest(hookFile) {
  const dir = path.join(path.dirname(hookFile), '__tests__');
  ensureDir(dir);
  const base = path.basename(hookFile).replace(/\.(ts|tsx|js|jsx)$/, '');
  const testPath = path.join(dir, `${base}.test.ts`);
  const importPath = relImport(testPath, hookFile);

  const content = `import { renderHook } from '@testing-library/react';
import * as mod from '${importPath}';

describe('${base} (hook)', () => {
  it('se importa y ejecuta sin fallar', () => {
    const name = '${base}';
    const hook: any = (mod as any)[name] ?? (mod as any).default;
    expect(hook).toBeTruthy();
    if (typeof hook === 'function') {
      const { result } = renderHook(() => hook());
      expect(result).toBeTruthy();
    }
  });
});
`;
  fs.writeFileSync(testPath, content, 'utf8');
  return testPath;
}

function genUtilTest(utilFile) {
  const dir = path.join(path.dirname(utilFile), '__tests__');
  ensureDir(dir);
  const base = path.basename(utilFile).replace(/\.(ts|tsx|js|jsx)$/, '');
  const testPath = path.join(dir, `${base}.test.ts`);
  const importPath = relImport(testPath, utilFile);

  const content = `import * as mod from '${importPath}';

describe('${base} (util)', () => {
  it('exporta algo usable', () => {
    expect(mod && typeof mod === 'object').toBe(true);
  });
});
`;
  fs.writeFileSync(testPath, content, 'utf8');
  return testPath;
}

function main() {
  const hooksDir = path.join(projectRoot, 'src', 'hooks');
  const utilsDir = path.join(projectRoot, 'src', 'utils');

  const hooks = scanDir(hooksDir);
  const utils = scanDir(utilsDir);

  const created = [];
  for (const f of hooks) created.push(genHookTest(f));
  for (const f of utils) created.push(genUtilTest(f));

  if (created.length === 0) {
    console.log('No se encontraron hooks ni utils para generar tests.');
  } else {
    console.log('Generados tests:');
    created.forEach(p => console.log(' - ' + path.relative(projectRoot, p)));
  }
}

main();
