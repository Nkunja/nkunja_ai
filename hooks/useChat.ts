import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const router = useRouter();

  const getActiveChat = useCallback(() => {
    return chats.find(chat => chat._id === activeChatId) || null;
  }, [chats, activeChatId]);

  const fetchChats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
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


    const handleSelectChat = useCallback(async (chatId: string) => {
        const selected = chats.find(chat => chat._id === chatId);
        if (selected) {
        setActiveChat(selected);
        try {
            const response = await fetchWithAuth(`/api/messages/${chatId}`);
            if (response.ok) {
            const data = await response.json();
            setMessages(data.messages);
            } else {
            console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
        }
    }, [chats]);



    const handleNewMessage = useCallback(async (chatId: string, messageData: { message: string; isUser: boolean }) => {
        try {
          const response = await fetchWithAuth('/api/messages/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId, ...messageData }),
          });
      
          if (response.ok) {
            const savedMessage: Message = await response.json();
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat._id === chatId
                  ? {
                      ...chat,
                      messages: [...chat.messages, savedMessage],
                    }
                  : chat
              )
            );
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


  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
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
    handleLogout,
  };
};