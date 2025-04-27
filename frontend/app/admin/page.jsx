'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call authentication endpoint with email and password only
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for session cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Check if user is an admin
      const userResponse = await fetch('http://localhost:5000/api/auth/user-info', {
        credentials: 'include'
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to verify admin status');
      }
      
      const userData = await userResponse.json();
      
      // Check if user has admin role
      if (userData.data.user.role !== 'admin') {
        // Sign out the user since they're not an admin
        await fetch('http://localhost:5000/api/auth/signout', {
          method: 'POST',
          credentials: 'include'
        });
        
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Admin authentication successful
      router.push('/admin-dashboard');
      
    } catch (error) {
      setError(error.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex justify-center items-center min-h-screen py-8 px-4'>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className='text-2xl font-semibold text-center mb-6'>Admin Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={8}
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md w-full transition duration-300'
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Login as Admin'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            Return to home page
          </Link>
        </div>
      </div>
    </main>
  );
}