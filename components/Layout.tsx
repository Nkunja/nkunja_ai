import React, { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { useChatContext } from '../contexts/ChatContext';

interface LayoutProps {
  children: ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { chats, handleNewChat, handleSelectChat, handleLogout, isAuthenticated } = useChatContext();

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>Nkunja AI</title>
        <meta name="description" content="Nkunja AI by Gemini API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar 
        chats={chats} 
        onSelectChat={handleSelectChat} 
        onNewChat={handleNewChat} 
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
