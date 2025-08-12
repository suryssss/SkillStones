'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { USER_ROLES, getUserRole, setUserRole } from '../api/clerk';
import { motion } from 'framer-motion';

export default function SelectRolePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }
    if (user) {
      const role = getUserRole(user);
      if (role) router.replace(`/dashboard/${role}`);
    }
  }, [isLoaded, isSignedIn, user, router]);

  const chooseRole = async (role) => {
    if (!user) return;
    setIsProcessing(true);
    setError('');
    try {
      await setUserRole(role);
      router.replace(`/dashboard/${role}`);
    } catch (err) {
      const msg = err?.message || 'Failed to save role';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <nav className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-2 w-10 h-10 grid place-items-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-teal-600 to-teal-900 bg-clip-text text-transparent tracking-tight">SkillStones</span>
        </a>
        <button onClick={() => signOut().then(() => router.push('/sign-in'))} className="text-gray-600 hover:text-gray-800 text-sm font-medium">Sign Out</button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose your role</h1>
              <p className="text-gray-600">Select how you want to use SkillStones</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => chooseRole(USER_ROLES.OWNER)} disabled={isProcessing} className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-teal-200'} border-gray-200`}>
                <h3 className="font-semibold text-gray-900">Project Owner</h3>
                <p className="text-sm text-gray-600 mt-1">Create and manage projects, invite contributors, and track progress.</p>
              </motion.button>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => chooseRole(USER_ROLES.CONTRIBUTOR)} disabled={isProcessing} className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-teal-200'} border-gray-200`}>
                <h3 className="font-semibold text-gray-900">Project Contributor</h3>
                <p className="text-sm text-gray-600 mt-1">Join projects, contribute your skills, and earn recognition.</p>
              </motion.button>
            </div>

            {isProcessing && (
              <div className="mt-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
                <span className="ml-2 text-sm text-gray-600">Saving your role...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
