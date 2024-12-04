"use client"
import React, { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat';
import { Chat, Message, NewMessageData } from '../types/chat';

interface ChatContextType {
  isAuthenticated: boolean;
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  handleNewChat: () => Promise<string | null>;
  handleSelectChat: (chatId: string) => Promise<void>;
  handleNewMessage: (chatId: string, messageData: NewMessageData) => Promise<Message>;
  handleLogout: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatState = useChat();

  return (
    <ChatContext.Provider value={chatState as ChatContextType}>
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

export type { ChatContextType, Chat, Message, NewMessageData };