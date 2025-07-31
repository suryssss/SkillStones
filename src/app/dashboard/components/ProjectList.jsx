import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaTrash, FaGem } from 'react-icons/fa';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';

const ProjectModal = ({ show, onClose, project, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stones: [{ title: '', detail: '', status: 'TO_DO' }]
  });

  useEffect(() => {
    setFormData({
      title: project?.title || '',
      description: project?.description || '',
      stones: project?.stones?.length > 0 
        ? project.stones 
        : [{ title: '', detail: '', status: 'TO_DO' }]
    });
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddStone = () => {
    setFormData(prev => ({
      ...prev,
      stones: [...prev.stones, { title: '', detail: '', status: 'TO_DO' }]
    }));
  };

  const handleRemoveStone = (index) => {
    setFormData(prev => ({
      ...prev,
      stones: prev.stones.filter((_, i) => i !== index)
    }));
  };

  const handleStoneChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stones: prev.stones.map((stone, i) => 
        i === index ? { ...stone, [field]: value } : stone
      )
    }));
  };

  return (
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
            className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {project?.id ? 'Edit Project' : 'New Project'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
                type="button"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="3"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Stones
                    </label>
                    <button
                      type="button"
                      onClick={handleAddStone}
                      className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      disabled={isLoading}
                    >
                      <FaPlus className="w-3 h-3" />
                      Add Stone
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.stones.map((stone, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stone Title
                              </label>
                              <input
                                type="text"
                                value={stone.title}
                                onChange={e => handleStoneChange(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                required
                                disabled={isLoading}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Detail
                              </label>
                              <textarea
                                value={stone.detail || ''}
                                onChange={e => handleStoneChange(index, 'detail', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                rows="2"
                                disabled={isLoading}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                              </label>
                              <select
                                value={stone.status}
                                onChange={e => handleStoneChange(index, 'status', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                disabled={isLoading}
                              >
                                <option value="TO_DO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                              </select>
                            </div>
                          </div>
                          {formData.stones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStone(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              disabled={isLoading}
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : project?.id ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ProjectList() {
  const { getToken } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState({ 
    title: '', 
    description: '', 
    stones: [{ title: '', detail: '', status: 'TO_DO' }] 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = useCallback(async (projectId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      if (!window.confirm('Are you sure you want to delete this project?')) {
        return;
      }

      setIsLoading(true);
      setError(null);

      console.log('Starting project deletion...', projectId);
      await api.projects.delete(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || 'Failed to delete project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      setError(null);
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message || 'Failed to fetch projects. Please try again.');
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter(p =>
    (p.title.toLowerCase().includes(search.toLowerCase()) || 
     p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleSave(project) {
    try {
      setIsLoading(true);
      setError(null);
      if (project.id) {
        const updatedProject = await api.projects.update(project.id, project);
        setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
      } else {
        const newProject = await api.projects.create(project);
        setProjects([...projects, newProject]);
      }
      setShowModal(false);
    } catch (error) {
      setError('Failed to save project. Please try again.');
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const DeleteButton = ({ project }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDelete(project.id, e);
      }}
      onMouseDown={(e) => e.preventDefault()}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      disabled={isLoading}
      type="button"
      aria-label="Delete project"
    >
      <FaTrash className="w-5 h-5" />
    </button>
  );

  return (
    <div 
      className="relative" 
      onClick={(e) => e.preventDefault()}
      onSubmit={(e) => e.preventDefault()}
    >
      <section className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentProject({ 
                title: '', 
                description: '', 
                stones: [{ title: '', detail: '', status: 'TO_DO' }] 
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            disabled={isLoading}
            type="button"
          >
            <FaPlus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <FaGem className="w-4 h-4" />
                      <span>{project.stones?.length || 0} stones</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentProject(project);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      disabled={isLoading}
                      type="button"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <DeleteButton project={project} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <ProjectModal
          show={showModal}
          onClose={(e) => {
            if (e) e.preventDefault();
            setShowModal(false);
          }}
          project={currentProject}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
