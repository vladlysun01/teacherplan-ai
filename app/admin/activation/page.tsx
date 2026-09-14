"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ArrowLeft, ShieldAlert, Mail } from "lucide-react";

type Candidate = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  credits: number;
  total_generations: number;
};

const DEFAULT_SUBJECT = "У тебе ще лишились 2 безкоштовні генерації в TeacherPlan AI";
const DEFAULT_BODY = `<p>Привіт, {{first_name}}!</p>
<p>Бачу, ти зареєструвався(лась) в TeacherPlan AI, але ще жодного разу не спробував(ла) згенерувати календарний план — а в тебе досі є {{credits}} безкоштовних кредити, які нікуди не зникають.</p>
<p>Це займає буквально 10 секунд: обираєш предмет і клас — і готовий план відповідно до чинної програми МОН одразу у тебе.</p>
<p><a href="{{site_url}}/dashboard">Спробувати зараз →</a></p>
<p>Якщо щось незрозуміло чи не запрацювало — просто дай знати, відповівши на цей лист.</p>
<p>З повагою,<br/>TeacherPlan AI</p>`;

export default function AdminActivationPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [bodyHtml, setBodyHtml] = useState(DEFAULT_BODY);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sentCount: number; failedCount: number } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setToken(session.access_token);
      const res = await fetch("/api/admin/activation-reminders", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 401 || res.status === 403) {
        setDenied(true);
        setLoading(false);
        return;
      }
      const body = await res.json();
      setCandidates(body.candidates ?? []);
      setSelected(new Set((body.candidates ?? []).map((c: Candidate) => c.id)));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function sendBatch() {
    if (!token || selected.size === 0) return;
    setSending(true);
    setSendError(null);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/activation-reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userIds: Array.from(selected), subject, bodyHtml }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Помилка відправки");
      setSendResult({ sentCount: body.sentCount, failedCount: body.failedCount });
      setCandidates((prev) => prev.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
    } catch (err: any) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Завантаження...</div>
      </div>
    );
  }
  if (denied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <ShieldAlert className="mx-auto text-red-400 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-white mb-2">Доступ заборонено</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm mb-2 transition-colors"
        >
          <ArrowLeft size={14} /> До адмінки
        </button>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-1">
          Нагадування про активацію
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Зареєструвались 24-72 год тому, жодного разу не генерували — досі мають безкоштовні кредити.
          Знайдено автономним аудитом: 75% реєстрацій ніколи не активуються.
        </p>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Кандидати ({candidates.length})</h2>
            <span className="text-slate-400 text-sm">Обрано: {selected.size}</span>
          </div>
          {candidates.length === 0 ? (
            <div className="text-slate-500 text-sm py-6 text-center">
              Наразі нема кому слати — усі свіжі реєстрації або вже активувались, або ще замолоді (&lt;24 год),
              або їм уже надсилали нагадування.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {candidates.map((c) => (
                <label key={c.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-slate-700/50 last:border-0">
                  <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                  <span className="text-white">{c.full_name || "—"}</span>
                  <span className="text-slate-400">{c.email}</span>
                  <span className="text-slate-500 ml-auto text-xs">{new Date(c.created_at).toLocaleString("uk-UA")}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-1">Текст листа</h2>
          <p className="text-slate-500 text-xs mb-3">
            Плейсхолдери <code className="text-cyan-400">{"{{first_name}}"}</code>,{" "}
            <code className="text-cyan-400">{"{{credits}}"}</code>, <code className="text-cyan-400">{"{{site_url}}"}</code>.
          </p>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm mb-3"
          />
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={10}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-mono mb-4"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={sendBatch}
              disabled={sending || selected.size === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <Mail size={15} /> {sending ? "Надсилаю…" : `Відправити (${selected.size})`}
            </button>
            {sendResult && (
              <span className="text-green-400 text-sm">
                Надіслано: {sendResult.sentCount}
                {sendResult.failedCount > 0 ? `, помилок: ${sendResult.failedCount}` : ""}
              </span>
            )}
            {sendError && <span className="text-red-400 text-sm">{sendError}</span>}
          </div>
          <p className="text-slate-500 text-xs mt-3">
            ⚠️ Той самий Resend-акаунт, що й для аутріча шкіл — поки без верифікованого домену листи підуть лише
            на власну пошту акаунту (перевір спершу на собі).
          </p>
        </div>
      </div>
    </div>
  );
}
