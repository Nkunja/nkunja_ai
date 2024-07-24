import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Chat {
  id: string;
  title: string;
  messages: { message: string; isUser: boolean }[];
}

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchChats();
      // You might want to fetch user's chats here
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleNewChat = useCallback(async () => {
    const newChatId = new Date().getTime().toString();
    const title = `Chat ${chats.length + 1}`;
    const newChat = {
      id: newChatId,
      title,
      messages: [],
    };
    try {
      const response = await fetchWithAuth('/api/chats/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newChatId, title }),
      });
  
      if (response.ok) {
        const createdChat = await response.json();
        setChats((prevChats) => [...prevChats, { ...newChat, ...createdChat }]);
        setActiveChatId(newChatId);
      } else {
        const errorData = await response.json();
        console.error('Failed to create chat:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }, [chats, fetchWithAuth]);

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const handleNewMessage = useCallback(async (chatId: string, message: { message: string; isUser: boolean }) => {
    try {
      const response = await fetchWithAuth('/api/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, ...message }),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, savedMessage],
                }
              : chat
          )
        );
      } else {
        console.error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    chats,
    activeChatId,
    isAuthenticated,
    handleNewChat,
    handleSelectChat,
    handleNewMessage,
    handleLogout,
  };
};