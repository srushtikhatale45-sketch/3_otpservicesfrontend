import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'sms':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.032 2.002c-5.514 0-9.986 4.472-9.986 9.986 0 1.744.449 3.46 1.296 4.966L2 22l5.285-1.425c1.44.789 3.094 1.227 4.747 1.227 5.514 0 9.986-4.472 9.986-9.986 0-5.513-4.472-9.985-9.986-9.985z"/>
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">Your account is verified via {user?.preferredChannel?.toUpperCase()}</p>
            </div>
            <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="text-lg font-medium text-gray-800">{user?.name}</p>
              </div>
              {user?.email && (
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-lg font-medium text-gray-800">{user?.email}</p>
                </div>
              )}
              {user?.mobileNumber && (
                <div>
                  <label className="text-sm text-gray-500">Mobile Number</label>
                  <p className="text-lg font-medium text-gray-800">{user?.mobileNumber}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Verification Status</label>
                <p className="text-lg font-medium text-green-600">✓ Verified</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Preferred Channel</label>
                <div className="flex items-center gap-1">
                  {getChannelIcon(user?.preferredChannel)}
                  <p className="text-lg font-medium text-gray-800">{user?.preferredChannel?.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">Your session is secured with JWT tokens stored in HTTP-only cookies.</p>
              <p className="text-xs text-blue-600">Access tokens expire in 15 minutes, refresh tokens in 7 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;