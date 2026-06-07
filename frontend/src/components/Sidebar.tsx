import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Conversation { id: number; title: string; }

interface Props {
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: (id: number) => void;
}

export default function Sidebar({ activeId, onSelect, onNew }: Props) {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    const { data } = await api.get('/conversations');
    setConversations(data);
  };

  useEffect(() => { fetchConversations(); }, [activeId]);

  const createNew = async () => {
    const { data } = await api.post('/conversations');
    setConversations(prev => [data, ...prev]);
    onNew(data.id);
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.top}>
        <span style={styles.logo}>AI Chat</span>
        <button style={styles.newBtn} onClick={createNew}>+ New</button>
      </div>

      <div style={styles.list}>
        {conversations.map(c => (
          <div key={c.id} onClick={() => onSelect(c.id)}
            style={{ ...styles.item, ...(activeId === c.id ? styles.activeItem : {}) }}>
            <span style={styles.itemIcon}>💬</span>
            <span style={styles.itemText}>{c.title || 'New Chat'}</span>
          </div>
        ))}
      </div>

      <div style={styles.bottom}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <span style={styles.userName}>{user?.name}</span>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar:   { width: '260px', minHeight: '100vh', background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' },
  top:       { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' },
  logo:      { color: '#fff', fontWeight: 600, fontSize: '16px' },
  newBtn:    { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' },
  list:      { flex: 1, overflowY: 'auto', padding: '8px' },
  item:      { padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: '#ccc', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' },
  activeItem:{ background: '#1e1e2e', color: '#fff' },
  itemIcon:  { fontSize: '14px' },
  itemText:  { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bottom:    { padding: '16px', borderTop: '1px solid #222' },
  userInfo:  { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  avatar:    { width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' },
  userName:  { color: '#ccc', fontSize: '14px' },
  logoutBtn: { width: '100%', padding: '8px', borderRadius: '6px', background: 'transparent', color: '#888', border: '1px solid #333', cursor: 'pointer', fontSize: '13px' },
};