"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  Users,
  FileText,
  Wallet,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  ArrowLeft,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { PROGRAMS } from "@/lib/programs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
} from "recharts";

const PAGE_SIZE = 20;
type Granularity = "day" | "week" | "month";

// Дата-мітка "початку тижня" (понеділок) / "початку місяця" для
// групування щоденних лічильників у грубші відрізки на графіку.
function bucketKey(dateStr: string, granularity: Granularity): string {
  if (granularity === "day") return dateStr;
  const d = new Date(dateStr + "T00:00:00Z");
  if (granularity === "month") {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  }
  // week: відкат до понеділка цього тижня (ISO)
  const day = d.getUTCDay() || 7; // нд=0 -> 7
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

function bucketLabel(key: string, granularity: Granularity): string {
  if (granularity === "month") {
    const [y, m] = key.split("-");
    return `${m}.${y.slice(2)}`;
  }
  const d = new Date(key + "T00:00:00Z");
  return d.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
}

function aggregateSignups(
  daily: { date: string; count: number }[],
  granularity: Granularity
): { key: string; label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const d of daily) {
    const key = bucketKey(d.date, granularity);
    map.set(key, (map.get(key) || 0) + d.count);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([key, count]) => ({ key, label: bucketLabel(key, granularity), count }));
}

type AdminDocument = {
  id: string;
  title: string;
  subject: string | null;
  class: string | number | null;
  status: string;
  createdAt: string;
  creditsUsed: number | null;
};

type AdminUser = {
  id: string;
  signupNumber: number;
  email: string;
  fullName: string | null;
  schoolName: string | null;
  createdAt: string;
  credits: number;
  totalGenerations: number;
  documentsCount: number;
  paid: boolean;
  totalSpentUAH: number;
  documents: AdminDocument[];
};

type AdminStats = {
  summary: {
    totalUsers: number;
    totalDocuments: number;
    totalPaidUsers: number;
    totalTrialUsers: number;
    totalRevenueUAH: number;
    docsBySubject: Record<string, number>;
    docsByStatus: Record<string, number>;
    signupsByDay: { date: string; count: number }[];
  };
  users: AdminUser[];
};

