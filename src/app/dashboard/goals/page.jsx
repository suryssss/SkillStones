'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

const goals = [
  {
    id: 1,
    title: 'Master React Hooks',
    description: 'Complete advanced React Hooks course and build 3 projects',
    progress: 75,
    deadline: '2024-04-15',
    status: 'active',
  },
  {
    id: 2,
    title: 'Learn TypeScript',
    description: 'Complete TypeScript fundamentals and advanced concepts',
    progress: 45,
    deadline: '2024-05-01',
    status: 'active',
  },
  {
    id: 3,
    title: 'Build Portfolio Website',
    description: 'Create a modern portfolio website using Next.js',
    progress: 90,
    deadline: '2024-03-30',
    status: 'active',
  },
];

export default function Goals() {
  const [activeTab, setActiveTab] = useState('active');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Navbar */}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
              <p className="text-gray-600 mt-2">Track and manage your learning goals</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Goal</span>
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['active', 'completed', 'archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                  <span className="text-sm text-gray-500">Due: {goal.deadline}</span>
                </div>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}