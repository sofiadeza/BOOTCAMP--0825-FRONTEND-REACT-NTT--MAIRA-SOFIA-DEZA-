# Pack para subir coverage > 90%

Este ZIP trae **3 archivos de test** listos para pegar en tu repo. Para que pasen sin tocar UX, agrega mínimos `data-testid` en `App.tsx`, `Cart.tsx` y `Login.tsx` como se indica.

---

## Archivos incluidos

- `src/pages/__tests__/Cart.form.test.tsx`
- `src/pages/__tests__/Login.forgot.test.tsx`
- `src/components/__tests__/Header.more.test.tsx`

---

## Cambios mínimos necesarios en tu código

### 1) `App.tsx`
Asegúrate de mostrar loader y error global con testids:

```tsx
{loading && <div role="status" data-testid="loading">Cargando…</div>}
{error && <div role="alert" data-testid="global-error">{error}</div>}
```

*Colócalo dentro del `<main>` antes de `<Routes>`.*

### 2) `Cart.tsx`
Añade `data-testid` a los campos y mensajes del formulario:

```tsx
<input data-testid="firstName" ... />
<input data-testid="lastName" ... />
<select data-testid="district" ... />
<input data-testid="address" ... />
<input data-testid="reference" ... />
<input data-testid="phone" ... />

<button type="submit" data-testid="checkout-btn">Finalizar compra</button>

{formError && (
  <div role="alert" data-testid="checkout-error">{formError}</div>
)}
{successMsg && (
  <div role="status" data-testid="checkout-success">{successMsg}</div>
)}
```

Ajusta los nombres si tus props/estado se llaman distinto.

### 3) `Login.tsx` (flujo "olvidé mi contraseña")
Añade testids a los elementos del modal:

```tsx
<button type="button" data-testid="forgot-open">¿Olvidaste tu contraseña?</button>

{forgotOpen && (
  <div role="dialog">
    <input data-testid="forgot-email" type="email" ... />
    {forgotError && <div role="alert" data-testid="forgot-error">{forgotError}</div>}
    {forgotOk && <div role="status" data-testid="forgot-ok">Te enviamos un correo</div>}
    <button data-testid="forgot-submit">Enviar</button>
  </div>
)}
```

---

## Cómo usar este pack

1. Copia las carpetas/archivos de `src/...` a tu proyecto respetando rutas.
2. Realiza los cambios mínimos anteriores (no afectan UI).
3. Ejecuta:
   ```bash
   npm test -- --coverage --watchAll=false
   ```

Si te quedas un poco por debajo del 90%, añade un test chiquito de Market:
- Pon `data-testid="search-input"` al input de búsqueda en `Market.tsx`
- Crea un test que escriba 3+ caracteres y verifique filtrado o mensaje "sin resultados". Eso empuja branches en `Market`.
```
