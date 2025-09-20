import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../Cart';
import { MemoryRouter } from 'react-router-dom';

const product = {
  id: 1,
  title: 'Item',
  description: 'Desc',
  price: 10,
  thumbnail: 'x.jpg',
  stock: 5,
  category: 'General',
};

describe('Cart (formulario de checkout)', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test('submit con campos vacíos no rompe la UI', () => {
    const onCheckout = jest.fn();
    render(
      <MemoryRouter>
        <Cart
          items={[{ product, quantity: 1 }]}
          onUpdateQty={() => {}}
          onRemove={() => {}}
          onCheckout={onCheckout}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /resumen de compra/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    // Buscar el texto exacto "Total:" para evitar "Subtotal"
    expect(screen.getByText(/^Total:$/i)).toBeInTheDocument();
  });

  test('completar formulario y hacer submit', () => {
    const onCheckout = jest.fn();
    render(
      <MemoryRouter>
        <Cart
          items={[{ product, quantity: 1 }]}
          onUpdateQty={() => {}}
          onRemove={() => {}}
          onCheckout={onCheckout}
        />
      </MemoryRouter>
    );

    // Inputs por placeholder/label
    fireEvent.change(screen.getByPlaceholderText(/nombres/i), { target: { value: 'Mai' } });
    fireEvent.change(screen.getByPlaceholderText(/apellidos/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText(/\+519x+/i), { target: { value: '+51912345678' } });
    fireEvent.change(screen.getByPlaceholderText(/calle 123/i), { target: { value: 'Av 123' } });
    fireEvent.change(screen.getByPlaceholderText(/frente al parque/i), { target: { value: 'Cerca' } });

    // Select de distrito
    fireEvent.change(screen.getByRole('combobox', { name: /distrito/i }), { target: { value: 'Lima' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    // La tabla sigue visible (UI estable) y se llamó onCheckout
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});
