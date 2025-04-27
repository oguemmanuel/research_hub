'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    indexNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasIndexNumber, setHasIndexNumber] = useState(false);

  // List of valid index numbers (could be moved to a configuration file)
  const validIndexNumbers = [
    'UGR0202110312', 'UGR0202110315', 'UGR0202110313', 'UGR0202110334',
    'UGR0202110320', 'UGR0202110333', 'UGR0202120027', 'UGR0202120028',
    'UGR0202120031', 'UGR0202110006', 'UGR0402210132', 'UGR0402111248',
    'UGR0402111239', 'UGR0202120017'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation for index number if the user has chosen to provide one
    if (hasIndexNumber && !formData.indexNumber) {
      setError('Index number is required if selected');
      setLoading(false);
      return;
    }

    // Check if the index number is in the valid list (only if user has chosen to provide one)
    if (hasIndexNumber && !validIndexNumbers.includes(formData.indexNumber)) {
      setError('Invalid index number. Please enter an authorized index number.');
      setLoading(false);
      return;
    }

    try {
      // If user doesn't have an index number, remove it from the request
      const requestData = {...formData};
      if (!hasIndexNumber) {
        requestData.indexNumber = ''; // Send empty string to ensure it's not included
      }

      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include',  // Important for session-based authentication
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('User created successfully, session is stored on the server');
      router.push('/sign-in'); // Redirect to the sign-in page after successful signup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {hasIndexNumber 
              ? 'With index number (for project submission privileges)' 
              : 'Without index number (limited to viewing projects)'}
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => setHasIndexNumber(!hasIndexNumber)}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            {hasIndexNumber 
              ? <p className={"bg-blue-600 py-3 px-4 text-white rounded-md cursor-pointer text-2xl"}>Sign up with email</p>
              : <p className={"bg-blue-600 py-3 px-4 text-white rounded-md cursor-pointer text-2xl"}>Sign up with an index number</p>}
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            {hasIndexNumber && (
              <div>
                <label htmlFor="indexNumber" className="block text-sm font-medium text-gray-700">Index Number</label>
                <input
                  id="indexNumber"
                  name="indexNumber"
                  type="text"
                  required={hasIndexNumber}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Index Number (e.g., UGR0202110312)"
                  value={formData.indexNumber}
                  onChange={(e) => setFormData({ ...formData, indexNumber: e.target.value })}
                  pattern="^UGR\d{10}$"
                  title="Index number must be UGR followed by 10 digits"
                />
                <p className="mt-1 text-xs text-gray-500">Format: UGR followed by 10 digits</p>
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
                placeholder="Password"
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
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="text-center flex flex-col gap-4">
          <Link
            href="/sign-in"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </Link>
          <Link href="/admin" className='text-indigo-600 hover:text-indigo-500'>
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}