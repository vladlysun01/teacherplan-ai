"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { CheckCircle, FileText, ArrowRight, X } from 'lucide-react';

type VariantModule = {
  id: string;
  name: string;
};

type Program = {
  id: string;
  classes: number[];
  description: string;
  lessonsPerWeek?: number | number[]; // кількість уроків на тиждень (число або діапазон [мін, макс])
  hasVariant: boolean;
  variantModules?: VariantModule[];
  variantRequired?: number;
};

type Programs = {
  [subject: string]: {
    [program: string]: Program;
  };
};

const PROGRAMS: Programs = {
  "Фізична культура": {
    "НУШ 5-9 класи": {
      id: "fizkultura-nush-5-9",
      classes: [5, 6, 7, 8, 9],
      description: "Базова програма НУШ",
      lessonsPerWeek: 3,
      hasVariant: false,
    },
    "10-11 класи (рівень стандарту)": {
      id: "fizkultura-10-11-standart",
      classes: [10, 11],
      description: "2 год/тиждень",
      lessonsPerWeek: 2,
      hasVariant: true,
      variantModules: [
        { id: "basketball", name: "Баскетбол" },
        { id: "volleyball", name: "Волейбол" },
        { id: "football", name: "Футбол" },
        { id: "athletics", name: "Легка атлетика" },
        { id: "gymnastics", name: "Гімнастика" },
        { id: "badminton", name: "Бадмінтон" },
      ],
      variantRequired: 2,
    },
    "10-11 класи (профільний рівень)": {
      id: "fizkultura-10-11-profil",
      classes: [10, 11],
      description: "4-5 год/тиждень, поглиблене вивчення",
      lessonsPerWeek: [4, 5],
      hasVariant: true,
      variantModules: [
        { id: "basketball", name: "Баскетбол (поглиблений)" },
        { id: "volleyball", name: "Волейбол (поглиблений)" },
        { id: "football", name: "Футбол (поглиблений)" },
        { id: "athletics", name: "Легка атлетика (поглиблена)" },
        { id: "gymnastics", name: "Гімнастика (поглиблена)" },
      ],
      variantRequired: 1,
    },
  },
  "Українська мова": {
    "НУШ 5-9 класи": {
      id: "ukrainian-nush-5-9",
      classes: [5, 6, 7, 8, 9],
      description: "Базова програма НУШ",
      lessonsPerWeek: [2, 4],
      hasVariant: false,
    },
    "10-11 класи (рівень стандарту)": {
      id: "ukrainian-10-11-standard",
      classes: [10, 11],
      description: "2-3 год/тиждень",
      lessonsPerWeek: [2, 3],
      hasVariant: false,
    },
    "10-11 класи (профільний рівень)": {
      id: "ukrainian-10-11-profile",
      classes: [10, 11],
      description: "4-5 год/тиждень, поглиблене вивчення",
      lessonsPerWeek: [4, 5],
      hasVariant: false,
    },
  },
  "Українська література": {
    "НУШ 5-9 класи": {
      id: "ukrainian-literature-nush-5-9",
      classes: [5, 6, 7, 8, 9],
      description: "Базова програма НУШ",
      lessonsPerWeek: 2,
      hasVariant: false,
    },
  },
  "Математика": {
    "10-11 класи (рівень стандарту)": {
      id: "mathematics-10-11-standard",
      classes: [10, 11],
      description: "3 год/тиждень",
      lessonsPerWeek: 3,
      hasVariant: false,
    },
    "10-11 класи (поглиблений рівень)": {
      id: "mathematics-10-11-advanced",
      classes: [10, 11],
      description: "4 год/тиждень",
      lessonsPerWeek: 4,
      hasVariant: false,
    },
    "10-11 класи (профільний рівень)": {
      id: "mathematics-10-11-profile",
      classes: [10, 11],
      description: "5-6 год/тиждень, поглиблене вивчення",
      lessonsPerWeek: [5, 6],
      hasVariant: false,
    },
  },
  "Інформатика": {
    "10-11 класи (рівень стандарту)": {
      id: "informatics-10-11-standard",
      classes: [10, 11],
      description: "1-2 год/тиждень",
      lessonsPerWeek: [1, 2],
      hasVariant: false,
    },
  },
  "Історія України": {
    "10-11 класи": {
      id: "history-ukraine-10-11",
      classes: [10, 11],
      description: "Інтегрований курс",
      lessonsPerWeek: 2,
      hasVariant: false,
    },
  },
  "Всесвітня історія": {
    "НУШ 6-9 класи": {
      id: "world-history-nush-6-9",
      classes: [6, 7, 8, 9],
      description: "Базова програма НУШ",
      lessonsPerWeek: 1,
      hasVariant: false,
    },
    "10-11 класи": {
      id: "world-history-10-11",
      classes: [10, 11],
      description: "Старша школа",
      lessonsPerWeek: 1,
      hasVariant: false,
    },
  },
  "Мистецтво": {
    "10-11 класи (профільний рівень)": {
      id: "art-10-11-profile",
      classes: [10, 11],
      description: "Поглиблене вивчення мистецтва",
      lessonsPerWeek: 2,
      hasVariant: false,
    },
  },
  "Географія": {
    "6 клас": {
      id: "geography-6",
      classes: [6],
      description: "Загальна географія (2 год/тиждень, 70 год)",
      lessonsPerWeek: 2,
      hasVariant: false,
    },
    "7 клас": {
      id: "geography-7",
      classes: [7],
      description: "Материки та океани (2 год/тиждень, 70 год)",
      lessonsPerWeek: 2,
      hasVariant: false,
    },
    "8 клас": {
      id: "geography-8",
      classes: [8],
      description: "Україна у світі: природа, населення (2 год/тиждень, 70 год)",
      lessonsPerWeek: 2,
      hasVariant: false,
    },
    "9 клас": {
      id: "geography-9",
      classes: [9],
      description: "Україна і світове господарство (1.5 год/тиждень, 52 год)",
      lessonsPerWeek: [1, 2],
      hasVariant: false,
    },
    "10 клас": {
      id: "geography-10",
      classes: [10],
      description: "Регіони та країни (1.5 год/тиждень, 52 год)",
      lessonsPerWeek: [1, 2],
      hasVariant: false,
    },
    "11 клас": {
      id: "geography-11",
      classes: [11],
      description: "Географічний простір Землі (1 год/тиждень, 35 год)",
      lessonsPerWeek: 1,
      hasVariant: false,
    },
  },
  "Захист України": {
    "10-11 класи (профільний рівень)": {
      id: "defense-ukraine-10-11-profile",
      classes: [10, 11],
      description: "6 год/тиждень, 210 год на рік",
      lessonsPerWeek: 6,
      hasVariant: false,
    },
  },
};

