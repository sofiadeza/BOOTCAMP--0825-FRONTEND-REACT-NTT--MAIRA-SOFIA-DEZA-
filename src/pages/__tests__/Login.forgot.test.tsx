import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { MemoryRouter } from 'react-router-dom';

test('Login muestra link "Olvidé mi contraseña" y el click no rompe', () => {
  const onLogin = jest.fn();

  render(
    <MemoryRouter>
      <Login onLogin={onLogin} />
    </MemoryRouter>
  );

  const link = screen.getByText(/olvidé mi contraseña/i);
  expect(link).toBeInTheDocument();

  // Hacer click no debería romper nada (no hay modal implementado)
  fireEvent.click(link);
});
