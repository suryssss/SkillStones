'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon,
  ViewColumnsIcon,
  UserGroupIcon,
  ClockIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function DashboardSidebar({ 
  isOpen, 
  toggleSidebar, 
  activeSection = 'dashboard', 
  setActiveSection = () => {} 
}) {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { id: 'kanban', label: 'Kanban Board', icon: ViewColumnsIcon, path: '/dashboard/kanban' },
    { id: 'team', label: 'Team Overview', icon: UserGroupIcon, path: '/dashboard/team' },
    { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon, path: '/dashboard/chat' },
    { id: 'activity', label: 'Activity Feed', icon: ClockIcon, path: '/dashboard/activity' },
  ];

  // Sidebar open if either hovered or isOpen (from click)
  const sidebarOpen = hovered || isOpen;
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-0';

  return (
    <>
      {/* Overlay for mobile and desktop when sidebar is open */}
      <AnimatePresence>
        {(sidebarOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Desktop hover/click sidebar overlays content */}
      <div
        className={`hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 transition-all duration-300 ease-in-out ${sidebarWidth} bg-white border-r shadow-md overflow-hidden`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`flex-1 py-6 px-4 space-y-1 overflow-y-auto h-full ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}> 
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => {
                setActiveSection(item.id);
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    pathname === item.path ? 'text-teal-600' : 'text-gray-500'
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}

          {/* Bottom actions */}
          <div className="pt-6 mt-6 border-t">
            <div className="space-y-1">
              <Link href="/dashboard/settings">
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    pathname === '/dashboard/settings'
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="font-medium">Settings</span>
                </motion.div>
              </Link>
              <Link href="/dashboard/help">
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    pathname === '/dashboard/help'
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="font-medium">Help & Support</span>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:hidden inset-y-0 left-0 w-64 bg-white shadow-lg z-50 
                 flex flex-col h-full"
      >
        {/* Mobile close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => {
                setActiveSection(item.id);
                toggleSidebar();
              }}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    pathname === item.path ? 'text-teal-600' : 'text-gray-500'
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t">
          <div className="space-y-1">
            <Link href="/dashboard/settings">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  pathname === '/dashboard/settings'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">Settings</span>
              </motion.div>
            </Link>
            <Link href="/dashboard/help">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  pathname === '/dashboard/help'
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">Help & Support</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
