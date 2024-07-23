import { useState } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import AIChat from './AIChat';

interface Chat {
  id: string;
  title: string;
  messages: { message: string, isUser: boolean }[];
}

const Layout = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChatId);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleNewMessage = (chatId: string, message: { message: string, isUser: boolean }) => {
    setChats(chats.map(chat => chat.id === chatId ? {
      ...chat,
      messages: [...chat.messages, message],
    } : chat));
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>Nkunja AI</title>
        <meta name="description" content="Nkunja AI by Gemini API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar chats={chats} onSelectChat={handleSelectChat} onNewChat={handleNewChat} />
      <main className="flex-1 flex flex-col">
        {activeChat ? (
          <AIChat messages={activeChat.messages} onNewMessage={(message) => handleNewMessage(activeChat.id, message)} />
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
