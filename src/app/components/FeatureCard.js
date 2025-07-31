// src/app/components/FeatureCard.jsx
'use client'
import { motion } from "framer-motion";
import Tilt from 'react-parallax-tilt';

const accentColors = {
  realTime: 'bg-teal-400',
  kanban: 'bg-green-400',
  chat: 'bg-emerald-400',
};

export default function FeatureCard({ type, title, description, featured, tagline }) {
  return (
    <Tilt
      glareEnable={false}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      className="rounded-2xl"
      transitionSpeed={250}
      scale={1.04}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 24px rgba(16, 185, 129, 0.10)" }}
        className="relative rounded-2xl bg-stone-100 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 font-sans flex flex-col h-full"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        {/* Featured badge */}
        {featured && (
          <span className="absolute top-4 left-4 bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full shadow">Featured</span>
        )}
        <motion.div className="flex flex-col items-center gap-3 p-8 flex-1">
          {/* Animated icon placeholder */}
          <motion.div
            className="mb-2 w-16 h-16 flex items-center justify-center"
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Replace with Lottie or SVG icon as needed */}
            <span className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-200 to-emerald-100 flex items-center justify-center text-2xl text-teal-900 shadow-inner">
              {type === 'realTime' && '👥'}
              {type === 'kanban' && '🗂️'}
              {type === 'chat' && '💬'}
            </span>
          </motion.div>
          <h3 className="text-xl font-bold text-teal-900 mb-1">{title}</h3>
          {tagline && <div className="text-xs text-emerald-700 font-semibold mb-1">{tagline}</div>}
          <p className="text-green-900 text-base font-medium text-center mb-4">{description}</p>
          <motion.a
            href="/features"
            className="mt-auto inline-block px-5 py-2 bg-teal-900 text-white rounded-lg font-semibold text-xs shadow hover:bg-teal-800 transition"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>
    </Tilt>
  );
}
