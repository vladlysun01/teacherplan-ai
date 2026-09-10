import type { Metadata } from "next";
import HomePageContent from "@/components/landing/HomePageContent";
import { FAQ } from "@/lib/landing-faq";

export const metadata: Metadata = {
  title: "TeacherPlan AI — календарно-тематичні плани за 10 секунд",
  description:
    "Генеруйте календарно-тематичні та поурочні плани для 24 предметів відповідно до програм МОН України за 10 секунд замість 4-6 годин. Готовий документ у форматі .docx.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "TeacherPlan AI",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        description:
          "Автоматична генерація календарно-тематичних та поурочних планів для вчителів України відповідно до програм МОН.",
        offers: { "@type": "Offer", price: "99", priceCurrency: "UAH" },
        url: "https://www.teacher-plan-ai.site",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePageContent />
    </>
  );
}
