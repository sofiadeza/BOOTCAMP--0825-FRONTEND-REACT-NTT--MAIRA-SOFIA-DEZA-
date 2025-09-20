# Paquete de pruebas unitarias (Jest + Testing Library)

Este paquete cumple con:
- **Cada componente** con su prueba independiente.
- **Cada página** con su prueba independiente.
- **Hooks** y **utilitarios**: incluye un generador que crea **un test por archivo** en `src/hooks` y `src/utils` (si existen).

> Está pensado para tu proyecto Vite + React + TypeScript con Jest 29 + ts-jest (como lo configuraste).

## Contenido
- `src/components/__tests__/Header.test.tsx`
- `src/components/__tests__/Footer.test.tsx`
- `src/pages/__tests__/Login.test.tsx`
- `src/pages/__tests__/Market.test.tsx`
- `src/pages/__tests__/Cart.test.tsx`
- `src/pages/__tests__/NotFound.test.tsx`
- `src/types/style.d.ts`  (declaraciones TS para importar CSS/SCSS)
- `tools/gen-tests-for-hooks-utils.cjs`  (genera un test por **hook** y por **utilitario**)

## Cómo usar

1. **Descomprime** este zip en la **raíz** de tu proyecto.
2. (Opcional) Genera tests por **hook** y **utilitario**:
   ```bash
   node tools/gen-tests-for-hooks-utils.cjs
   ```
   Esto crea, si existen carpetas/archivos:
   - `src/hooks/__tests__/<archivo>.test.ts`
   - `src/utils/__tests__/<archivo>.test.ts`
3. Ejecuta los tests:
   ```bash
   npm test
   ```
4. (Cobertura, opcional)
   ```bash
   npm run coverage
   ```

### Notas
- Los tests de componentes/páginas son **smoke tests** que no dependen de textos exactos (para evitar falsos negativos). 
- Si alguna página dispara `fetch` en `useEffect`, no falla; pero si necesitas evitar `act` warnings, puedes esperar los efectos con:
  ```ts
  import { waitFor } from '@testing-library/react';
  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
  ```
