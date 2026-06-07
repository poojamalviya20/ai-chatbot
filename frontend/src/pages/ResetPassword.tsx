import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');
  const navigate                = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirm) return setError('Please fill all fields');
    if (password !== confirm)  return setError('Passwords do not match');
    if (password.length < 6)   return setError('Min 6 characters required');
    if (!token)                return setError('Invalid reset link');

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset password</h2>

        {success ? (
          <div style={styles.success}>
            ✅ Password reset! Redirecting to login...
          </div>
        ) : (
          <>
            {error && <p style={styles.error}>{error}</p>}

            {/* New password */}
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                placeholder="New password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span style={styles.eye} onClick={() => setShowPassword(p => !p)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            {/* Confirm password */}
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                placeholder="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <span style={styles.eye} onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? '🙈' : '👁️'}
              </span>
            </div>

            <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </>
        )}

        <p style={styles.link}><Link to="/login">← Back to login</Link></p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' },
  card:         { background: '#1a1a1a', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #2a2a2a' },
  title:        { color: '#fff', marginBottom: '24px', fontSize: '22px', fontWeight: 500 },
  inputWrapper: { position: 'relative', width: '100%', marginBottom: '14px' },
  input:        { width: '100%', padding: '12px 42px 12px 14px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  eye:          { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', userSelect: 'none', color: '#888' },
  btn:          { width: '100%', padding: '12px', borderRadius: '8px', background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 500 },
  error:        { color: '#f87171', marginBottom: '12px', fontSize: '14px' },
  success:      { background: '#1a2e1a', color: '#4ade80', padding: '14px', borderRadius: '8px', fontSize: '14px' },
  link:         { color: '#7c3aed', marginTop: '20px', fontSize: '14px', textAlign: 'center' },
};