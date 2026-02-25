import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items);
  const userId = useSelector((s) => s.auth.user?.id || 'guest_user');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <section>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p.sku} className="card">
          <h4>{p.name}</h4>
          <p>₹{p.price} | Stock: {p.stock}</p>
          <button disabled={p.stock === 0} onClick={() => dispatch(addToCart({ userId, sku: p.sku, quantity: 1 }))}>Add to cart</button>
        </div>
      ))}
    </section>
  );
}
