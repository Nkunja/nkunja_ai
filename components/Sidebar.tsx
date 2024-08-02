import React, { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiLogOut } from 'react-icons/fi';
import { Chat, useChatContext } from '../contexts/ChatContext';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { chats, activeChatId, handleSelectChat, handleNewChat, handleLogout } = useChatContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNewChatClick = () => {
    if (isAuthenticated) {
      handleNewChat();
    } else {
      router.push('/login');
    }
  };

  const handleChatSelect = (chatId: string) => {
    if (isAuthenticated) {
      handleSelectChat(chatId);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white p-4 transition-width duration-300`}>
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 w-full text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
      {!isCollapsed && (
        <>
          <button
            onClick={handleNewChatClick}
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
                  activeChatId === chat._id ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                {chat.title}
              </div>
            ))}
          </div>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Login
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;