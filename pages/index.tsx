import { NextPage } from 'next';
import Layout from '../components/Layout';
import AIChat from '../components/AIChat';
import Sidebar from '../components/Sidebar';
import { ChatProvider } from '../contexts/ChatContext';

const Home: NextPage = () => {
  return (
      <Layout>
        <div className="flex h-screen">
          <main className="flex-1 bg-gray-900 p-6">
            <AIChat />
          </main>
        </div>
      </Layout>
  );
};

export default Home;