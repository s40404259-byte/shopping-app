import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts } from '../features/products/productSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items);
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = useMemo(() => {
    const values = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(values)];
  }, [products]);

  return (
    <section>
      <h2>Welcome to Flipkart-style app</h2>
      <p>Search products, browse categories, and continue checkout.</p>

      <input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
      <button onClick={() => dispatch(searchProducts({ q }))}>Search</button>
      <button onClick={() => dispatch(fetchProducts())}>Reset</button>

      <div style={{ marginTop: 8 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(cat === 'all' ? fetchProducts() : searchProducts({ category: cat }))}
          >
            {cat}
          </button>
        ))}
      </div>

      <Link to="/products">Go to products</Link>
    </section>
  );
}
