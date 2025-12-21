'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, FileText, ShoppingCart, Loader } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { getUserStats } from '@/lib/credits';

export default function CreditsBalance() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentCredits: 0,
    totalGenerations: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const userStats = await getUserStats(user.id);
      if (userStats) {
        setStats(userStats);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center h-32">
          <Loader className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Current Credits */}
      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Wallet className="w-8 h-8 text-amber-400" />
          {stats.currentCredits === 0 && (
            <Link 
              href="/dashboard/billing"
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full transition-colors"
            >
              Купити
            </Link>
          )}
        </div>
        
        <div className="text-4xl font-bold text-white mb-2">
          {stats.currentCredits}
        </div>
        
        <div className="text-gray-300 text-sm">
          {stats.currentCredits === 1 ? 'Кредит' : 'Кредитів'} доступно
        </div>
        
        {stats.currentCredits > 0 && (
          <div className="mt-3 text-xs text-gray-400">
            Ви можете згенерувати ще {stats.currentCredits} {stats.currentCredits === 1 ? 'документ' : 'документи'}
          </div>
        )}

        {stats.currentCredits === 0 && (
          <div className="mt-3 text-xs text-amber-300">
            ⚠️ Купіть кредити щоб продовжити
          </div>
        )}
      </div>

      {/* Total Generations */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
        
        <div className="text-4xl font-bold text-white mb-2">
          {stats.totalGenerations}
        </div>
        
        <div className="text-gray-300 text-sm">
          Всього згенеровано
        </div>

        {stats.totalGenerations > 0 && (
          <div className="mt-3 text-xs text-gray-400">
            За весь час використання
          </div>
        )}
      </div>

      {/* Quick Action */}
      <Link 
        href="/dashboard/billing"
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-4">
          <ShoppingCart className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
          <TrendingUp className="w-6 h-6 text-purple-300 opacity-50" />
        </div>
        
        <div className="text-2xl font-bold text-white mb-2">
          Купити кредити
        </div>
        
        <div className="text-gray-300 text-sm">
          Пакети від 99 грн
        </div>

        <div className="mt-3 text-xs text-purple-300">
          Економте до 391 грн →
        </div>
      </Link>
    </div>
  );
}
