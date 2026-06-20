import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, GraduationCap, FileText, IndianRupee } from 'lucide-react';
import type { User as UserType } from '../types';
import { COUNTRIES } from '../utils/countries';

interface LoginPageProps {
  setAuthUser: (user: UserType) => void;
}

export default function LoginPage({ setAuthUser }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    country: '',
    state: '',
    category: '',
    course: '',
    degreeLevel: '',
    marks: '',
    income: '',
    skills: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL;
      const res = await fetch(apiUrl ? `${apiUrl}${url}` : url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('scholarfind_token', data.token);
      localStorage.setItem('scholarfind_user', JSON.stringify(data.user));
      setAuthUser(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
              {isLogin ? 'Welcome Back' : 'Create Student Profile'}
            </h2>
            <p className="mt-2 text-sm text-slate-700 font-medium">
              {isLogin ? 'Sign in to access your matched scholarships' : 'Join thousands of students funding their future'}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-md text-red-800 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                    <input type="text" name="name" required onChange={handleChange} className="block w-full pl-10 pr-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input type="tel" name="mobile" required onChange={handleChange} className="block w-full pl-10 pr-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input type="email" name="email" required onChange={handleChange} className="block w-full pl-10 pr-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="student@university.edu" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input type="password" name="password" required onChange={handleChange} className="block w-full pl-10 pr-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="••••••••" />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="border-t border-slate-300/50 mt-6 pt-6">
                   <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Academic Profile</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-800 mb-1">Country</label>
                     <div className="relative">
                       <select name="country" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 shadow-sm">
                          <option value="">Select Country</option>
                          {COUNTRIES.filter(c => c !== "Global (All)").map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="Other">Other</option>
                       </select>
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">State/Province</label>
                    <div className="relative">
                      <select name="state" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 shadow-sm">
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">Category</label>
                    <div className="relative">
                      <select name="category" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 shadow-sm">
                        <option value="">Select Category</option>
                        <option value="General">General/Open</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="Minority">Minority</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">Degree Level</label>
                    <div className="relative">
                      <select name="degreeLevel" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 shadow-sm">
                        <option value="">Select Level</option>
                        <option value="High School">High School (X/XII)</option>
                        <option value="Undergraduate">Undergraduate (Bachelor)</option>
                        <option value="Postgraduate">Postgraduate (Master)</option>
                        <option value="Ph.D">Ph.D / Doctorate</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">Current Course</label>
                    <input type="text" name="course" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="e.g. Computer Science, MBBS" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-800 mb-1">Marks/CGPA (%)</label>
                     <input type="number" name="marks" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="e.g. 85" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">Family Annual Income</label>
                    <input type="number" name="income" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="e.g. 250000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">Skills (Comma separated)</label>
                    <input type="text" name="skills" required onChange={handleChange} className="block w-full px-3 py-2.5 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-500 shadow-sm" placeholder="e.g. React, Python, Leadership" />
                  </div>
                </div>
              </>
            )}

            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.3)] text-sm font-bold text-white bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-sans transform hover:-translate-y-0.5 backdrop-blur-md">
                {isLogin ? 'Sign in' : 'Create Profile'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm font-bold text-blue-700 hover:text-blue-800"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
