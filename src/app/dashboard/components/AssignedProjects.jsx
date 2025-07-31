import { useState } from 'react';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

const ProjectCard = ({ project }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-teal-900">{project.name}</h3>
        <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        project.status === 'Active' ? 'bg-green-100 text-green-800' :
        project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {project.status}
      </span>
    </div>
    
    <div className="mt-4 flex items-center text-sm text-gray-500">
      <span>Owner: {project.owner}</span>
      <span className="mx-2">•</span>
      <span>Tasks: {project.taskCount}</span>
    </div>
    
    <Link 
      href={`/projects/${project.id}`}
      className="mt-4 inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
    >
      View Project <FaExternalLinkAlt className="w-3 h-3" />
    </Link>
  </div>
);

export default function AssignedProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Mock data - replace with actual data from your backend
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      description: "Building a modern e-commerce solution with React and Node.js",
      owner: "John Doe",
      status: "Active",
      taskCount: 8
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Creating a cross-platform mobile application using React Native",
      owner: "Jane Smith",
      status: "On Hold",
      taskCount: 5
    },
    // Add more projects as needed
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
} 