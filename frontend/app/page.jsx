import Login from '@/app/login/page';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 space-y-4 transition-all ease-in-out duration-300 transform hover:scale-105">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back!</h1>
          <p className="text-lg text-gray-600">Please log in to your account to continue</p>
        </div>

        {/* Login Component */}
        <Login />
      </div>
    </div>
  );
};

export default Home;
