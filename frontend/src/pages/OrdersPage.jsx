import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory, trackOrder } from '../features/orders/orderSlice';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user?.id);
  const history = useSelector((s) => s.orders.history);
  const tracking = useSelector((s) => s.orders.tracking);

  return (
    <section>
      <h2>Orders</h2>
      <button onClick={() => dispatch(fetchHistory(userId))}>Load orders</button>
      {history.map((o) => (
        <div key={o.orderId} className="card">
          {o.orderId} - {o.status}
          <button onClick={() => dispatch(trackOrder(o.orderId))}>Track</button>
        </div>
      ))}
      {tracking && <pre>{JSON.stringify(tracking, null, 2)}</pre>}
    </section>
  );
}
