import React, { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Chat } from '../contexts/ChatContext';

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onSelectChat, onNewChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex justify-between items-center p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">Chats</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
        </button>
      </div>
      <button
        onClick={onNewChat}
        className="w-full p-2 mb-4 bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
      >
        <FiPlus size={24} />
        {!isCollapsed && <span className="ml-2">New Chat</span>}
      </button>
      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className="p-2 hover:bg-gray-700 cursor-pointer truncate"
          >
            {isCollapsed ? chat.title.charAt(0) : chat.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;