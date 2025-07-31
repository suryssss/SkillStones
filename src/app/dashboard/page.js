'use client';

import { useUser } from '@clerk/nextjs';
import { setUserRole, getUserRole, USER_ROLES } from '../api/clerk';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const role = getUserRole(user);
      if (role === USER_ROLES.OWNER && !window.location.pathname.startsWith('/dashboard/owner')) {
        router.replace('/dashboard/owner');
      } else if (role === USER_ROLES.CONTRIBUTOR && !window.location.pathname.startsWith('/dashboard/contributor')) {
        router.replace('/dashboard/contributor');
      } else if (!role) {
        router.replace('/onboarding');
      }
      
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );
} 