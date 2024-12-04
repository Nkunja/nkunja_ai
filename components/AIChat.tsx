import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChatInput from './ChatInput';
import ChatResponse from './ChatResponse';
import { generateResponse } from '../utils/api';
import { useChatContext } from '../contexts/ChatContext';
import { NewMessageData } from '../types/chat';

const AIChat = () => {
  const { 
    activeChatId, 
    chats, 
    messages, 
    handleNewMessage, 
    handleNewChat, 
    isAuthenticated 
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const router = useRouter();

  const activeChat = chats.find(chat => chat._id === activeChatId);

  const chatCards = [
    { emoji: '🌟', text: 'Tell me a story' },
    { emoji: '🧠', text: 'Explain a complex topic' },
    { emoji: '🎨', text: 'Describe a painting' },
    { emoji: '🍳', text: 'Share a recipe' },
  ];

  const handleSubmit = async (input: string, chatId = activeChatId) => {
    if (!isAuthenticated) {
      setNeedsLogin(true);
      return;
    }

    if (!chatId) {
      console.error('No active chat ID');
      return;
    }

    const messageData: NewMessageData = {
      message: input,
      isUser: true
    };

    try {
      setIsLoading(true);
      await handleNewMessage(chatId, messageData);
      
      const result = await generateResponse(input);
      await handleNewMessage(chatId, {
        message: result,
        isUser: false
      });
    } catch (error) {
      console.error('Error:', error);
      await handleNewMessage(chatId, { 
        message: 'An error occurred. Please try again.',
        isUser: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (prompt: string) => {
    if (!isAuthenticated) {
      setNeedsLogin(true);
      return;
    }

    const newChatId = await handleNewChat();
    if (newChatId !== null) {
      handleNewMessage(newChatId, { message: prompt, isUser: true });
    } else {
      console.error('Failed to create new chat');
    }
  };

  if (needsLogin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="mb-4">Please log in to continue.</p>
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-8 text-white">Start a new chat</h2>
          <div className="grid grid-cols-2 gap-6 max-w-md">
            {chatCards.map((card, index) => (
              <button
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col items-center"
                onClick={() => handleCardClick(card.text)}
              >
                <span className="text-5xl mb-3">{card.emoji}</span>
                <span className="text-gray-800 text-center text-lg">{card.text}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">{activeChat.title}</h1>
      <div className="flex-grow bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto font-sans">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => (
            <ChatResponse key={index} message={message.message} isUser={message.isUser} />
          ))
        ) : (
          <div className="text-center text-gray-500">Start a new conversation</div>
        )}
      </div>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AIChat;