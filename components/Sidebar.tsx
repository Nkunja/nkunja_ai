import { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const Sidebar = ({ chats = [], onSelectChat, onNewChat }: SidebarProps) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    onSelectChat(chatId);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white p-4 transition-width duration-300`}>
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
      {!isCollapsed && (
        <>
          <button
            onClick={onNewChat}
            className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            <FiPlus className="mr-2" /> New Chat
          </button>
          <div className="flex-grow overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-2 rounded cursor-pointer ${
                  selectedChat === chat.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                {chat.title}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
