'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import OwnerStats from '../components/OwnerStatus';
import ProjectList from '../components/ProjectList';
import StoneManager from '../components/StoneManager';
import ActivityFeed from '../components/ActivityFeed';

import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerDashboard() {
  const { user, isLoaded } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };
  const card = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
    whileHover: { scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
    whileTap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          role="owner"
        />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <motion.div
            className="max-w-7xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Owner Stats */}
            <motion.div variants={card} className="mb-8">
              <OwnerStats />
            </motion.div>

            {/* Project List and Stone Manager */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div variants={card} whileHover="whileHover" whileTap="whileTap" className="bg-white rounded-lg shadow">
                <div className="h-[600px] flex flex-col">
                  <div className="flex-none p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ProjectList />
                  </div>
                </div>
              </motion.div>
              <motion.div variants={card} whileHover="whileHover" whileTap="whileTap" className="bg-white rounded-lg shadow">
                <div className="h-[600px] flex flex-col">
                  <div className="flex-none p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Stones</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <StoneManager />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Activity Feed */}
            <motion.div variants={card} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Feed</h2>
              <ActivityFeed />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 