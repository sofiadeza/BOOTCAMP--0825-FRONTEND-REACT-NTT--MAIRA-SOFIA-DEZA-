import { render } from '@testing-library/react';
import NotFound from '../NotFound';

describe('NotFound (página)', () => {
  it('renderiza sin fallar', () => {
    const { container } = render(<NotFound />);
    expect(container).toBeTruthy();
  });
});
