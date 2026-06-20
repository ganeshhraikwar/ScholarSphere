import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-16">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display mb-4">About ScholarSphere</motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 font-light">Empowering students globally to achieve their dreams.</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 24 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="prose prose-lg prose-slate max-w-none">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4 mt-0">Our Mission</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-8 leading-relaxed">
              ScholarSphere was founded with a singular vision: to democratize access to education by connecting ambitious students with life-changing scholarship opportunities worldwide. We believe that financial constraints should never be a barrier to academic excellence and personal growth.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">Why ScholarSphere?</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6 leading-relaxed">
              Navigating the fragmented world of scholarships can be overwhelming. We've built an intelligent, centralized platform that curates active scholarships worldwide to help you find the best opportunities faster.
            </motion.p>

            <motion.ul variants={containerVariants} className="space-y-4 mb-8 text-slate-600 list-none pl-0">
              <motion.li variants={itemVariants} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                <span><strong>Global Reach:</strong> Scholarships from USA, UK, Canada, India, and everywhere in between.</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                <span><strong>Personalized Matches:</strong> Find scholarships tailored specifically to your profile.</span>
              </motion.li>
            </motion.ul>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">Join Us</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 leading-relaxed mb-0">
              Whether you are an undergraduate, postgraduate, or a high school student, ScholarSphere is your dedicated workstation. Join thousands of students who are taking the next step in their academic journey with us.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
