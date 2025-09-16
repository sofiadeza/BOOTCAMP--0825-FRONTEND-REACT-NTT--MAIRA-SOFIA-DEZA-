import { useState } from 'react';
import Button from '../ui/Button';
import '../styles/cart.css';
import type { CartItem } from '../types';

const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[\s'\-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const PHONE_RE = /^\+?\d{7,15}$/;

const DISTRICTS: string[] = [
  "Ancón","Ate","Barranco","Breña","Carabayllo","Chaclacayo","Chorrillos","Cieneguilla","Comas","El Agustino",
  "Independencia","Jesús María","La Molina","La Victoria","Lima","Lince","Los Olivos","Lurigancho (Chosica)","Lurín",
  "Magdalena del Mar","Miraflores","Pachacámac","Pucusana","Pueblo Libre","Puente Piedra","Punta Hermosa","Punta Negra",
  "Rímac","San Bartolo","San Borja","San Isidro","San Juan de Lurigancho","San Juan de Miraflores","San Luis",
  "San Martín de Porres","San Miguel","Santa Anita","Santa María del Mar","Santa Rosa","Santiago de Surco","Surquillo",
  "Villa El Salvador","Villa María del Triunfo",
  "Callao","Bellavista","Carmen de la Legua-Reynoso","La Perla","La Punta","Ventanilla","Mi Perú"
];

export default function Cart({ items, onUpdateQty, onRemove, onCheckout }: { items: CartItem[]; onUpdateQty: (productId: number, qty: number)=>void; onRemove: (productId: number)=>void; onCheckout: () => void }){
  const total = items.reduce((acc, it)=> acc + it.product.price * it.quantity, 0);
  const isCartEmpty = items.length === 0;

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [distrito, setDistrito] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [celular, setCelular] = useState('');

  const [errors, setErrors] = useState<{nombres?:string; apellidos?:string; distrito?:string; direccion?:string; celular?:string}>({});

  function validateAll(){
    const next: typeof errors = {};
    if(!NAME_RE.test(nombres.trim())) next.nombres = 'Solo letras, espacios, apóstrofes o guiones.';
    if(!NAME_RE.test(apellidos.trim())) next.apellidos = 'Solo letras, espacios, apóstrofes o guiones.';
    if(!distrito) next.distrito = 'Selecciona un distrito.';
    if(!direccion.trim()) next.direccion = 'Dirección requerida.';
    if(!PHONE_RE.test(celular.trim())) next.celular = 'Solo dígitos, puede iniciar con + (7–15).';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(isCartEmpty){ alert('Tu carrito está vacío'); return; }
    if(!validateAll()) return;
    alert('Compra realizada');
    onCheckout();
  }

  return (
    <section className="container" aria-labelledby="cartTitle">
      <h1 id="cartTitle" className="cart-title">Resumen de compra</h1>

      <div className="cart-tableWrap">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:'center', color:'var(--muted)'}}>No hay productos en el carrito</td></tr>
            )}
            {items.map(({product, quantity})=> {
              const max = Math.max(1, product.stock ?? 1);
              const subtotal = product.price * quantity;
              return (
              <tr key={product.id}>
                <td><img src={product.thumbnail} alt={product.title} className="thumb"/></td>
                <td>{product.title}</td>
                <td>S/ {product.price.toFixed(2)}</td>
                <td>
                  <div className="qty">
                    <Button aria-label="Disminuir" variant="ghost" onClick={()=> onUpdateQty(product.id, Math.max(1, quantity-1))}>–</Button>
                    <input
                      className="qtyInput"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={quantity}
                      onChange={(e)=>{
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        const num = raw === '' ? 1 : Number(raw);
                        const clamped = Math.max(1, Math.min(num, max));
                        onUpdateQty(product.id, clamped);
                      }}
                      onBlur={()=> onUpdateQty(product.id, Math.max(1, Math.min(quantity, max)))}
                      required
                    />
                    <Button aria-label="Aumentar" variant="ghost" onClick={()=> onUpdateQty(product.id, Math.min(max, quantity+1))}>+</Button>
                  </div>
                </td>
                <td>S/ {subtotal.toFixed(2)}</td>
                <td><Button variant="danger" onClick={()=> onRemove(product.id)}>Eliminar</Button></td>
              </tr>
            )})}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="totalRow">
                <span>Total:</span>
                <strong>S/ {total.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <form className="form" onSubmit={onSubmit} noValidate aria-label="Formulario de envío">
        <div className="grid2">
          <label className="field">Nombre
            <input
              placeholder="Nombres"
              value={nombres}
              onChange={(e)=>{
                const v = e.target.value.replace(/[0-9]/g, '').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'\-]/g, '');
                setNombres(v);
              }}
              onBlur={()=> setErrors(s=> ({...s, nombres: NAME_RE.test(nombres.trim())? undefined : 'Solo letras, espacios, apóstrofes o guiones.'}))}
              aria-invalid={!!errors.nombres}
              required
            />
            <span className="error">{errors.nombres ?? ''}</span>
          </label>
          <label className="field">Apellidos
            <input
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e)=>{
                const v = e.target.value.replace(/[0-9]/g, '').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'\-]/g, '');
                setApellidos(v);
              }}
              onBlur={()=> setErrors(s=> ({...s, apellidos: NAME_RE.test(apellidos.trim())? undefined : 'Solo letras, espacios, apóstrofes o guiones.'}))}
              aria-invalid={!!errors.apellidos}
              required
            />
            <span className="error">{errors.apellidos ?? ''}</span>
          </label>
        </div>
        <div className="grid2">
          <label className="field">Distrito
            <select
              value={distrito}
              onChange={(e)=> setDistrito(e.target.value)}
              onBlur={()=> setErrors(s=> ({...s, distrito: distrito? undefined : 'Selecciona un distrito.'}))}
              aria-invalid={!!errors.distrito}
              required
            >
              <option value="">Selecciona...</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="error">{errors.distrito ?? ''}</span>
          </label>
          <label className="field">Celular
            <input
              placeholder="+519XXXXXXXX"
              value={celular}
              onChange={(e)=>{
                let v = e.target.value.replace(/[^0-9+]/g, '');
                if(v.includes('+')){
                  v = '+' + v.replace(/\+/g, '').replace(/^(\+)/, '');
                }
                setCelular(v);
              }}
              onBlur={()=> setErrors(s=> ({...s, celular: PHONE_RE.test(celular.trim())? undefined : 'Solo dígitos, puede iniciar con + (7–15).'}))}
              aria-invalid={!!errors.celular}
              required
            />
            <span className="error">{errors.celular ?? ''}</span>
          </label>
        </div>
        <label className="field">Dirección
          <input
            placeholder="Calle 123, N° 456"
            value={direccion}
            onChange={(e)=> setDireccion(e.target.value)}
            onBlur={()=> setErrors(s=> ({...s, direccion: direccion.trim()? undefined : 'Dirección requerida.'}))}
            aria-invalid={!!errors.direccion}
            required
          />
          <span className="error">{errors.direccion ?? ''}</span>
        </label>
        <label className="field">Referencia
          <input
            placeholder="Frente al parque"
            value={referencia}
            onChange={(e)=> setReferencia(e.target.value)}
            required
          />
        </label>

        <Button type="submit" disabled={isCartEmpty}>Comprar</Button>
      </form>
    </section>
  );
}
