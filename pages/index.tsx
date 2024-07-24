import { NextPage } from 'next';
import { useState } from 'react';
import Layout from '../components/Layout';
import AIChat from '../components/AIChat';


const Home: NextPage = () => {
  const [messages, setMessages] = useState<{ message: string; isUser: boolean }[]>([]);

  const handleNewMessage = (message: { message: string; isUser: boolean }) => {
    setMessages((prevMessages: any) => [...prevMessages, message]);
  };
  return (
    <Layout>
      <AIChat messages={messages} onNewMessage={handleNewMessage} />
    </Layout>
  );
};

export default Home;

