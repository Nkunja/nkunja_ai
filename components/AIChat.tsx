import { useState } from 'react';
import ChatInput from './ChatInput';
import ChatResponse from './ChatResponse';
import { generateResponse } from '../utils/api';

interface AIChatProps {
  messages: { message: string, isUser: boolean }[];
  onNewMessage: (message: { message: string, isUser: boolean }) => void;
}

const AIChat = ({ messages, onNewMessage }: AIChatProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string) => {
    onNewMessage({ message: input, isUser: true });
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
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Nkunja AI</h1>
      <div className="flex-grow bg-white p-4 rounded-lg shadow-lg overflow-y-auto font-sans">
        {messages.map((response, index) => (
          <ChatResponse key={index} message={response.message} isUser={response.isUser} />
        ))}
      </div>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AIChat;
