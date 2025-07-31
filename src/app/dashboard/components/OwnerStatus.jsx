import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaGem, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/nextjs';

export default function OwnerStats() {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalStones: 0,
    completedStones: 0,
    activeContributors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setError(null);
      
      // Check if user is authenticated
      if (!isLoaded) {
        console.log('🔄 Auth is still loading...');
        return;
      }

      if (!isSignedIn) {
        console.error('❌ User is not signed in');
        throw new Error('Authentication required');
      }

      // Add debug logging here
      console.log('🔍 Debug Auth State:', {
        isLoaded,
        isSignedIn,
        hasUserId: !!userId,
        userId
      });

      // Get the authentication token
      const token = await getToken();
      console.log('🔑 Token obtained:', !!token);
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('📡 Fetching stats from API...');
      try {
        const response = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        console.log('📥 API Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error Response Text:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
          } catch (parseError) {
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
          }
        }
        
        const data = await response.json();
        console.log('📊 Fetched stats:', data);
        
        if (!data || typeof data !== 'object') {
          console.error('❌ Invalid response format:', data);
          throw new Error('Invalid response format');
        }

        setStats(data);
        console.log('✅ Stats updated successfully');
      } catch (error) {
        console.error('❌ Error fetching stats:', {
          message: error.message,
          stack: error.stack,
          cause: error.cause
        });
        setError(error.message);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch statistics. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch statistics. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    console.log('🚀 Mounting OwnerStats component');
    let isMounted = true;

    const initFetch = async () => {
      try {
        if (isMounted && isLoaded) {
          console.log('📡 Initial fetch starting...');
          await fetchStats();
          console.log('✅ Initial fetch completed');
        }
      } catch (error) {
        console.error('❌ Initial fetch failed:', error);
      }
    };

    if (isLoaded) {
      initFetch();
    }

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (isMounted && isLoaded) {
        console.log('⏰ Fetching updated stats');
        fetchStats();
      }
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      console.log('🧹 Cleaning up OwnerStats component');
      isMounted = false;
      clearInterval(interval);
    };
  }, [isLoaded]);

  // If auth is not loaded yet, show loading state
  if (!isLoaded) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  // If user is not signed in, show auth error
  if (!isSignedIn) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">Please sign in to view statistics.</p>
      </div>
    );
  }

  const completionRate = Math.round((stats.completedStones / (stats.totalStones || 1)) * 100);

  const statCards = [
    { icon: FaProjectDiagram, label: 'Active Projects', value: stats.totalProjects, color: 'from-blue-500 to-blue-600' },
    { icon: FaGem, label: 'Stones Created', value: stats.totalStones, color: 'from-purple-500 to-purple-600' },
    { icon: FaCheckCircle, label: 'Stones Completed', value: stats.completedStones, color: 'from-green-500 to-green-600' },
    { icon: FaUsers, label: 'Active Contributors', value: stats.activeContributors, color: 'from-amber-500 to-amber-600' },
  ];

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">Failed to load statistics: {error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${isLoading ? 'opacity-50' : ''}`}
          >
            <div className={`h-2 bg-gradient-to-r ${card.color}`} />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <card.icon className={`w-8 h-8 bg-gradient-to-r ${card.color} text-white p-1.5 rounded-lg`} />
                <motion.span 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {card.value}
                </motion.span>
              </div>
              <p className="mt-4 text-gray-600 font-medium">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className={`bg-white rounded-2xl shadow-lg p-6 ${isLoading ? 'opacity-50' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Completion Rate</h3>
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span className="font-semibold">{completionRate}%</span>
        </div>
      </motion.div>
    </section>
  );
}
