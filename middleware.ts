// middleware.ts
//
// Ловить ?ref=<code> на будь-якій сторінці (посилання можуть вести на
// головну, /register чи будь-куди ще) і кладе код у cookie на 30 днів —
// фіксація "хто кого запросив" відбувається аж при реєстрації
// (app/(auth)/register/page.tsx, app/(auth)/callback/route.ts), а не тут.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REF_COOKIE = "tp_ref";
const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 днів
const REF_CODE_PATTERN = /^[A-Za-z0-9]{4,16}$/;

export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");

  if (ref && REF_CODE_PATTERN.test(ref)) {
    const response = NextResponse.next();
    response.cookies.set(REF_COOKIE, ref, {
      maxAge: REF_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
