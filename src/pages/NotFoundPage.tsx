import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Compass className="w-32 h-32 text-indigo-200 mx-auto mb-8" />
        <h1 className="text-6xl font-display font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-6 font-display">Off the map.</h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg">
          The page you are looking for does not exist or has been moved. Let's get you back on track to finding the right scholarships.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
