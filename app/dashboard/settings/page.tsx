'use client';

import React, { useState, useEffect } from 'react';
import { User, School, BookOpen, Award, Mail, Save, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    school_name: '',
    subject: '',
    teacher_category: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return;

      setUser(authUser);
      
      // Try to load profile from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || authUser.user_metadata?.full_name || '',
          email: authUser.email || '',
          school_name: data.school_name || '',
          subject: data.subject || '',
          teacher_category: data.teacher_category || '',
        });
      } else {
        // Set default values from auth metadata
        setProfile({
          full_name: authUser.user_metadata?.full_name || '',
          email: authUser.email || '',
          school_name: '',
          subject: '',
          teacher_category: '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return;

      // Update or insert profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          full_name: profile.full_name,
          email: profile.email,
          school_name: profile.school_name,
          subject: profile.subject,
          teacher_category: profile.teacher_category,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert('✅ Налаштування збережено успішно!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('❌ Помилка збереження: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-2">
          Налаштування профілю
        </h1>
        <p className="text-slate-400">Керуйте вашою особистою інформацією</p>
      </div>

      {/* Profile Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Personal Info */}
        <div>
          <h2 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <User size={20} className="text-cyan-400" />
            Особиста інформація
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                👤 Повне ім'я
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="Ваше повне ім'я"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-slate-700/30 border-2 border-slate-600/50 rounded-xl px-4 py-3.5 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-2">Email не можна змінити</p>
            </div>
          </div>
        </div>

        {/* School Info */}
        <div className="pt-6 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <School size={20} className="text-cyan-400" />
            Інформація про школу
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                🏫 Назва школи
              </label>
              <input
                type="text"
                value={profile.school_name}
                onChange={(e) => setProfile({ ...profile, school_name: e.target.value })}
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="Назва вашої школи"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                <Award size={16} className="inline mr-1" />
                Категорія вчителя
              </label>
              <div className="relative">
                <select
                  value={profile.teacher_category}
                  onChange={(e) => setProfile({ ...profile, teacher_category: e.target.value })}
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium appearance-none cursor-pointer hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="" className="bg-slate-800">Оберіть категорію</option>
                  <option value="спеціаліст" className="bg-slate-800">Спеціаліст</option>
                  <option value="спеціаліст II категорії" className="bg-slate-800">Спеціаліст II категорії</option>
                  <option value="спеціаліст I категорії" className="bg-slate-800">Спеціаліст I категорії</option>
                  <option value="спеціаліст вищої категорії" className="bg-slate-800">Спеціаліст вищої категорії</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-slate-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={20} />
                Збереження...
              </>
            ) : (
              <>
                <Save size={20} />
                Зберегти зміни
              </>
            )}
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-medium text-cyan-400 mb-3 uppercase tracking-wide">Інформація про акаунт</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-400">User ID:</span>
            <span className="text-slate-300 font-mono text-xs">{user?.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-400">Дата реєстрації:</span>
            <span className="text-slate-300">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('uk-UA') : '-'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Метод входу:</span>
            <span className="text-slate-300">
              {user?.app_metadata?.provider === 'google' ? '🔍 Google' : '📧 Email'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
