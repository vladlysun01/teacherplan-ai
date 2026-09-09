import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PROGRAMS, SUBJECT_SLUGS, getAllClassesForSubject } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Календарно-тематичні плани за предметами",
  description:
    "Календарно-тематичне планування для 14 предметів шкільної програми МОН України — українська мова, математика, хімія, біологія, фізика, історія та інші. Оберіть предмет.",
  alternates: { canonical: "/plans" },
};

export default function PlansHubPage() {
  const subjects = Object.keys(PROGRAMS);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <span className="text-white font-bold text-xl">TeacherPlan</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Календарно-тематичні плани за предметами
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Оберіть предмет — побачите, які класи й програми вже підтримуються, і зможете згенерувати свій план за 10 секунд.
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-4">
            Перелік предметів і програм постійно оновлюється під чинну Типову освітню програму МОН.
            Не знайшли свій предмет або клас?{" "}
            <a href="mailto:teacher_plan_ai@proton.me" className="text-cyan-400 hover:text-cyan-300">
              Напишіть у підтримку
            </a>{" "}
            — додамо.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const classes = getAllClassesForSubject(subject);
            return (
              <Link
                key={subject}
                href={`/plans/${SUBJECT_SLUGS[subject]}`}
                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="text-cyan-400" size={24} />
                </div>
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  {subject}
                </h2>
                <p className="text-slate-400 text-sm">
                  {classes.length > 0 ? `${classes[0]}–${classes[classes.length - 1]} клас` : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
