import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { checkAuthStatus } from '../lib/functions';

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
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const router = useRouter();

  const getActiveChat = useCallback(() => {
    return chats.find(chat => chat._id === activeChatId) || null;
  }, [chats, activeChatId]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/status', { 
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log('Auth status response:', data);

      setIsAuthenticated(data.isAuthenticated);
      if (!data.isAuthenticated && router.pathname !== '/login') {
        router.push('/login');
      }
      return data.isAuthenticated;
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      if (router.pathname !== '/login') {
        router.push('/login');
      }
      return false;
    }
  }, [router]);

  const fetchChats = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else {
        setError('Failed to fetch chats');
      }
    } catch (error) {
      setError('Error fetching chats');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [fetchChats, isAuthenticated]);

  const handleNewChat = useCallback(async () => {
    const authStatus = await checkAuth();
    if (!authStatus) {
      console.error('User is not authenticated');
      router.push('/login');
      return null;
    }

    const newChatId = new Date().getTime().toString();
    const newChat = {
      _id: newChatId,
      title: "New Chat",
      messages: [],
    };
  
    try {
      const response = await fetchWithAuth('/api/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: newChatId, title: "New Chat" }),
      });
  
      if (response.ok) {
        const createdChat = await response.json();
        setChats((prevChats) => [...prevChats, { ...newChat, ...createdChat }]);
        setActiveChatId(newChatId);
        router.push(`/chat/${newChatId}`);
        return newChatId;
      } else {
        const errorData = await response.json();
        console.error('Failed to create chat:', errorData.message);
        return null;
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }, [isAuthenticated, router, fetchWithAuth]);


  const handleNewMessage = useCallback(async (chatId: string, messageData: { message: string; isUser: boolean }) => {
    try {
      const response = await fetchWithAuth('/api/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, ...messageData }),
      });
  
      if (response.ok) {
        const savedMessage: Message = await response.json();
        
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat._id === chatId) {
              const updatedMessages = Array.isArray(chat.messages) 
                ? [...chat.messages, savedMessage]
                : [savedMessage];
              
              // Update chat title if this is the first user message
              const newTitle = updatedMessages.length === 1 && messageData.isUser
                ? messageData.message.slice(0, 50) + (messageData.message.length > 50 ? '...' : '')
                : chat.title;
              
              return {
                ...chat,
                title: newTitle,
                messages: updatedMessages,
              };
            }
            return chat;
          });
  
          // Find the updated chat after the state update
          const updatedChat = updatedChats.find(c => c._id === chatId);
  
          // Update chat title on the server if this is the first user message
          if (messageData.isUser && updatedChat && updatedChat.messages.length === 1) {
            fetchWithAuth(`/api/chats/${chatId}/update-title`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: messageData.message.slice(0, 50) }),
            }).catch(error => console.error('Failed to update chat title:', error));
          }
  
          return updatedChats;
        });
  
        if (chatId === activeChatId) {
          setMessages((prevMessages) => [...prevMessages, savedMessage]);
        }
      } else {
        console.error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [fetchWithAuth, activeChatId]);
  

  const handleSelectChat = useCallback(async (chatId: string) => {
    setActiveChatId(chatId);
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);


  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        console.log('Login successful');
        localStorage.setItem('token', data.token);
        await checkAuth();
        router.push('/chat');
      } else {
        console.error('Login failed:', data.message);
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  }, [router, checkAuth]);

  const handleLogout = useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        router.push('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }, [router]);

  return {
    chats,
    messages,
    activeChatId,
    isAuthenticated,
    fetchChats,
    handleNewChat,
    handleSelectChat,
    getActiveChat,
    handleNewMessage,
    handleLogin,
    handleLogout,
    error,
    checkAuth,
  };
};