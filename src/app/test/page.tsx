'use client';
import { useState, useEffect } from 'react';

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<{
    status: string;
    message: string;
    database?: string;
    host?: string;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error: any) {
      setConnectionStatus({
        status: 'error',
        message: 'Failed to test connection',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">MongoDB Connection Test</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg mb-6 transition-all disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        {connectionStatus && (
          <div className={`p-4 rounded-lg ${
            connectionStatus.status === 'success' 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <h2 className={`text-xl font-semibold mb-2 ${
              connectionStatus.status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {connectionStatus.status === 'success' ? 'Connection Successful!' : 'Connection Failed'}
            </h2>
            <p className="text-white/90 mb-2">{connectionStatus.message}</p>
            
            {connectionStatus.database && (
              <p className="text-white/80 text-sm">Database: {connectionStatus.database}</p>
            )}
            
            {connectionStatus.host && (
              <p className="text-white/80 text-sm">Host: {connectionStatus.host}</p>
            )}
            
            {connectionStatus.error && (
              <div className="mt-2 p-2 bg-red-900/30 rounded text-red-300 text-sm">
                Error: {connectionStatus.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 