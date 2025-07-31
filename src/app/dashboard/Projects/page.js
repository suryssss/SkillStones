'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaTrash, FaUsers, FaGem } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import Navbar from '../components/navbar.jsx';
import { api } from '@/lib/api';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/components/ui/use-toast';

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

const ProjectDetailModal = ({ show, onClose, project }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
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
          className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              {project.title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600">{project.description || 'No description provided.'}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Contributors</h4>
              <div className="grid gap-3">
                {project.members?.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <FaUsers className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.user?.name || member.user?.email || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
                {(!project.members || project.members.length === 0) && (
                  <p className="text-gray-500">No contributors yet.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">Stones</h4>
              <div className="grid gap-3">
                {project.stones?.map(stone => (
                  <div key={stone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaGem className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{stone.title}</p>
                      <p className="text-sm text-gray-500">{stone.status}</p>
                    </div>
                  </div>
                ))}
                {(!project.stones || project.stones.length === 0) && (
                  <p className="text-gray-500">No stones created yet.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function ProjectsPage() {
  const { user } = useUser();
  const { projects, loading, error, createProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentProject, setCurrentProject] = useState({ title: '', description: '', stones: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

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
      await api.projects.delete(projectId);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  async function handleSave(project) {
    try {
      setIsLoading(true);
      if (project.id) {
        await api.projects.update(project.id, project);
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
      } else {
        await api.projects.create(project);
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
      }
      setShowModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const filtered = projects.filter(p =>
    (p.title?.toLowerCase().includes(search.toLowerCase()) || 
     p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <button
              onClick={() => {
                setCurrentProject({ title: '', description: '', stones: [] });
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

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaUsers className="w-4 h-4" />
                        <span>{project.members?.length || 0} contributors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaGem className="w-4 h-4" />
                        <span>{project.stones?.length || 0} stones</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProject(project);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={isLoading}
                        type="button"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id, e);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={isLoading}
                        type="button"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found</p>
            </div>
          )}
        </div>

        <ProjectModal
          show={showModal}
          onClose={() => setShowModal(false)}
          project={currentProject}
          onSave={handleSave}
          isLoading={isLoading}
        />

        <ProjectDetailModal
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          project={selectedProject}
        />
      </div>
    </div>
  );
}
