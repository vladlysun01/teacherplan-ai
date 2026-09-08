import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { PROGRAMS, SUBJECT_SLUGS, SLUG_TO_SUBJECT, getAllClassesForSubject } from "@/lib/programs";

export function generateStaticParams() {
  return Object.values(SUBJECT_SLUGS).map((subject) => ({ subject }));
}

function getSubject(slug: string): string | null {
  return SLUG_TO_SUBJECT[slug] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) return {};

  const classes = getAllClassesForSubject(subject);
  const classRange = classes.length > 0 ? `${classes[0]}–${classes[classes.length - 1]} клас` : "";

  return {
    title: `Календарно-тематичний план з предмету «${subject}» — ${classRange}`,
    description: `Готовий календарно-тематичний план з предмету «${subject}» для ${classRange} відповідно до програми МОН України. Генерація за 10 секунд, експорт у Google Docs.`,
    alternates: { canonical: `/plans/${slug}` },
    openGraph: {
      title: `Календарно-тематичний план: ${subject}`,
      description: `Автоматична генерація КТП з предмету «${subject}» для ${classRange}.`,
    },
  };
}

export default async function SubjectPlanPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) notFound();

  const programs = PROGRAMS[subject];
  const classes = getAllClassesForSubject(subject);
  const classRange = classes.length > 0 ? `${classes[0]}–${classes[classes.length - 1]} клас` : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `Календарно-тематичний план: ${subject}`,
    description: `Автоматично згенерований календарно-тематичний план з предмету «${subject}» відповідно до програми МОН України, для ${classRange}.`,
    provider: {
      "@type": "Organization",
      name: "TeacherPlan AI",
      sameAs: "https://www.teacher-plan-ai.site",
    },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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

      <div className="max-w-4xl mx-auto px-6 py-16">
        <nav className="text-sm text-slate-500 mb-8">
          <Link href="/plans" className="hover:text-cyan-400 transition-colors">Всі предмети</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">{subject}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Календарно-тематичний план: <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{subject}</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl">
          Автоматична генерація готового КТП з предмету «{subject}» для {classRange} відповідно до чинної програми
          МОН України — за 10 секунд замість 4-6 годин ручної роботи.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-lg mb-14"
        >
          Згенерувати план з «{subject}»
          <ArrowRight size={20} />
        </Link>

        <h2 className="text-2xl font-bold text-white mb-6">Доступні програми й класи</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {Object.entries(programs).map(([programName, program]) => (
            <div
              key={program.id}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-2">{programName}</h3>
              <p className="text-slate-400 text-sm mb-3">{program.description}</p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm">
                <CheckCircle size={16} />
                <span>
                  {program.classes.length === 1
                    ? `${program.classes[0]} клас`
                    : `Класи: ${program.classes.join(", ")}`}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Що входить у план</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
              <span>Теми уроків відповідно до чинної програми МОН, розподілені по датах з урахуванням твого розкладу</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
              <span>Готовий Google Docs документ, який можна відредагувати під себе</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
              <span>Розподіл по семестрах — I семестр (вересень-грудень) або II семестр (січень-травень)</span>
            </li>
          </ul>
        </div>

        <div className="mt-14 text-center">
          <Link href="/plans" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
            ← Переглянути всі предмети
          </Link>
        </div>
      </div>
    </div>
  );
}
