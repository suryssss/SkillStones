'use client'
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { GithubIcon, TwitterIcon } from 'lucide-react';

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
);
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.276.06-2.687.334-3.678 1.325-.991.991-1.265 2.402-1.325 3.678-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.276.334 2.687 1.325 3.678.991.991 2.402 1.265 3.678 1.325 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.276-.06 2.687-.334 3.678-1.325.991-.991 1.265-2.402 1.325-3.678.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.265-3.678-1.325-1.28-.06-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 border-t border-neutral-900 py-24 px-8 md:px-16 shadow-md  font-sans transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Left: Logo and description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <div className="font-bold text-2xl text-white mb-2">SkillStones</div>
          <p className="text-white text-base max-w-xs">SkillStones empowers teams to break down big ideas into actionable, collaborative tasks for real progress.</p>
        </motion.div>
        {/* Center: Links */}
        <div className="flex-1 flex justify-center gap-16">
          {[
            {
              title: 'Product',
              links: [
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#how' },
                { label: 'Pricing', href: '#' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Terms', href: '#' },
                { label: 'Privacy', href: '#' },
              ],
            },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <h4 className="font-semibold text-white mb-2">{col.title}</h4>
              <ul className="text-white text-base space-y-1">
                {col.links.map((link, j) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.15 * j }}
                  >
                    <a
                      href={link.href}
                      className="hover:text-emerald-600 transition-all duration-300 ease-in-out"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        {/* Right: Newsletter and Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col items-end gap-4"
        >
          <form className="flex w-full max-w-xs">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-l-2xl border border-gray-200 bg-white text-green-900 focus:outline-none"
            />
            <button type="submit" className="px-5 py-3 bg-teal-900 text-white rounded-r-2xl font-semibold hover:bg-emerald-600 transition-all duration-300 ease-in-out shadow-md">Subscribe</button>
          </form>
          <div className="flex gap-4 mt-2">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-400 transition-all duration-300" aria-label="Twitter"><TwitterIcon className="w-6 h-6" /></a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-400 transition-all duration-300" aria-label="GitHub"><GithubIcon className="w-6 h-6" /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-400 transition-all duration-300" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-400 transition-all duration-300" aria-label="Instagram"><InstagramIcon /></a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 