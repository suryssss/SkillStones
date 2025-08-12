'use client';

import { useUser, useSignUp, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRole } from '../api/clerk';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignUpPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const role = getUserRole(user);
      if (role) router.replace(`/dashboard/${role}`);
      else router.replace('/select-role');
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Step 1: Create signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        username: username,
        phoneNumber: phoneNumber,
        unsafeMetadata: {
          first_name: firstName,
          last_name: lastName,
        },
        captcha: false,
      });

      if (result.status === 'complete') {
        router.push('/select-role');
        return;
      }

      if (result.status === 'missing_requirements') {
        try {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setIsVerifying(true);
          setIsLoading(false);
        } catch (prepErr) {
          console.error('Failed to prepare verification:', prepErr);
          setError('Failed to send verification code');
          setIsLoading(false);
        }
      } else {
        console.log('Unexpected signup status:', result.status);
        setError('Unexpected signup status. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Sign up error:', err);

      // Look for breach error in Clerk error messages
      if (err.errors && err.errors.some(e => e.longMessage?.includes('data breach'))) {
        setError('This password has been found in a data breach. Please choose a different password.');
        // Optionally, add a UI button here "Continue anyway" to allow passwordless signup or override
      } else {
        // Other errors
        setError(err.errors?.[0]?.longMessage || 'Signup failed. Please try again.');
      }
    }
  };






  // Step 2: Verify email
  const handleVerification = async (e) => {
    e.preventDefault();
    if (!signUpLoaded) return;
  
    setError('');
    setIsLoading(true);
  
    if (!verificationCode || verificationCode.trim() === '') {
      setError('Please enter the verification code sent to your email.');
      setIsLoading(false);
      return;
    }
  
    try {
      const verificationResult = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });
  
      if (verificationResult.status === 'complete') {
        if (verificationResult.createdSessionId) {
          await setActive({ session: verificationResult.createdSessionId });
        }
        if (verificationResult.user) {
          await verificationResult.user.update({ firstName, lastName });
        }
        router.push('/select-role');
      } else if (verificationResult.status === 'missing_requirements') {
        // Update required fields and retry signup completion by re-calling create or update (but no signUp.complete)
        await signUp.update({
          username,
          phoneNumber,
          emailAddress: email,
          password,
        });
        // After update, try to resend verification code and ask user to verify again
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setError('Please verify the new code sent to your email.');
        setVerificationCode('');
        setIsLoading(false);
        setIsVerifying(true);
      } else {
        setError(`Verification incomplete. Status: ${verificationResult.status}`);
      }
    } catch (err) {
      let errorMessage = 'Verification failed.';
      if (err?.errors?.length > 0) {
        errorMessage = err.errors[0].longMessage || err.errors[0].message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
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
      console.error('Resend code error:', err);
      setError('Failed to resend verification code');
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{isVerifying ? 'Verify Your Email' : 'Create Account'}</h1>
              <p className="text-gray-600">{isVerifying ? 'Enter the verification code sent to your email' : 'Join SkillStones to start collaborating on projects'}</p>
            </div>

            {error && (
              <motion.div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {isVerifying ? (
              <form onSubmit={handleVerification} className="space-y-6">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                  <input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter verification code" />
                </div>

                <motion.button type="submit" disabled={isLoading || !signUpLoaded} className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${isLoading || !signUpLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`} whileHover={!isLoading && signUpLoaded ? { scale: 1.02 } : {}} whileTap={!isLoading && signUpLoaded ? { scale: 0.98 } : {}}>
                  {isLoading ? (<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>Verifying...</div>) : ('Verify Email')}
                </motion.button>

                <div className="text-center">
                  <button type="button" onClick={handleResendCode} className="text-teal-600 hover:text-teal-700 font-medium">Resend Code</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="First name" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Last name" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your email" />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Choose a username" />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your phone number" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Create a password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Confirm your password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>
                  </div>
                </div>
                <motion.button type="submit" disabled={isLoading || !signUpLoaded} className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${isLoading || !signUpLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`} whileHover={!isLoading && signUpLoaded ? { scale: 1.02 } : {}} whileTap={!isLoading && signUpLoaded ? { scale: 0.98 } : {}}>
                  {isLoading ? (<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>Creating Account...</div>) : ('Create Account')}
                </motion.button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">Already have an account?<a href="/sign-in" className="ml-1 text-teal-600 hover:text-teal-700 font-medium">Sign In</a></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