export default function Dashboard() {
  const [formData, setFormData] = useState({
    subject: "Фізична культура",
    program: "НУШ 5-9 класи",
    programId: "fizkultura-nush-5-9",
    class: "5",
    semester: "1",
    weekdays: "",
    startDate: "2024-09-01",
    schoolYear: "2024/2025",
    teacherName: "",
    teacherCategory: "",
    schoolName: "",
    variantModules: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentProgram = PROGRAMS[formData.subject]?.[formData.program];

  // ✅ АВТОЗАПОВНЕННЯ З SETTINGS
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, school_name, subject, teacher_category')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        // Перевіряємо чи subject існує в PROGRAMS
        const profileSubject = profile.subject && PROGRAMS[profile.subject] ? profile.subject : 'Фізична культура';
        const firstProgram = Object.keys(PROGRAMS[profileSubject])[0];
        const programData = PROGRAMS[profileSubject][firstProgram];
        
        setFormData(prev => ({
          ...prev,
          teacherName: profile.full_name || '',
          schoolName: profile.school_name || '',
          teacherCategory: profile.teacher_category || '',
          // Встановлюємо subject з відповідною програмою
          subject: profileSubject,
          program: firstProgram,
          programId: programData.id,
          class: programData.classes[0].toString(),
        }));
        
        setProfileLoaded(true);
        console.log('✅ Дані профілю завантажено:', profile);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження профілю:', error);
    }
  };

  const handleSubjectChange = (subject: string) => {
    const firstProgram = Object.keys(PROGRAMS[subject])[0];
    const programData = PROGRAMS[subject][firstProgram];
    
    setFormData({
      ...formData,
      subject,
      program: firstProgram,
      programId: programData.id,
      class: programData.classes[0].toString(),
      variantModules: [],
    });
  };

  const handleProgramChange = (program: string) => {
    const programData = PROGRAMS[formData.subject]?.[program];
    if (!programData) return;

    setFormData({
      ...formData,
      program,
      programId: programData.id,
      class: programData.classes[0].toString(),
      variantModules: [],
    });
  };

  const handleVariantToggle = (moduleId: string) => {
    const isSelected = formData.variantModules.includes(moduleId);
    setFormData({
      ...formData,
      variantModules: isSelected
        ? formData.variantModules.filter((id) => id !== moduleId)
        : [...formData.variantModules, moduleId],
    });
  };

  const handleGenerate = async () => {
    if (currentProgram?.hasVariant) {
      const required = currentProgram.variantRequired || 1;
      if (formData.variantModules.length < required) {
        alert(`Оберіть мінімум ${required} модулі для вивчення`);
        return;
      }
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("❌ Помилка авторизації. Будь ласка, увійдіть знову.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Помилка генерації");

      setShowSuccessModal(true);
      setFormData({ ...formData, variantModules: [] });
    } catch (error: any) {
      alert("❌ Помилка: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white" size={40} />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Успішно згенеровано!
              </h2>

              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
                Ваш календарний план готовий. <br className="hidden sm:block" />
                Перегляньте його в розділі "Мої документи"
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-4 sm:px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Закрити
                </button>

                <a
                  href="/dashboard/documents"
                  className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 group"
                >
                  <FileText size={18} />
                  <span>Мої документи</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-2">
            Генерація календарного плану
          </h1>
          <p className="text-slate-400">Заповніть форму для створення документу</p>
          
          {/* Індикатор автозаповнення */}
          {profileLoaded && (
            <div className="mt-4 inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-cyan-300 text-sm">Дані підтягнуто з налаштувань</span>
            </div>
          )}
        </div>

        {/* Форма */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            
            {/* Предмет */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                📚 Предмет
                {profileLoaded && formData.subject && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ З профілю</span>
                )}
              </label>
              <div className="relative">
                <select
                  value={formData.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium appearance-none cursor-pointer hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  {Object.keys(PROGRAMS).map((subj) => (
                    <option key={subj} value={subj} className="bg-slate-800">
                      {subj}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Програма */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                📖 Програма
              </label>
              <div className="relative">
                <select
                  value={formData.program}
                  onChange={(e) => handleProgramChange(e.target.value)}
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium appearance-none cursor-pointer hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  {Object.keys(PROGRAMS[formData.subject] || {}).map((prog) => (
                    <option key={prog} value={prog} className="bg-slate-800">
                      {prog}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {currentProgram?.description && (
                <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                  <span className="text-cyan-400">💡</span>
                  {currentProgram.description}
                </p>
              )}
            </div>

            {/* Клас */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                🎓 Клас
              </label>
              <div className="relative">
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium appearance-none cursor-pointer hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  {currentProgram?.classes.map((cls: number) => (
                    <option key={cls} value={cls.toString()} className="bg-slate-800">
                      {cls} клас
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Варіантні модулі */}
            {currentProgram?.hasVariant && currentProgram.variantModules && (
              <div className="p-5 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl">
                <label className="block text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  🎯 Оберіть модулі для вивчення (мінімум {currentProgram.variantRequired || 1})
                </label>
                <div className="space-y-3">
                  {currentProgram.variantModules.map((module: VariantModule) => (
                    <label
                      key={module.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-cyan-500/50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.variantModules.includes(module.id)}
                        onChange={() => handleVariantToggle(module.id)}
                        className="w-5 h-5 rounded accent-cyan-500"
                      />
                      <span className="text-white font-medium">{module.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-cyan-300 mt-3">
                  Вибрано: {formData.variantModules.length} / {currentProgram.variantModules.length}
                </p>
              </div>
            )}

            {/* Семестр */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                📅 Семестр
              </label>
              <div className="relative">
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium appearance-none cursor-pointer hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="1" className="bg-slate-800">1️⃣ Перший семестр (Вересень - Грудень)</option>
                  <option value="2" className="bg-slate-800">2️⃣ Другий семестр (Січень - Травень)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                <span className="text-cyan-400">💡</span>
                Кожен семестр генерується окремо (1 кредит = 1 семестр)
              </p>
            </div>

            {/* Дні тижня */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                📆 Дні тижня
              </label>
              
              {/* Підказка з кількістю уроків */}
              {(() => {
                const lpw = currentProgram?.lessonsPerWeek;
                const selectedCount = formData.weekdays.split(',').filter(Boolean).length;
                
                if (!lpw) return (
                  <div className="mb-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <p className="text-cyan-300 text-sm flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <span>Поставте галочку на днях, коли у вас будуть проходити уроки з цього предмету</span>
                    </p>
                  </div>
                );

                const isRange = Array.isArray(lpw);
                const min = isRange ? lpw[0] : lpw as number;
                const max = isRange ? lpw[1] : lpw as number;
                const hint = isRange ? `${min}–${max} уроки на тиждень` : `${min} ${min === 1 ? 'урок' : min < 5 ? 'уроки' : 'уроків'} на тиждень`;
                
                const isCorrect = isRange 
                  ? (selectedCount >= min && selectedCount <= max)
                  : selectedCount === min;
                const isOver = selectedCount > max;

                return (
                  <div className={`mb-4 rounded-xl p-4 border ${
                    selectedCount === 0 
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : isCorrect 
                        ? 'bg-green-500/10 border-green-500/30'
                        : isOver
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <p className="text-sm flex items-start gap-2">
                      <span className="text-lg">
                        {selectedCount === 0 ? '💡' : isCorrect ? '✅' : isOver ? '❌' : '⚠️'}
                      </span>
                      <span className={
                        selectedCount === 0 ? 'text-cyan-300' 
                        : isCorrect ? 'text-green-300'
                        : isOver ? 'text-red-300'
                        : 'text-amber-300'
                      }>
                        {selectedCount === 0 
                          ? <>Ця програма передбачає <strong>{hint}</strong> — оберіть відповідну кількість днів</>
                          : isCorrect
                            ? <>Чудово! Вибрано {selectedCount} {selectedCount === 1 ? 'день' : 'дні'} — відповідає програмі ({hint})</>
                            : isOver
                              ? <>Забагато днів! Вибрано {selectedCount}, а програма передбачає {hint}</>
                              : <>Вибрано {selectedCount} {selectedCount === 1 ? 'день' : 'дні'}, а програма передбачає {hint}</>
                        }
                      </span>
                    </p>
                  </div>
                );
              })()}
              
              {/* Чекбокси */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'Пн', name: 'Понеділок', gradient: 'from-blue-500 to-blue-600' },
                  { id: 'Вт', name: 'Вівторок', gradient: 'from-emerald-500 to-emerald-600' },
                  { id: 'Ср', name: 'Середа', gradient: 'from-amber-500 to-amber-600' },
                  { id: 'Чт', name: 'Четвер', gradient: 'from-orange-500 to-orange-600' },
                  { id: 'Пт', name: "П'ятниця", gradient: 'from-rose-500 to-rose-600' },
                  { id: 'Сб', name: 'Субота', gradient: 'from-purple-500 to-purple-600' },
                  { id: 'Нд', name: 'Неділя', gradient: 'from-pink-500 to-pink-600' },
                ].map((day) => {
                  const selectedDays = formData.weekdays.split(',').map(d => d.trim()).filter(Boolean);
                  const isSelected = selectedDays.includes(day.id);
                  
                  return (
                    <label
                      key={day.id}
                      className="relative group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const days = formData.weekdays.split(',').map(d => d.trim()).filter(Boolean);
                          let newDays;
                          
                          if (e.target.checked) {
                            newDays = [...days, day.id];
                          } else {
                            newDays = days.filter(d => d !== day.id);
                          }
                          
                          setFormData({ 
                            ...formData, 
                            weekdays: newDays.join(',') 
                          });
                        }}
                        className="peer sr-only"
                      />
                      
                      {/* Card */}
                      <div className={`
                        relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300
                        ${isSelected 
                          ? `bg-gradient-to-br ${day.gradient} border-transparent shadow-lg scale-105` 
                          : 'bg-slate-700/30 border-slate-600/50 group-hover:border-cyan-500/50 group-hover:bg-slate-700/50'
                        }
                      `}>
                        {/* Background pattern */}
                        <div className={`absolute inset-0 opacity-10 ${isSelected ? 'block' : 'hidden'}`}>
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative flex items-center justify-between">
                          <div className="flex-1">
                            <div className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {day.id}
                            </div>
                            <div className={`text-xs ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                              {day.name}
                            </div>
                          </div>
                          
                          {/* Custom checkbox indicator */}
                          <div className={`
                            w-7 h-7 rounded-lg flex items-center justify-center transition-all
                            ${isSelected 
                              ? 'bg-white/20 backdrop-blur-sm' 
                              : 'bg-slate-600/50 border-2 border-slate-500'
                            }
                          `}>
                            {isSelected && (
                              <svg 
                                className="w-5 h-5 text-white drop-shadow-lg" 
                                fill="none" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="3" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              {/* Відображення вибраних днів */}
              <div className="mt-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Вибрані дні:</span>
                  <span className="font-medium text-cyan-400">
                    {formData.weekdays || '❌ Оберіть дні тижня'}
                  </span>
                </div>
              </div>
            </div>

            {/* Дата початку */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                📍 Дата початку
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Навчальний рік */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                🗓️ Навчальний рік
              </label>
              <input
                type="text"
                value={formData.schoolYear}
                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                placeholder="2024/2025"
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* ПІБ вчителя */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                👤 ПІБ вчителя
                {profileLoaded && formData.teacherName && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ З профілю</span>
                )}
              </label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                placeholder="Іванов Іван Іванович"
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Категорія вчителя */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                🏆 Категорія вчителя
                {profileLoaded && formData.teacherCategory && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ З профілю</span>
                )}
              </label>
              <input
                type="text"
                value={formData.teacherCategory}
                onChange={(e) => setFormData({ ...formData, teacherCategory: e.target.value })}
                placeholder="Спеціаліст / І категорія / Вища категорія"
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Назва школи */}
            <div>
              <label className="block text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                🏫 Назва школи
                {profileLoaded && formData.schoolName && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ З профілю</span>
                )}
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="КЗ 'Гімназія №1 м. Києва'"
                className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-xl px-4 py-3.5 text-white font-medium placeholder-slate-500 hover:border-cyan-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Кнопка генерації */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Генерується...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Згенерувати план</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
