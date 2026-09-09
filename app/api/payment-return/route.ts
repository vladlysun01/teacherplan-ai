import { NextRequest, NextResponse } from "next/server";

// WayForPay після оплати повертає браузер користувача на returnUrl не
// звичайним GET-переходом, а POST-формою з даними транзакції
// (стандартна поведінка платіжних шлюзів для return-адреси). У Next.js
// App Router POST на URL, де лежить лише page.tsx (без свого route.ts),
// намагається трактуватись як виклик Server Action — і оскільки жодної
// такої дії там нема, віддається гола помилка "Server action not
// found." замість сторінки успіху.
//
// Це проміжний Route Handler саме для цього POST: приймає його і одразу
// робить справжній HTTP-редирект (303 — гарантовано змінює метод на GET
// при переході, на відміну від 307/308) на реальну сторінку
// /payment/success, яка вже сама підвантажує актуальний баланс
// кредитів із Supabase — тож жодні дані з тіла POST-запиту сюди
// передавати не треба.
const SUCCESS_URL = "/payment/success";

function redirectToSuccess(request: NextRequest) {
  return NextResponse.redirect(new URL(SUCCESS_URL, request.url), { status: 303 });
}

export async function POST(request: NextRequest) {
  return redirectToSuccess(request);
}

export async function GET(request: NextRequest) {
  return redirectToSuccess(request);
}
