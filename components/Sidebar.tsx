import React, { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiLogOut } from 'react-icons/fi';
import { useChatContext } from '../contexts/ChatContext';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const { 
    chats, 
    activeChatId, 
    handleSelectChat, 
    handleNewChat, 
    handleLogout, 
    isAuthenticated 
  } = useChatContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const handleNewChatClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      await handleNewChat();
    } catch (error) {
      console.error('Error creating new chat:', error);
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    }
  };

  const handleChatSelect = async (chatId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      await handleSelectChat(chatId);
    } catch (error) {
      console.error('Error selecting chat:', error);
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    }
  };

  return (
    <div className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white p-4 transition-width duration-300`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
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