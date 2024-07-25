import { useState } from 'react';
import ChatInput from './ChatInput';
import ChatResponse from './ChatResponse';
import { generateResponse } from '../utils/api';
import { useChatContext } from '../contexts/ChatContext';

const AIChat = () => {
  const { activeChatId, chats, messages, handleNewMessage } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find(chat => chat._id === activeChatId);

  if (!activeChat) {
    return <div className="flex-1 flex items-center justify-center text-white">Select a chat to start messaging</div>;
  }

  const handleSubmit = async (input: string) => {
    await handleNewMessage(activeChatId, { message: input, isUser: true });
    setIsLoading(true);

    try {
      const result = await generateResponse(input);
      await handleNewMessage(activeChatId, { message: result, isUser: false });
    } catch (error) {
      console.error('Error:', error);
      await handleNewMessage(activeChatId, { message: 'An error occurred. Please try again.', isUser: false });
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