import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaClock, FaTag, FaUser } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const initialStones = [
  { id: 1, project: 'Website Redesign', title: 'Design Hero Section', description: 'Create a modern hero section.', assignee: 'Alice', tags: ['UI'], deadline: '2024-06-10', status: 'To Do' },
  { id: 2, project: 'Mobile App', title: 'API Integration', description: 'Integrate REST API.', assignee: 'Bob', tags: ['Backend'], deadline: '2024-06-15', status: 'In Progress' },
];

const StoneModal = ({ show, onClose, stone, onSave }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {stone.id ? 'Edit Stone' : 'New Stone'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={e => {
            e.preventDefault();
            onSave(stone);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <input
                  type="text"
                  value={stone.project}
                  onChange={e => onSave({ ...stone, project: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={stone.title}
                  onChange={e => onSave({ ...stone, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={stone.description}
                  onChange={e => onSave({ ...stone, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={stone.assignee}
                  onChange={e => onSave({ ...stone, assignee: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={stone.tags}
                  onChange={e => onSave({ ...stone, tags: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={stone.deadline}
                  onChange={e => onSave({ ...stone, deadline: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={stone.status}
                  onChange={e => onSave({ ...stone, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                {stone.id ? 'Save Changes' : 'Create Stone'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function StoneManager() {
  const [stones, setStones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStone, setCurrentStone] = useState({
    project: '',
    title: '',
    description: '',
    assignee: '',
    tags: '',
    deadline: '',
    status: 'To Do'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch stones when component mounts
  useEffect(() => {
    fetchStones();
  }, []);

  async function fetchStones() {
    try {
      setIsLoading(true);
      const projects = await api.projects.getAll();
      // Collect all stones from all projects
      const allStones = projects.flatMap(project => 
        project.stones.map(stone => ({
          ...stone,
          project: project.title,
          tags: stone.tags || [],
          assignee: stone.assignee || 'Unassigned',
          deadline: stone.deadline || new Date().toISOString().split('T')[0]
        }))
      );
      setStones(allStones);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch stones. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(stone) {
    try {
      setIsLoading(true);
      if (stone.id) {
        // Find the project this stone belongs to
        const projects = await api.projects.getAll();
        const project = projects.find(p => 
          p.stones.some(s => s.id === stone.id)
        );
        
        if (project) {
          const updatedStones = project.stones.map(s => 
            s.id === stone.id ? {
              title: stone.title,
              detail: stone.description,
              status: stone.status
            } : s
          );
          
          await api.projects.update(project.id, {
            ...project,
            stones: updatedStones
          });
          
          toast({
            title: 'Success',
            description: 'Stone updated successfully',
          });
        }
      }
      
      await fetchStones(); // Refresh the stones list
      setShowModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save stone. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(stone) {
    setCurrentStone({
      ...stone,
      tags: Array.isArray(stone.tags) ? stone.tags.join(', ') : ''
    });
    setShowModal(true);
  }

  async function handleDelete(stoneId) {
    try {
      setIsLoading(true);
      // Find the project this stone belongs to
      const projects = await api.projects.getAll();
      const project = projects.find(p => 
        p.stones.some(s => s.id === stoneId)
      );
      
      if (project) {
        const updatedStones = project.stones.filter(s => s.id !== stoneId);
        await api.projects.update(project.id, {
          ...project,
          stones: updatedStones
        });
        
        toast({
          title: 'Success',
          description: 'Stone deleted successfully',
        });
        
        await fetchStones(); // Refresh the stones list
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete stone. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Stones</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCurrentStone({
              project: '',
              title: '',
              description: '',
              assignee: '',
              tags: '',
              deadline: new Date().toISOString().split('T')[0],
              status: 'To Do'
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          disabled={isLoading}
        >
          <FaPlus className="w-4 h-4" />
          New Stone
        </motion.button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {stones.map((stone, index) => (
            <motion.div
              key={stone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {stone.title}
                    </h3>
                    <p className="text-sm text-gray-500">{stone.project}</p>
                  </div>
                  <p className="text-gray-600">{stone.detail || stone.description}</p>
                  {stone.tags && stone.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {stone.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
                        >
                          <FaTag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <FaUser className="w-4 h-4" />
                      {stone.assignee}
                    </span>
                    {stone.deadline && (
                      <span className="inline-flex items-center gap-1">
                        <FaClock className="w-4 h-4" />
                        {stone.deadline}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(stone)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <FaEdit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(stone.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <FaTrash className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  stone.status === 'DONE' ? 'bg-green-100 text-green-800' :
                  stone.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stone.status.replace('_', ' ')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <StoneModal
        show={showModal}
        onClose={() => setShowModal(false)}
        stone={currentStone}
        onSave={handleSave}
      />
    </section>
  );
}
