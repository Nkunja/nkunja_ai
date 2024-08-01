import { NextPage } from 'next';
import Register from '../../components/Register';

const RegisterPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Register />
    </div>
  );
};

export default RegisterPage;