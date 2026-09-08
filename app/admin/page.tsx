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
  Search,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

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

  const topSubjects = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.summary.docsBySubject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [data]);

  const maxSubjectCount = topSubjects.length > 0 ? topSubjects[0][1] : 1;
  const maxSignups = data ? Math.max(1, ...data.summary.signupsByDay.map((d) => d.count)) : 1;

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

          {/* Signups by day */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Реєстрації за 14 днів</h2>
            <div className="flex items-end gap-1 h-24">
              {summary.signupsByDay.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500 to-teal-400 rounded-sm min-h-[2px]"
                    style={{ height: `${(d.count / maxSignups) * 100}%` }}
                    title={`${d.date}: ${d.count}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
              <span>{summary.signupsByDay[0]?.date.slice(5)}</span>
              <span>{summary.signupsByDay[summary.signupsByDay.length - 1]?.date.slice(5)}</span>
            </div>
          </div>
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
            {filteredUsers.map((u) => {
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
        </div>
      </div>
    </div>
  );
}
