// lib/admin.ts
//
// Список пошт, яким дозволено бачити /admin. Значення з env
// (ADMIN_EMAILS, через кому) — щоб додати ще одного адміна (наприклад,
// друга-вчителя, з яким разом роблять проєкт) можна було просто змінити
// змінну середовища на Vercel, без правок коду й нового деплою.
// Дефолт — лише пошта власника, якщо змінна ще не виставлена.
const DEFAULT_ADMIN_EMAILS = ["vladlysun01@gmail.com"];

export function getAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
