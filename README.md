# My Market

## 1) ¿Qué se ha implementado?
- **Autenticación (DummyJSON)**: login en `/`, sesión guardada en `sessionStorage`.  
  Rutas protegidas: **/market**, **/cart** y **404** (si no hay sesión, va al login).
  Modal “Olvidé mi contraseña” y validación de email.
- **Market (catálogo)**: productos y categorías desde DummyJSON, 10 ítems por página, con paginación, filtro por categoría,
  búsqueda con sugerencias (≥3 caracteres),
  **cards** de igual altura; cantidad editable con **±**, el stock baja al agregar productos.
- **Cart (carrito)**: editar/eliminar cantidades, formulario de envío con validaciones,  
  bloquea compra si el carrito está vacío; **vacía el carrito** al comprar.
- **UI/Theme**: tema claro (fondo blanco); diseño responsive.

---

## 2) Pasos para ejecutarlo localmente
```bash
# instalar dependencias
npm install
# ejecutar en modo desarrollo
npm run dev
```

## 3) Arquitectura de carpetas 
```bash
src/
  App.tsx                # Rutas, RequireAuth, estado simple (auth, productos, carrito)
  main.tsx               # Crear y montar la app de React en #root, Envolver la app con BrowserRouter para habilitar React Router y cargar los estilos globales.
  types.ts               # Tipos TS: Product, CartItem, AuthData

  components/
    Header.tsx           
    Footer.tsx
    ProductCard.tsx      # Card del producto

  pages/
    Login.tsx            # Login + modal “Olvidé mi contraseña”
    Market.tsx           # Catálogo, filtros por categoría, búsqueda, paginación 
    Cart.tsx             # Carrito + formulario de envío; compra limpia el carrito
    NotFound.tsx         # 404 (protegida)

  hooks/
    usePagination.ts     # Paginación en cliente (10 por página)

  ui/
    Button.tsx
    Input.tsx

  styles/
    global.css, header.css, market.css, product-card.css,
    cart.css, button.css, input.css, footer.css, modal.css
```
