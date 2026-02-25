import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../features/orders/orderSlice';
import { fetchAddresses } from '../features/profile/profileSlice';

export default function PaymentPage() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user?.id);
  const order = useSelector((s) => s.orders.current);
  const addresses = useSelector((s) => s.profile.addresses);

  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [addressText, setAddressText] = useState('');

  useEffect(() => {
    if (userId) dispatch(fetchAddresses(userId));
  }, [dispatch, userId]);

  return (
    <section>
      <h2>Payment</h2>
      <p>Choose address and payment method (CARD / WALLET / COD).</p>

      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="CARD">Card</option>
        <option value="WALLET">Wallet</option>
        <option value="COD">Cash on Delivery</option>
      </select>

      <div>
        <h4>Address</h4>
        {addresses.map((a) => (
          <button key={a.id} onClick={() => setAddressText(`${a.addressLine}, ${a.city}, ${a.state}, ${a.pincode}`)}>
            {a.addressLine}, {a.city}
          </button>
        ))}
        <input
          placeholder="or type address"
          value={addressText}
          onChange={(e) => setAddressText(e.target.value)}
        />
      </div>

      <button
        disabled={!userId || !addressText}
        onClick={() => dispatch(placeOrder({
          userId,
          paymentMethod,
          shippingAddress: addressText,
          idempotencyKey: `idem_${Date.now()}`,
        }))}
      >
        Pay & Confirm
      </button>
      {order?.order?.orderId && <p>Confirmed: {order.order.orderId}</p>}
    </section>
  );
}
