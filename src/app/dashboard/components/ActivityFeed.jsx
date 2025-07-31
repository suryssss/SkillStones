'use client'
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaCheckCircle, 
  FaCommentAlt, 
  FaUserPlus,
  FaSpinner,
  FaTasks,
  FaFilter,
  FaSearch,
  FaExclamationCircle
} from 'react-icons/fa';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';

const ActivityItem = ({ activity, index }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'STONE_COMPLETED':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'COMMENT_ADDED':
        return <FaCommentAlt className="w-5 h-5 text-blue-500" />;
      case 'STONE_ASSIGNED':
        return <FaTasks className="w-5 h-5 text-purple-500" />;
      case 'MEMBER_ADDED':
        return <FaUserPlus className="w-5 h-5 text-orange-500" />;
      default:
        return <FaBell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex-shrink-0 relative">
        <Image
          src={activity.user?.imageUrl || 'https://www.gravatar.com/avatar/default?d=mp'}
          alt={activity.user?.name || 'User'}
          width={40}
          height={40}
          className="rounded-full ring-2 ring-white"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm"
        >
          {getIcon()}
        </motion.div>
      </div>
      
      <div className="flex-1 min-w-0">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.1 }}
          className="text-sm text-gray-900"
        >
          <span className="font-medium hover:text-teal-600 transition-colors cursor-pointer">
            {activity.user?.name || 'Unknown User'}
          </span>
          {' '}
          {activity.description}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="text-xs text-gray-500 mt-1"
        >
          {activity.project && (
            <span className="text-teal-600 hover:text-teal-700 transition-colors cursor-pointer">
              {activity.project.title} • 
            </span>
          )}
          {' '}
          {new Date(activity.createdAt).toRelative()}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function ActivityFeed({ projectId }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchActivities = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 Fetching activities...');
      let fetchedActivities = [];

      if (projectId) {
        // If projectId is provided, fetch single project
        console.log('📁 Fetching activities for project:', projectId);
        const response = await fetch(`/api/projects/${projectId}/activities`);
        if (!response.ok) {
          throw new Error('Failed to fetch project activities');
        }
        fetchedActivities = await response.json();
      } else {
        // Otherwise fetch all projects (for dashboard view)
        console.log('📁 Fetching activities for all projects');
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        fetchedActivities = await response.json();
      }

      // Sort activities by creation date (newest first)
      fetchedActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Check if we have new activities
      const hasNewActivities = activities.length === 0 || 
        fetchedActivities.some(newAct => 
          !activities.find(oldAct => oldAct.id === newAct.id)
        );

      if (hasNewActivities) {
        console.log('✨ New activities found');
        setActivities(fetchedActivities);
        setLastUpdate(new Date());

        // Show toast for new activities only if this isn't the initial load
        if (activities.length > 0) {
          toast({
            title: 'New Activities',
            description: 'New activities have been added to the feed.',
          });
        }
      } else {
        console.log('📝 No new activities');
      }
    } catch (error) {
      console.error('❌ Failed to fetch activities:', error);
      setError(error.message || 'Failed to load activities');
      toast({
        title: 'Error',
        description: 'Failed to load activities. Will retry automatically.',
        variant: 'destructive',
      });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [projectId, activities.length]);

  // Initial fetch
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Set up real-time updates
  useEffect(() => {
    // Update every 10 seconds
    const interval = setInterval(() => {
      fetchActivities(false); // Don't show loading state for background updates
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchActivities]);

  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false;
    if (searchTerm && !activity.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Activity Feed</h2>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Last updated: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Activities</option>
            <option value="STONE_COMPLETED">Completions</option>
            <option value="COMMENT_ADDED">Comments</option>
            <option value="STONE_ASSIGNED">Assignments</option>
            <option value="MEMBER_ADDED">Team Updates</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="w-6 h-6 text-teal-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500 gap-2">
            <FaExclamationCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : filteredActivities.length > 0 ? (
          <AnimatePresence>
            {filteredActivities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No activities found
          </div>
        )}
      </div>
    </section>
  );
}

