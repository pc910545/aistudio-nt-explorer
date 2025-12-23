
import React, { useState, useEffect } from 'react';
import { 
  QUIZ_QUESTIONS, 
  BRANCH_QUESTIONS,
  TRANSPORT_OPTIONS, 
  PRICE_OPTIONS, 
  DURATION_OPTIONS, 
  TIME_OPTIONS,
  UI_STRINGS 
} from './constants';
import { UserPreferences } from './types';
import { getRecommendations, RecommendationCard } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [step, setStep] = useState<'welcome' | 'quiz' | 'filters' | 'loading' | 'results'>('welcome');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isBranching, setIsBranching] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    answers: [],
    transport: 'MRT',
    price: '$$',
    duration: '3-5h',
    timeOfDay: 'Anytime'
  });
  const [results, setResults] = useState<RecommendationCard[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [error, setError] = useState<string | null>(null);

  const t = UI_STRINGS[lang];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.warn("Location denied")
      );
    }
  }, []);

  const handleStart = () => {
    setCurrentQuizIndex(0);
    setIsBranching(false);
    setPreferences({ ...preferences, answers: [] });
    setStep('quiz');
  };

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = [...preferences.answers.filter(a => a.questionId !== questionId), { questionId, value }];
    setPreferences({ ...preferences, answers: newAnswers });

    if (!isBranching) {
      if (questionId === 'social') {
        setIsBranching(true);
        return;
      }
      
      if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
      }
    } else {
      setStep('filters');
    }
  };

  const fetchResults = async () => {
    setStep('loading');
    setError(null);
    try {
      const data = await getRecommendations(preferences, userLocation);
      setResults(data);
      setStep('results');
    } catch (err: any) {
      setError(lang === 'en' ? "Failed to load matches. Please try again." : "載入失敗，請稍後再試。");
      setStep('filters');
    }
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-in fade-in zoom-in duration-1000">
      <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl rotate-6 transition-transform hover:rotate-0 cursor-default">
        <i className="fas fa-mountain-sun text-white text-5xl"></i>
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
        {t.welcomeTitle}
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold text-indigo-600/80 mb-10">
        {t.welcomeSubtitle}
      </h2>
      <p className="text-slate-500 max-w-xl mb-14 leading-relaxed text-lg font-medium">
        {t.welcomeDesc}
      </p>
      <button
        onClick={handleStart}
        className="px-16 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl transition-all transform hover:scale-105 shadow-2xl shadow-indigo-300 uppercase tracking-[0.2em] text-lg"
      >
        {t.startBtn}
      </button>
    </div>
  );

  const renderQuiz = () => {
    const socialAnswer = preferences.answers.find(a => a.questionId === 'social')?.value;
    const q = isBranching 
      ? (socialAnswer === 'solo' ? BRANCH_QUESTIONS.solo : BRANCH_QUESTIONS.group)
      : QUIZ_QUESTIONS[currentQuizIndex];
    
    const progress = isBranching ? 100 : ((currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 85;

    return (
      <div className="max-w-2xl mx-auto py-16 px-4 animate-in slide-in-from-bottom-8 duration-700">
        <div className="mb-14">
          <div className="flex justify-between items-end mb-4">
            <span className="text-indigo-600 font-black uppercase text-xs tracking-widest">{t.question} {isBranching ? '+' : currentQuizIndex + 1}</span>
            <span className="text-slate-300 font-black text-xs uppercase tracking-widest">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full p-1 shadow-inner">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
          
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 leading-[1.1] tracking-tighter relative z-10">
            {lang === 'en' ? q.questionEn : q.questionZh}
          </h3>

          <div className="grid gap-6 relative z-10">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(q.id, opt.value)}
                className="w-full p-8 text-left border-2 border-slate-100 rounded-[2rem] hover:border-indigo-600 hover:bg-indigo-50/50 transition-all group flex items-center justify-between bg-slate-50/30"
              >
                <span className="text-2xl font-black text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {lang === 'en' ? opt.labelEn : opt.labelZh}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 group-hover:border-indigo-600 group-hover:rotate-90 transition-all flex items-center justify-center shrink-0">
                  <i className="fas fa-plus text-slate-300 group-hover:text-indigo-600 text-sm"></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="max-w-5xl mx-auto py-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">{t.refineTitle}</h3>
        <p className="text-slate-500 text-xl font-medium">{t.refineSubtitle}</p>
      </div>

      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-50 grid md:grid-cols-2 gap-16">
        {[
          { icon: 'train', label: t.transport, options: TRANSPORT_OPTIONS, key: 'transport', color: 'indigo' },
          { icon: 'coins', label: t.price, options: PRICE_OPTIONS, key: 'price', color: 'emerald' },
          { icon: 'hourglass-half', label: t.duration, options: DURATION_OPTIONS, key: 'duration', color: 'orange' },
          { icon: 'cloud-moon', label: t.timeOfDay, options: TIME_OPTIONS, key: 'timeOfDay', color: 'purple' }
        ].map(filter => (
          <div key={filter.key} className="group">
            <label className="block text-slate-900 font-black text-xl mb-6 flex items-center group-hover:translate-x-1 transition-transform">
              <span className={`w-10 h-10 rounded-2xl bg-${filter.color}-100 text-${filter.color}-600 flex items-center justify-center mr-4 shadow-sm`}>
                <i className={`fas fa-${filter.icon} text-sm`}></i>
              </span>
              {filter.label}
            </label>
            <div className="flex flex-wrap gap-4">
              {filter.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setPreferences({ ...preferences, [filter.key]: opt })}
                  className={`px-7 py-4 rounded-[1.25rem] font-black transition-all border-2 text-sm uppercase tracking-widest ${preferences[filter.key as keyof UserPreferences] === opt ? `border-${filter.color}-600 bg-${filter.color}-600 text-white shadow-xl shadow-${filter.color}-100` : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center">
        {error && <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl mb-8 font-bold border border-red-100 animate-bounce">{error}</div>}
        <button
          onClick={fetchResults}
          className="w-full md:w-auto px-20 py-7 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-[2rem] transition-all transform hover:scale-105 shadow-2xl hover:shadow-indigo-200 text-xl uppercase tracking-[0.2em]"
        >
          {t.findBtn}
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-[1400px] mx-auto py-20 px-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
        <div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-none">{t.resultsTitle}</h2>
          <div className="flex flex-wrap gap-3">
            {preferences.answers.map(ans => (
              <span key={ans.questionId} className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                {ans.value}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setStep('welcome')} 
          className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95"
        >
          <i className="fas fa-arrow-left text-sm"></i> {t.restartBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {results.map((card, idx) => (
          <div key={idx} className="group bg-white rounded-[3.5rem] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] transition-all duration-700 transform hover:-translate-y-4 border border-slate-50 flex flex-col h-full relative">
            <div className="relative h-96 overflow-hidden bg-slate-100">
              <img 
                src={`https://loremflickr.com/800/1000/taiwan,${encodeURIComponent(card.imageKeyword)}/all?lock=${idx}`}
                alt={card.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                loading="lazy"
                onError={(e) => {
                  (e.target as any).src = "https://images.unsplash.com/photo-1549247796-5d8f09e9034b?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              
              <div className="absolute top-8 right-8 bg-white/95 backdrop-blur px-5 py-2.5 rounded-3xl shadow-2xl flex items-center gap-2">
                <i className="fas fa-star text-amber-500 text-sm"></i>
                <span className="font-black text-slate-900 text-lg">{card.rating}</span>
              </div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <span className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl inline-block mb-4">
                  {card.category}
                </span>
                <h3 className="text-3xl font-black text-white leading-tight mb-2 group-hover:translate-x-1 transition-transform">
                  {lang === 'zh' ? card.nameZh : card.nameEn}
                </h3>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest">
                  {lang === 'zh' ? card.nameEn : card.nameZh}
                </p>
              </div>
            </div>

            <div className="p-10 flex-1 flex flex-col justify-between">
              <div className="mb-10">
                <p className="text-slate-500 text-lg font-bold leading-relaxed italic border-l-8 border-indigo-600 pl-6 py-2">
                  "{lang === 'zh' ? card.highlightZh : card.highlightEn}"
                </p>
              </div>
              
              <a 
                href={card.mapUri} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full py-6 bg-slate-950 hover:bg-indigo-600 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-4 group/btn shadow-xl shadow-slate-200 hover:shadow-indigo-200"
              >
                <i className="fas fa-diamond-turn-right text-lg group-hover/btn:translate-x-1 transition-transform"></i>
                {t.viewOnMaps}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 font-['Inter',_'Noto_Sans_TC'] selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-10 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setStep('welcome')}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-[15deg] transition-all duration-500">
              <i className="fas fa-location-arrow text-white text-xl"></i>
            </div>
            <span className="font-black text-3xl tracking-tighter text-slate-900 uppercase">
              {t.brand}
            </span>
          </div>

          <div className="flex bg-slate-100/50 p-2 rounded-[1.5rem] shadow-inner border border-slate-100">
            <button 
              onClick={() => setLang('en')}
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'en' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('zh')}
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${lang === 'zh' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              繁中
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {step === 'welcome' && renderWelcome()}
        {step === 'quiz' && renderQuiz()}
        {step === 'filters' && renderFilters()}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in duration-1000">
            <div className="relative mb-16">
              <div className="w-32 h-32 border-[12px] border-indigo-50 rounded-full"></div>
              <div className="w-32 h-32 border-[12px] border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 shadow-2xl shadow-indigo-200"></div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{t.loadingTitle}</h3>
            <div className="flex items-center gap-3 text-indigo-600 font-black uppercase text-sm tracking-[0.3em] animate-pulse">
              <i className="fas fa-sparkles"></i>
              {t.loadingSubtitle}
              <i className="fas fa-sparkles"></i>
            </div>
          </div>
        )}
        {step === 'results' && renderResults()}
      </main>

      <footer className="bg-white border-t border-slate-100 py-24 px-10 mt-20">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-location-arrow text-white text-sm"></i>
              </div>
              <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase">{t.brand}</span>
            </div>
            <p className="max-md text-slate-400 font-bold text-lg leading-relaxed mb-10">
              {t.footerDesc}
            </p>
            <div className="flex gap-6">
              {['facebook-f', 'instagram', 'threads', 'youtube'].map(social => (
                <a key={social} href="#" className="w-14 h-14 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-2xl hover:-translate-y-2">
                  <i className={`fab fa-${social} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-slate-900 font-black uppercase text-sm tracking-[0.2em] mb-10">{t.destinations}</h5>
            <ul className="space-y-6 text-slate-400 font-black text-xs uppercase tracking-widest">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> Taipei / 台北
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> New Taipei / 新北
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> Keelung / 基隆
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> Taoyuan / 桃園
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-slate-900 font-black uppercase text-sm tracking-[0.2em] mb-10">{t.about}</h5>
            <ul className="space-y-6 text-slate-400 font-black text-xs uppercase tracking-widest">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy & Safety</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">API Connectivity</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Business Inquiry</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Help Center</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto border-t border-slate-50 mt-24 pt-10 text-[10px] text-center font-black text-slate-300 uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} Northern Taiwan Explorer &bull; AI Powered Travel Platform
        </div>
      </footer>
    </div>
  );
};

export default App;
