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

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-16">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display mb-4">Help Center</motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 font-light">Find answers to common questions and learn how to use ScholarSphere.</motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
          
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Why do I need to create an account?</h3>
            <p className="text-slate-600 mb-0">
              Creating an account allows you to save scholarships that interest you, track your applications, and provides our AI tools with the necessary context (your country, qualification, domain) to generate personalized statements of purpose and interview questions. While you can browse external links without an account, logging in unlocks the full AI functionality.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">How do I apply for scholarships?</h3>
            <p className="text-slate-600 mb-0">
              ScholarSphere acts as a unified search engine for scholarships. We provide the details and direct links. When you are ready to apply, simply click the "Apply Now" button on any scholarship card, and it will take you directly to the official scholarship provider's website. We do not host the application forms ourselves.
            </p>
          </motion.div>

          {/* Removed AI tools section */}

          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">How often are new scholarships added?</h3>
            <p className="text-slate-600 mb-0">
              Our team constantly searches the web for the latest scholarships across platforms and regions and adds them to our database. This ensures you have access to the freshest opportunities.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
