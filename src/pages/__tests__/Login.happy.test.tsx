import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';

test('login correcto llama onLogin', async () => {
const onLogin = jest.fn();

const originalFetch = (globalThis as any).fetch;

const mockFetch = jest.fn().mockResolvedValue({

  ok: true,

  json: async () => ({ token: 't', firstName: 'Mai', lastName: 'User' }),

} as any);

(globalThis as any).fetch = mockFetch;

render(<Login onLogin={onLogin} />);

fireEvent.change(screen.getByPlaceholderText(/usuario/i), { target: { value: 'mai' } });
fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: '12345678' } });
fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

await waitFor(() => expect(onLogin).toHaveBeenCalled());

(globalThis as any).fetch = originalFetch;

});
