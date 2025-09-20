import { render } from '@testing-library/react';
import Cart from '../Cart';
import type { CartItem, Product } from '../../types';

describe('Cart (página)', () => {
  it('renderiza con un item', () => {
    const product: Product = {
      id: 1, title: 'P1', description: 'd', price: 10, thumbnail: '', stock: 3, category: 'cat'
    };
    const items: CartItem[] = [{ product, quantity: 1 }];
    const { container } = render(
      <Cart items={items} onUpdateQty={() => {}} onRemove={() => {}} onCheckout={() => {}} />
    );
    expect(container).toBeTruthy();
  });
});
