'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sparkles, FileText, Plus, Settings, CreditCard, LogOut, Zap, Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ ДОДАНО: стан для мобільного меню

  useEffect(() => {
    checkUser();
    loadCredits();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        loadCredits();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkUser = async () => {
    try {
      console.log('🔍 CheckUser: Starting...');
      console.log('🔍 Current URL:', window.location.href);
      console.log('🔍 Hash:', window.location.hash);
      
      // Спочатку перевіряємо чи є токени в hash (після OAuth redirect)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      console.log('🔍 Access token in hash?', !!accessToken);
      
      if (accessToken) {
        console.log('⏳ Waiting for Supabase to process tokens...');
        // Якщо є токени в hash, чекаємо поки Supabase їх обробить
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('🔍 Getting session from Supabase...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('🔍 Session result:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        error: error?.message 
      });
      
      if (!session) {
        console.log('❌ No session found, redirecting to login');
        router.push('/login');
      } else {
        console.log('✅ Session found! User:', session.user.email);
        setUser(session.user);
        // Очищаємо hash з URL після успішної автентифікації
        if (window.location.hash) {
          console.log('🧹 Cleaning hash from URL');
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } catch (error) {
      console.error('💥 Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setCredits(profile.credits || 0);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          {/* Animated background glow */}
          <div className="absolute inset-0 blur-3xl opacity-50">
            <div className="w-32 h-32 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
          {/* Spinner */}
          <div className="relative w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-cyan-500 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-teal-500 animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-5 bg-blue-500 animate-pulse" style={{animationDuration: '8s'}}></div>
      </div>

      {/* ✅ ДОДАНО: Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold text-white">TeacherPlan</span>
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ ДОДАНО: Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ ВИПРАВЛЕНО: Sidebar - адаптивний */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 shadow-2xl flex flex-col transition-all duration-300 z-50
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo - DesktopOnly */}
        <div className="hidden lg:block p-6 border-b border-slate-800/50">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TeacherPlan</h1>
              <p className="text-xs text-slate-400">← На головну</p>
            </div>
          </button>
        </div>

        {/* ✅ ДОДАНО: Mobile Spacer */}
        <div className="lg:hidden h-16"></div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a 
            href="/dashboard" 
            onClick={() => setSidebarOpen(false)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-medium">Генерувати</span>
          </a>

          <a 
            href="/dashboard/documents" 
            onClick={() => setSidebarOpen(false)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <FileText size={20} />
            <span className="font-medium">Мої документи</span>
          </a>

          <a 
            href="/dashboard/settings" 
            onClick={() => setSidebarOpen(false)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <Settings size={20} />
            <span className="font-medium">Налаштування</span>
          </a>

          <a 
            href="/dashboard/billing" 
            onClick={() => setSidebarOpen(false)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <CreditCard size={20} />
            <span className="font-medium">Кредити</span>
          </a>
        </nav>

        {/* Credits Balance Card */}
        <div className="p-4 border-t border-slate-800/50 space-y-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-4">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-cyan-400" />
                <p className="text-sm font-medium text-white">Ваш баланс</p>
              </div>
              
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-white">{credits}</span>
                <span className="text-sm text-slate-400">
                  {credits === 1 ? 'кредит' : credits < 5 ? 'кредити' : 'кредитів'}
                </span>
              </div>

              <button 
                onClick={() => {
                  router.push('/dashboard/billing');
                  setSidebarOpen(false);
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm py-2.5 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 font-medium"
              >
                Поповнити
              </button>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span>Вийти</span>
          </button>
        </div>
      </div>

      {/* ✅ ВИПРАВЛЕНО: Main Content - адаптивний margin */}
      <div className="lg:ml-64 min-h-screen flex flex-col pt-16 lg:pt-0">
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer with legal links */}
        <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400 text-center sm:text-left">
                © 2024 TeacherPlan. Всі права захищені.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <a href="/about" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Про нас
                </a>
                <a href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Умови використання
                </a>
                <a href="/privacy" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Конфіденційність
                </a>
                <a href="/refund" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Повернення коштів
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
