import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Conversation { id: number; title: string; }

interface Props {
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Sidebar({ activeId, onSelect, onNew, onDelete }: Props) {
  const { user, logout } = useAuth();
  const [conversations, setConversations]   = useState<Conversation[]>([]);
  const [hoveredId, setHoveredId]           = useState<number | null>(null);
  const [confirmId, setConfirmId]           = useState<number | null>(null);
  const [deleting, setDeleting]             = useState<number | null>(null);

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

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();      // chat select na ho
    setConfirmId(id);         // confirmation modal open
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(confirmId);
    try {
      await api.delete(`/conversations/${confirmId}`);
      setConversations(prev => prev.filter(c => c.id !== confirmId));
      onDelete(confirmId);    // parent ko batao
    } catch (err) {
      console.error('Delete failed');
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.top}>
        <span style={styles.logo}>AI Chat</span>
        <button style={styles.newBtn} onClick={createNew}>+ New</button>
      </div>

      <div style={styles.list}>
        {conversations.map(c => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              ...styles.item,
              ...(activeId === c.id ? styles.activeItem : {}),
              ...(hoveredId === c.id && activeId !== c.id ? styles.hoveredItem : {}),
            }}
          >
            <span style={styles.itemIcon}>💬</span>
            <span style={styles.itemText}>{c.title || 'New Chat'}</span>

            {/* Cross icon — hover pe dikhega */}
            {hoveredId === c.id && (
              <span
                onClick={(e) => handleDeleteClick(e, c.id)}
                style={styles.deleteIcon}
                title="Delete chat"
              >
                ✕
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmId && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete chat?</h3>
            <p style={styles.modalText}>
              This conversation will be permanently deleted.
            </p>
            <div style={styles.modalBtns}>
              <button
                style={styles.cancelBtn}
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmBtn}
                onClick={confirmDelete}
                disabled={!!deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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
  sidebar:     { width: '260px', height: '100vh', background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0 },
  top:         { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' },
  logo:        { color: '#fff', fontWeight: 600, fontSize: '16px' },
  newBtn:      { background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' },
  list:        { flex: 1, overflowY: 'auto', padding: '8px', scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' },
  item:        { padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: '#ccc', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s' },
  hoveredItem: { background: '#1a1a2e' },
  activeItem:  { background: '#1e1e2e', color: '#fff' },
  itemIcon:    { fontSize: '14px', flexShrink: 0 },
  itemText:    { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
  deleteIcon:  { flexShrink: 0, color: '#666', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto', transition: 'color 0.15s' },

  // Modal
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal:       { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '28px', width: '300px' },
  modalTitle:  { color: '#fff', fontSize: '16px', fontWeight: 500, marginBottom: '10px' },
  modalText:   { color: '#888', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 },
  modalBtns:   { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  cancelBtn:   { padding: '8px 18px', borderRadius: '8px', background: 'transparent', color: '#ccc', border: '1px solid #333', cursor: 'pointer', fontSize: '14px' },
  confirmBtn:  { padding: '8px 18px', borderRadius: '8px', background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 },

  bottom:      { padding: '16px', borderTop: '1px solid #222' },
  userInfo:    { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  avatar:      { width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' },
  userName:    { color: '#ccc', fontSize: '14px' },
  logoutBtn:   { width: '100%', padding: '8px', borderRadius: '6px', background: 'transparent', color: '#888', border: '1px solid #333', cursor: 'pointer', fontSize: '13px' },
};