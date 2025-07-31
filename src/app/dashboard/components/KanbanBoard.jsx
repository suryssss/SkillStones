import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTag, FaClock, FaUser, FaSpinner } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const SortableStoneCard = ({ stone }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-move group"
    >
      <div className="space-y-3">
        <div>
          {stone.projectTitle && (
            <div className="text-xs text-teal-600 font-medium mb-1">
              {stone.projectTitle}
            </div>
          )}
          <h4 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
            {stone.title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{stone.detail}</p>
        </div>

        {stone.tags && stone.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stone.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium"
              >
                <FaTag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <FaUser className="w-3.5 h-3.5" />
            {stone.assignee || 'Unassigned'}
          </span>
          {stone.deadline && (
            <span className="inline-flex items-center gap-1.5">
              <FaClock className="w-3.5 h-3.5" />
              {new Date(stone.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Column = ({ title, stones, className }) => {
  const columnId = title.toLowerCase().replace(/\s+/g, '-');
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
      <h3 className="font-semibold text-gray-700 mb-4 px-2">
        {title} ({stones.length})
      </h3>
      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[200px]"
      >
        <SortableContext
          items={stones.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {stones.map((stone) => (
              <SortableStoneCard key={stone.id} stone={stone} />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>
    </div>
  );
};

const DroppableColumn = ({ id, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver ? 'bg-teal-100 transition-colors duration-300' : ''
      }`}
      style={{ minHeight: '200px' }}
    >
      {children}
    </div>
  );
};

export default function KanbanBoard({ projectId, showAllStones }) {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch stones when component mounts or projectId changes
  useEffect(() => {
    const fetchStones = async () => {
      try {
        console.log('🔍 Fetching stones:', showAllStones ? 'all stones' : `project ${projectId}`);
        setLoading(true);
        
        let data;
        if (showAllStones) {
          // Fetch all projects and their stones
          const projects = await api.projects.getAll();
          data = projects.flatMap(project => 
            project.stones.map(stone => ({
              ...stone,
              projectTitle: project.title // Add project title for reference
            }))
          );
        } else {
          // Fetch stones for a specific project
          const response = await fetch(`/api/projects/${parseInt(projectId, 10)}/stones`);
          if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to fetch stones');
          }
          data = await response.json();
        }
        
        console.log('✅ Fetched stones:', data);
        setStones(data);
      } catch (error) {
        console.error('Failed to fetch stones:', error);
        toast({
          title: 'Error',
          description: 'Failed to load stones. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (showAllStones || projectId) {
      console.log('🚀 Fetching stones...');
      fetchStones();
    } else {
      console.log('⚠️ No project ID provided and not showing all stones');
      setLoading(false);
    }
  }, [projectId, showAllStones]);

  // Set up real-time updates
  useEffect(() => {
    if (!showAllStones && !projectId) return;

    const interval = setInterval(async () => {
      try {
        let data;
        if (showAllStones) {
          const projects = await api.projects.getAll();
          data = projects.flatMap(project => 
            project.stones?.map(stone => ({
              ...stone,
              projectTitle: project.title
            })) || []
          );
        } else {
          const stones = await api.stones.getAll(projectId);
          data = stones;
        }
        setStones(data);
      } catch (error) {
        console.error('Failed to update stones:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [projectId, showAllStones]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeStone = stones.find((s) => s.id === active.id);
    if (!activeStone) return;

    const newStatus = over.id.toUpperCase().replace(/-/g, '_');
    if (activeStone.status === newStatus) return;

    try {
      // Update stone status locally first
      setStones(stones.map(s => 
        s.id === active.id ? { ...s, status: newStatus } : s
      ));

      // Update in database
      const response = await fetch(`/api/projects/${activeStone.projectId}/stones/${active.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update stone status');
      }

      toast({
        title: 'Success',
        description: 'Stone status updated successfully',
      });
    } catch (error) {
      console.error('Failed to update stone status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update stone status. Please try again.',
        variant: 'destructive',
      });

      // Revert local state on error
      setStones(stones);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  const todoStones = stones.filter((s) => s.status === 'TO_DO');
  const inProgressStones = stones.filter((s) => s.status === 'IN_PROGRESS');
  const doneStones = stones.filter((s) => s.status === 'DONE');

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column
          title="To Do"
          stones={todoStones}
          className="border-t-4 border-gray-400"
        />
        <Column
          title="In Progress"
          stones={inProgressStones}
          className="border-t-4 border-blue-400"
        />
        <Column
          title="Done"
          stones={doneStones}
          className="border-t-4 border-green-400"
        />
      </div>
    </DndContext>
  );
}
