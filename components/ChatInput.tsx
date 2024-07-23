import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full bg-gray-900 p-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <FiSend />
      </button>
    </form>
  );
};

export default ChatInput;
