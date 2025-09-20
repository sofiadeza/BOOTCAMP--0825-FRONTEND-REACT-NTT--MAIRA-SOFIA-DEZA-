import { render } from '@testing-library/react';
import Login from '../Login';

describe('Login (página)', () => {
  it('renderiza sin fallar', () => {
    const { container } = render(<Login onLogin={() => {}} />);
    expect(container).toBeTruthy();
  });
});
