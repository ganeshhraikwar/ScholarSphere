import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    question: "How do I apply for scholarships?",
    answer: "ScholarSphere acts as a unified search engine. We provide the details and direct links. When you are ready to apply, click the 'Apply Now' button on any scholarship card, which takes you directly to the official scholarship provider's website."
  },
  {
    question: "Is this platform really free?",
    answer: "Yes! Our mission is to democratize access to education. Creating an account, building your profile, and searching for scholarships will always be 100% free."
  },
  {
    question: "How does the matching system work?",
    answer: "We compare your profile details (such as degree level, course, country, GPA, and extracurriculars) against the eligibility criteria of thousands of scholarships to determine your best matches."
  },
  {
    question: "Do I need to check the site every day?",
    answer: "No! You can subscribe to our weekly email digest from your Dashboard to receive personalized scholarship recommendations straight to your inbox."
  },
  {
    question: "How often are new scholarships added?",
    answer: "Our team and community continually update the database to ensure you have access to the freshest and most accurate funding opportunities."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 -z-10" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 text-blue-600">
             <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">Find quick answers to common questions and learn how to make the most of your ScholarSphere experience.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
           <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
           <p className="text-slate-600 mb-6">We're here to help you navigate your scholarship journey.</p>
           <Link to="/help" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors inline-block">
              Contact Support
           </Link>
        </div>
      </div>
    </div>
  );
}
