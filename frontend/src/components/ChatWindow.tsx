import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

interface Message { id: number; role: 'user' | 'assistant'; content: string; }

export default function ChatWindow({ conversationId }: { conversationId: number | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    api.get(`/conversations/${conversationId}/messages`)
      .then(r => setMessages(r.data));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !conversationId) return;
    const userMsg = { id: Date.now(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post(`/conversations/${conversationId}/messages`, { content: input });
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Error. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!conversationId) return (
    <div style={styles.empty}>
      <h2 style={{ color: '#fff', marginBottom: 8 }}>AI Chatbot</h2>
      <p style={{ color: '#666' }}>Click "+ New" to start a conversation</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map(m => (
          <div key={m.id} style={m.role === 'user' ? styles.userRow : styles.botRow}>
            <div style={m.role === 'user' ? styles.userBubble : styles.botBubble}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={styles.botRow}>
            <div style={styles.botBubble}>Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputArea}>
        <input style={styles.input} placeholder="Message AI..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()} />
        <button style={styles.sendBtn} onClick={send}>Send</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f0f' },
  empty:     { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', height: '100vh' },
  messages:  { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  userRow:   { display: 'flex', justifyContent: 'flex-end' },
  botRow:    { display: 'flex', justifyContent: 'flex-start' },
  userBubble:{ background: '#7c3aed', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '70%', fontSize: '14px', lineHeight: 1.6 },
  botBubble: { background: '#1a1a1a', color: '#e5e5e5', padding: '10px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '70%', fontSize: '14px', lineHeight: 1.6, border: '1px solid #2a2a2a' },
  inputArea: { padding: '16px 24px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '12px', background: '#0f0f0f' },
  input:     { flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#fff', fontSize: '14px', outline: 'none' },
  sendBtn:   { padding: '12px 24px', borderRadius: '10px', background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 },
};