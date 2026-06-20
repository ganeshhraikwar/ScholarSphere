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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-16">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display mb-4">Terms & Conditions</motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 font-light">Rules and guidelines for using our platform.</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 24 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="prose prose-slate max-w-none">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4 mt-0">Acceptance of Terms</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6">
              By accessing and using ScholarSphere, you agree to comply with and be bound by these terms. If you do not agree with any part of these terms, please do not use our services.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">User Responsibilities</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">AI Tools Usage</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6">
              Our AI-powered tools (SOP drafter, resume reviewer, bot) are provided as assistants to aid your application process. You are solely responsible for reviewing and verifying the output before using it for official applications. We do not guarantee admission or scholarship awards based on the use of these tools.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">External Links</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-0">
              ScholarSphere indexes external scholarship links. We do not control the application process nor the final decisions for external scholarships. We are not responsible for the privacy practices or content of third-party sites.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
