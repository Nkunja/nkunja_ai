"use client"
import React, { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat';

export interface Message {
  message: string;
  isUser: boolean;
}

export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
}

interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  isAuthenticated: boolean;
  handleNewChat: () => Promise<string | null>;
  handleSelectChat: (chatId: string) => Promise<void>;
  handleNewMessage: (chatId: string, messageData: { message: string; isUser: boolean }) => Promise<any>;
  handleLogout: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatState = useChat();

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};