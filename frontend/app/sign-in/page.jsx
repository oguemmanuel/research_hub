'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [signInMethod, setSignInMethod] = useState('email'); // Changed default to 'email'
  const [formData, setFormData] = useState({
    indexNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestBody = {
        password: formData.password
      };

      // Add either indexNumber or email based on the selected sign-in method
      if (signInMethod === 'indexNumber') {
        requestBody.indexNumber = formData.indexNumber;
      } else {
        requestBody.email = formData.email;
      }

      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Important for session-based authentication
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('User signed in successfully, session is stored on the server');
      
      // Redirect to the dashboard after successful sign-in
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSignInMethod = () => {
    setSignInMethod(signInMethod === 'indexNumber' ? 'email' : 'indexNumber');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {signInMethod === 'indexNumber' 
              ? 'Use your index number to sign in' 
              : 'Use your email to sign in'}
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={toggleSignInMethod}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            {signInMethod === 'indexNumber' 
              ? 'Switch to email sign in' 
              : 'Switch to index number sign in'}
          </button>
        </div>
        
        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            {signInMethod === 'indexNumber' ? (
              <div>
                <label htmlFor="indexNumber" className="block text-sm font-medium text-gray-700">Index Number</label>
                <input
                  id="indexNumber"
                  name="indexNumber"
                  type="text"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your index number (e.g., UGR0202110312)"
                  value={formData.indexNumber}
                  onChange={(e) => setFormData({ ...formData, indexNumber: e.target.value })}
                  pattern="^UGR\d{10}$"
                  title="Index number must be UGR followed by 10 digits"
                />
                <p className="mt-1 text-xs text-gray-500">Format: UGR followed by 10 digits</p>
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center flex flex-col gap-4">
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Sign up
          </Link>
          <Link href="/admin" className='text-indigo-600 hover:text-indigo-500'>
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}