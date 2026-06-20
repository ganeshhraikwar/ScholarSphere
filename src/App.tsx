import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Search, Home as HomeIcon, CheckCircle, GraduationCap, Bot, Globe } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import HelpPage from './pages/HelpPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import { useState, useEffect } from 'react';
import type { User as UserType } from './types';
import { useTranslation } from 'react-i18next';

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem('scholarfind_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfilePhoto(localStorage.getItem(`profile_photo_${parsedUser.id}`));
    }

    const handlePhotoUpdate = () => {
      if (storedUser) {
        setProfilePhoto(localStorage.getItem(`profile_photo_${JSON.parse(storedUser).id}`));
      }
    };
    window.addEventListener('profile_photo_updated', handlePhotoUpdate);
    return () => window.removeEventListener('profile_photo_updated', handlePhotoUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('scholarfind_user');
    localStorage.removeItem('scholarfind_token');
    setUser(null);
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-transparent selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/70 backdrop-blur-3xl border-b border-white/80 sticky top-0 z-50 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                 <GraduationCap className="h-6 w-6 text-white" />
               </div>
               <span className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-slate-800 tracking-tight drop-shadow-sm">
                 ScholarSphere
               </span>
            </Link>
            
            <nav className="hidden md:flex space-x-1 bg-slate-100/50 p-1.5 rounded-2xl border border-white/60 shadow-inner">
              <Link to="/" className="text-slate-600 hover:text-indigo-700 hover:bg-white px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md">
                 <HomeIcon className="w-4 h-4" /> {t('navbar.dashboard') || 'Home'}
              </Link>
              <Link to="/search" className="text-slate-600 hover:text-indigo-700 hover:bg-white px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md">
                 <Search className="w-4 h-4" /> {t('navbar.search')}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="flex items-center justify-center w-10 h-10 text-slate-500 hover:text-indigo-700 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <Globe className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="p-2 flex flex-col gap-1">
                    <button onClick={() => changeLanguage('en')} className={`px-4 py-2 text-left text-sm rounded-xl hover:bg-slate-100 transition-colors ${i18n.language.startsWith('en') ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>English</button>
                    <button onClick={() => changeLanguage('hi')} className={`px-4 py-2 text-left text-sm rounded-xl hover:bg-slate-100 transition-colors ${i18n.language.startsWith('hi') ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>हिन्दी</button>
                    <button onClick={() => changeLanguage('es')} className={`px-4 py-2 text-left text-sm rounded-xl hover:bg-slate-100 transition-colors ${i18n.language.startsWith('es') ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}>Español</button>
                  </div>
                </div>
              </div>

              {!user ? (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-slate-600 font-semibold hover:text-indigo-700 px-4 py-2 text-sm transition-colors">{t('navbar.login') || 'Log in'}</Link>
                  <Link to="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-white ring-2 ring-transparent hover:ring-indigo-100" title="Account">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user.name.substring(0, 1).toUpperCase()}</span>
                    )}
                  </Link>
                  <button onClick={handleLogout} className="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm" title={t('navbar.logout')}>
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative pb-16">
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/login" element={<LoginPage setAuthUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/search" element={<SearchPage user={user} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 text-slate-600 py-16 text-center mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center flex-col items-center gap-4 mb-8">
            <div className="bg-indigo-50 p-3 rounded-2xl inline-block">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
            <span className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">ScholarSphere</span>
            <p className="max-w-md text-slate-500 font-medium">Connecting ambitious students worldwide with life-changing opportunities through intelligent AI discovery.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-sm font-semibold">
             <Link to="/about" className="text-slate-500 hover:text-indigo-600 transition-colors">About Us</Link>
             <Link to="/faq" className="text-slate-500 hover:text-indigo-600 transition-colors">Help & FAQ</Link>
             <Link to="/privacy" className="text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
             <Link to="/terms" className="text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
          
          <div className="text-sm font-medium text-slate-400">
            &copy; {new Date().getFullYear()} ScholarSphere. Built with Google AI Studio.
          </div>
        </div>
      </footer>
    </div>
  );
}

