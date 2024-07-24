import { NextPage } from 'next';
import Layout from '../components/Layout';
import AIChat from '../components/AIChat';
import Sidebar from '../components/Sidebar';
import { useChatContext } from '../contexts/ChatContext';

const Home: NextPage = () => {
  const { chats, activeChatId, handleSelectChat, handleNewChat, handleLogout, handleNewMessage } = useChatContext();
  
  const activeChat = chats.find(chat => chat._id === activeChatId);

  return (
    <Layout>
      <div className="flex h-screen">
        <main className="flex-1 bg-gray-900 p-6">
          {activeChat && (
            <AIChat
              chat={activeChat}
              onNewMessage={(message) => handleNewMessage(activeChat._id, message)}
            />
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Home;