import { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatResponse from './ChatResponse';
import { generateResponse } from '../utils/api';
import { useChatContext } from '../contexts/ChatContext';

const AIChat = () => {
  const { messages, activeChatId, handleNewMessage, handleNewChat } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (!activeChatId) {
  //     handleNewChat();
  //   }
  // }, [activeChatId, handleNewChat]);

  const handleSubmit = async (input: string) => {
    if (!activeChatId) return;

    setIsLoading(true);
    await handleNewMessage(activeChatId, { message: input, isUser: true });

    try {
      const aiResponse = await generateResponse(input);
      await handleNewMessage(activeChatId, { message: aiResponse, isUser: false });
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatResponse key={index} message={msg.message} isUser={msg.isUser} />
        ))}
      </div>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AIChat;