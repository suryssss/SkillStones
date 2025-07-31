'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ user, isSidebarOpen, setIsSidebarOpen }) {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/dashboard/Projects' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow-lg flex items-center justify-between px-6 border-b border-gray-100">
      {/* Left Section: Logo and Navigation */}
      <div className="flex items-center gap-8">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-2 flex items-center justify-center w-10 h-10">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-teal-600 to-teal-900 bg-clip-text text-transparent tracking-tight">
            SkillStones
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.path
                  ? 'text-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Section: User Menu */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-700 flex items-center justify-center text-white font-semibold text-lg">
          {user?.firstName?.[0] || user?.lastName?.[0] || '?'}
        </div>
        {/* User Info */}
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-semibold text-gray-900 leading-tight">{user?.fullName}</span>
          <span className="text-xs text-gray-500 leading-tight">{user?.primaryEmailAddress?.emailAddress}</span>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-teal-600 bg-gray-100 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-500"></div>
              <span>Logging out...</span>
            </div>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </nav>
  );
} 