"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ArrowLeft, Wallet, Download, ShieldAlert, AlertTriangle } from "lucide-react";

type UnifiedPayment = {
  project: "teacherplan" | "tenderintel";
  id: string;
  createdAt: string;
  userEmail: string | null;
  amountUAH: number;
  status: string;
  note: string | null;
};

type PeriodRow = { period: string; teacherplanUAH: number; tenderintelUAH: number; totalUAH: number };

type FinanceData = {
  summary: {
    totalUAH: number;
    totalTeacherplanUAH: number;
    totalTenderintelUAH: number;
    byMonth: PeriodRow[];
    byQuarter: PeriodRow[];
  };
  payments: UnifiedPayment[];
  tenderIntelError: string | null;
};

const PROJECT_LABELS: Record<string, string> = {
  teacherplan: "TeacherPlan",
  tenderintel: "TenderIntel",
};

function downloadCSV(payments: UnifiedPayment[]) {
  const header = ["Дата", "Проєкт", "Пошта", "Сума (₴)", "Статус", "Примітка"];
  const rows = payments.map((p) => [
    new Date(p.createdAt).toLocaleString("uk-UA"),
    PROJECT_LABELS[p.project] || p.project,
    p.userEmail || "",
    String(p.amountUAH),
    p.status,
    p.note || "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  // BOM — щоб Excel/Numbers коректно показали кирилицю.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `finance-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminFinancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FinanceData | null>(null);
  const [periodView, setPeriodView] = useState<"month" | "quarter">("month");

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const res = await fetch("/api/admin/finance", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Помилка завантаження");
      setData(json);
    } catch (e: any) {
      setError(e.message || "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  };

  const periodRows = useMemo(() => (data ? (periodView === "month" ? data.summary.byMonth : data.summary.byQuarter) : []), [data, periodView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Завантаження...</div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <ShieldAlert className="mx-auto text-red-400 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-white mb-2">Доступ заборонено</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 rounded-xl transition-all"
          >
            У кабінет
          </button>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center text-red-400">Помилка: {error}</div>
      </div>
    );
  }

  const { summary, payments, tenderIntelError } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> До адмінки
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Фінанси
            </h1>
            <p className="text-slate-500 text-sm mt-1">TeacherPlan + TenderIntel разом — для звітності</p>
          </div>
          <button
            onClick={() => downloadCSV(payments)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm transition-colors"
          >
            <Download size={16} /> Вивантажити CSV
          </button>
        </div>

        {tenderIntelError && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm">Дані TenderIntel недоступні</p>
              <p className="text-amber-200/70 text-xs mt-0.5">{tenderIntelError} — показані лише дані TeacherPlan.</p>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Wallet size={20} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white leading-tight">{summary.totalUAH.toLocaleString("uk-UA")} ₴</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Разом (усі підтверджені)</div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="text-xl font-bold text-cyan-400">{summary.totalTeacherplanUAH.toLocaleString("uk-UA")} ₴</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">TeacherPlan</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="text-xl font-bold text-teal-400">{summary.totalTenderintelUAH.toLocaleString("uk-UA")} ₴</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">TenderIntel</div>
          </div>
        </div>

        {/* Period breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Підсумки для звітності</h2>
            <div className="flex bg-slate-900/50 rounded-lg p-0.5 gap-0.5">
              {(["month", "quarter"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setPeriodView(v)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                    periodView === v ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {v === "month" ? "По місяцях" : "По кварталах"}
                </button>
              ))}
            </div>
          </div>
          {periodRows.length === 0 ? (
            <p className="text-slate-500 text-sm">Ще немає підтверджених оплат</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-700">
                    <th className="pb-2 pr-4">Період</th>
                    <th className="pb-2 pr-4 text-right">TeacherPlan</th>
                    <th className="pb-2 pr-4 text-right">TenderIntel</th>
                    <th className="pb-2 text-right">Разом</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {[...periodRows].reverse().map((row) => (
                    <tr key={row.period}>
                      <td className="py-2 pr-4 text-slate-300 tabular-nums">{row.period}</td>
                      <td className="py-2 pr-4 text-right text-slate-400 tabular-nums">{row.teacherplanUAH.toLocaleString("uk-UA")} ₴</td>
                      <td className="py-2 pr-4 text-right text-slate-400 tabular-nums">{row.tenderintelUAH.toLocaleString("uk-UA")} ₴</td>
                      <td className="py-2 text-right text-white font-medium tabular-nums">{row.totalUAH.toLocaleString("uk-UA")} ₴</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payments list */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Усі платежі ({payments.length})</h2>
          </div>
          {payments.length === 0 ? (
            <p className="text-slate-500 text-sm p-4">Ще немає жодного платежу</p>
          ) : (
            <div className="divide-y divide-slate-700/60 max-h-[600px] overflow-y-auto">
              {payments.map((p) => (
                <div key={`${p.project}-${p.id}`} className="flex items-center gap-3 p-3 text-sm">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide shrink-0 ${
                      p.project === "teacherplan" ? "bg-cyan-500/15 text-cyan-400" : "bg-teal-500/15 text-teal-400"
                    }`}
                  >
                    {PROJECT_LABELS[p.project]}
                  </span>
                  <span className="text-slate-300 flex-1 truncate">{p.userEmail || "—"}</span>
                  <span className="text-slate-500 text-xs shrink-0 hidden sm:block">{p.note}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
                      p.status === "completed" ? "bg-green-500/15 text-green-400" : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-white font-medium tabular-nums shrink-0 w-20 text-right">{p.amountUAH} ₴</span>
                  <span className="text-slate-500 text-xs shrink-0 w-24 text-right">
                    {new Date(p.createdAt).toLocaleDateString("uk-UA")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
