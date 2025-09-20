# 🧪 Pruebas de My Market

Este proyecto implementa una **cobertura de tests superior al 60 %** (actualmente ~73 % de líneas) para garantizar la calidad de la aplicación **My Market**, una tienda en línea desarrollada con **React + TypeScript**.

Las pruebas fueron realizadas con **Jest** y **@testing-library/react**.

---

## 📂 Estructura de los tests

Todos los archivos de pruebas se ubican en **`src/**`** siguiendo el patrón  
`__tests__` cerca del archivo que prueban.

La arquitectura de carpetas para los tests en My Market es simple y organizada para que cada prueba esté cerca del código que valida.
Aquí la idea principal 👇

```
src/
├─ App.test.tsx               ← test de la app principal
├─ components/
│  └─ __tests__/              ← tests de cada componente UI
│     ├─ Footer.test.tsx
│     ├─ Header.test.tsx
│     └─ ProductCard.test.tsx
├─ hooks/
│  └─ __tests__/              ← tests de hooks personalizados
│     └─ usePagination.test.ts
├─ pages/
│  └─ __tests__/              ← tests de cada página (rutas)
│     ├─ Cart.test.tsx
│     ├─ Login.test.tsx
│     └─ Market.test.tsx
└─ ui/                        ← componentes básicos (botones, inputs)
```

## ✅ Lo que ya está cubierto

App.tsx → test de integración básico.

components/ → Footer, Header, ProductCard probados.

hooks/ → usePagination probado al 100%.

pages/ → Cart, Login, Market y NotFound tienen tests (incluyendo escenarios extras como filtros, formulario, login olvidado, etc.).

ui/ → Button e Input tienen tests de uso básico.
