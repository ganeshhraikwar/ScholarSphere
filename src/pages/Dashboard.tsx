import { useEffect, useState, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Bookmark, CheckCircle, Search, User as UserIcon, Calendar, ArrowRight, Bot, Lightbulb, Mail, Camera } from 'lucide-react';
import type { User, Scholarship } from '../types';
import confetti from 'canvas-confetti';
import SEO from '../components/SEO';

interface DashboardProps {
  user: User | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [saved, setSaved] = useState<Scholarship[]>([]);
  const [expired, setExpired] = useState<Scholarship[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(user?.isSubscribed || false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user?.id) {
       const savedPhoto = localStorage.getItem(`profile_photo_${user.id}`);
       if (savedPhoto) setProfilePhoto(savedPhoto);
       
       const storedApplied = localStorage.getItem(`applied_scholarships_${user.id}`);
       if (storedApplied) {
          setAppliedIds(new Set(JSON.parse(storedApplied)));
       }
    }
  }, [user]);

  const handleMarkApplied = (id: number) => {
    if (appliedIds.has(id)) return;
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#ec4899', '#f59e0b', '#10b981']
    });

    const newApplied = new Set(appliedIds);
    newApplied.add(id);
    setAppliedIds(newApplied);
    if (user?.id) {
       localStorage.setItem(`applied_scholarships_${user.id}`, JSON.stringify(Array.from(newApplied)));
    }
  };

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
       const w = videoRef.current.videoWidth;
       const h = videoRef.current.videoHeight;
       canvasRef.current.width = w;
       canvasRef.current.height = h;
       const ctx = canvasRef.current.getContext('2d');
       if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, w, h);
          const dataUrl = canvasRef.current.toDataURL('image/jpeg');
          setProfilePhoto(dataUrl);
          if (user?.id) {
             localStorage.setItem(`profile_photo_${user.id}`, dataUrl);
             window.dispatchEvent(new Event('profile_photo_updated'));
          }
       }
       stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
       const stream = videoRef.current.srcObject as MediaStream;
       stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const upcomingDeadlines = saved.filter(s => {
    if (!s.deadline) return false;
    const deadlineDate = new Date(s.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}/saved`)
        .then(r => r.json())
        .then(data => {
            if(Array.isArray(data)) setSaved(data)
        })
        .catch(console.error);
        
      fetch('/api/scholarships/expired')
        .then(r => r.json())
        .then(data => {
           if(Array.isArray(data)) setExpired(data)
        });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Dashboard" description="Manage your saved scholarships, track applications, and view your personalized scholarship recommendations." />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
         <div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-3">
               Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Here's your personal funding overview.</p>
         </div>
         <div className="flex gap-3">
            <Link to="/search" className="bg-white border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-sm transition-all transform hover:-translate-y-0.5 hover:shadow-md">
               <Search className="w-4 h-4"/> Browse Scholarships
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-indigo-600 text-white border border-indigo-500 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
           <div className="flex justify-between items-center mb-6 relative z-10">
             <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-sm border border-white/10"><CheckCircle className="w-6 h-6"/></div>
           </div>
           <div className="text-4xl font-black font-display mb-2 relative z-10 tracking-tight">90% Match</div>
           <div className="text-indigo-200 font-medium relative z-10 text-sm">Based on your {user.course} outline</div>
           <Link to="/search" className="mt-8 inline-flex items-center gap-2 text-sm font-bold bg-white text-indigo-700 px-6 py-3 rounded-xl transition-all shadow-md relative z-10 transform hover:-translate-y-1 hover:shadow-lg">
              Find Best Matches <ArrowRight className="w-4 h-4"/>
           </Link>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-[2rem] p-8">
           <div className="flex justify-between items-center mb-6">
             <div className="bg-orange-50 text-orange-600 border border-orange-100 p-3 rounded-2xl"><Calendar className="w-6 h-6"/></div>
           </div>
           <div className="text-4xl font-black font-display text-slate-900 mb-2 tracking-tight">{upcomingDeadlines.length} Due</div>
           <div className="text-slate-500 font-medium text-sm text-balance">Deadlines approaching in the next 30 days</div>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-[2rem] p-8">
           <div className="flex justify-between items-center mb-6">
             <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-3 rounded-2xl"><Bookmark className="w-6 h-6"/></div>
           </div>
           <div className="text-4xl font-black font-display text-slate-900 mb-2 tracking-tight">{saved.length} Saved</div>
           <div className="text-slate-500 font-medium text-sm text-balance">Scholarships currently bookmarked</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            {upcomingDeadlines.length > 0 && (
               <div>
                  <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2 mb-6">
                     <Bell className="w-6 h-6 text-orange-500" />
                     Action Required: Upcoming Deadlines
                  </h2>
                  <div className="space-y-4">
                     {upcomingDeadlines.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map((s, i) => {
                        const daysLeft = Math.ceil((new Date(s.deadline).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 3600 * 24));
                        return (
                           <motion.div 
                              key={s.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-10px" }}
                              transition={{ duration: 0.4, delay: i * 0.1 }}
                              className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 transform"
                           >
                              <div>
                                 <h3 className="font-bold text-orange-900 text-lg">{s.title || (s as any).name}</h3>
                                 <p className="text-orange-700 font-medium text-sm">{s.provider} &bull; Deadline: {s.deadline}</p>
                              </div>
                              <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                                 <div className="bg-white text-orange-600 font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm border border-orange-100 whitespace-nowrap">
                                    {daysLeft === 0 ? 'Today' : `${daysLeft} days left`}
                                 </div>
                                 {appliedIds.has(s.id) ? (
                                    <div className="bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm border border-green-200 whitespace-nowrap flex items-center gap-1">
                                       <CheckCircle className="w-4 h-4" /> Applied
                                    </div>
                                 ) : (
                                    <button 
                                      onClick={() => handleMarkApplied(s.id)}
                                      className="bg-white hover:bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm border border-blue-200 whitespace-nowrap flex items-center gap-1 transition-colors"
                                    >
                                       <CheckCircle className="w-4 h-4" /> Mark
                                    </button>
                                 )}
                                 <a href={s.applyLink} target="_blank" rel="noreferrer" className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-xl transition-colors shadow-sm flex items-center justify-center">
                                    <ArrowRight className="w-5 h-5" />
                                 </a>
                              </div>
                           </motion.div>
                        );
                     })}
                  </div>
               </div>
            )}

            <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
               <Bookmark className="w-6 h-6 text-indigo-600" />
               Your Saved Scholarships
            </h2>
            {saved.length === 0 ? (
               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-16 text-center text-slate-500 shadow-sm">
                  <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="font-medium text-xl text-slate-900 mb-2">You haven't saved any scholarships yet.</p>
                  <p className="text-slate-500 mb-6">Get started by browsing our database.</p>
                  <Link to="/search" className="bg-indigo-50 text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-100 transition-colors inline-block text-sm">Go discover some</Link>
               </div>
            ) : (
               <div className="space-y-5">
                  {saved.map((s, i) => (
                      <motion.div 
                         key={s.id}
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, margin: "-50px" }}
                         transition={{ duration: 0.5, delay: (i % 10) * 0.05 }}
                         className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center hover:border-indigo-200 hover:shadow-lg transition-all group relative hover:-translate-y-1"
                      >
                         <button 
                             onClick={async () => {
                                try {
                                   await fetch(`/api/users/${user.id}/unsave`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ scholarshipId: s.id })
                                   });
                                   setSaved(prev => prev.filter(item => item.id !== s.id));
                                } catch(e) { console.error(e); }
                             }}
                             className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-white border border-slate-200 shadow-sm rounded-full transform hover:scale-110"
                             title="Remove from saved"
                         >
                            <Bookmark className="w-4 h-4 fill-current" />
                         </button>

                         <div className="pr-12 lg:pr-4">
                            <h3 className="font-bold font-display text-slate-900 text-2xl mb-2">{s.title || (s as any).name}</h3>
                            <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs mb-4 flex items-center gap-2">
                              <span>{s.provider}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>{s.country}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                               <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-xl font-bold border border-emerald-100">{s.currency} {s.amount?.toLocaleString() || s.amount}</span>
                               <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1.5 rounded-xl font-bold border border-rose-100">Deadline: {s.deadline}</span>
                            </div>
                         </div>
                         <div className="flex flex-col sm:flex-row gap-3 shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                            {appliedIds.has(s.id) ? (
                               <div className="bg-emerald-50 text-emerald-700 px-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-emerald-200">
                                  <CheckCircle className="w-4 h-4" /> Applied
                               </div>
                            ) : (
                               <button 
                                 onClick={() => handleMarkApplied(s.id)}
                                 className="bg-white border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 px-6 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 transform group-hover:-translate-y-0.5"
                               >
                                 <CheckCircle className="w-4 h-4" /> Mark Applied
                               </button>
                            )}
                            <a href={s.applyLink} target="_blank" rel="noreferrer" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 transform group-hover:-translate-y-0.5 whitespace-nowrap">
                               Apply <ArrowRight className="w-4 h-4" />
                            </a>
                         </div>
                      </motion.div>
                   ))}
               </div>
            )}

            {expired.length > 0 && (
               <div className="mt-12">
                  <h2 className="text-xl font-bold font-display text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                     Recently Expired
                  </h2>
                  <div className="space-y-4 opacity-70 grayscale">
                     {expired.slice(0,3).map((s, i) => (
                        <motion.div 
                           key={s.id} 
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true, margin: "-10px" }}
                           transition={{ duration: 0.4, delay: i * 0.1 }}
                           className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                        >
                           <div>
                              <h3 className="font-bold text-slate-800 text-lg line-through">{s.title}</h3>
                              <p className="text-slate-500 text-xs font-semibold uppercase mb-3">{s.provider} &bull; {s.country}</p>
                              <div className="flex gap-2">
                                 <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-lg font-bold border border-slate-200">Expired: {s.deadline}</span>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            )}
         </div>

         <div className="space-y-10">
            <div>
               <h2 className="text-2xl font-bold font-display text-slate-900 mb-6 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-indigo-500" />
                  Your Profile Photo
               </h2>
               <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8 flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center border-4 border-white shadow-md mb-6 ring-1 ring-slate-100">
                     {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        <UserIcon className="w-12 h-12 text-slate-300" />
                     )}
                     {!isCameraOpen && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold backdrop-blur-sm" onClick={openCamera}>
                           Update Photo
                        </div>
                     )}
                  </div>
                  
                  {isCameraOpen ? (
                     <div className="w-full flex flex-col items-center gap-5">
                        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                           <video ref={videoRef} className="w-full h-auto" autoPlay playsInline muted />
                        </div>
                        <div className="flex gap-3 w-full">
                           <button onClick={capturePhoto} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                              Capture
                           </button>
                           <button onClick={stopCamera} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                              Cancel
                           </button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                     </div>
                  ) : (
                     <button onClick={openCamera} className="bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm w-full">
                        <Camera className="w-4 h-4" /> Capture Photo
                     </button>
                  )}
               </div>
            </div>

            <div>
               <h2 className="text-2xl font-bold font-display text-slate-900 mb-6 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-indigo-500" />
                  Profile Completion
               </h2>
               <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8">
                  <div className="flex justify-between items-end mb-4">
                     <span className="text-4xl font-extrabold font-display text-slate-900 tracking-tight">{Math.round(((user as any).marks ? 1 : 0) * 15 + ((user as any).mobile ? 1 : 0) * 10 + ((user as any).skills ? 1 : 0) * 15 + ((user as any).extracurriculars ? 1 : 0) * 20 + 40)}%</span>
                     <span className="text-indigo-700 font-bold text-sm bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">{Math.round(((user as any).marks ? 1 : 0) * 15 + ((user as any).mobile ? 1 : 0) * 10 + ((user as any).skills ? 1 : 0) * 15 + ((user as any).extracurriculars ? 1 : 0) * 20 + 40) === 100 ? 'All Set!' : 'Needs Work'}</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-3 mb-8 overflow-hidden border border-slate-100">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.round(((user as any).marks ? 1 : 0) * 15 + ((user as any).mobile ? 1 : 0) * 10 + ((user as any).skills ? 1 : 0) * 15 + ((user as any).extracurriculars ? 1 : 0) * 20 + 40)}%` }}></div>
                  </div>
                  
                  {(!user.marks || !(user as any).extracurriculars || !(user as any).testScores) && (
                     <div>
                        <p className="text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">Missing Information:</p>
                        <div className="space-y-3">
                           {!user.marks && (
                              <div className="flex items-start gap-4 p-4 bg-white border border-red-100 hover:border-red-200 rounded-2xl relative group transition-colors shadow-sm">
                                 <div className="bg-red-50 p-2 rounded-xl text-red-500 shrink-0"><Lightbulb className="w-5 h-5" /></div>
                                 <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">GPA / Academic Marks</p>
                                    <p className="text-xs text-slate-500 mt-1 mb-2">Enhances match for Merit-based scholarships.</p>
                                 </div>
                                 <button className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors self-center border border-red-100">Add</button>
                              </div>
                           )}
                           {!(user as any).extracurriculars && (
                              <div className="flex items-start gap-4 p-4 bg-white border border-orange-100 hover:border-orange-200 rounded-2xl relative group transition-colors shadow-sm">
                                 <div className="bg-orange-50 p-2 rounded-xl text-orange-500 shrink-0"><Lightbulb className="w-5 h-5" /></div>
                                 <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">Extracurriculars</p>
                                    <p className="text-xs text-slate-500 mt-1 mb-2">Required for leadership & community grants.</p>
                                 </div>
                                 <button className="text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors self-center border border-orange-100">Add</button>
                              </div>
                           )}
                           {!(user as any).testScores && (
                              <div className="flex items-start gap-4 p-4 bg-white border border-blue-100 hover:border-blue-200 rounded-2xl relative group transition-colors shadow-sm">
                                 <div className="bg-blue-50 p-2 rounded-xl text-blue-500 shrink-0"><Lightbulb className="w-5 h-5" /></div>
                                 <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">Test Scores (SAT/ACT/IELTS)</p>
                                    <p className="text-xs text-slate-500 mt-1 mb-2">Crucial for international applications.</p>
                                 </div>
                                 <button className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors self-center border border-blue-100">Add</button>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div>
               <h2 className="text-2xl font-bold font-display text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-indigo-500" />
                  Global Checklist
               </h2>
               <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8 space-y-4">
                  {[
                     { name: "Valid Passport / ID Proof", done: true },
                     { name: "Academic Transcripts", done: true },
                     { name: "Statement of Purpose (SOP)", done: false },
                     { name: "2 Letters of Recommendation", done: false },
                     { name: "English Proficiency (IELTS)", done: false }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-200 text-transparent'}`}>
                           {item.done && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span className={`text-sm font-bold ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.name}</span>
                     </div>
                  ))}
                  <div className="mt-8 pt-8 border-t border-slate-100">
                     <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-2 mb-3">
                       <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                     </div>
                     <p className="text-xs font-bold text-slate-500 text-center uppercase tracking-wider mb-5">2 of 5 Documented</p>
                     <button className="w-full text-center bg-white border-2 border-slate-200 hover:border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold py-3.5 rounded-xl transition-all text-sm shadow-sm">
                        Manage Documents
                     </button>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-2xl font-bold font-display text-slate-900 mb-6 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-indigo-500" />
                  Email Digest
               </h2>
               <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8">
                  <p className="text-slate-500 mb-6 font-medium text-sm leading-relaxed">Join our mailing list to receive personalized weekly digests of new scholarships matching your specific major and preferences.</p>
                  {isSubscribed ? (
                     <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                        <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-emerald-900 mb-1">You are subscribed!</p>
                           <p className="text-xs text-emerald-700 font-medium mb-3">We'll send your matching scholarships to {user.email || 'your email'}.</p>
                           <button onClick={async () => {
                             try {
                               await fetch("/api/user/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, subscribe: false }) });
                               setIsSubscribed(false);
                             } catch (e) { console.error(e); }
                           }} className="text-xs font-bold text-slate-500 hover:text-red-600 underline transition-colors">Unsubscribe</button>
                        </div>
                     </div>
                  ) : (
                     <form onSubmit={async (e) => { 
                       e.preventDefault(); 
                       try {
                         await fetch("/api/user/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, subscribe: true }) });
                         setIsSubscribed(true); 
                       } catch (e) { console.error(e); }
                     }} className="space-y-5">
                        <div>
                           <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                           <input type="email" required defaultValue={user.email || ''} placeholder="you@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium text-slate-900 placeholder:text-slate-400 transition-all" />
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer group p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                           <input type="checkbox" required className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                           <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">Send me weekly updates about newly added scholarships that match my profile.</span>
                        </label>
                        <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-md text-sm transform hover:-translate-y-0.5">
                           Subscribe Now
                        </button>
                     </form>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
