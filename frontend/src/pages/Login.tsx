import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const SECRET = import.meta.env.VITE_ENCRYPTION_SECRET || 'fallback-key';

const getSavedCredentials = () => {
  const saved = localStorage.getItem('rememberedCredentials');
  if (!saved) return { email: '', password: '' };
  try {
    const decrypted = CryptoJS.AES.decrypt(saved, SECRET).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return { email: '', password: '' };
  }
};

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const saved = getSavedCredentials();

  const [form, setForm]                 = useState({ email: saved.email, password: saved.password });
  const [rememberMe, setRememberMe]     = useState(!!saved.email);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { ...form, rememberMe });

      if (rememberMe) {
        // Encrypt karke save karo
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify({ email: form.email, password: form.password }),
          SECRET
        ).toString();
        localStorage.setItem('rememberedCredentials', encrypted);
      } else {
        localStorage.removeItem('rememberedCredentials');
      }

      login(data.token, data.user, rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome back</h2>

        {error && <p className="login-error">{error}</p>}

        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <div className="input-wrapper">
          <input
            className="login-input"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <span className="eye-icon" onClick={() => setShowPassword(p => !p)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="login-row">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
        </div>

        <button className="login-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="login-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}