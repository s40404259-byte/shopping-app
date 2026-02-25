import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, searchProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{product.name}</h3>
        <div className="gallery">
          {(product.images || []).slice(0, 4).map((src) => <img key={src} src={src} alt={product.name} />)}
        </div>
        <p>{product.description || 'No description available'}</p>
        <h4>Reviews</h4>
        {(product.reviews || []).length > 0
          ? product.reviews.map((r, idx) => <p key={`${r.user || 'u'}_${idx}`}>⭐ {r.rating || 0} - {r.comment || ''}</p>)
          : <p>No reviews yet.</p>}
        <button disabled={product.stock === 0} onClick={() => onAdd(product.sku)}>Add to cart</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((s) => s.products.items);
  const userId = useSelector((s) => s.auth.user?.id || 'guest_user');
  const [selectedSku, setSelectedSku] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.sku === selectedSku) || null,
    [products, selectedSku],
  );

  const addOne = (sku) => dispatch(addToCart({ userId, sku, quantity: 1 }));

  return (
    <section>
      <h2>Products</h2>
      <input placeholder="search products" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => dispatch(searchProducts({ q: query }))}>Search</button>
      <button onClick={() => dispatch(fetchProducts())}>Reset</button>

      {products.map((p) => (
        <div key={p.sku} className="card">
          <h4>{p.name}</h4>
          <p>{p.category} | ₹{p.price} | Stock: {p.stock}</p>
          <p>{(p.reviews || []).length} review(s)</p>
          <button onClick={() => setSelectedSku(p.sku)}>View details</button>
          <button disabled={p.stock === 0} onClick={() => addOne(p.sku)}>Add to cart</button>
          <button
            disabled={p.stock === 0}
            onClick={() => {
              addOne(p.sku);
              navigate('/payment');
            }}
          >
            Buy now
          </button>
        </div>
      ))}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedSku(null)}
        onAdd={addOne}
      />
    </section>
  );
}
