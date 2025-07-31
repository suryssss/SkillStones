import { useState, useEffect } from 'react';
import { FaSearch, FaCrown, FaUserAlt, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';

const TeamMemberCard = ({ member }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="relative">
        <Image
          src={member.user?.imageUrl || 'https://www.gravatar.com/avatar/default?d=mp'}
          alt={member.user?.name || 'Team Member'}
          width={48}
          height={48}
          className="rounded-full"
        />
        {member.role === 'OWNER' && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 p-1 rounded-full">
            <FaCrown className="w-3 h-3 text-yellow-800" />
          </span>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-teal-900">{member.user?.name || 'Unknown User'}</h3>
        <p className="text-sm text-gray-600">{member.role.charAt(0) + member.role.slice(1).toLowerCase()}</p>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-semibold text-teal-700">
          {member.assignedStones?.length || 0}
        </div>
        <div className="text-xs text-gray-500">Tasks</div>
      </div>
    </div>
    
    <div className="mt-4 flex flex-wrap gap-2">
      {member.user?.skills?.map((skill, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

export default function ProjectTeam({ projectId }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const project = await api.projects.getById(projectId);
        if (project?.members) {
          setMembers(project.members);
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load team members. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user?.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || member.role === roleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <FaSpinner className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members or skills..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Owner">Owner</option>
          <option value="Member">Member</option>
          <option value="Contributor">Contributor</option>
        </select>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMembers.map(member => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No team members found
        </div>
      )}

      {user && (
        <div className="flex items-center justify-center py-4">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
            onClick={() => {
              toast({
                title: 'Coming Soon',
                description: 'Team member invitation feature is coming soon!',
              });
            }}
          >
            <FaUserAlt className="w-4 h-4" />
            Invite Team Member
          </button>
        </div>
      )}
    </div>
  );
} 