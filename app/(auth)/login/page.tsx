'use client';

import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('🔐 Starting Google OAuth...');
      console.log('🔐 Redirect URL:', `${window.location.origin}/auth/callback`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('❌ OAuth error:', error);
        throw error;
      }
      
      console.log('✅ OAuth initiated successfully');
    } catch (err: any) {
      console.error('💥 Login error:', err);
      setError(err.message || 'Помилка Google входу');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/20 blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>

        {/* Animated Waves */}
        <svg className="absolute bottom-0 left-0 w-full h-64 opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="url(#wave-gradient)" 
            fillOpacity="0.3" 
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                      M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                      M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">TeacherPlan</h1>
              <p className="text-xs text-gray-400">AI Platform</p>
            </div>
          </a>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">З поверненням!</h2>
            <p className="text-gray-400 text-sm">Увійдіть, щоб продовжити роботу</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 mb-6"
          >
            <Chrome size={20} className="text-white" />
            <span className="font-medium">Продовжити з Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/50 text-gray-400">або</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5" />
                Запам'ятати мене
              </label>
              <a href="#" className="text-amber-400 hover:text-amber-300 transition">
                Забули пароль?
              </a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Входимо...
                </>
              ) : (
                <>
                  Увійти
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <p>
            Ще немає акаунту?{' '}
            <a href="/register" className="text-amber-400 hover:text-amber-300 transition font-medium">
              Зареєструватись
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">
            ← Повернутись на головну
          </a>
        </div>
      </div>
    </div>
  );
}