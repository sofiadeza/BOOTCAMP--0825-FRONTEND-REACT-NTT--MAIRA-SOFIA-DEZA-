import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import '../styles/modal.css';

export default function Login({ onLogin }: { onLogin: (data: { token:string; firstName:string; lastName:string })=> void }){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    try{
      setLoading(true);
      setError(null);
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if(!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      onLogin({ token: data.token, firstName: data.firstName, lastName: data.lastName });
    }catch(err:any){
      setError(err.message || 'Error de autenticación');
    }finally{
      setLoading(false);
    }
  }

  function openForgot(e: React.MouseEvent){ e.preventDefault(); setForgotEmail(''); setForgotError(null); setForgotOpen(true); }
  function closeForgot(){ setForgotOpen(false); setForgotEmail(''); setForgotError(null); }
  function sendForgot(e: React.FormEvent){
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail);
    if(!ok){ setForgotError('Correo inválido'); return; }
    alert('Enlace de recuperación enviado');
    closeForgot();
  }

  return (
    <section className="container" style={{display:'grid', placeItems:'center', minHeight:'60dvh'}}>
      <form onSubmit={submit} style={{width:'min(420px, 92%)', display:'grid', gap:'.8rem'}}>
        <h1>Iniciar sesión</h1>
        <Input placeholder="Usuario" value={username} onChange={e=> setUsername(e.target.value)} autoComplete="username" />
        <Input placeholder="Contraseña" type="password" value={password} onChange={e=> setPassword(e.target.value)} autoComplete="current-password" />
        {error && <div style={{color:'var(--danger)'}}>{error}</div>}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'.5rem'}}>
          <Button type="submit" disabled={loading}>{loading? 'Ingresando...' : 'Ingresar'}</Button>
          <a href="#" onClick={openForgot} style={{color:'var(--muted)', textDecoration:'underline'}}>Olvidé mi contraseña</a>
        </div>
      </form>

      {forgotOpen && (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <form className="modal-card" onSubmit={sendForgot}>
      <div className="modal-header">
        <h3 className="modal-title">Recuperar contraseña</h3>
        <button type="button" className="modal-close" aria-label="Cerrar" onClick={closeForgot}>×</button>
      </div>
      <div className="modal-content">
        <Input type="email" placeholder="tu@correo.com" value={forgotEmail} onChange={e=> setForgotEmail(e.target.value)} />
        {forgotError && <div className="modal-error">{forgotError}</div>}
      </div>
      <div className="modal-footer">
        <Button variant="ghost" type="button" onClick={closeForgot}>Cancelar</Button>
        <Button type="submit">Enviar</Button>
      </div>
    </form>
  </div>
)}
    </section>
  );
}
