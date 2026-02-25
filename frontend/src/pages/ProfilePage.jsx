import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, fetchAddresses } from '../features/profile/profileSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user?.id);
  const addresses = useSelector((s) => s.profile.addresses);
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [coords, setCoords] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (userId) dispatch(fetchAddresses(userId));
  }, [dispatch, userId]);

  const useLocation = () => navigator.geolocation.getCurrentPosition((p) => setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude }));

  return (
    <section>
      <h2>Profile & Address</h2>
      <input placeholder="Address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
      <input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
      <button onClick={useLocation}>Use live location</button>
      <button onClick={() => dispatch(addAddress({ userId, payload: { addressLine, city, state, pincode, ...coords } }))}>Add address</button>
      {addresses.map((a) => <div key={a.id}>{a.addressLine} - {a.city}</div>)}
    </section>
  );
}
