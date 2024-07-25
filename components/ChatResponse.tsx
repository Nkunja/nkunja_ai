import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';

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
        isUser ? 'bg-purple-600 text-white ml-auto text-right max-w-[35%]' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div className="text-sm">
        <ReactMarkdown
                className="ai-text"
                components={{
                  code({node, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter  
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        {...props as any}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message}
              </ReactMarkdown>
      </div>

    </motion.div>
  );
};

export default ChatResponse;

