import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer (componente)', () => {
  it('renderiza sin fallar', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });
});
