import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleDelete = (deletedId: number) => {
    // Agar active chat delete hui to clear karo
    if (activeId === deletedId) setActiveId(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        activeId={activeId}
        onSelect={setActiveId}
        onNew={setActiveId}
        onDelete={handleDelete}
      />
      <ChatWindow conversationId={activeId} />
    </div>
  );
}