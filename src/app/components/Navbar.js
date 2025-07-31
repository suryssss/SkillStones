'use client'
import { ChevronDownIcon, GlobeAltIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, UsersIcon, Squares2X2Icon, EnvelopeIcon, NewspaperIcon, StarIcon, ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Our Features', href: '/features' },
  { name: 'DashBoard', href: '/dashboard' },
  { name: 'Contact Us', href: '/contactus' },
  { name: 'More info', href: '#more', hasDropdown: true },
];

const megaMenu = [
  {
    heading: 'Explore Our Platform',
    items: [
      { icon: GlobeAltIcon, title: 'Project Overview', desc: 'Manage your projects effortlessly with SkillStones.' },
      { icon: Squares2X2Icon, title: 'Task Management', desc: 'Stay organized and on top of your tasks.' },
      { icon: UsersIcon, title: 'Team Collaboration', desc: 'Work together seamlessly in real-time.' },
      { icon: Cog6ToothIcon, title: 'User Settings', desc: 'Customize your experience and preferences.' },
    ]
  },
  {
    heading: 'Resources and Support',
    items: [
      { icon: ChatBubbleLeftRightIcon, title: 'Help Center', desc: 'Find answers to your questions quickly.' },
      { icon: EnvelopeIcon, title: 'Feedback', desc: 'Share your thoughts and suggestions.' },
      { icon: NewspaperIcon, title: 'Blog Updates', desc: 'Stay informed with our latest articles.' },
      { icon: StarIcon, title: 'Community Events', desc: 'Join us for upcoming workshops and meetups.' },
    ]
  },
  {
    heading: 'Stay Connected',
    items: [
      { icon: EnvelopeIcon, title: 'Newsletter Signup', desc: 'Subscribe for updates and news.' },
      { icon: GlobeAltIcon, title: 'Social Media', desc: 'Follow us on our social platforms.' },
      { icon: UsersIcon, title: 'User Stories', desc: 'See how others are using SkillStones.' },
      { icon: StarIcon, title: 'Success Stories', desc: "Learn from our community's achievements." },
    ]
  }
];

const latestArticle = {
  image: null, // Placeholder
  title: 'SkillStones Insights',
  desc: 'Discover tips and tricks for project management.',
  link: '#',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let dropdownTimeout;
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers for desktop mega menu
  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout = setTimeout(() => setDropdownOpen(false), 120);
  };

  const handleJoin = () => {
    router.push('/onboarding');
  };

  const handleStartNow = () => {
    router.push('/onboarding');
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-stone-100'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 font-extrabold text-2xl text-green-900 tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.span 
              className="bg-green-900 rounded-xl p-2 flex items-center justify-center"
              style={{ width: 40, height: 40 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white text-xl font-bold">S</span>
            </motion.span>
            SkillStones
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.hasDropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                  onFocus={handleDropdownEnter}
                  onBlur={handleDropdownLeave}
                  tabIndex={0}
                >
                  <motion.a
                    href={item.href}
                    className="text-green-900 font-medium hover:text-green-700 transition-colors flex items-center gap-1"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    <motion.span
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </motion.span>
                  </motion.a>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 top-full z-40 mt-4 w-[900px] -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 flex gap-8"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {/* 3 columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8">
                          {megaMenu.map((col, idx) => (
                            <div key={col.heading}>
                              <div className="font-semibold text-gray-800 mb-4 text-base">{col.heading}</div>
                              <ul className="space-y-4">
                                {col.items.map((item, i) => (
                                  <li key={item.title} className="flex items-start gap-3">
                                    <item.icon className="w-5 h-5 mt-1 text-green-900 flex-shrink-0" />
                                    <div>
                                      <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                                      <div className="text-xs text-gray-500 leading-snug">{item.desc}</div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {/* Latest Articles */}
                        <div className="w-64 flex flex-col gap-4 border-l border-gray-200 pl-8">
                          <div className="font-semibold text-gray-800 mb-2 text-base">Latest Articles</div>
                          <div className="flex flex-col gap-2">
                            <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                              <PhotoIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <div className="font-bold text-gray-900 text-base leading-tight">{latestArticle.title}</div>
                            <div className="text-xs text-gray-500 mb-2">{latestArticle.desc}</div>
                            <a href="#" className="text-xs text-blue-600 hover:underline mb-2">Read more</a>
                            <button className="flex items-center gap-1 px-4 py-2 bg-green-900 text-white rounded-lg font-semibold text-xs hover:bg-green-800 transition">
                              Button <ArrowRightIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-green-900 font-medium hover:text-green-700 transition-colors"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              )
            ))}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              className="px-6 py-2 rounded-lg font-semibold text-green-900 border-none bg-transparent hover:bg-green-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoin}
            >
              Join
            </motion.button>
            <motion.button
              className="px-6 py-2 rounded-lg font-semibold bg-teal-900 text-white hover:bg-teal-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartNow}
            >
              Start Now
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-green-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
                className="w-full h-0.5 bg-green-900"
              />
              <motion.span
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                className="w-full h-0.5 bg-green-900"
              />
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
                className="w-full h-0.5 bg-green-900"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-900 hover:bg-green-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <motion.button
                  className="w-full px-4 py-2 text-center rounded-lg font-semibold text-green-900 hover:bg-green-50"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoin}
                >
                  Join
                </motion.button>
                <motion.button
                  className="w-full mt-2 px-4 py-2 text-center rounded-lg font-semibold bg-teal-900 text-white hover:bg-teal-800"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartNow}
                >
                  Start Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 