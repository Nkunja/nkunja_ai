import React, { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat';

interface Chat {
  _id: string;  
  title: string;
  messages: { message: string; isUser: boolean }[];
}

interface Message {
  _id: string;
  message: string;
  isUser: boolean;
}

interface ChatContextType {
  chats: Chat[];
  messages: Message[];  
  activeChatId: string | null;
  isAuthenticated: boolean;
  fetchChats: () => Promise<void>;  
  handleNewChat: () => Promise<void>;
  handleSelectChat: (chatId: string) => Promise<void>;  
  getActiveChat: () => Chat | null;  
  handleNewMessage: (chatId: string, messageData: { message: string; isUser: boolean }) => Promise<void>;  
  handleLogout: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatState = useChat();

  return <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};