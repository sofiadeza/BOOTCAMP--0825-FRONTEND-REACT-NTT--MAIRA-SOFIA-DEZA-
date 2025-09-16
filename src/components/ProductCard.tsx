import { useState, memo } from 'react';
import '../styles/product-card.css';
import Button from '../ui/Button';
import type { Product } from '../types';

type Props = { product: Product; onAdd?: (product: Product, qty: number) => void };

function ProductCard({ product, onAdd }: Props){
  const [qty, setQty] = useState<number>(1);
  const stock = Math.max(0, product.stock ?? 5);
  const soldOut = stock <= 0;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = raw === '' ? 1 : Number(raw);
    const clamped = Math.max(1, Math.min(num, stock || 1));
    setQty(clamped);
  };
  const inc = () => setQty(q => Math.min(stock || 1, q + 1));
  const dec = () => setQty(q => Math.max(1, q - 1));

  return (
    <article className="pcard">
      <div className="pcard-thumb">
        <img src={product.thumbnail} alt={product.title} loading="lazy" decoding="async" />
      </div>
      <div className="pcard-body">
        <h3 className="pcard-title">{product.title}</h3>
        <p className="pcard-price">S/ {product.price.toFixed(2)}</p>
        <p className="pcard-desc">{product.description}</p>
        <p style={{margin:0, color:'var(--muted)'}}>Stock: {stock}</p>
        {soldOut && <p className="soldout">No disponible</p>}
        <div className="pcard-actions" style={{marginTop:'.4rem'}}>
          <div className="qtyWrap">
            <button type="button" className="stepBtn" aria-label="Disminuir" onClick={dec} disabled={soldOut}>–</button>
            <input
              className="qtyInput"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={stock || 1}
              value={qty}
              onChange={onChange}
              onBlur={()=> setQty(q => Math.max(1, Math.min(q, stock || 1)))}
              disabled={soldOut}
            />
            <button type="button" className="stepBtn" aria-label="Aumentar" onClick={inc} disabled={soldOut}>+</button>
          </div>
          <Button variant="primary" className="btn" onClick={()=> onAdd?.(product, qty)} disabled={soldOut}>Agregar</Button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
