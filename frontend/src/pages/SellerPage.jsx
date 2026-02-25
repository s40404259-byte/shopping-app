import { useState } from 'react';
import { api } from '../services/api';
import CloudinaryUpload from '../components/CloudinaryUpload';

export default function SellerPage() {
  const [sellerId, setSellerId] = useState('seller_1');
  const [name, setName] = useState('Seller');
  const [sku, setSku] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [dashboard, setDashboard] = useState(null);

  const loadDash = async () => {
    await api.post('/api/sellers', { sellerId, legalName: name }).catch(() => null);
    const { data } = await api.get(`/api/sellers/${sellerId}/dashboard`);
    setDashboard(data);
  };

  const addProduct = async () => {
    await api.post('/api/catalog/products', { sku, name: productName, price: Number(price), stock: Number(stock), sellerId, imageUrl });
    await loadDash();
  };

  return (
    <section>
      <h2>Seller panel</h2>
      <input value={sellerId} onChange={(e) => setSellerId(e.target.value)} placeholder="seller id" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
      <button onClick={loadDash}>Load dashboard</button>
      <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="sku" />
      <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="product" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="price" />
      <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="stock" />
      <CloudinaryUpload onUploaded={setImageUrl} />
      <button onClick={addProduct}>Add product</button>
      {dashboard && <pre>{JSON.stringify(dashboard, null, 2)}</pre>}
    </section>
  );
}
