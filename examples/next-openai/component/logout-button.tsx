'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg border">
      <span className="text-sm text-gray-600">
        Welcome, <strong>{user.username}</strong>
      </span>
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}
