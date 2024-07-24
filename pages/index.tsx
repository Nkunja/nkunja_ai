import { NextPage } from 'next';
import Layout from '../components/Layout';
import AIChat from '../components/AIChat';


const Home: NextPage = () => {
  return (
    <Layout>
      <AIChat messages={[]} onNewMessage={function (message: { message: string; isUser: boolean; }): void {
        throw new Error('Function not implemented.');
      } } />
    </Layout>
  );
};

export default Home;