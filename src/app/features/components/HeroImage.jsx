import { motion } from 'framer-motion';

export default function HeroImage() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-16 border-8 border-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <img src="/feature-hero.png" alt="Feature overview" className="w-full h-auto" />
    </motion.div>
  );
}
