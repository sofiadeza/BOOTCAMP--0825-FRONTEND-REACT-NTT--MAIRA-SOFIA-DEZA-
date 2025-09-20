import { render } from '@testing-library/react';
import Market from '../Market';
import type { Product } from '../../types';

describe('Market (página)', () => {
  it('renderiza sin fallar con props mínimas', () => {
    const products: Product[] = [];
    const categories: string[] = [];
    const { container } = render(
      <Market products={products} categories={categories} loading={false} error={null} onAdd={() => {}} />
    );
    expect(container).toBeTruthy();
  });
});
