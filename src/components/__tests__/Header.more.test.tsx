import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { MemoryRouter } from 'react-router-dom';

test('Header dispara logout y muestra contador', () => {
  const onLogout = jest.fn();

  render(
    <MemoryRouter>
      <Header userName="Mai User" cartCount={3} onLogout={onLogout} />
    </MemoryRouter>
  );

  // User + links de carrito
  expect(screen.getByText(/Mai User/i)).toBeInTheDocument();

  // Link del menú: nombre accesible EXACTO "Carrito"
  expect(screen.getByRole('link', { name: /^carrito$/i })).toBeInTheDocument();

  // Link del ícono: nombre accesible "Ver carrito"
  expect(screen.getByRole('link', { name: /ver carrito/i })).toBeInTheDocument();

  // Badge del contador
  expect(screen.getByText('3')).toBeInTheDocument();

  // Click en salir
  fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));
  expect(onLogout).toHaveBeenCalledTimes(1);
});
