import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProductAdmin } from '../features/products/productSlice';
import CloudinaryUpload from '../components/CloudinaryUpload';

export default function AdminPage() {
  const dispatch = useDispatch();
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [sellerId, setSellerId] = useState('seller_1');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  return (
    <section>
      <h2>Admin panel</h2>
      <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="sku" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
      <input value={sellerId} onChange={(e) => setSellerId(e.target.value)} placeholder="seller" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="price" />
      <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="stock" />
      <CloudinaryUpload onUploaded={setImageUrl} />
      <button onClick={() => dispatch(createProductAdmin({ sku, name, sellerId, price: Number(price), stock: Number(stock), imageUrl }))}>Create product</button>
    </section>
  );
}
