import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, CheckCircle, ArrowRight, BookOpen, Clock, User, Star, Send, Bot } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const LiveUserBadge = () => {
  const [liveUsers, setLiveUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        const res = await fetch('/api/stats/live-users');
        const data = await res.json();
        setLiveUsers(data.liveUsers);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLiveUsers();
    const interval = setInterval(fetchLiveUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  if (liveUsers === null) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-green-300 mb-6 ml-4">
      <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
      {liveUsers} Students Online
    </div>
  );
};

export default function LandingPage({ user }: { user?: any }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const { t } = useTranslation();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    fetch('/api/reviews').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setReviews(data);
    }).catch(console.error);
  };

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          rating,
          comment: reviewText
        })
      });
      setReviewText("");
      fetchReviews();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="w-full">
      <SEO title="Home" description="Discover and apply for global scholarships with ease automatically using our advanced AI agent." />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white text-slate-900 min-h-[85vh] flex items-center pt-24 pb-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-purple-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-sm border border-slate-200 mb-10"
            >
               <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                 </span>
                 Intelligent Discovery Agent Active
               </div>
               <div className="w-px h-4 bg-slate-300"></div>
               <LiveUserBadge />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-extrabold tracking-tight mb-8 leading-[1.05] text-slate-900 max-w-5xl"
            >
              Every Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Scholarship</span> <br className="hidden md:block"/> At Your Fingertips.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl font-light leading-relaxed"
            >
              Stop searching manually. Set up your profile once and let our AI discover perfect, fully-funded opportunities specifically tailored to your academic journey.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 justify-center w-full"
            >
              <Link to="/search" className="bg-slate-900 text-white hover:bg-indigo-600 text-lg px-8 py-4 rounded-full font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 transform hover:-translate-y-1">
                <Search className="w-5 h-5" />
                Explore Scholarships
              </Link>
              <Link to="/login" className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-lg px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-3 hover:bg-slate-50 transform hover:-translate-y-1">
                Create Your Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
        </div>
      </section>

      {/* App Preview Showcase */}
      <section className="relative z-20 -mt-20 flex justify-center px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring' }}
          className="w-full relative rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl border border-slate-800"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent rounded-[2.5rem] z-10 pointer-events-none"></div>
          <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 relative z-0 flex flex-col md:flex-row">
            <div className="p-8 md:p-12 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-wider text-xs">
                <Bot className="w-4 h-4"/> AI Matching Engine
              </div>
              <h3 className="text-3xl text-white font-display font-bold mb-4">Matching made effortless</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our AI precisely analyzes your academic background, region, and degree to instantly align you with high-probability opportunities worldwide.</p>
            </div>
            <div className="p-8 md:p-12 md:w-2/3 bg-slate-900/50 flex flex-col gap-4 overflow-hidden relative">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
              {[
                { icon: BookOpen, title: "Global Excellence Award", amt: "$50,000", match: "99% Match", delay: 0.6 },
                { icon: GraduationCap, title: "Women in STEM Grant", amt: "Full Tuition", match: "97% Match", delay: 0.7 },
                { icon: Clock, title: "Future Innovators Scholarship", amt: "$15,000", match: "92% Match", delay: 0.8 },
              ].map((item, i) => (
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay, duration: 0.5 }}
                    key={i}
                    className="bg-slate-800/80 border border-slate-700/50 p-5 rounded-2xl flex items-center justify-between shadow-lg"
                 >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-700 p-3 rounded-xl text-indigo-300">
                        <item.icon className="w-5 h-5"/>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">{item.title}</h4>
                        <p className="text-slate-400 text-xs font-semibold">{item.amt}</p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30">
                      {item.match}
                    </div>
                 </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight mb-3">120<span className="text-indigo-600">+</span></div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Countries Tracked</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight mb-3">5k<span className="text-indigo-600">+</span></div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Active Programs</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight mb-3">$2B<span className="text-indigo-600">+</span></div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Funds Available</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight mb-3">24<span className="text-indigo-600">/7</span></div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Real-Time Updates</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-slate-50 relative z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 mb-6 tracking-tight">How It Works</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">Three extremely simple steps to secure your educational funding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: User, title: "1. Build Your Profile", desc: "Share your academic background, region, and aspirations. We take care of finding what fits you best." },
              { icon: CheckCircle, title: "2. Get Machine Matched", desc: "Our agent monitors thousands of programs daily to surface only the grants you are highly likely to win." },
              { icon: Clock, title: "3. Never Miss a Deadline", desc: "Receive automated alerts containing direct application links, requirements, and crucial reminders." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-white rounded-[2.5rem] p-12 text-center relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="relative z-10">
                  <div className="bg-slate-50 text-indigo-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 transform group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-slate-100">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">Student Success Stories</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">Join thousands of students who have successfully funded their education through our platform.</p>
            </div>
            
            <div className="relative h-80 max-w-3xl mx-auto flex justify-center items-center">
              <AnimatePresence mode="wait">
                {reviews.length > 0 && (
                  <motion.div
                    key={currentReviewIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white border border-slate-100 p-10 md:p-12 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center"
                  >
                    <div className="flex text-yellow-400 mb-6 gap-1">
                       {[...Array(reviews[currentReviewIndex]?.rating || 5)].map((_, j) => <Star key={j} className="w-6 h-6 fill-current" />)}
                    </div>
                    <p className="text-slate-700 italic mb-8 leading-relaxed text-xl max-w-2xl">"{reviews[currentReviewIndex]?.comment}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl shadow-sm">
                        {reviews[currentReviewIndex]?.userName?.[0] || 'U'}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{reviews[currentReviewIndex]?.userName}</h4>
                        <p className="text-slate-500 font-medium">{reviews[currentReviewIndex]?.userCountry}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute -bottom-8 flex gap-2">
                {reviews.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentReviewIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === currentReviewIndex ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            </div>

            {user && (
              <div className="mt-24 max-w-2xl mx-auto bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-6 text-center">Share Your Experience</h3>
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className={`p-2 rounded-xl transition-all ${rating >= num ? 'text-yellow-400 bg-yellow-50' : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-50'}`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
                    <textarea 
                      required
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Tell us how ScholarSphere helped you..."
                      className="w-full text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow min-h-[120px] resize-none pb-12 bg-slate-50 relative"
                    ></textarea>
                    <div className="flex justify-end -mt-12 mr-2 relative z-10">
                      <button 
                         disabled={submittingReview}
                         type="submit" 
                         className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg shadow-md transition-all disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        </section>
      )}
    </div>
  );
}
