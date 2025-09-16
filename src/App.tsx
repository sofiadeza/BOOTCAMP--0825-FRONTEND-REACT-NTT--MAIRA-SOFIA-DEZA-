import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Market from './pages/Market';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import type { AuthData, CartItem, Product } from './types';

async function fetchAllProducts(): Promise<Product[]>{
  const limit = 100;
  let skip = 0;
  let total = 0;
  const all: Product[] = [];
  do{
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    if(!res.ok) throw new Error('Error al cargar productos');
    const data = await res.json();
    const batch = (data.products || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || '',
      stock: p.stock,
      category: p.category
    } as Product));
    all.push(...batch);
    total = data.total ?? all.length;
    skip += data.limit ?? limit;
  } while(all.length < total);
  return all;
}

async function fetchCategories(): Promise<string[]>{ 
  const res = await fetch('https://dummyjson.com/products/category-list');
  if(!res.ok) throw new Error('Error al cargar categorías');
  const cats = await res.json();
  return Array.isArray(cats)? cats : [];
}

function RequireAuth({ children }: { children: JSX.Element }){
  const raw = sessionStorage.getItem('auth');
  const isAuthed = !!raw;
  const location = useLocation();
  if(!isAuthed){
    return <Navigate to="/" state={{ from: location }} replace/>;
  }
  return children;
}

export default function App(){
  const [auth, setAuth] = useState<AuthData | null>(()=>{
    const raw = sessionStorage.getItem('auth');
    return raw? JSON.parse(raw) as AuthData : null;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(()=>{
    let cancelled = false;
    (async()=>{
      try{
        setLoading(true);
        const [cats, prods] = await Promise.all([fetchCategories(), fetchAllProducts()]);
        if(cancelled) return;
        setCategories(cats);
        setProducts(prods);
        setError(null);
      }catch(e){
        if(cancelled) return;
        setError('No se pudieron cargar los productos.');
      }finally{
        if(!cancelled) setLoading(false);
      }
    })();
    return ()=>{ cancelled = true; };
  }, []);

  const userName = useMemo(()=> auth ? `${auth.firstName} ${auth.lastName}` : null, [auth]);

  function getStock(p: Product){ return p.stock ?? 5; }
  function setProductStock(productId: number, newStock: number){
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  }

  const addToCart = useCallback((product: Product, qty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(ci => ci.product.id === product.id);
      if(idx >= 0){
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
    const current = products.find(p => p.id === product.id);
    if(current){
      const available = Math.max(0, getStock(current));
      const addQty = Math.max(1, Math.min(qty, available));
      setProductStock(product.id, available - addQty);
    }
  }, [products]);

  const updateQty = useCallback((productId: number, newQty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(ci => ci.product.id === productId);
      if (idx === -1) return prev;
      const next = [...prev];
      const item = next[idx];
      next[idx] = { ...item, quantity: Math.max(1, newQty) };
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(ci => ci.product.id !== productId));
  }, []);

  function logout(){
    setAuth(null);
    sessionStorage.removeItem('auth');
  }

  return (
    <>
      {auth && (
        <Header userName={userName} cartCount={cart.length} onLogout={logout} />
      )}
      <main className="header-space">
        <Routes>
  <Route
    path="/"
    element={auth ? <Navigate to="/market" replace /> : (
      <Login onLogin={(data) => {
        setAuth(data);
        sessionStorage.setItem('auth', JSON.stringify(data));
      }} />
    )}
  />
  <Route
    path="/market"
    element={
      <RequireAuth>
        <Market
          products={products}
          categories={categories}
          loading={loading}
          error={error}
          onAdd={addToCart}
        />
      </RequireAuth>
    }
  />
  <Route
    path="/cart"
    element={
      <RequireAuth>
        <Cart
          items={cart}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCheckout={() => setCart([])}
        />
      </RequireAuth>
    }
  />
  <Route
    path="*"
    element={
      <RequireAuth>
        <NotFound />
      </RequireAuth>
    }
  />
</Routes>
      </main>
      <Footer />
    </>
  );
}
