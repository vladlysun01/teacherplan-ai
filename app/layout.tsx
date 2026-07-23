import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://teacher-plan-ai.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TeacherPlan AI — календарно-тематичні плани для вчителів за 10 секунд",
    template: "%s | TeacherPlan AI",
  },
  description:
    "TeacherPlan AI автоматично генерує календарно-тематичні та поурочні плани для вчителів України відповідно до програм МОН. Замість 4-6 годин — 10 секунд. Експорт у Google Docs.",
  keywords: [
    "календарно-тематичний план",
    "поурочний план",
    "план для вчителя",
    "МОН України",
    "TeacherPlan",
    "AI для вчителів",
  ],
  authors: [{ name: "TeacherPlan AI" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: "TeacherPlan AI",
    title: "TeacherPlan AI — календарно-тематичні плани для вчителів за 10 секунд",
    description:
      "Автоматична генерація календарно-тематичних та поурочних планів відповідно до програм МОН України.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TeacherPlan AI — календарно-тематичні плани за 10 секунд",
    description:
      "Автоматична генерація календарно-тематичних та поурочних планів відповідно до програм МОН України.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

