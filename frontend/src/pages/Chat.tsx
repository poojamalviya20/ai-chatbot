import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activeId={activeId} onSelect={setActiveId} onNew={setActiveId} />
      <ChatWindow conversationId={activeId} />
    </div>
  );
}