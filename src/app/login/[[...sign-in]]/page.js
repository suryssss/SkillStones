'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { setUserRole, getUserRole } from '../../api/clerk'; // adjust path as needed

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/onboarding';
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const currentRole = getUserRole(user);
      if (!currentRole) {
        const pendingRole = localStorage.getItem('pendingRole');
        if (pendingRole) {
          setUserRole(pendingRole).then(() => {
            localStorage.removeItem('pendingRole');
            // Force a reload to get the updated Clerk user object
            window.location.reload();
          });
        }
      } else {
        window.location.href = `/dashboard/${currentRole}`;
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (isSignedIn) {
    // Optional: Redirect manually instead of showing a blank page
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl; // Use the same redirect URL logic
    }
    return null; // Avoid rendering <SignIn /> when already signed in
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
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <SignIn 
              forceRedirectUrl={redirectUrl}
              signUpUrl="/signup"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 