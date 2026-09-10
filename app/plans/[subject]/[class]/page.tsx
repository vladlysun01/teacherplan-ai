import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import {
  SLUG_TO_SUBJECT,
  getAllSubjectClassPairs,
  getProgramsForSubjectAndClass,
} from "@/lib/programs";
import SiteFooter from "@/components/landing/SiteFooter";

// Окрема сторінка на кожну пару "предмет × клас" — довгі пошукові запити
// штибу "календарний план хімія 8 клас 2026-2027" реально шукають
// (конкуренти vseosvita.ua/naurok.com.ua/osvita.ua ранжуються саме за
// ними), а /plans/[subject] сама по собі націлена на ширший запит
// без класу. Дві сторінки не дублюють одна одну: тут вузько й конкретно.
export function generateStaticParams() {
  return getAllSubjectClassPairs().map(({ slug, classNum }) => ({
    subject: slug,
    class: String(classNum),
  }));
}

function resolve(slug: string, classParam: string) {
  const subject = SLUG_TO_SUBJECT[slug] ?? null;
  const classNum = parseInt(classParam, 10);
  if (!subject || Number.isNaN(classNum)) return null;
  const programs = getProgramsForSubjectAndClass(subject, classNum);
  if (programs.length === 0) return null;
  return { subject, classNum, programs };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; class: string }>;
}): Promise<Metadata> {
  const { subject: slug, class: classParam } = await params;
  const resolved = resolve(slug, classParam);
  if (!resolved) return {};
  const { subject, classNum } = resolved;

  const title = `Календарний план з предмету «${subject}», ${classNum} клас — 2026/2027 н.р.`;
  const description = `Готовий календарно-тематичний план з предмету «${subject}» для ${classNum} класу на 2026/2027 навчальний рік, відповідно до чинної програми МОН України. Генерація за 10 секунд.`;

  return {
    title,
    description,
    alternates: { canonical: `/plans/${slug}/${classNum}` },
    openGraph: { title, description },
  };
}

export default async function SubjectClassPlanPage({
  params,
}: {
  params: Promise<{ subject: string; class: string }>;
}) {
  const { subject: slug, class: classParam } = await params;
  const resolved = resolve(slug, classParam);
  if (!resolved) notFound();
  const { subject, classNum, programs } = resolved;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `Календарно-тематичний план: ${subject}, ${classNum} клас`,
    description: `Автоматично згенерований календарно-тематичний план з предмету «${subject}» для ${classNum} класу відповідно до програми МОН України.`,
    provider: {
      "@type": "Organization",
      name: "TeacherPlan AI",
      sameAs: "https://www.teacher-plan-ai.site",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Всі предмети", item: "https://www.teacher-plan-ai.site/plans" },
      { "@type": "ListItem", position: 2, name: subject, item: `https://www.teacher-plan-ai.site/plans/${slug}` },
      { "@type": "ListItem", position: 3, name: `${classNum} клас`, item: `https://www.teacher-plan-ai.site/plans/${slug}/${classNum}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

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
          <Link href={`/plans/${slug}`} className="hover:text-cyan-400 transition-colors">{subject}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">{classNum} клас</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Календарний план: <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{subject}</span>, {classNum} клас
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl">
          Готовий календарно-тематичний план з предмету «{subject}» для {classNum} класу на 2026/2027 навчальний рік
          відповідно до чинної програми МОН України — за 10 секунд замість 4-6 годин ручної роботи.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-lg mb-14"
        >
          Згенерувати план для {classNum} класу
          <ArrowRight size={20} />
        </Link>

        <h2 className="text-2xl font-bold text-white mb-6">
          Програми для {classNum} класу
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {programs.map(([programName, program]) => (
            <div
              key={program.id}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-2">{programName}</h3>
              <p className="text-slate-400 text-sm">{program.description}</p>
              {(program.officialName || program.authors) && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500 space-y-1">
                  {program.officialName && <p>Офіційна програма: «{program.officialName}»</p>}
                  {program.authors && <p>Автори: {program.authors}</p>}
                </div>
              )}
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
              <span>Готовий документ, який можна відредагувати під себе</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
              <span>Розподіл по семестрах — I семестр (вересень-грудень) або II семестр (січень-травень)</span>
            </li>
          </ul>
        </div>

        <div className="mt-14 text-center">
          <Link href={`/plans/${slug}`} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
            ← Всі класи з предмету «{subject}»
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
