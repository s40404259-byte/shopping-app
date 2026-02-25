import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShippingQuote } from '../features/shipping/shippingSlice';

export default function ShippingPage() {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart.cart);
  const quote = useSelector((s) => s.shipping.quote);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const useLocation = () => navigator.geolocation.getCurrentPosition((p) => {
    setLat(String(p.coords.latitude));
    setLng(String(p.coords.longitude));
  });

  return (
    <section>
      <h2>Shipping</h2>
      <input placeholder="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
      <input placeholder="lng" value={lng} onChange={(e) => setLng(e.target.value)} />
      <button onClick={useLocation}>Use location</button>
      <button onClick={() => dispatch(getShippingQuote({ lat: Number(lat), lng: Number(lng), itemsCount: cart.items.length, subtotal: cart.totalAmount }))}>Calculate</button>
      {quote && <pre>{JSON.stringify(quote, null, 2)}</pre>}
    </section>
  );
}
