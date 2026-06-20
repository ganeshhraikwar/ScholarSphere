import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Bookmark, GraduationCap, Clock, BadgeCent, Share2, ArrowUp, Mic } from 'lucide-react';
import type { Scholarship, User } from '../types';
import { COUNTRIES, getThemeForCountry } from '../utils/countries';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function SearchPage({ user }: { user?: User | null }) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const { t } = useTranslation();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<Set<number>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [filters, setFilters] = useState({
    country: 'All',
    degreeLevel: 'All'
  });

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchString(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchScholarships = async (p: number = page) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ ...filters, page: p.toString() });
      if (searchString) q.set('search', searchString);
      const res = await fetch(`/api/scholarships?${q.toString()}`);
      const data = await res.json();
      setScholarships(data.items || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedScholarships = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}/saved`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedScholarshipIds(new Set(data.map((s: Scholarship) => s.id)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchScholarships(1);
  }, [filters]);

  useEffect(() => {
    fetchSavedScholarships();
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setPage(1);
     fetchScholarships(1);
  };

  const handleShare = (s: Scholarship) => {
    const url = `${window.location.origin}/search?search=${encodeURIComponent(s.title)}`;
    navigator.clipboard.writeText(url);
    setToastMessage("Link copied to clipboard!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSave = async (id: number) => {
    if(!user) return alert("Please login to save scholarships");
    
    const isSaved = savedScholarshipIds.has(id);
    const endpoint = isSaved ? `/api/users/${user.id}/unsave` : `/api/users/${user.id}/save`;

    try {
      await fetch(endpoint, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ scholarshipId: id })
      });
      
      setSavedScholarshipIds(prev => {
        const next = new Set(prev);
        if (isSaved) {
          next.delete(id);
          setToastMessage("Scholarship removed from your saved list.");
        } else {
          next.add(id);
          setToastMessage("Scholarship saved successfully! Check your Dashboard.");
        }
        setTimeout(() => setToastMessage(null), 3000);
        return next;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const currentTheme = getThemeForCountry(filters.country);

  return (
    <div className="relative min-h-screen">
      <SEO title="Search Scholarships" description="Filter and find the best scholarships, grants, and financial aid matching your unique profile and goals." />
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Bookmark className="w-5 h-5 fill-current" />
          {toastMessage}
        </div>
      )}
      <div className={`fixed inset-0 bg-slate-50 transition-colors duration-1000 -z-10`} />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} />
      </div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
       <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-6 tracking-tight">Discover Scholarships</h1>
          <p className="text-xl text-slate-500 font-light">Browse through hundreds of verified global scholarships and find the ones that perfectly match your profile.</p>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
           {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-28">
                <div className="flex items-center gap-3 font-bold font-display text-xl text-slate-900 mb-8">
                   <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                     <Filter className="w-5 h-5" />
                   </div>
                   Filter By
                </div>
                
                <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Country</label>
                     <div className="relative">
                       <select 
                         value={filters.country} 
                         onChange={e => setFilters({...filters, country: e.target.value})}
                         className="w-full appearance-none border border-slate-200 rounded-2xl bg-slate-50 px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700 hover:border-slate-300"
                       >
                         {COUNTRIES.map(c => (
                           <option key={c} value={c === 'Global (All)' ? 'All' : c}>{c}</option>
                         ))}
                       </select>
                       <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Degree Level</label>
                     <div className="relative">
                       <select 
                         value={filters.degreeLevel} 
                         onChange={e => setFilters({...filters, degreeLevel: e.target.value})}
                         className="w-full appearance-none border border-slate-200 rounded-2xl bg-slate-50 px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700 hover:border-slate-300"
                       >
                          <option value="All">All Levels</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Postgraduate">Postgraduate</option>
                          <option value="Ph.D">Ph.D</option>
                       </select>
                       <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
             <form onSubmit={handleSearchSubmit} className="mb-10 relative flex gap-4">
                 <div className="relative flex-1 group">
                     <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Search className="h-6 w-6" />
                     </div>
                     <input 
                       type="text" 
                       value={searchString}
                       onChange={(e) => setSearchString(e.target.value)}
                       placeholder="Search global scholarships by title, keyword, or course..."
                       className="w-full pl-16 pr-16 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-900 outline-none transition-all text-lg font-medium placeholder:text-slate-400 placeholder:font-normal"
                     />
                     <button
                        type="button"
                        onClick={handleVoiceSearch}
                        className={`absolute inset-y-0 right-2 pr-6 flex items-center ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-indigo-600 transition-colors'}`}
                        title="Search by voice"
                     >
                        <Mic className="h-6 w-6" />
                     </button>
                 </div>
                 <button type="submit" className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-bold font-sans hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap hidden sm:block text-lg">
                    Search
                 </button>
             </form>

             <div className="flex justify-between items-center mb-8">
                <div className="text-sm text-slate-500 font-semibold bg-white border border-slate-200 px-5 py-2 rounded-full shadow-sm">
                   {t('search.results') || 'Showing'} <span className="text-slate-900 font-bold">{totalCount.toLocaleString()}</span> {t('search.scholarships') || 'scholarships'}
                </div>
             </div>
             
             {loading ? (
                <div className="space-y-6">
                   {[1, 2, 3].map((n) => (
                     <div key={n} className="bg-white p-8 border border-slate-100 rounded-[2rem] animate-pulse flex flex-col md:flex-row gap-8 relative shadow-sm">
                        <div className="flex-1">
                           <div className="h-8 bg-slate-100 rounded-xl w-3/4 mb-4"></div>
                           <div className="h-4 bg-slate-100 rounded-lg w-1/3 mb-8"></div>
                           <div className="flex flex-wrap gap-3 mb-8">
                              <div className="h-10 bg-slate-100 rounded-xl w-24"></div>
                              <div className="h-10 bg-slate-100 rounded-xl w-32"></div>
                              <div className="h-10 bg-slate-100 rounded-xl w-28"></div>
                           </div>
                           <div className="h-24 bg-slate-100 rounded-2xl w-full"></div>
                        </div>
                        <div className="md:w-48 flex flex-col justify-end">
                           <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
                        </div>
                     </div>
                   ))}
                </div>
             ) : scholarships.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-20 text-center text-slate-500">
                   <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Search className="w-10 h-10 text-slate-400" />
                   </div>
                   <p className="text-2xl font-bold text-slate-900 mb-3 font-display">No matches found</p>
                   <p className="text-slate-500 mb-8 max-w-sm mx-auto">Try adjusting your filters or search terms to find more opportunities.</p>
                   <button onClick={() => { setFilters({country:'All', degreeLevel:'All'}); setSearchString(''); }} className="bg-indigo-50 text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-100 transition-colors">Clear Filters</button>
                </div>
             ) : (
                <div className="space-y-6">
                   {scholarships.map((s, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: (i % 10) * 0.05 }}
                        key={s.id} 
                        className="bg-white p-8 md:p-10 border border-slate-100 hover:border-indigo-100/50 transition-all flex flex-col md:flex-row gap-8 relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 rounded-[2.5rem]"
                      >
                         <div className="absolute top-8 right-8 flex gap-3">
                            <button 
                               onClick={() => handleShare(s)} 
                               className="transition-all p-3 rounded-full border shadow-sm transform hover:scale-110 text-slate-400 hover:text-indigo-600 bg-white border-slate-100 hover:border-indigo-100"
                               title="Share Scholarship"
                            >
                               <Share2 className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleToggleSave(s.id)} 
                                className={`transition-all p-3 rounded-full border shadow-sm transform hover:scale-110 ${savedScholarshipIds.has(s.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'text-slate-400 hover:text-indigo-600 bg-white border-slate-100 hover:border-indigo-100'}`}
                                title={savedScholarshipIds.has(s.id) ? "Unsave Scholarship" : "Save Scholarship"}
                             >
                                <Bookmark className={`w-5 h-5 ${savedScholarshipIds.has(s.id) ? 'fill-current' : ''}`} />
                             </button>
                          </div>
                         
                         <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold font-display text-slate-900 pr-24 mb-3 leading-tight group-hover:text-indigo-900 transition-colors">{s.title || (s as any).name}</h3>
                            <p className="text-slate-500 font-semibold mb-8 tracking-wide uppercase text-sm flex items-center gap-2">
                              <span>{s.provider}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                              <span>{s.country}</span>
                            </p>
                            
                            <div className="flex flex-wrap gap-3 text-sm mb-8">
                               <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 font-semibold">
                                  <BadgeCent className="w-5 h-5 text-emerald-500"/> 
                                  <span>{s.currency} {s.amount?.toLocaleString() || s.amount}</span>
                               </div>
                               <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 font-semibold">
                                  <GraduationCap className="w-5 h-5 text-indigo-500"/> 
                                  <span>{s.degreeLevel || s.course}</span>
                               </div>
                               <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 font-semibold">
                                  <Clock className="w-5 h-5 text-rose-500"/> 
                                  <span>{s.deadline}</span>
                               </div>
                            </div>

                            <div className="text-sm text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100 leading-relaxed">
                               <span className="font-bold text-slate-900 block mb-2 uppercase tracking-tight text-xs">Eligibility Criteria</span> {s.eligibility}
                            </div>
                         </div>
                         
                         <div className="md:w-56 flex flex-col justify-end mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <a href={s.applyLink} target="_blank" rel="noreferrer" className="w-full text-center bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-md flex justify-center items-center gap-2">
                               Apply Now
                            </a>
                         </div>
                      </motion.div>
                   ))}
                </div>
             )}

             {!loading && totalPages > 1 && (
               <div className="flex justify-center mt-12 gap-2">
                  <button 
                    onClick={() => { setPage(p => Math.max(1, p - 1)); fetchScholarships(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page === 1}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl disabled:opacity-50 font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-6 font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-2xl">
                     Page {page} of {totalPages}
                  </div>
                  <button 
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchScholarships(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page === totalPages}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl disabled:opacity-50 font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Next
                  </button>
               </div>
             )}
          </div>
       </div>
     </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all z-50 flex items-center justify-center"
            title="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
