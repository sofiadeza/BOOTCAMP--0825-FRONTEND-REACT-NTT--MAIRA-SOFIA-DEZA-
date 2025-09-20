// src/pages/__tests__/Market.filters.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Market from '../Market';

const products = [
  { id: 1, title: 'Café Peruano', description: 'Desc A', price: 10, thumbnail: 'x.jpg', stock: 5, category: 'Grano' },
  { id: 2, title: 'Café Colombiano', description: 'Desc B', price: 12, thumbnail: 'y.jpg', stock: 3, category: 'Grano' },
  { id: 3, title: 'Té Verde', description: 'Desc C', price: 8,  thumbnail: 'z.jpg', stock: 4, category: 'Té' },
];

const categories = ['Grano', 'Té'];

test('filtra por texto', () => {
  const onAdd = jest.fn();

  render(
    <MemoryRouter>
      <Market products={products} categories={categories} onAdd={onAdd} />
    </MemoryRouter>
  );

  const search = screen.getByPlaceholderText(/buscar/i);
  fireEvent.change(search, { target: { value: 'peru' } });

  // Aserciones sobre el heading de la card (evita la sugerencia con el mismo texto)
  expect(screen.getByRole('heading', { name: /café peruano/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /café colombiano/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /té verde/i })).not.toBeInTheDocument();
});
