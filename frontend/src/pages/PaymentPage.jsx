import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../features/orders/orderSlice';

export default function PaymentPage() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user?.id);
  const order = useSelector((s) => s.orders.current);

  return (
    <section>
      <h2>Payment</h2>
      <button onClick={() => dispatch(placeOrder({ userId, paymentMethod: 'UPI', idempotencyKey: `idem_${Date.now()}` }))}>Pay & Confirm</button>
      {order?.order?.orderId && <p>Confirmed: {order.order.orderId}</p>}
    </section>
  );
}
