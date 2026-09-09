import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Same-origin проксі для скачування .docx.
//
// Пряме посилання на Supabase Storage (cross-origin, akdhybkcmfwajlppwpgs.supabase.co)
// у Safari нестабільне навіть із коректним Content-Disposition: attachment —
// сервер віддає правильні заголовки (перевірено curl'ом), але:
//   1) звичайна href-навігація на чужий origin інколи просто не запускає
//      завантаження (стара прикмета WebKit);
//   2) fetch()+blob у клієнтському JS теж ненадійний, бо await розриває
//      "user gesture" — Safari після цього або мовчки ігнорує click() по
//      blob:-посиланню, або встигає частково й одразу зупиняє ("0 КБ з N КБ —
//      остановлена"), залежно від того, наскільки швидко відповів fetch.
// Рішення — качати файл на сервері (тут server-to-server запит до Storage
// не має жодних cross-origin/gesture обмежень) і віддавати браузеру як
// звичайний GET-запит того ж домену, що й сторінка. Це вже жодних
// WebKit-специфічних винятків не має.
export async function GET(request: NextRequest) {
  try {
    const documentId = request.nextUrl.searchParams.get("id");
    if (!documentId) {
      return NextResponse.json({ error: "Не вказано id документа" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    // Сервісний ключ — тільки для читання зі Storage; належність документа
    // саме цьому користувачу перевіряємо окремо через .eq('user_id', ...).
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: doc, error: docError } = await supabaseAdmin
      .from("documents")
      .select("title, file_url, metadata")
      .eq("id", documentId)
      .eq("user_id", session.user.id)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: "Документ не знайдено" }, { status: 404 });
    }

    const storagePath = (doc.metadata as { storagePath?: string } | null)?.storagePath;
    if (!storagePath) {
      return NextResponse.json({ error: "Файл документа недоступний" }, { status: 404 });
    }

    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
      .from("documents")
      .download(storagePath);

    if (downloadError || !fileBlob) {
      return NextResponse.json({ error: "Не вдалось завантажити файл" }, { status: 500 });
    }

    // Оригінальне ім'я файлу вже підібране при генерації (лежить у query
    // параметрі старого publicUrl) — перевикористовуємо його, щоб не
    // дублювати логіку формування назви.
    const nameFromOldUrl = doc.file_url ? new URL(doc.file_url).searchParams.get("download") : null;
    const downloadName = nameFromOldUrl || `${doc.title}.docx`;

    const buffer = await fileBlob.arrayBuffer();

    // Content-Length НЕ виставляємо вручну: якщо Vercel/CDN поверх стискає
    // тіло відповіді (gzip), заявлений вручну розмір перестає збігатись із
    // фактично переданими байтами — і Safari бачить розбіжність та зупиняє
    // завантаження ("0 КБ з N КБ — остановлена"), хоча заголовок
    // Content-Disposition: attachment уже спрацював і індикатор встиг
    // з'явитись. Без явного Content-Length платформа порахує його сама
    // (або віддасть chunked) узгоджено з фактичним тілом.
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="document.docx"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Error in /api/documents/download:", error);
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}
