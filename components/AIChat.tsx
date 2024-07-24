import { useState } from 'react';
import ChatInput from './ChatInput';
import ChatResponse from './ChatResponse';
import { generateResponse } from '../utils/api';

interface AIChatProps {
  chat: {
    _id: string;
    title: string;
    messages: { message: string; isUser: boolean }[];
  };
  onNewMessage: (message: { message: string; isUser: boolean }) => void;
}

const AIChat = ({ chat, onNewMessage }: AIChatProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string) => {
    await onNewMessage({ message: input, isUser: true });
    setIsLoading(true);
    try {
      const result = await generateResponse(input);
      onNewMessage({ message: result, isUser: false });
    } catch (error) {
      console.error('Error:', error);
      onNewMessage({ message: 'An error occurred. Please try again.', isUser: false });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">{chat.title}</h1>
      <div className="flex-grow bg-white p-4 rounded-lg shadow-lg overflow-y-auto font-sans">
        {chat.messages.map((message, index) => (
          <ChatResponse key={index} message={message.message} isUser={message.isUser} />
        ))}
      </div>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AIChat;