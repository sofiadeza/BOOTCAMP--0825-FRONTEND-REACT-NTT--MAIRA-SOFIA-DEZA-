import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

describe('Header (componente)', () => {
  it('renderiza con props mínimas', () => {
    const { container } = render(
      <MemoryRouter>
        <Header userName="Test User" cartCount={0} onLogout={() => {}} />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});

