import { NextPage } from 'next';
import Login from '../../components/Login';

const LoginPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Login />
    </div>
  );
};

export default LoginPage;