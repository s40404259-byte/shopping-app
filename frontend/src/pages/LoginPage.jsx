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
  const [otpStatus, setOtpStatus] = useState('');

  const sendOtp = async ({ emailValue, phoneValue }) => {
    setOtpStatus('');
    try {
      const payload = phoneValue ? { phone: phoneValue } : { email: emailValue };
      const { data } = await api.post('/api/auth/send-otp', payload);
      setOtpStatus(`OTP sent on ${data.channel}: ${data.target}`);
    } catch (error) {
      setOtpStatus(error?.response?.data?.error || 'Failed to send OTP');
    }
  };

  return (
    <section>
      <h2>Login / Signup</h2>
      <div className="card">
        <h3>Email Login</h3>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => dispatch(signup({ email, password }))}>Signup Email</button>
        <button onClick={() => dispatch(login({ email, password }))}>Login Email</button>
        <button onClick={() => sendOtp({ emailValue: email })}>Forgot Password (Send Email OTP)</button>
        <button onClick={() => dispatch(login({ email, otp }))}>Login with Email OTP</button>
      </div>

      <div className="card">
        <h3>Phone Login</h3>
        <input placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button onClick={() => sendOtp({ phoneValue: phone })}>Send Phone OTP</button>
        <input placeholder="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button onClick={() => dispatch(login({ phone, otp }))}>Login OTP</button>
      </div>

      <div className="card">
        <h3>Google</h3>
        <input placeholder="gmail" value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)} />
        <button onClick={() => dispatch(signup({ provider: 'google', googleEmail }))}>Signup Google</button>
        <button onClick={() => dispatch(login({ provider: 'google', googleEmail }))}>Login Google</button>
      </div>

      {otpStatus && <p>{otpStatus}</p>}
    </section>
  );
}
