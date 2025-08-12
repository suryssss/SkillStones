'use client';

import { useUser, useSignIn, useClerk } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRole } from '../api/clerk';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/select-role';
  const { user, isSignedIn, isLoaded } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const currentRole = getUserRole(user);
      if (currentRole) {
        router.replace(`/dashboard/${currentRole}`);
      } else {
        router.replace('/select-role');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signInLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        const role = getUserRole(user);
        if (role) router.push(`/dashboard/${role}`);
        else router.push('/select-role');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      const clerkMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message;
      setError(clerkMsg || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignedIn) {
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
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div className="bg-white rounded-2xl shadow-xl p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your SkillStones account</p>
            </div>

            {error && (
              <motion.div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your email" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={isLoading || !signInLoaded} className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${isLoading || !signInLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`} whileHover={!isLoading && signInLoaded ? { scale: 1.02 } : {}} whileTap={!isLoading && signInLoaded ? { scale: 0.98 } : {}}>
                {isLoading ? (
                  <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>Signing In...</div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?
                <a href="/sign-up" className="ml-1 text-teal-600 hover:text-teal-700 font-medium">Sign Up</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
