import { useState } from 'react';
import { FaSearch, FaClock, FaTag, FaCheck } from 'react-icons/fa';

const StoneCard = ({ stone, onStatusChange }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-teal-900">{stone.title}</h3>
        <p className="text-gray-600 text-sm">{stone.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {stone.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs"
            >
              <FaTag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <select
        className={`px-3 py-1 rounded-lg text-sm font-medium ${
          stone.status === 'Done' ? 'bg-green-100 text-green-800' :
          stone.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}
        value={stone.status}
        onChange={(e) => onStatusChange(stone.id, e.target.value)}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
    
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FaClock className="w-4 h-4" />
        <span>Due: {stone.deadline}</span>
      </div>
      
      {stone.status !== 'Done' && (
        <button
          onClick={() => onStatusChange(stone.id, 'Done')}
          className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100"
        >
          <FaCheck className="w-3 h-3" />
          Mark Done
        </button>
      )}
    </div>
  </div>
);

export default function MyStones() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stones, setStones] = useState([
    {
      id: 1,
      title: "Implement User Authentication",
      description: "Add JWT-based authentication system with refresh tokens",
      tags: ["Backend", "Security"],
      status: "In Progress",
      deadline: "2024-03-20"
    },
    {
      id: 2,
      title: "Design Dashboard UI",
      description: "Create responsive dashboard layout with Tailwind CSS",
      tags: ["Frontend", "UI/UX"],
      status: "To Do",
      deadline: "2024-03-25"
    },
    // Add more stones as needed
  ]);

  const handleStatusChange = (stoneId, newStatus) => {
    setStones(stones.map(stone => 
      stone.id === stoneId ? { ...stone, status: newStatus } : stone
    ));
  };

  const filteredStones = stones.filter(stone => {
    const matchesSearch = 
      stone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || stone.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stones..."
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
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStones.map(stone => (
          <StoneCard 
            key={stone.id} 
            stone={stone}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
} 