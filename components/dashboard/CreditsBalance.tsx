"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import CreditsBalance from "@/components/dashboard/CreditsBalance";

type VariantModule = {
  id: string;
  name: string;
};

type Program = {
  id: string;
  classes: number[];
  description: string;
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
      hasVariant: false,
    },
    "10-11 класи (рівень стандарту)": {
      id: "fizkultura-10-11-standart",
      classes: [10, 11],
      description: "2 год/тиждень",
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
      hasVariant: false,
    },
    "10-11 класи (рівень стандарту)": {
      id: "ukrainian-10-11-standard",
      classes: [10, 11],
      description: "2-3 год/тиждень",
      hasVariant: false,
    },
    "10-11 класи (профільний рівень)": {
      id: "ukrainian-10-11-profile",
      classes: [10, 11],
      description: "4-5 год/тиждень, поглиблене вивчення",
      hasVariant: false,
    },
  },
};

export default function DashboardPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  const availablePrograms = selectedSubject ? PROGRAMS[selectedSubject] : {};
  const currentProgram = selectedProgram ? availablePrograms[selectedProgram] : null;

  const handleGenerate = async () => {
    if (!selectedSubject || !selectedProgram || !selectedClass) {
      alert("Будь ласка, виберіть всі параметри");
      return;
    }

    if (currentProgram?.hasVariant && selectedVariants.length !== currentProgram.variantRequired) {
      alert(`Потрібно вибрати ${currentProgram.variantRequired} варіантних модулі(в)`);
      return;
    }

    setGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Необхідна авторизація");
        return;
      }

      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          subject: selectedSubject,
          program: selectedProgram,
          class: selectedClass,
          variants: selectedVariants,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Документ успішно згенеровано!");
        if (result.documentUrl) {
          window.open(result.documentUrl, "_blank");
        }
      } else {
        if (result.errorCode === "INSUFFICIENT_CREDITS") {
          alert(`Недостатньо кредитів!\nПоточний баланс: ${result.currentCredits}\nПерейдіть на сторінку Billing щоб купити кредити.`);
          // Можна перенаправити на billing
          // window.location.href = "/dashboard/billing";
        } else {
          alert(`Помилка: ${result.error}`);
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Помилка генерації");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8">
      {/* Компонент балансу кредитів */}
      <CreditsBalance />

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Генерація календарного плану
        </h1>
        <p className="text-gray-400">
          Оберіть параметри для генерації документу
        </p>
      </div>

      {/* Форма */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
        {/* Предмет */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Предмет
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedProgram("");
              setSelectedClass(null);
              setSelectedVariants([]);
            }}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
          >
            <option value="">Оберіть предмет</option>
            {Object.keys(PROGRAMS).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Програма */}
        {selectedSubject && (
          <div>
            <label className="block text-white font-semibold mb-2">
              Програма
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                setSelectedClass(null);
                setSelectedVariants([]);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Оберіть програму</option>
              {Object.entries(availablePrograms).map(([name, program]) => (
                <option key={program.id} value={name}>
                  {name} - {program.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Клас */}
        {currentProgram && (
          <div>
            <label className="block text-white font-semibold mb-2">
              Клас
            </label>
            <select
              value={selectedClass || ""}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Оберіть клас</option>
              {currentProgram.classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls} клас
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Варіантні модулі */}
        {currentProgram?.hasVariant && (
          <div>
            <label className="block text-white font-semibold mb-2">
              Варіантні модулі (оберіть {currentProgram.variantRequired})
            </label>
            <div className="grid grid-cols-2 gap-3">
              {currentProgram.variantModules?.map((module) => (
                <label
                  key={module.id}
                  className={`
                    flex items-center gap-2 p-4 rounded-xl cursor-pointer transition-all
                    ${
                      selectedVariants.includes(module.id)
                        ? "bg-amber-500/20 border-2 border-amber-500"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedVariants.includes(module.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedVariants.length < currentProgram.variantRequired!) {
                          setSelectedVariants([...selectedVariants, module.id]);
                        }
                      } else {
                        setSelectedVariants(selectedVariants.filter((v) => v !== module.id));
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <span className="text-white">{module.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка генерації */}
        <button
          onClick={handleGenerate}
          disabled={!selectedSubject || !selectedProgram || !selectedClass || generating}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg transition-all
            ${
              !selectedSubject || !selectedProgram || !selectedClass || generating
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/50"
            }
            text-white
          `}
        >
          {generating ? "Генерація..." : "🚀 Згенерувати план"}
        </button>
      </div>
    </div>
  );
}