const STATUS_LABELS: Record<string, string> = {
  ready: "Готово",
  error: "Помилка",
  generating: "Генерується",
  draft: "Чернетка",
};

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white leading-tight">{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminStats | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [granularity, setGranularity] = useState<Granularity>("week");
  const [showPrograms, setShowPrograms] = useState(false);
  const [creditInputs, setCreditInputs] = useState<Record<string, { amount: string; note: string }>>({});
  const [creditSaving, setCreditSaving] = useState<string | null>(null);
  const [creditMessage, setCreditMessage] = useState<{ userId: string; text: string; ok: boolean } | null>(null);

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

      const res = await fetch("/api/admin/stats", {
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

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGrantCredits = async (userId: string) => {
    const input = creditInputs[userId];
    const amount = Number(input?.amount);
    if (!input?.amount || !Number.isInteger(amount) || amount === 0) {
      setCreditMessage({ userId, text: "Введи ціле число, не 0", ok: false });
      return;
    }
    setCreditSaving(userId);
    setCreditMessage(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const res = await fetch("/api/admin/add-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ userId, amount, note: input.note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Помилка");

      setCreditMessage({ userId, text: `Готово, новий баланс: ${json.newBalance}`, ok: true });
      setCreditInputs((prev) => ({ ...prev, [userId]: { amount: "", note: "" } }));
      // Оновлюємо баланс у вже завантажених даних, не перезавантажуючи все.
      setData((prev) =>
        prev
          ? { ...prev, users: prev.users.map((u) => (u.id === userId ? { ...u, credits: json.newBalance } : u)) }
          : prev
      );
    } catch (e: any) {
      setCreditMessage({ userId, text: e.message || "Помилка", ok: false });
    } finally {
      setCreditSaving(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.users;
    return data.users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q) ||
        u.schoolName?.toLowerCase().includes(q)
    );
  }, [data, search]);

  // Скидаємо на першу сторінку щоразу, як змінюється пошук — інакше
  // легко залишитись на "сторінці 4", де після фільтра вже нічого нема.
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pagedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredUsers, page]
  );

  const signupChartData = useMemo(() => {
    if (!data) return [];
    return aggregateSignups(data.summary.signupsByDay, granularity);
  }, [data, granularity]);

  const topSubjects = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.summary.docsBySubject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [data]);

  const maxSubjectCount = topSubjects.length > 0 ? topSubjects[0][1] : 1;

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
          <p className="text-slate-400 mb-6">Ця сторінка доступна лише адміністраторам.</p>
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

  const { summary } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> У кабінет
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Адмін-панель
            </h1>
          </div>
          <button
            onClick={() => router.push("/admin/finance")}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm transition-colors"
          >
            <Wallet size={16} /> Фінанси (обидва проєкти)
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard icon={<Users size={20} className="text-cyan-400" />} label="Користувачів" value={summary.totalUsers} accent="bg-cyan-500/10" />
          <StatCard icon={<Sparkles size={20} className="text-amber-400" />} label="Платних" value={summary.totalPaidUsers} accent="bg-amber-500/10" />
          <StatCard icon={<Users size={20} className="text-slate-400" />} label="Пробних" value={summary.totalTrialUsers} accent="bg-slate-500/10" />
          <StatCard icon={<FileText size={20} className="text-teal-400" />} label="Документів" value={summary.totalDocuments} accent="bg-teal-500/10" />
          <StatCard icon={<Wallet size={20} className="text-green-400" />} label="Дохід" value={`${summary.totalRevenueUAH} ₴`} accent="bg-green-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Subjects breakdown */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Популярні предмети</h2>
            {topSubjects.length === 0 ? (
              <p className="text-slate-500 text-sm">Ще немає даних</p>
            ) : (
              <div className="space-y-2.5">
                {topSubjects.map(([subject, count]) => (
                  <div key={subject} className="flex items-center gap-3">
                    <div className="w-32 sm:w-40 shrink-0 text-xs text-slate-400 truncate">{subject}</div>
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                        style={{ width: `${(count / maxSubjectCount) * 100}%` }}
                      />
                    </div>
                    <div className="w-6 text-right text-xs text-slate-400">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signups over time */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Реєстрації за весь час</h2>
              <div className="flex bg-slate-900/50 rounded-lg p-0.5 gap-0.5">
                {(["day", "week", "month"] as Granularity[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGranularity(g)}
                    className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                      granularity === g ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {g === "day" ? "День" : g === "week" ? "Тиждень" : "Місяць"}
                  </button>
                ))}
              </div>
            </div>
            {signupChartData.length === 0 ? (
              <p className="text-slate-500 text-sm">Ще немає даних</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={signupChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    cursor={{ fill: "rgba(6, 182, 212, 0.08)" }}
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#22d3ee" }}
                    formatter={(value) => `${value} реєстрацій`}
                  />
                  <Bar dataKey="count" fill="#22d3ee" radius={[3, 3, 0, 0]} />
                  {signupChartData.length > 8 && (
                    <Brush
                      dataKey="label"
                      height={22}
                      travellerWidth={8}
                      stroke="#0891b2"
                      fill="#0f172a"
                      startIndex={Math.max(0, signupChartData.length - 12)}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Programs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl mb-6 overflow-hidden">
          <button
            onClick={() => setShowPrograms((v) => !v)}
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-teal-400" />
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Навчальні програми</h2>
              <span className="text-xs text-slate-500">
                {Object.keys(PROGRAMS).length} предметів ·{" "}
                {Object.values(PROGRAMS).reduce((sum, progs) => sum + Object.keys(progs).length, 0)} програм
              </span>
            </div>
            {showPrograms ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
          </button>

          {showPrograms && (
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(PROGRAMS).map(([subject, programs]) => (
                <div key={subject} className="bg-slate-900/40 rounded-xl p-4">
                  <h3 className="text-white font-semibold text-sm mb-2">{subject}</h3>
                  <div className="space-y-2">
                    {Object.entries(programs).map(([name, p]) => (
                      <div key={p.id} className="text-xs">
                        <div className="text-slate-300">{name}</div>
                        <div className="text-slate-500">
                          {p.classes.join(", ")} клас{p.classes.length > 1 ? "и" : ""} · {p.description}
                          {p.hasVariant && <span className="text-amber-400"> · варіативні модулі</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center gap-3">
            <Search size={16} className="text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук за поштою, ім'ям або школою..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500">{filteredUsers.length} з {data.users.length}</span>
          </div>

          <div className="divide-y divide-slate-700/60">
            {pagedUsers.map((u) => {
              const isOpen = expanded.has(u.id);
              return (
                <div key={u.id}>
                  <button
                    onClick={() => toggleExpanded(u.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors text-left"
                  >
                    {isOpen ? (
                      <ChevronDown size={16} className="text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-500 shrink-0" />
                    )}
                    <span className="text-xs text-slate-500 shrink-0 w-8 tabular-nums" title="Порядковий номер реєстрації">
                      №{u.signupNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-sm truncate">{u.fullName || "Без імені"}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                            u.paid
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-600/30 text-slate-400 border border-slate-600/40"
                          }`}
                        >
                          {u.paid ? `Платний · ${u.totalSpentUAH}₴` : "Пробний"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">{u.email}</div>
                    </div>
                    <div className="hidden sm:block text-xs text-slate-500 shrink-0">
                      {new Date(u.createdAt).toLocaleDateString("uk-UA")}
                    </div>
                    <div className="text-xs text-cyan-400 shrink-0 w-24 text-right">
                      {u.documentsCount} {u.documentsCount === 1 ? "документ" : "документів"}
                    </div>
                    <div className="text-xs text-slate-500 shrink-0 w-16 text-right hidden sm:block">
                      {u.credits} кред.
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pl-10">
                      {u.schoolName && (
                        <div className="text-xs text-slate-500 mb-2">🏫 {u.schoolName}</div>
                      )}

                      {/* Ручне нарахування/списання кредитів — для компенсацій, бонусів
                          першим користувачам тощо. */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 bg-slate-900/40 rounded-lg p-2.5">
                        <input
                          type="number"
                          placeholder="±кредити"
                          value={creditInputs[u.id]?.amount ?? ""}
                          onChange={(e) =>
                            setCreditInputs((prev) => ({ ...prev, [u.id]: { amount: e.target.value, note: prev[u.id]?.note ?? "" } }))
                          }
                          className="w-24 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          placeholder="Причина (необов'язково)"
                          value={creditInputs[u.id]?.note ?? ""}
                          onChange={(e) =>
                            setCreditInputs((prev) => ({ ...prev, [u.id]: { amount: prev[u.id]?.amount ?? "", note: e.target.value } }))
                          }
                          className="flex-1 min-w-[140px] bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => handleGrantCredits(u.id)}
                          disabled={creditSaving === u.id}
                          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
                        >
                          {creditSaving === u.id ? "..." : "Застосувати"}
                        </button>
                        {creditMessage?.userId === u.id && (
                          <span className={`text-xs ${creditMessage.ok ? "text-green-400" : "text-red-400"}`}>
                            {creditMessage.text}
                          </span>
                        )}
                      </div>

                      {u.documents.length === 0 ? (
                        <p className="text-xs text-slate-500">Ще не генерував документів</p>
                      ) : (
                        <div className="space-y-1.5">
                          {u.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 text-xs bg-slate-900/40 rounded-lg px-3 py-2"
                            >
                              <FileText size={12} className="text-slate-500 shrink-0" />
                              <span className="text-slate-300 flex-1 truncate">
                                {doc.subject || doc.title} {doc.class ? `· ${doc.class} клас` : ""}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                                  doc.status === "ready"
                                    ? "bg-green-500/15 text-green-400"
                                    : doc.status === "error"
                                    ? "bg-red-500/15 text-red-400"
                                    : "bg-slate-500/15 text-slate-400"
                                }`}
                              >
                                {STATUS_LABELS[doc.status] || doc.status}
                              </span>
                              <span className="text-slate-500 shrink-0">
                                {new Date(doc.createdAt).toLocaleDateString("uk-UA")}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-700">
              <span className="text-xs text-slate-500">
                Сторінка {page} з {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-slate-900/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .map((n, i, arr) => (
                    <span key={n} className="flex items-center">
                      {i > 0 && arr[i - 1] !== n - 1 && <span className="text-slate-600 px-1">…</span>}
                      <button
                        onClick={() => setPage(n)}
                        className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                          n === page ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                        }`}
                      >
                        {n}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-slate-900/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
