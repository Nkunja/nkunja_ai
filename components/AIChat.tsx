import { useState } from 'react';
import ChatInput from './ChatInput';
import ChatResponse from './ChatResponse';
import { generateResponse } from '../utils/api';
import { useChatContext } from '../contexts/ChatContext';

const AIChat = () => {
  const { activeChatId, chats, messages, handleNewMessage, handleNewChat } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find(chat => chat._id === activeChatId);

  const chatCards = [
    { emoji: '🌟', text: 'Tell me a story' },
    { emoji: '🧠', text: 'Explain a complex topic' },
    { emoji: '🎨', text: 'Describe a painting' },
    { emoji: '🍳', text: 'Share a recipe' },
  ];

  const handleCardClick = async (prompt: string) => {
    const newChatId = await handleNewChat();
    handleNewMessage(newChatId, { message: prompt, isUser: true });
  };

  // const handleCardClick = async (prompt: string) => {
  //   const newChatId = await handleNewChat();
  //   if (newChatId) {
  //     handleNewMessage(newChatId, { message: prompt, isUser: true });
  //   }
  // };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
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
    );
  }

  const handleSubmit = async (input: string, chatId = activeChatId) => {
    await handleNewMessage(chatId, { message: input, isUser: true });
    setIsLoading(true);

    try {
      const result = await generateResponse(input);
      await handleNewMessage(chatId, { message: result, isUser: false });
    } catch (error) {
      console.error('Error:', error);
      await handleNewMessage(chatId, { message: 'An error occurred. Please try again.', isUser: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">{activeChat.title}</h1>
      <div className="flex-grow bg-white p-4 rounded-lg shadow-lg overflow-y-auto font-sans">
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