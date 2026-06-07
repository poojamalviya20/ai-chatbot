import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot password</h2>
        <p style={styles.subtitle}>Enter your email and we'll send a reset link</p>

        {message ? (
          <div style={styles.success}>
            ✅ {message} — Check your inbox!
          </div>
        ) : (
          <>
            {error && <p style={styles.error}>{error}</p>}
            <input style={styles.input} placeholder="Email" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </>
        )}

        <p style={styles.link}><Link to="/login">← Back to login</Link></p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' },
  card:      { background: '#1a1a1a', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #2a2a2a' },
  title:     { color: '#fff', marginBottom: '8px', fontSize: '22px', fontWeight: 500 },
  subtitle:  { color: '#888', marginBottom: '24px', fontSize: '14px' },
  input:     { width: '100%', padding: '12px 14px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  btn:       { width: '100%', padding: '12px', borderRadius: '8px', background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 500 },
  error:     { color: '#f87171', marginBottom: '12px', fontSize: '14px' },
  success:   { background: '#1a2e1a', color: '#4ade80', padding: '14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' },
  link:      { color: '#7c3aed', marginTop: '20px', fontSize: '14px', textAlign: 'center' },
};