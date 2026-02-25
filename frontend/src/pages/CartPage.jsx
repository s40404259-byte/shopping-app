import { useSelector } from 'react-redux';

export default function CartPage() {
  const cart = useSelector((s) => s.cart.cart);
  return (
    <section>
      <h2>Cart</h2>
      {cart.items.map((i) => <div key={i.sku}>{i.name} x {i.quantity}</div>)}
      <h3>Total: ₹{cart.totalAmount}</h3>
    </section>
  );
}
