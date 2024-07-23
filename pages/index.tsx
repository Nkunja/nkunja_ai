import { NextPage } from 'next';
import Layout from '../components/Layout';
import AIChat from '../components/AIChat';


const Home: NextPage = () => {
  return (
    <Layout>
      <AIChat />
    </Layout>
  );
};

export default Home;