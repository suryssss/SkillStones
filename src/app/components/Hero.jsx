'use client'
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const avatars = [
  { src: "https://randomuser.me/api/portraits/women/44.jpg", alt: "User 1", style: "top-30 left-40", chevronRotation: 45, chevronLeft: false },
  { src: "https://randomuser.me/api/portraits/men/32.jpg", alt: "User 2", style: "top-30 right-40", chevronRotation: 135, chevronLeft: true },
  { src: "https://randomuser.me/api/portraits/women/65.jpg", alt: "User 3", style: "bottom-14 left-60", chevronRotation: -45, chevronLeft: false },
  { src: "https://randomuser.me/api/portraits/men/12.jpg", alt: "User 4", style: "bottom-14 right-60", chevronRotation: -135, chevronLeft: true },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 50]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const router = useRouter();

  const handleStart = () => {
    router.push('/onboarding');
  };

  const handleBrowse = () => {
    router.push('/onboarding');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative w-full min-h-screen py-32 px-4 md:px-0 bg-stone-100 font-sans overflow-hidden" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      >
        <svg width="100%" height="100%" className="h-full w-full" style={{ minHeight: 400 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Decorative avatars with chevrons */}
      {avatars.map((a, i) => (
        <motion.div
          key={i}
          className={`absolute z-10 ${a.style} hidden md:flex items-center`}
          initial={{ opacity: 0, x: a.chevronLeft ? 40 : -40, y: i < 2 ? -40 : 40 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.7, type: 'spring', stiffness: 60 }}
          style={{ y: springY }}
          whileHover={{ scale: 1.05 }}
        >
          {a.chevronLeft && (
            <motion.span 
              className="mr-2 bg-white rounded-full p-1 shadow -translate-y-2"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRightIcon className="w-6 h-6 text-green-900" style={{ transform: `rotate(${a.chevronRotation}deg)` }} />
            </motion.span>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={a.src}
              alt={a.alt}
              width={64}
              height={64}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </motion.div>
          {!a.chevronLeft && (
            <motion.span 
              className="ml-2 bg-white rounded-full p-1 shadow -translate-y-2"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRightIcon className="w-6 h-6 text-green-900" style={{ transform: `rotate(${a.chevronRotation}deg)` }} />
            </motion.span>
          )}
        </motion.div>
      ))}

      <motion.div
        className="relative z-20 max-w-4xl mx-auto flex flex-col items-center text-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col gap-4" variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TypeAnimation
              sequence={[
                'Break Down Big Ideas. Build Together',
                1000,
                'Transform ideas into actionable tasks',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="inline-block px-4 py-2 bg-white text-teal-900 font-semibold rounded-full text-sm tracking-wide border border-green-100 mb-2 shadow-sm"
            />
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-6xl font-bold text-teal-900 leading-tight tracking-tight"
            variants={itemVariants}
          >
            Transform <span className="relative inline-block">
              <span className="relative z-10">ideas</span>
              <motion.span
                className="absolute left-0 right-0 bottom-1 h-3 bg-lime-200 z-0 rounded"
                style={{ height: '0.7em' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              />
            </span>
            <br />into actionable tasks
          </motion.h1>

          <motion.p 
            className="text-xl md:text-xl text-slate-700 max-w-2xl mx-auto mt-2 font-medium"
            variants={itemVariants}
          >
            SkillStones empowers teams to collaborate effectively by breaking down large projects into manageable tasks. Join us to streamline your workflow and enhance productivity.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-4 justify-center"
          variants={itemVariants}
        >
          <motion.button
            className="px-8 py-3 rounded-lg bg-teal-900 text-white font-bold text-lg shadow-md hover:bg-teal-800 transition"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label="Start for Free"
            onClick={handleStart}
          >
            Start
          </motion.button>
          <motion.button
            className="px-8 py-3 rounded-lg border border-green-900 text-teal-900 font-bold text-lg bg-white shadow-md hover:bg-green-50 transition"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label="Get a Demo"
            onClick={handleBrowse}
          >
            Browse
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
} 