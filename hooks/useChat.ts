import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Message {
  message: string;
  isUser: boolean;
}

export const useChat = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleSelectChat = useCallback(async (chatId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/messages/${chatId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }

      const messages = await response.json();
      setMessages(messages);
      setActiveChatId(chatId);
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error selecting chat:', error);
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  const handleNewChat = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return null;
    }

    const newChatId = new Date().getTime().toString();
    
    try {
      const response = await fetchWithAuth('/api/chats/create', {
        method: 'POST',
        body: JSON.stringify({
          id: newChatId,
          title: 'New Chat',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create chat');
      }

      const createdChat = await response.json();
      setChats(prevChats => [...prevChats, createdChat]);
      setActiveChatId(newChatId);
      router.push(`/chat/${newChatId}`);
      return newChatId;
    } catch (error) {
      console.error('Error creating chat:', error);
      if (error.message === 'Unauthorized') {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/login');
      }
      return null;
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setChats([]);
    setActiveChatId(null);
    setMessages([]);
    router.push('/login');
  }, [router]);

  const handleNewMessage = useCallback(async (chatId: string, messageData: Message) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetchWithAuth('/api/messages/create', {
        method: 'POST',
        body: JSON.stringify({
          chatId,
          message: messageData.message,
          isUser: messageData.isUser
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create message');
      }

      const newMessage = await response.json();
      setMessages(prevMessages => [...prevMessages, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
      throw error;
    }
  }, [isAuthenticated, router]);

  // Add a useEffect to fetch chats when authenticated
  useEffect(() => {
    const fetchChats = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetchWithAuth('/api/chats');
          if (response.ok) {
            const fetchedChats = await response.json();
            setChats(fetchedChats);
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      }
    };

    fetchChats();
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    chats,
    activeChatId,
    messages,
    handleNewChat,
    handleSelectChat,
    handleNewMessage,
    handleLogout,
  };
};