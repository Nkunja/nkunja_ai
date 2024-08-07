import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

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

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetchWithAuth('/api/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else {
        console.error('Failed to fetch chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleNewChat = useCallback(async () => {
    try {
      const response = await fetchWithAuth('/api/chats/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prevChats => [...prevChats, newChat]);
        setActiveChatId(newChat._id);
        return newChat._id;
      } else {
        console.error('Failed to create new chat');
        return null;
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      return null;
    }
  }, []);

  const handleSelectChat = useCallback(async (chatId: string) => {
    setActiveChatId(chatId);
    try {
      const response = await fetchWithAuth(`/api/messages/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        console.error('Failed to fetch messages');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  }, []);

  const getActiveChat = useCallback(() => {
    return chats.find(chat => chat._id === activeChatId) || null;
  }, [chats, activeChatId]);

  const handleNewMessage = useCallback(async (chatId: string, messageData: { message: string; isUser: boolean }) => {
    try {
      const response = await fetchWithAuth('/api/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, ...messageData }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } else {
        console.error('Failed to create new message');
      }
    } catch (error) {
      console.error('Error creating new message:', error);
    }
  }, []);

  return {
    chats,
    messages,
    activeChatId,
    fetchChats,
    handleNewChat,
    handleSelectChat,
    getActiveChat,
    handleNewMessage,
    error,
  };
};