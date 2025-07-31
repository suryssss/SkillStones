'use client'
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

const TopWave = () => (
  <svg className="absolute top-0 left-0 w-full h-16 -translate-y-full" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" />
  </svg>
);
const BottomWave = () => (
  <svg className="absolute bottom-0 left-0 w-full h-16 translate-y-full" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M0,0 C480,80 960,-80 1440,0 L1440,80 L0,80 Z" />
  </svg>
);
const Blob = ({ className, color }) => (
  <svg className={className} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={color} fillOpacity=".15" d="M40.5,-66.6C52.2,-59.2,60.7,-46.2,68.2,-32.7C75.7,-19.2,82.2,-5.1,80.7,8.2C79.2,21.5,69.7,34,59.1,44.7C48.5,55.4,36.8,64.3,23.2,69.7C9.6,75.1,-6,77,-20.7,73.2C-35.4,69.4,-49.2,59.9,-59.2,47.2C-69.2,34.5,-75.4,18.7,-75.2,3.2C-75,-12.3,-68.4,-27.6,-58.2,-36.7C-48,-45.8,-34.2,-48.7,-21.1,-55.2C-8,-61.7,4.5,-71.9,18.2,-75.2C31.9,-78.5,46.8,-75.9,40.5,-66.6Z" transform="translate(100 100)" />
  </svg>
);

export default function Features() {
  return (
    <section
      id="features"
      className="relative w-full py-24 px-6 md:px-16 bg-white font-sans overflow-hidden"
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}
    >
      <TopWave />
      <Blob className="absolute left-[-80px] top-[-80px] z-0" color="#14b8a6" />
      <Blob className="absolute right-[-80px] bottom-[-80px] z-0" color="#22c55e" />
      <motion.div
        className="max-w-6xl mx-auto flex flex-col gap-12 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-teal-900 mb-2 tracking-tight"
          >
            Transform Your Workflow with Seamless Collaboration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-green-900 max-w-2xl mx-auto font-medium mb-2"
          >
            Experience real-time teamwork, visual project management, and effective communication—all in one place with SkillStones.
          </motion.p>  
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <FeatureCard
            type="realTime"
            title="Collaborate in Real-Time"
            description="Work together instantly, assign tasks, and see updates as they happen."
            featured
            tagline="Live updates & teamwork"
          />
          <FeatureCard
            type="kanban"
            title="Drag-Drop Kanban Board"
            description="Organize tasks visually and move them across stages with an intuitive board."
            tagline="Visual project flow"
          />
          <FeatureCard
            type="chat"
            title="Per-Task Chat"
            description="Keep all discussions focused and relevant with chat for every task."
            tagline="Focused communication"
          />
        </div>
      </motion.div>
      <BottomWave />
    </section>
  );
}
