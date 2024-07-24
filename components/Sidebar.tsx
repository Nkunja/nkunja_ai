import { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiLogOut } from 'react-icons/fi';
import { useChat } from '../hooks/useChat';


interface Chat {
  _id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
}

const Sidebar = ({ chats = [], onSelectChat, onNewChat, onLogout }: SidebarProps) => {
  console.log('Sidebar chats:', chats);  
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
                key={chat._id}
                onClick={() => handleChatSelect(chat._id)}
                className={`p-2 rounded cursor-pointer ${
                  selectedChat === chat._id ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                {chat.title}
              </div>
            ))}
          </div>

            <button
                onClick={onLogout}
                className="flex items-center justify-center w-full  bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                <FiLogOut className="mr-2" /> Logout
            </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;




