# Налаштування Google OAuth для TeacherPlan

## Що вже виправлено:
✅ Redirect URL в коді тепер `/callback` замість `/auth/callback`

## Що потрібно зробити:

### 1. Google Cloud Console

Перейдіть до: https://console.cloud.google.com/apis/credentials

#### Authorized JavaScript origins:
```
http://localhost:3000
```

#### Authorized redirect URIs:
```
http://localhost:3000/callback
```

**ВАЖЛИВО:** Видаліть старий URI `http://localhost:3000/auth/callback` якщо він там є!

### 2. Supabase Dashboard

Перейдіть до: Settings → Authentication → URL Configuration

#### Site URL:
```
http://localhost:3000
```

#### Redirect URLs (додайте якщо немає):
```
http://localhost:3000/callback
```

### 3. Змінні оточення (.env.local)

Переконайтеся що у вас є:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Перезапустіть сервер

```bash
npm run dev
```

## Тестування

1. Відкрийте http://localhost:3000/login
2. Натисніть "Продовжити з Google"
3. Виберіть Google акаунт
4. Після успішного входу ви маєте бути перенаправлені на `/dashboard`

## Структура проекту

```
app/
├── (auth)/
│   ├── callback/
│   │   └── route.ts          ← Обробляє OAuth callback
│   ├── login/
│   │   └── page.tsx          ← Сторінка входу
│   └── register/
│       └── page.tsx          ← Сторінка реєстрації
└── (dashboard)/
    ├── layout.tsx
    └── page.tsx              ← Дашборд після входу
```

## Якщо все ще не працює

Перевірте консоль браузера (F12) на наявність помилок та надішліть їх для діагностики.
