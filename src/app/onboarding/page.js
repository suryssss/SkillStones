'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { setUserRole, getUserRole, USER_ROLES } from '../api/clerk';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Redirect if signed in and has a role
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const currentRole = getUserRole(user);
      if (currentRole) {
        router.replace(`/dashboard/${currentRole}`);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleRoleSelection = (role) => {
    localStorage.setItem('pendingRole', role);
    router.push('/login');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      setError('Failed to sign out. Please try again.');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-2 flex items-center justify-center w-10 h-10">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-teal-600 to-teal-900 bg-clip-text text-transparent tracking-tight">
            SkillStones
          </span>
        </a>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign out
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SkillStones!</h1>
            <p className="text-gray-600 mb-8">Please select your role to get started.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection(USER_ROLES.OWNER)}
                disabled={isProcessing}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  selectedRole === USER_ROLES.OWNER
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-200'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <h3 className="font-semibold text-gray-900">Project Owner</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage projects, invite contributors, and track progress.
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection(USER_ROLES.CONTRIBUTOR)}
                disabled={isProcessing}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  selectedRole === USER_ROLES.CONTRIBUTOR
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-200'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <h3 className="font-semibold text-gray-900">Contributor</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Join projects, contribute your skills, and earn recognition.
                </p>
              </motion.button>
            </div>

            {isProcessing && (
              <div className="mt-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
                <span className="ml-2 text-sm text-gray-600">Setting up your account...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 