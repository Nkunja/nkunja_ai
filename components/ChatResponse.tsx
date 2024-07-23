import { motion } from 'framer-motion';

interface ChatResponseProps {
  message: string;
  isUser: boolean;
}

const ChatResponse = ({ message, isUser }: ChatResponseProps) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg mb-4 max-w-[70%] ${
        isUser ? 'bg-purple-600 text-white ml-auto text-right' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <p className="text-sm">{message}</p>
    </motion.div>
  );
};

export default ChatResponse;
