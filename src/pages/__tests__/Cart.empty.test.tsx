import { render, screen } from '@testing-library/react';
import Cart from '../Cart';

test('muestra mensaje de carrito vacío', () => {
  render(
    <Cart
      items={[]}
      onUpdateQty={() => {}}
      onRemove={() => {}}
      onCheckout={() => {}}
    />
  );

  expect(screen.getByText(/no hay productos en el carrito/i)).toBeInTheDocument();
});
