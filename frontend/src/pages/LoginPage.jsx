import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, signup } from '../features/auth/authSlice';
import { api } from '../services/api';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  return (
    <section>
      <h2>Login / Signup</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => dispatch(signup({ email, password }))}>Signup Email</button>
      <button onClick={() => dispatch(login({ email, password }))}>Login Email</button>

      <input placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={() => api.post('/api/auth/send-otp', { phone })}>Send OTP</button>
      <input placeholder="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={() => dispatch(login({ phone, otp }))}>Login OTP</button>

      <input placeholder="gmail" value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)} />
      <button onClick={() => dispatch(signup({ provider: 'google', googleEmail }))}>Signup Google</button>
      <button onClick={() => dispatch(login({ provider: 'google', googleEmail }))}>Login Google</button>
    </section>
  );
}
