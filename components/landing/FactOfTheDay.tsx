'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

const SCIENCE_FACTS = [
  "🌍 Земля обертається зі швидкістю понад 1600 км/год на екваторі!",
  "🧠 Людський мозок містить приблизно 86 мільярдів нейронів.",
  "⚡ Блискавка нагрівається до 30,000°C - гарячіше за поверхню Сонця!",
  "🌊 Океани виробляють 70% кисню на Землі.",
  "🚀 Світло долає відстань від Сонця до Землі за 8 хвилин.",
  "🦋 Метелики куштують їжу своїми ногами.",
  "💎 Алмаз - найтвердіша природна речовина на Землі.",
  "🌙 Гравітація на Місяці в 6 разів слабша ніж на Землі.",
  "🔬 ДНК людини на 50% співпадає з ДНК банана.",
  "🌟 У нашій галактиці близько 200-400 мільярдів зірок.",
];

export default function FactOfTheDay() {
  const [fact, setFact] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * SCIENCE_FACTS.length);
    return SCIENCE_FACTS[randomIndex];
  };

  useEffect(() => {
    setFact(getRandomFact());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setFact(getRandomFact());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-2xl p-6">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Факт дня</h3>
              <p className="text-xs text-gray-400">Наукове відкриття</p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 group"
            title="Оновити факт"
          >
            <RefreshCw 
              className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
                isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'
              }`} 
            />
          </button>
        </div>

        <p className="text-white text-lg leading-relaxed">
          {fact}
        </p>

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500">
            💡 Натисніть на кнопку оновлення для нового факту
          </p>
        </div>
      </div>
    </div>
  );
}
