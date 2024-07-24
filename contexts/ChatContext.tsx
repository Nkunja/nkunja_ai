import React, { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat';

interface Chat {
  id: string;
  title: string;
  messages: { message: string; isUser: boolean }[];
}

interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  isAuthenticated: boolean;
  handleNewChat: () => Promise<void>;
  handleSelectChat: (chatId: string) => void;
  handleNewMessage: (chatId: string, message: { message: string; isUser: boolean }) => void;
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