'use client'
import { PencilSquareIcon, Squares2X2Icon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    icon: PencilSquareIcon,
    title: "Create Project",
    desc: "Start by creating a new project for your big idea."
  },
  {
    icon: Squares2X2Icon,
    title: "Add Tasks",
    desc: "Break your project into actionable, manageable tasks."
  },
  {
    icon: UserGroupIcon,
    title: "Invite Team",
    desc: "Bring collaborators on board and assign tasks."
  },
  {
    icon: ChartBarIcon,
    title: "Track Progress",
    desc: "Visualize your team's progress in real time."
  }
];

const TopWave = () => (
  <svg className="absolute top-0 left-0 w-full h-16 -translate-y-full" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f5f5f4" d="M0,80 C480,0 960,160 1440,80 L1440,0 L0,0 Z" />
  </svg>
);
const Blob = ({ className, color }) => (
  <svg className={className} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={color} fillOpacity=".12" d="M40.5,-66.6C52.2,-59.2,60.7,-46.2,68.2,-32.7C75.7,-19.2,82.2,-5.1,80.7,8.2C79.2,21.5,69.7,34,59.1,44.7C48.5,55.4,36.8,64.3,23.2,69.7C9.6,75.1,-6,77,-20.7,73.2C-35.4,69.4,-49.2,59.9,-59.2,47.2C-69.2,34.5,-75.4,18.7,-75.2,3.2C-75,-12.3,-68.4,-27.6,-58.2,-36.7C-48,-45.8,-34.2,-48.7,-21.1,-55.2C-8,-61.7,4.5,-71.9,18.2,-75.2C31.9,-78.5,46.8,-75.9,40.5,-66.6Z" transform="translate(100 100)" />
  </svg>
);
const DotsPattern = () => (
  <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0" width="400" height="200" fill="none" viewBox="0 0 400 200">
    <g opacity="0.08">
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={(i % 10) * 40 + 10} cy={Math.floor(i / 10) * 80 + 10} r="4" fill="#0f766e" />
      ))}
    </g>
  </svg>
);

const stepVariants = [
  // Step 1: Bounce in
  {
    initial: { opacity: 0, scale: 0.7, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.5, duration: 0.7 } }
  },
  // Step 2: Flip in
  {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0, transition: { type: 'spring', duration: 0.7 } }
  },
  // Step 3: Slide from side
  {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0, transition: { type: 'spring', duration: 0.7 } }
  },
  // Step 4: Fade with scaling
  {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
  }
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  // Animate the stepper line height and glow as steps come in
  const lineHeight = isInView ? '100%' : '0%';
  const lineGlow = isInView ? '0 0 24px 4px #14b8a6' : 'none';

  return (
    <section className="relative w-full py-24 px-8 md:px-16 bg-stone-100 font-sans overflow-hidden" style={{ fontFamily: 'Inter, Arial, sans-serif', background: 'radial-gradient(ellipse at 60% 0%, #e0f2fe 0%, #f5f5f4 100%)' }}>
      <TopWave />
      <Blob className="absolute left-[-80px] top-[-80px] z-0" color="#14b8a6" />
      <Blob className="absolute right-[-80px] bottom-[-80px] z-0" color="#22c55e" />
      <DotsPattern />
      <div className="max-w-5xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-teal-900 mb-4 tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-green-900 max-w-2xl mx-auto text-lg font-medium"
          >
            SkillStones makes project collaboration simple and effective in just a few steps.
          </motion.p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 mt-8" ref={ref}>
          {/* Animated vertical line for stepper */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-teal-200 via-emerald-200 to-green-200 rounded-full z-0"
            style={{ transform: 'translateX(-50%)', boxShadow: lineGlow }}
            initial={{ height: '0%' }}
            animate={{ height: lineHeight }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-10 gap-5 border border-gray-100 relative z-10"
              initial={stepVariants[idx].initial}
              whileInView={stepVariants[idx].animate}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 + idx * 0.25, duration: 0.7, type: 'spring', stiffness: 80 }}
              style={idx === 1 ? { perspective: 600 } : {}}
            >
              {/* Step number badge */}
              <span className="absolute top-5 left-5 bg-teal-100 text-teal-900 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shadow">{idx + 1}</span>
              {/* Animated icon */}
              <motion.div
                className="mb-2 w-14 h-14 rounded-full bg-gradient-to-tr from-teal-200 to-emerald-100 flex items-center justify-center shadow-inner"
                whileHover={{ scale: 1.12, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {step.icon && <step.icon className="w-8 h-8 text-teal-900" />}
              </motion.div>
              <h3 className="font-bold text-xl text-teal-900 tracking-tight">{step.title}</h3>
              <p className="text-green-900 text-base font-normal">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 