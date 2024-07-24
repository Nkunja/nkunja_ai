import Head from 'next/head';
import Sidebar from './Sidebar';
import AIChat from './AIChat';
import { useChatContext } from '../contexts/ChatContext';

const Layout = () => {
  const { chats, activeChatId, isAuthenticated, handleNewChat, handleSelectChat, handleNewMessage, handleLogout } = useChatContext();

  if (!isAuthenticated) {
    return null;
  }

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>Nkunja AI</title>
        <meta name="description" content="Nkunja AI by Gemini API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar chats={chats} onSelectChat={handleSelectChat} onNewChat={handleNewChat} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col">
        {activeChat ? (
          <AIChat
            messages={activeChat.messages}
            onNewMessage={(message) => handleNewMessage(activeChat.id, message)}
          />
        ) : (
          <div className="flex items-center justify-center flex-1 text-white">
            <p>Select a chat or start a new one</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
