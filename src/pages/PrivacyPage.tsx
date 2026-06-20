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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-16">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display mb-4">Privacy Policy</motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 font-light">How we protect your data.</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 24 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="prose prose-slate max-w-none">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4 mt-0">Information We Collect</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6">
              When you create an account on ScholarSphere, we collect basic profile information such as your name, email address, education level, and country. This helps us tailor scholarship recommendations and AI assistance to your specific profile.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6">
              Your information is used strictly to provide you with relevant scholarship opportunities and to enable personalization for our AI-powered SOP drafter and resume reviewer. Your data is not sold or rented to third parties.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">Data Security</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-6">
              We employ industry-standard encryption and security measures to protect your personal information. However, please remember that no method of transmission over the internet or electronic storage is 100% secure.
            </motion.p>

            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-900 mb-4">Contact Us</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 mb-0">
              If you have any questions regarding this privacy policy, please contact our support team via the Help Center.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
