import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [messages, setMessages] = useState<Message[]>([]);

  const router = useRouter();

  const getActiveChat = useCallback(() => {
    return chats.find(chat => chat._id === activeChatId) || null;
  }, [chats, activeChatId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchChats();
    }
  }, [status]);

  const fetchChats = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch chats:', errorData);
        setError(`Failed to fetch chats: ${errorData.message}`);
      }
    } catch (error: any) {
      console.error('Error fetching chats:', error);
      setError(`Error fetching chats: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchWithAuth]);

  const handleNewChat = useCallback(async () => {
    if (!isAuthenticated) {
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


  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router, signOut]);

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
    handleLogout,
    error,
  };
};