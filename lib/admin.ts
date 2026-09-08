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

// Власні тестові акаунти (власник + друг-вчитель, який здебільшого
// тестує "Фізичну культуру") — їх генерації не відображають реальних
// вчителів-користувачів і лише спотворюють статистику в адмінці.
const TEST_USER_EMAILS = ["vladlysun01@gmail.com", "bykypy@gmail.com"];

export function isTestEmail(email?: string | null): boolean {
  if (!email) return false;
  return TEST_USER_EMAILS.includes(email.toLowerCase());
}

// Режим тестування: коли NEXT_PUBLIC_MAINTENANCE_MODE=true, генерацію
// документів бачать вимкненою всі, КРІМ адміна й тестових акаунтів —
// щоб поки ми доробляємо генератор, звичайний вчитель не отримав
// зламаний .docx. NEXT_PUBLIC_-префікс навмисний: одна змінна працює
// і на клієнті (сіра кнопка "Генерувати" без зайвого кліку в помилку),
// і на сервері (справжня блокуюча перевірка в /api/documents/generate,
// яка не залежить від того, що намалював фронтенд).
export function isMaintenanceModeOn(): boolean {
  return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
}

export function canBypassMaintenance(email?: string | null): boolean {
  return isAdminEmail(email) || isTestEmail(email);
}
