'use client'
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function CallToActionBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
      className="w-full py-20 px-8 md:px-16 bg-teal-950 font-sans transition-all duration-300 ease-in-out  shadow-2xl relative overflow-hidden"
    >
      {/* Animated background shape */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
      />
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        >
          <RocketLaunchIcon className="w-16 h-16 text-white drop-shadow mb-2 animate-bounce" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight"
        >
          Ready to turn your ideas into action?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-emerald-100 text-lg mb-4"
        >
          Start collaborating with your team and make real progress today.
        </motion.p>
        <motion.a
          href="/onboarding"
          className="px-12 py-5 bg-white text-teal-900 font-bold rounded-2xl text-2xl shadow-xl hover:bg-teal-50 hover:scale-105 transition-all duration-300 ease-in-out"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started for Free
        </motion.a>
      </div>
    </motion.section>
  );
}
