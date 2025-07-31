import { UserGroupIcon, AdjustmentsHorizontalIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const KeyCapabilities = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-teal-900 mb-12"
        >
          Key Capabilities That Power Your Workflow
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12 text-left">
          {/* Real-Time Collaboration */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="p-8 rounded-2xl shadow-xl bg-teal-50 hover:shadow-2xl"
          >
            <UserGroupIcon className="w-10 h-10 text-teal-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">Collaborate in Real-Time</h3>
            <p className="text-lg text-gray-700">
              Stay connected with your team and track progress instantly. With live updates, you can
              make changes, assign tasks, and see updates happen in real time without having to refresh
              or wait for syncing. This ensures smooth collaboration and fast decision-making in
              dynamic work environments. Every task update is instantly visible to all team members, so
              nothing falls through the cracks.
            </p>
          </motion.div>

          {/* Drag-Drop Kanban Board */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="p-8 rounded-2xl shadow-xl bg-teal-50 hover:shadow-2xl"
          >
            <AdjustmentsHorizontalIcon className="w-10 h-10 text-teal-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">Drag-Drop Kanban Board</h3>
            <p className="text-lg text-gray-700">
              Organize and manage your tasks effortlessly with an intuitive drag-and-drop Kanban board.
              Visualize your project flow by organizing tasks across different stages like "To Do," 
              "In Progress," and "Completed." You can easily move tasks around, assign priorities, and
              get a quick overview of your team's workload. This keeps everyone aligned and ensures that
              your projects stay on track.
            </p>
          </motion.div>

          {/* Per-Task Chat */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="p-8 rounded-2xl shadow-xl bg-teal-50 hover:shadow-2xl"
          >
            <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-teal-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">Per-Task Chat</h3>
            <p className="text-lg text-gray-700">
              Keep all discussions focused and relevant with a dedicated chat for every task. Instead of
              sifting through long email chains or messaging apps, you can discuss task details in a
              centralized chat window attached directly to the task. This ensures that every conversation
              is organized and easy to reference, boosting productivity and eliminating confusion. It's
              like having an ongoing meeting for every task in your project.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KeyCapabilities; 