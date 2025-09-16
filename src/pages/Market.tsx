import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/market.css';
import type { Product } from '../types';
import { usePagination } from '../hooks/usePagination';

type Props = { products: Product[]; categories: string[]; loading?: boolean; error?: string | null; onAdd: (p: Product, qty: number)=>void };

const ALL = 'Todas las categorías';
function normalize(s: string){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

export default function Market({ products, categories = [], loading, error, onAdd }: Props){
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const options = useMemo(() => [ALL, ...categories], [categories]);

  const inCategory = useMemo(()=> category === ALL ? products : products.filter(p => p.category === category), [products, category]);
  const q = normalize(query);

  const filtered = useMemo(()=> q.length >= 3 ? inCategory.filter(p => normalize(p.title).includes(q)) : inCategory, [inCategory, q]);

  const suggestions = useMemo(()=> {
    if(q.length < 3) return [];
    const names = inCategory.filter(p => normalize(p.title).includes(q)).map(p => p.title);
    return Array.from(new Set(names)).slice(0, 8);
  }, [inCategory, q]);

  const { page, totalPages, currentItems, goTo, setPage } = usePagination<Product>(filtered, 10);
  const [maxPageButtons, setMaxPageButtons] = useState(9);
  useEffect(() => {
    function compute(){
      const w = window.innerWidth;
      const val = w < 360 ? 5 : w < 480 ? 7 : w < 768 ? 9 : 11;
      setMaxPageButtons(val);
    }
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  useEffect(()=>{ setPage(1); }, [category, q, setPage]);

  function clearSearch(){ setQuery(''); setActiveIndex(-1); setShowSuggestions(false); inputRef.current?.focus(); }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    if(!showSuggestions || q.length < 3) return;
    const max = suggestions.length;
    if(max === 0) return;
    if(e.key === 'ArrowDown'){ e.preventDefault(); setActiveIndex(i => (i + 1) % max); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); setActiveIndex(i => (i <= 0 ? max - 1 : i - 1)); }
    else if(e.key === 'Enter'){ if(activeIndex >= 0 && activeIndex < max){ e.preventDefault(); setQuery(suggestions[activeIndex]); } setShowSuggestions(false); setActiveIndex(-1); }
    else if(e.key === 'Escape'){ setShowSuggestions(false); setActiveIndex(-1); }
  }

  return (
    <section className="container" aria-labelledby="mkTitle">
      <h1 id="mkTitle" className="mk-title">Catálogo</h1>

      <div className="mk-controls">
        <div className="mk-row">
          <select className="mk-select" value={category} onChange={(e)=> { setCategory(e.target.value); setPage(1); }}>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <div className="mk-searchWrap">
            <input
              ref={inputRef}
              className="mk-search"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e)=>{ setQuery(e.target.value); setShowSuggestions(true); setActiveIndex(-1); }}
              onFocus={()=> setShowSuggestions(true)}
              onBlur={()=> setTimeout(()=> setShowSuggestions(false), 120)}
              onKeyDown={onKeyDown}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="sug-list"
              aria-activedescendant={activeIndex >= 0 ? `sug-${activeIndex}` : undefined}
              autoComplete="off"
            />
            {query && <button className="mk-clear" onClick={clearSearch} aria-label="Limpiar búsqueda">×</button>}

            <div className="mk-suggestions" data-open={showSuggestions || undefined}>
              {q.length < 3 ? (
                <div className="mk-msg">Escribe al menos tres caracteres</div>
              ) : (
                suggestions.length === 0 ? (
                  <div className="mk-msg">Sin coincidencias</div>
                ) : (
                  <ul role="listbox" id="sug-list">
                    {suggestions.map((name, i) => (
                      <li key={name}>
                        <button
                          type="button"
                          id={`sug-${i}`}
                          onMouseEnter={()=> setActiveIndex(i)}
                          onMouseDown={(e)=> e.preventDefault()}
                          onClick={()=> { setQuery(name); setShowSuggestions(false); setActiveIndex(-1); }}
                          aria-selected={activeIndex===i}
                          className={activeIndex===i? 'active': undefined}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="mk-msg">Cargando productos…</div>}
      {error && !loading && <div className="mk-msg">{error}</div>}

      <div className="mk-grid">
        {currentItems.map((p)=> (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>

      <nav className="mk-pagination" aria-label="Paginación">
  <button className="mk-pageBtn" onClick={() => goTo(page-1)} disabled={page<=1} aria-label="Página anterior">«</button>
  {(() => {
    const total = totalPages;
    const current = page;
    const maxButtons = Math.max(3, Math.min(15, maxPageButtons));
    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          className={n === current ? 'mk-pageBtn active' : 'mk-pageBtn'}
          onClick={() => goTo(n)}
          aria-current={n === current ? 'page' : undefined}
        >
          {n}
        </button>
      ));
    }
    const inner = Math.max(1, maxButtons - 2);
    let start = current - Math.floor(inner / 2);
    let end = current + Math.floor(inner / 2);
    if (start < 2) { start = 2; end = start + inner - 1; }
    if (end > total - 1) { end = total - 1; start = end - inner + 1; }
    const seq = [1];
    if (start > 2) seq.push('left');
    for (let n = start; n <= end; n++) seq.push(n);
    if (end < total - 1) seq.push('right');
    seq.push(total);
    return seq.map((it, idx) => {
      if (it === 'left') {
        return <span key={'el'+idx} className="mk-ellipsis">…</span>;
      }
      if (it === 'right') {
        return <span key={'er'+idx} className="mk-ellipsis">…</span>;
      }
      const n = it as number;
      return (
        <button
          key={n}
          className={n === current ? 'mk-pageBtn active' : 'mk-pageBtn'}
          onClick={() => goTo(n)}
          aria-current={n === current ? 'page' : undefined}
        >
          {n}
        </button>
      );
    });
  })()}
  <button className="mk-pageBtn" onClick={() => goTo(page+1)} disabled={page>=totalPages} aria-label="Página siguiente">»</button>
</nav>
    </section>
  );
}
