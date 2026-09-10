'use client';

import React, { useState, useEffect } from 'react';
import { User, School, BookOpen, Award, Mail, Save, Loader, Gift, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

type ReferralInfo = {
  code: string;
  referralLink: string;
  pendingCount: number;
  rewardedCount: number;
};

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
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [referralLoading, setReferralLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
    loadReferral();
  }, []);

  const loadReferral = async () => {
    try {
      const res = await fetch('/api/referrals/me');
      const data = await res.json();
      if (data.success) {
        setReferral({
          code: data.code,
          referralLink: data.referralLink,
          pendingCount: data.pendingCount,
          rewardedCount: data.rewardedCount,
        });
      }
    } catch (error) {
      console.error('Error loading referral info:', error);
    } finally {
      setReferralLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!referral) return;
    try {
      await navigator.clipboard.writeText(referral.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const supabase = createClient();
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
      const supabase = createClient();
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
          Мій профіль
        </h1>
        <p className="text-slate-400">
          Заповни один раз — і ці дані самі підставлятимуться в кожен новий план, без повторного введення.
          На сторінці генерації їх завжди можна буде змінити для конкретного випадку.
        </p>
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
                placeholder="Наприклад: Коваленко Марія Іванівна"
              />
              <p className="text-xs text-slate-500 mt-2">
                Повністю, як на зразку: Прізвище Ім'я По батькові. У документі саме воно автоматично скоротиться до
                "Коваленко М.І." в підписі.
              </p>
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
                🏫 Повна офіційна назва закладу
              </label>
              <textarea
                value={profile.school_name}
                onChange={(e) => setProfile({ ...profile, school_name: e.target.value })}
                rows={3}
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder={
                  'Наприклад:\nЗолочівської селищної ради\nКомунальний заклад «Олександрівський ліцей»\nЗолочівської селищної ради'
                }
              />
              <p className="text-xs text-slate-500 mt-2">
                Візьми повну назву зі статуту закладу (засновник + повна назва). Можна написати одним рядком або
                перенести на кілька, як у зразку вище — на титульній сторінці плану вона автоматично зцентрується.
              </p>
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
              <p className="text-xs text-slate-500 mt-2">
                З'явиться в шапці плану так: "Вчитель предмету / Спеціаліст вищої категорії / ...". Немає категорії —
                просто лиши поле порожнім.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="pt-6 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <Gift size={20} className="text-cyan-400" />
            Запросити колег
          </h2>

          {referralLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader className="animate-spin" size={16} />
              Завантаження...
            </div>
          ) : referral ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Поділіться посиланням з колегами з методоб'єднання. Коли запрошений колега здійснить першу оплату,
                ви обидва отримаєте по 2 безкоштовні кредити.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referral.referralLink}
                  className="flex-1 bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold px-5 py-3 rounded-xl transition-all shrink-0"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Скопійовано' : 'Копіювати'}
                </button>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-slate-400">Запрошено, очікує оплати: </span>
                  <span className="text-white font-semibold">{referral.pendingCount}</span>
                </div>
                <div>
                  <span className="text-slate-400">Винагороджено: </span>
                  <span className="text-cyan-400 font-semibold">{referral.rewardedCount}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Не вдалося завантажити реферальне посилання. Спробуйте оновити сторінку.</p>
          )}
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
