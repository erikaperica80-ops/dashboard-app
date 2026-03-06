import { useEffect, useState } from 'react';
import { getMe } from './app/lib/api';
import { getTenant } from './app/lib/tenant';
import { LoginPage } from './app/pages/LoginPage';
import { DashboardPage } from './app/pages/DashboardPage';

type AuthState = 'unknown' | 'unauthenticated' | 'authenticated';

export default function App() {
  const tenant = getTenant() ?? '';
  // When no tenant present, skip the "unknown" state entirely
  const [authState, setAuthState] = useState<AuthState>(tenant ? 'unknown' : 'unauthenticated');

  // Attempt to restore session on mount (only when tenant is set)
  useEffect(() => {
    if (!tenant) return;
    getMe()
      .then(() => setAuthState('authenticated'))
      .catch(() => setAuthState('unauthenticated'));
  }, [tenant]);

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-sm w-full text-center space-y-3">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Please provide a <code className="font-mono bg-gray-100 px-1 rounded">?tenant=</code>{' '}
            query parameter to continue.
          </p>
          <p className="text-xs text-gray-400">
            Example:{' '}
            <a
              href="?tenant=demo"
              className="text-indigo-600 underline hover:text-indigo-700"
            >
              ?tenant=demo
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (authState === 'unknown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <LoginPage
        tenant={tenant}
        onLogin={() => setAuthState('authenticated')}
      />
    );
  }

  return (
    <DashboardPage
      tenant={tenant}
      onLogout={() => setAuthState('unauthenticated')}
    />
  );
}
