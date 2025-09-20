import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mocks simples de tus componentes
jest.mock('./components/Header', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="header">
      Header {props.userName ?? 'Anon'} ({props.cartCount ?? 0})
      <button data-testid="logout" onClick={props.onLogout}>Salir</button>
    </div>
  ),
}));
jest.mock('./components/Footer', () => ({ __esModule: true, default: () => <div data-testid="footer">Footer</div> }));
jest.mock('./pages/Login', () => ({
  __esModule: true,
  default: (props: any) => (
    <button
      data-testid="login"
      onClick={() => props.onLogin?.({ firstName: 'Mai', lastName: 'User', email: 'mai@ex.com', token: 't' })}
    >
      MockLogin
    </button>
  ),
}));
jest.mock('./pages/Market', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="market">
      Market
      {props.error && <div data-testid="error" role="alert">{props.error}</div>}
    </div>
  ),
}));
jest.mock('./pages/Cart',   () => ({ __esModule: true, default: () => <div data-testid="cart">Cart</div> }));
jest.mock('./pages/NotFound', () => ({ __esModule: true, default: () => <div data-testid="notfound">NotFound</div> }));

const flushAppEffects = async () => {
  await waitFor(() => {
    expect((globalThis.fetch as jest.Mock)).toHaveBeenCalled();
  });
};

beforeEach(() => {
  sessionStorage.clear();
  globalThis.fetch = jest.fn((url: string) => {
    if (url.includes('category-list')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(['cat1', 'cat2']) }) as any;
    }
    if (url.includes('products')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ products: [], total: 0, limit: 100 }) }) as any;
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }) as any;
  }) as any;
});

afterEach(() => {
  jest.resetAllMocks();
});

it('muestra Login cuando no hay auth', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  await flushAppEffects(); // <- esto elimina el warning
  expect(screen.getByTestId('login')).toBeTruthy();
  expect(screen.queryByTestId('header')).toBeNull();
});

it('login navega a /market y muestra Header', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  await flushAppEffects();
  fireEvent.click(screen.getByTestId('login'));
  await waitFor(() => {
    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByTestId('market')).toBeTruthy();
  });
  expect(sessionStorage.getItem('auth')).toBeTruthy();
});

it('ruta protegida /cart redirige a Login si no hay auth', async () => {
  render(
    <MemoryRouter initialEntries={['/cart']}>
      <App />
    </MemoryRouter>
  );
  await flushAppEffects();
  expect(screen.getByTestId('login')).toBeTruthy();
});

it('muestra mensaje de error si falla la carga inicial', async () => {

  sessionStorage.setItem(
    'auth',
    JSON.stringify({ firstName: 'Mai', lastName: 'User', email: 'mai@ex.com', token: 't' })
  );

  (globalThis.fetch as jest.Mock)
    .mockImplementationOnce(() => Promise.reject(new Error('boom')))
    .mockImplementation((url: string) => {
      if (url.includes('category-list')) {
        return Promise.resolve({ ok: true, json: async () => ['cat1', 'cat2'] }) as any;
      }
      if (url.includes('products')) {
        return Promise.resolve({ ok: true, json: async () => ({ products: [], total: 0, limit: 100 }) }) as any;
      }
      return Promise.resolve({ ok: true, json: async () => ({}) }) as any;
    });

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/no se pudieron cargar los productos/i)
  ).toBeInTheDocument();
});

it('logout limpia auth y vuelve a Login', async () => {
  sessionStorage.setItem('auth', JSON.stringify({ token: 't', firstName: 'Mai', lastName: 'User' }));

  render(
    <MemoryRouter initialEntries={['/market']}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByTestId('header')).toBeTruthy());

  fireEvent.click(screen.getByTestId('logout'));

  expect(screen.getByTestId('login')).toBeTruthy();
  expect(sessionStorage.getItem('auth')).toBeNull();
});

it('ruta desconocida muestra NotFound', async () => {

  sessionStorage.setItem(
    'auth',
    JSON.stringify({ token: 't', firstName: 'Mai', lastName: 'User', email: 'mai@ex.com' })
  );

  render(
    <MemoryRouter initialEntries={['/ruta-que-no-existe']}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByTestId('notfound')).toBeTruthy());
});

it('muestra loader mientras carga', () => {
  // 1) Forzamos que la PRIMERA llamada a fetch nunca resuelva
  (globalThis.fetch as jest.Mock).mockImplementationOnce(
    () => new Promise(() => {}) // queda pendiente => loading=true
  );

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  // 3) Aserción del loader (usa UNA de estas y borra las otras dos)
  expect(screen.getByRole('status')).toBeInTheDocument();
});
