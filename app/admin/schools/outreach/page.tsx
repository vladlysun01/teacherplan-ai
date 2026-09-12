"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ArrowLeft, ShieldAlert, Mail, Phone } from "lucide-react";

type School = {
  id: string;
  name: string;
  region: string | null;
  locality: string | null;
  street_address: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  alreadySent: boolean;
};

const DEFAULT_SUBJECT = "Пропозиція для {{school_name}} — TeacherPlan AI, календарні плани за 10 секунд";
const DEFAULT_BODY = `<p>Доброго дня, {{contact_name}}!</p>
<p>Пишу з TeacherPlan AI — сервісу, який генерує календарно-тематичні плани для вчителів відповідно до чинної програми МОН України за 10 секунд замість 4-6 годин ручної роботи.</p>
<p>Для закладів освіти є пакетний доступ на весь педколектив з оплатою рахунком на заклад (не карткою вчителя):</p>
<ul>
  <li>10 вчителів — від 4 500 ₴ на навчальний рік</li>
  <li>25 вчителів — від 9 900 ₴ на навчальний рік</li>
  <li>Необмежено — за домовленістю</li>
</ul>
<p>Детальніше й заявка без миттєвої оплати: <a href="https://www.teacher-plan-ai.site/dlya-shkil">teacher-plan-ai.site/dlya-shkil</a></p>
<p>Будемо раді відповісти на запитання й, за потреби, показати коротку демонстрацію на планерці методоб'єднання.</p>
<p>З повагою,<br/>TeacherPlan AI</p>`;

export default function AdminSchoolsOutreachPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  const [schools, setSchools] = useState<School[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [onlyNotSent, setOnlyNotSent] = useState(true);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [bodyHtml, setBodyHtml] = useState(DEFAULT_BODY);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sentCount: number; failedCount: number } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const loadSchools = useCallback(
    async (authToken: string) => {
      const params = new URLSearchParams({ page: String(page), onlyNotSent: String(onlyNotSent) });
      if (region) params.set("region", region);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/schools-outreach?${params}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401 || res.status === 403) {
        setDenied(true);
        setLoading(false);
        return;
      }
      const body = await res.json();
      setSchools(body.schools ?? []);
      setTotal(body.total ?? 0);
      setRegions(body.regions ?? []);
      setLoading(false);
    },
    [page, region, search, onlyNotSent]
  );

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setToken(session.access_token);
      await loadSchools(session.access_token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, region, search, onlyNotSent]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      schools.forEach((s) => next.add(s.id));
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function sendBatch() {
    if (!token || selected.size === 0) return;
    setSending(true);
    setSendError(null);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/schools-outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ buyerIds: Array.from(selected), subject, bodyHtml }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Помилка відправки");
      setSendResult({ sentCount: body.sentCount, failedCount: body.failedCount });
      clearSelection();
      await loadSchools(token);
    } catch (err: any) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  function exportCsv() {
    const header = "Назва,Регіон,Населений пункт,Адреса,Контактна особа,Email,Телефон\n";
    const rows = schools
      .map((s) =>
        [s.name, s.region, s.locality, s.street_address, s.contact_name, s.contact_email, s.contact_phone]
          .map((v) => `"${(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shkoly-storinka-${page + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/admin/schools")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm mb-2 transition-colors"
        >
          <ArrowLeft size={14} /> До заявок шкіл
        </button>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-1">
          Холодний аутріч шкіл
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Джерело контактів — офіційно опубліковані на Prozorro дані замовника. Дані живуть у базі tender-intel,
          лист надсилається вручну на обрану пачку.
        </p>

        {/* Фільтри */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <input
            placeholder="Пошук за назвою…"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white min-w-[220px]"
          />
          <select
            value={region}
            onChange={(e) => {
              setPage(0);
              setRegion(e.target.value);
            }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">Усі регіони</option>
            {regions.map((r) => (
              <option key={r} value={r} className="bg-slate-800">{r}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={onlyNotSent}
              onChange={(e) => {
                setPage(0);
                setOnlyNotSent(e.target.checked);
              }}
            />
            лише кому ще не надсилали
          </label>
          <div className="ml-auto text-slate-400 text-sm">Знайдено: {total.toLocaleString("uk-UA")}</div>
        </div>

        {/* Дії над списком */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={selectAllOnPage} className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            Обрати всіх на сторінці
          </button>
          <button onClick={clearSelection} className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            Зняти вибір
          </button>
          <button onClick={exportCsv} className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            Експорт CSV (сторінка)
          </button>
          <div className="ml-auto text-sm text-slate-400 self-center">Обрано: {selected.size}</div>
        </div>

        {/* Таблиця */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 text-left text-slate-400 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Заклад</th>
                  <th className="px-4 py-3">Регіон</th>
                  <th className="px-4 py-3">Контактна особа</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Телефон</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id} className="border-t border-slate-700">
                    <td className="px-4 py-2.5">
                      <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
                    </td>
                    <td className="px-4 py-2.5 text-white max-w-[280px]">{s.name}</td>
                    <td className="px-4 py-2.5 text-slate-300">{s.region ?? "—"}</td>
                    <td className="px-4 py-2.5 text-slate-300">{s.contact_name ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <a href={`mailto:${s.contact_email}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                        <Mail size={12} /> {s.contact_email}
                      </a>
                    </td>
                    <td className="px-4 py-2.5">
                      {s.contact_phone ? (
                        <a href={`tel:${s.contact_phone}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                          <Phone size={12} /> {s.contact_phone}
                        </a>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {s.alreadySent ? (
                        <span className="text-green-400">вже надіслано</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {schools.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      Нічого не знайдено за цими фільтрами.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Пагінація */}
        <div className="flex items-center gap-3 mb-8 text-sm">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg disabled:opacity-40 transition-colors"
          >
            ← Назад
          </button>
          <span className="text-slate-400">
            Сторінка {page + 1} з {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <button
            disabled={(page + 1) * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg disabled:opacity-40 transition-colors"
          >
            Далі →
          </button>
        </div>

        {/* Лист */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-1">Текст листа</h2>
          <p className="text-slate-500 text-xs mb-3">
            Плейсхолдери <code className="text-cyan-400">{"{{school_name}}"}</code> і{" "}
            <code className="text-cyan-400">{"{{contact_name}}"}</code> підставляються окремо під кожного отримувача.
          </p>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm mb-3"
          />
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={12}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-mono mb-4"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={sendBatch}
              disabled={sending || selected.size === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl text-sm font-semibold transition-all"
            >
              {sending ? "Надсилаю…" : `Відправити (${selected.size})`}
            </button>
            {sendResult && (
              <span className="text-green-400 text-sm">
                Надіслано: {sendResult.sentCount}
                {sendResult.failedCount > 0 ? `, помилок: ${sendResult.failedCount}` : ""}
              </span>
            )}
            {sendError && <span className="text-red-400 text-sm">{sendError}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
