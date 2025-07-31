import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

export default function TeamOverview({ projectId }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState('');

  // Fetch team members when component mounts or projectId changes
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('🔍 Fetching members for project:', projectId);
        setLoading(true);
        const project = await api.projects.getById(parseInt(projectId, 10));
        console.log('📡 Fetched project:', project);
        
        if (project?.members) {
          console.log('✅ Setting members:', project.members);
          setMembers(project.members);
        } else {
          console.log('⚠️ No members found in project');
        }
      } catch (error) {
        console.error('❌ Failed to fetch team members:', error);
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
      console.log('🚀 Project ID changed:', projectId);
      fetchMembers();
    } else {
      console.log('⚠️ No project ID provided');
      setLoading(false);
    }
  }, [projectId]);

  // Set up real-time updates
  useEffect(() => {
    if (!projectId) return;

    const interval = setInterval(async () => {
      try {
        const project = await api.projects.getById(parseInt(projectId, 10));
        if (project?.members) {
          setMembers(project.members);
        }
      } catch (error) {
        console.error('Failed to update team members:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [projectId]);

  async function handleInvite() {
    if (!invite.trim() || !projectId) return;

    try {
      const response = await api.projects.inviteMember(projectId, {
        email: invite.trim(),
        role: 'MEMBER'
      });

      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      });

      setInvite('');
      
      // Refresh members list
      const project = await api.projects.getById(projectId);
      if (project?.members) {
        setMembers(project.members);
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function handlePromote(memberId) {
    if (!projectId) return;

    try {
      const member = members.find(m => m.id === memberId);
      if (!member) return;

      const newRole = member.role === 'OWNER' ? 'MEMBER' : 'OWNER';
      
      await api.projects.updateMember(projectId, memberId, {
        role: newRole
      });

      toast({
        title: 'Success',
        description: `User ${newRole === 'OWNER' ? 'promoted to owner' : 'demoted to member'}`,
      });

      // Refresh members list
      const project = await api.projects.getById(projectId);
      if (project?.members) {
        setMembers(project.members);
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member role. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function handleRemove(memberId) {
    if (!projectId) return;

    try {
      await api.projects.removeMember(projectId, memberId);

      toast({
        title: 'Success',
        description: 'Team member removed successfully',
      });

      // Refresh members list
      const project = await api.projects.getById(projectId);
      if (project?.members) {
        setMembers(project.members);
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove team member. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <FaSpinner className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Team Overview</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Invite by email"
            className="border rounded px-3 py-2"
            value={invite}
            onChange={e => setInvite(e.target.value)}
          />
          <button 
            onClick={handleInvite} 
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!invite.trim() || loading}
          >
            Invite
          </button>
        </div>
      </div>
      
      {members.length > 0 ? (
        <ul className="divide-y">
          {members.map(member => (
            <li key={member.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={member.user?.imageUrl || 'https://www.gravatar.com/avatar/default?d=mp'}
                    alt={member.user?.name || 'Team Member'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{member.user?.name || 'Unknown User'}</div>
                  <div className="text-xs text-gray-500">{member.role.charAt(0) + member.role.slice(1).toLowerCase()}</div>
                  <div className="text-xs text-gray-400">
                    Tasks done: {member.user?.completedStones?.length || 0}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {user?.id !== member.user?.clerkId && (
                  <>
                    <button 
                      onClick={() => handlePromote(member.id)} 
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      {member.role === 'OWNER' ? 'Demote' : 'Promote'}
                    </button>
                    <button 
                      onClick={() => handleRemove(member.id)} 
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No team members found
        </div>
      )}
    </section>
  );
}
