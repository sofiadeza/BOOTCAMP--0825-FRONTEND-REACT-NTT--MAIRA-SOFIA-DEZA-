import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import type { Product, Category } from '../../types'; // <- añade Category

const dummyCategory = 'general' as unknown as Category;

describe('ProductCard', () => {
  test('renderiza y llama onAdd al hacer click en "Agregar"', () => {
    const onAdd = jest.fn();
    const product: Product = {
      id: 1,
      title: 'Zapato',
      price: 99.99,
      thumbnail: 'img.jpg',
      description: 'Clásico',
      stock: 5,
      category: dummyCategory,            // <- añade esto
    };

    render(<ProductCard product={product} onAdd={onAdd} />);
    expect(screen.getByText(/zapato/i)).toBeInTheDocument();

    const btnAgregar = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(btnAgregar);

    expect(onAdd).toHaveBeenCalledWith(product, 1);
  });

  test('controla cantidad con + y – y respeta límites (min 1, max stock)', () => {
    const onAdd = jest.fn();
    const product: Product = {
      id: 2,
      title: 'Producto X',
      price: 50,
      thumbnail: 'x.jpg',
      description: 'Desc',
      stock: 3,
      category: dummyCategory,            // <- añade esto
    };

    render(<ProductCard product={product} onAdd={onAdd} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const inc = screen.getByRole('button', { name: /aumentar/i });
    const dec = screen.getByRole('button', { name: /disminuir/i });

    expect(input.value).toBe('1');
    fireEvent.click(inc);
    fireEvent.click(inc);
    expect(input.value).toBe('3');

    fireEvent.click(inc);
    expect(input.value).toBe('3');

    fireEvent.click(dec);
    fireEvent.click(dec);
    fireEvent.click(dec);
    expect(input.value).toBe('1');

    fireEvent.change(input, { target: { value: '999' } });
    expect(input.value).toBe('3');

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('1');
  });

  test('cuando no hay stock, deshabilita controles y muestra "No disponible"', () => {
    const onAdd = jest.fn();
    const product: Product = {
      id: 3,
      title: 'Producto sin stock',
      price: 10,
      thumbnail: 'z.jpg',
      description: '',
      stock: 0,
      category: dummyCategory,            // <- añade esto
    };

    render(<ProductCard product={product} onAdd={onAdd} />);

    expect(screen.getByText(/no disponible/i)).toBeInTheDocument();

    const btnAgregar = screen.getByRole('button', { name: /agregar/i });
    const inc = screen.getByRole('button', { name: /aumentar/i });
    const dec = screen.getByRole('button', { name: /disminuir/i });
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(btnAgregar).toBeDisabled();
    expect(inc).toBeDisabled();
    expect(dec).toBeDisabled();
    expect(input).toBeDisabled();

    fireEvent.click(btnAgregar);
    expect(onAdd).not.toHaveBeenCalled();
  });
});

