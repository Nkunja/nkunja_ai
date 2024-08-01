import { NextPage } from 'next';
import Register from '../../components/Register';

const RegisterPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;