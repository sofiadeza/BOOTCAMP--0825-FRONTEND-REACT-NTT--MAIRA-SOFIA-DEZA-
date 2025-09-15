import { Link, NavLink } from 'react-router-dom';
import '../styles/header.css';
import Button from '../ui/Button';

export default function Header({ userName, cartCount, onLogout }: { userName: string | null; cartCount: number; onLogout: () => void }){
  return (
    <header className="hdr">
      <div className="container hdr-row">
        <Link to={userName? '/market':'/'} className="brand" aria-label="Inicio">
          <span className="logo" aria-hidden>🛒</span>
          <strong>Coffee Market</strong>
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/market" className={({isActive})=> isActive? 'link active':'link'}>Productos</NavLink>
          <NavLink to="/cart" className={({isActive})=> isActive? 'link active':'link'}>Carrito</NavLink>
        </nav>
        <div style={{display:'flex', gap:'.75rem', alignItems:'center'}}>
          {userName && <span className="userName">{userName}</span>}
          {userName && <Button variant="ghost" onClick={onLogout}>Cerrar sesión</Button>}
          <Link to="/cart" className="cart" aria-label="Ver carrito">
            <span className="sr-only">Carrito</span>
            <span className="cart-ico" aria-hidden>🧺</span>
            <span className="badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
