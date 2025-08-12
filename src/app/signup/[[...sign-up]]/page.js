'use client';

import { useUser, useSignUp, useClerk } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRole } from '../../api/clerk';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/role-selection';
  const { user, isSignedIn, isLoaded } = useUser();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const currentRole = getUserRole(user);
      if (currentRole) {
        // User already has a role, redirect to their dashboard
        window.location.href = `/dashboard/${currentRole}`;
      } else {
        // User doesn't have a role yet, redirect to role selection
        window.location.href = '/role-selection';
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create the sign up with required credentials only
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === 'complete') {
        // Sign up successful, activate session then redirect
        await setActive({ session: result.createdSessionId });
        router.push('/role-selection');
      } else if (result.status === 'missing_requirements') {
        // Attach additional user attributes to the pending sign-up
        await signUp.update({ firstName, lastName });
        // Email verification required - prepare email code challenge
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setIsVerifying(true);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      const clerkMsg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message;
      setError(clerkMsg || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        // Verification successful, activate session then redirect
        await setActive({ session: result.createdSessionId });
        router.push('/role-selection');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUpLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setError('Verification code sent to your email');
    } catch (err) {
      setError('Failed to resend verification code');
    }
  };

  if (isSignedIn) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
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
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isVerifying ? 'Verify Your Email' : 'Create Account'}
              </h1>
              <p className="text-gray-600">
                {isVerifying 
                  ? 'Enter the verification code sent to your email' 
                  : 'Join SkillStones to start collaborating on projects'
                }
              </p>
            </div>

            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {isVerifying ? (
              <form onSubmit={handleVerification} className="space-y-6">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Enter verification code"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || !signUpLoaded}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    isLoading || !signUpLoaded
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                  whileHover={!isLoading && signUpLoaded ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && signUpLoaded ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Email'
                  )}
                </motion.button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Clerk CAPTCHA placeholder for Smart CAPTCHA */}
                <div id="clerk-captcha" className="mt-2" />

                <motion.button
                  type="submit"
                  disabled={isLoading || !signUpLoaded}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    isLoading || !signUpLoaded
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                  whileHover={!isLoading && signUpLoaded ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && signUpLoaded ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?
                <a href="/login" className="ml-1 text-teal-600 hover:text-teal-700 font-medium">
                  Sign In
                </a>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to SkillStones' Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 