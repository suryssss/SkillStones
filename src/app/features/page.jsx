'use client'
import { motion } from 'framer-motion';
import { SparklesIcon, UserGroupIcon} from '@heroicons/react/24/solid';
import Tilt from 'react-parallax-tilt';
import KeyCapabilities from './components/KeyCapabilities';
import Navbar from '../components/Navbar';
import HeroHeading from './components/HeroHeading';
import HeroDescription from './components/HeroDescription';
import HeroImage from './components/HeroImage';

const features = [
  {
    icon: <SparklesIcon className="w-10 h-10 text-teal-600" />,
    title: 'Intuitive Interface',
    desc: 'Easily manage projects with a clean, modern dashboard and simple navigation.',
    content: (
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <Tilt tiltReverse={true} className="overflow-hidden rounded-2xl shadow-xl border border-teal-100">
          <img src="/dashboard-preview.png" alt="Dashboard preview" className="w-full h-auto" />
        </Tilt>
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-teal-900">Designed for Clarity</h3>
          <p className="text-lg text-green-900">
            Our dashboard provides real-time project overviews with customizable widgets. 
            Quickly access key metrics, recent activity, and priority tasks through 
            an intelligent layout that adapts to your workflow.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-teal-50 rounded-lg">
              <h4 className="font-bold text-teal-900 mb-2">87% Faster Navigation</h4>
              <p className="text-sm text-green-900">Compared to traditional project tools</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-bold text-emerald-900 mb-2">Custom Views</h4>
              <p className="text-sm text-green-900">Personalize your workspace layout</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: <UserGroupIcon className="w-10 h-10 text-emerald-600" />,
    title: 'Team Collaboration',
    desc: 'Work together in real time, assign tasks, and track progress as a team.',
    content: (
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <Tilt tiltReverse={true} className="overflow-hidden rounded-2xl shadow-xl border border-teal-100">
          <img src="/team-collab.png" alt="Team collaboration preview" className="w-full h-auto" />
        </Tilt>
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-teal-900">Seamless Teamwork</h3>
          <p className="text-lg text-green-900">
            Our platform enables real-time collaboration, task assignment, and progress tracking. 
            Teams can communicate, share files, and update project statuses instantly, ensuring everyone stays aligned and productive.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-teal-50 rounded-lg">
              <h4 className="font-bold text-teal-900 mb-2">Real-Time Updates</h4>
              <p className="text-sm text-green-900">Instant notifications and live changes</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-bold text-emerald-900 mb-2">Task Assignment</h4>
              <p className="text-sm text-green-900">Easily assign and track responsibilities</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
];
const AnimatedWave = () => (
  <motion.svg 
    className="absolute w-full h-24"
    viewBox="0 0 1440 100"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <path fill="#fff" d="M0 70L48 66C96 62 192 54 288 50C384 46 480 46 576 50C672 54 768 62 864 66C960 70 1056 70 1152 62C1248 54 1344 38 1392 30L1440 22V100H0Z"/>
  </motion.svg>
);
const ProgressChart = ({ percentage }) => (
  <svg viewBox="0 0 100 100" className="w-32 h-32">
    <circle cx="50" cy="50" r="45" className="fill-none stroke-teal-100 stroke-[8]" />
    <motion.circle
      cx="50" cy="50" r="45"
      className="fill-none stroke-teal-600 stroke-[8]"
      strokeLinecap="round"
      initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
      animate={{ strokeDashoffset: 283 * (1 - percentage/100) }}
      transition={{ duration: 1.5 }}
    />
    <text x="50" y="55" className="text-2xl font-bold fill-teal-900 text-center" dominantBaseline="middle" textAnchor="middle">
      {percentage}%
    </text>
  </svg>
);
export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-white font-sans overflow-hidden">
      <Navbar />
      <section className="relative pt-32 pb-24 px-4 bg-gradient-to-b from-teal-50 to-white">
        <AnimatedWave />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="text-center space-y-8"
          >
            <HeroHeading />
            <HeroDescription />
          </motion.div>
          <HeroImage />
        </div>
      </section>
      {features.map((feature, index) => (
        <section key={feature.title} className={`py-20 px-4 ${index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-7xl mx-auto"
          >
            {feature.content}
          </motion.div>
        </section>
      ))}
      <KeyCapabilities />
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white/10 rounded-xl"
          >
            <div className="text-5xl font-black mb-4">4.8/5</div>
            <div className="text-lg">User Satisfaction</div>
            <div className="flex justify-center mt-4">
              {[...Array(5)].map((_, i) => (
                <SparklesIcon key={i} className="w-6 h-6 text-amber-400" />
              ))}
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white/10 rounded-xl"
          >
            <div className="flex justify-center">
              <ProgressChart percentage={78} />
            </div>
            <div className="text-lg mt-4">Faster Project Completion</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white/10 rounded-xl"
          >
            <div className="text-5xl font-black mb-4">10x</div>
            <div className="text-lg">ROI Increase</div>
            <div className="mt-4 text-sm opacity-80">Average team efficiency improvement</div>
          </motion.div>
        </div>
      </section>
      <section className="relative py-32 bg-gradient-to-r from-teal-700 to-emerald-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              A Free Platform for Everyone
            </h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Join thousands of teams already building amazing things with SkillStones. Get started now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-teal-900 font-bold rounded-lg shadow-lg hover:bg-teal-50 transition-all"
              >
                Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 100" className="w-full h-24 transform translate-y-1">
            <path fill="#fff" d="M0 70L48 66C96 62 192 54 288 50C384 46 480 46 576 50C672 54 768 62 864 66C960 70 1056 70 1152 62C1248 54 1344 38 1392 30L1440 22V100H0Z"/>
          </svg>
        </div>
      </section>
    </main>
  );
}