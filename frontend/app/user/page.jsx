"use client";

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      fetchUserInfo(token);
    } else {
      setError('No token found');
    }
  }, []);

  const fetchUserInfo = async (token) => {
    setLoading(true);
    try {
      // Make an API call to fetch the user info
      const response = await fetch('http://localhost:5000/api/user-info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data); // Set the user info to state
      } else {
        setError('Failed to fetch user info');
      }
    } catch (error) {
      setError('Error fetching user info');
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar and other components... */}

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto gap-4">
            <div className="flex items-center gap-4">
              {/* Display user info */}
              {loading ? (
                <span>Loading user info...</span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                userInfo && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-800" />
                    <span>{userInfo.name}</span>
                    <span>{userInfo.email}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Content... */}
          <h1>User</h1>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
