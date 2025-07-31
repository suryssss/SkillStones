'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import ContributorStats from '../components/ContributorStats';
import AssignedProjects from '../components/AssignedProjects';
import MyStones from '../components/MyStones';
import ActivityFeed from '../components/ActivityFeed';
import { motion } from 'framer-motion';

export default function ContributorDashboard() {
  const { user, isLoaded } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

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
          role="contributor"
        />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <motion.div
            className="max-w-7xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Contributor Stats */}
            <motion.div variants={card} className="mb-8">
              <ContributorStats />
            </motion.div>

            {/* Assigned Projects and My Stones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div variants={card} whileHover="whileHover" whileTap="whileTap" className="bg-white rounded-lg shadow">
                <AssignedProjects />
              </motion.div>
              <motion.div variants={card} whileHover="whileHover" whileTap="whileTap" className="bg-white rounded-lg shadow">
                <MyStones />
              </motion.div>
            </div>

            {/* Activity Feed */}
            <motion.div variants={card} className="bg-white rounded-lg shadow">
              <ActivityFeed />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 