'use client'
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "What is SkillStones?",
    a: "SkillStones is a platform to break down big projects into smaller, collaborative tasks for teams."
  },
  {
    q: "Is SkillStones free to use?",
    a: "Yes! You can get started for free. Premium features may be added in the future."
  },
  {
    q: "Can I invite my team?",
    a: "Absolutely! SkillStones is built for collaboration. Invite as many teammates as you need."
  },
  {
    q: "Does it work on mobile?",
    a: "Yes, SkillStones is fully responsive and works great on any device."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="w-full py-24 px-8 md:px-16 bg-stone-100 font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col gap-14">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-teal-900 mb-4 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 ease-in-out ${open === idx ? 'border-teal-400' : 'border-gray-100'} hover:shadow-2xl hover:scale-[1.03]`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1 * idx, duration: 0.6, type: 'spring', stiffness: 80 }}
            >
              <button
                className="w-full flex justify-between items-center px-8 py-6 text-lg font-semibold text-teal-900 focus:outline-none"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
              >
                {faq.q}
                {open === idx ? (
                  <ChevronUpIcon className="w-6 h-6 text-emerald-500 ml-4 transition-all" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-emerald-500 ml-4 transition-all" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {open === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-green-900 text-base">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 