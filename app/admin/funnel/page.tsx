"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ArrowLeft, ShieldAlert } from "lucide-react";

const STEP_LABELS: Record<string, string> = {
  dashboard_view: "Відкрили дашборд",
  generate_click: "Натиснули «Згенерувати»",
  generate_success: "Успішна генерація",
  generate_error: "Помилка генерації",
};

type Step = { event: string; uniqueUsers: number; anonymousEvents: number };

export default function AdminFunnelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [recentErrors, setRecentErrors] = useState<{ createdAt: string; message: string | null }[]>([]);
  const [days, setDays] = useState(14);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/admin/funnel?days=${days}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 401 || res.status === 403) {
        setDenied(true);
        setLoading(false);
        return;
      }
      const body = await res.json();
      setSteps(body.steps ?? []);
      setRecentErrors(body.recentErrors ?? []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

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

  const dashboardViews = steps.find((s) => s.event === "dashboard_view")?.uniqueUsers ?? 0;
  const maxUsers = Math.max(1, dashboardViews);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm mb-2 transition-colors"
        >
          <ArrowLeft size={14} /> До адмінки
        </button>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            Лійка активації
          </h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value={7}>7 днів</option>
            <option value={14}>14 днів</option>
            <option value={30}>30 днів</option>
            <option value={90}>90 днів</option>
          </select>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Унікальні залогінені користувачі на кожному кроці. Трекінг з'явився 2026-09-17 — до цієї дати даних нема.
        </p>

        <div className="space-y-3 mb-10">
          {steps.map((s) => (
            <div key={s.event} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">{STEP_LABELS[s.event] ?? s.event}</span>
                <span className="text-cyan-400 font-bold text-lg">{s.uniqueUsers}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                  style={{ width: `${Math.min(100, (s.uniqueUsers / maxUsers) * 100)}%` }}
                />
              </div>
              {s.anonymousEvents > 0 && (
                <div className="text-slate-500 text-xs mt-1.5">+ {s.anonymousEvents} без сесії (не залогінені)</div>
              )}
            </div>
          ))}
        </div>

        {recentErrors.length > 0 && (
          <div className="bg-slate-800/50 border border-red-500/30 rounded-xl p-4">
            <h2 className="text-white font-semibold mb-3 text-sm">Останні помилки генерації</h2>
            <div className="space-y-2">
              {recentErrors.map((e, i) => (
                <div key={i} className="text-xs border-b border-slate-700/50 pb-2 last:border-0">
                  <span className="text-red-400">{e.message ?? "(без тексту)"}</span>
                  <span className="text-slate-500 ml-2">{new Date(e.createdAt).toLocaleString("uk-UA")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
