"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ArrowLeft, ShieldAlert, School, FileDown, Loader, Send } from "lucide-react";

type Lead = {
  id: string;
  school_name: string;
  contact_name: string;
  phone: string;
  email: string;
  teachers_count: string | null;
  package_id: string | null;
  comment: string | null;
  status: "new" | "contacted" | "invoiced" | "paid" | "declined";
  created_at: string;
};

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "Нова",
  contacted: "Зв'язались",
  invoiced: "Виставлено рахунок",
  paid: "Оплачено",
  declined: "Відмова",
};

const STATUS_COLORS: Record<Lead["status"], string> = {
  new: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  contacted: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  invoiced: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  paid: "bg-green-500/20 text-green-400 border-green-500/30",
  declined: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function AdminSchoolsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Форма рахунку
  const [invoiceLead, setInvoiceLead] = useState<Lead | null>(null);
  const [buyerCode, setBuyerCode] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("пакет");
  const [unitPrice, setUnitPrice] = useState("");
  const [generating, setGenerating] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setToken(session.access_token);
      const res = await fetch("/api/school-leads", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const json = await res.json();
      if (res.ok) setLeads(json.leads || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Lead["status"]) => {
    if (!token) return;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/school-leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
  };

  const openInvoiceForm = (lead: Lead) => {
    setInvoiceLead(lead);
    setBuyerCode("");
    setDescription(
      `Доступ до TeacherPlan AI для ${lead.school_name}${lead.package_id ? `, пакет «${lead.package_id}»` : ""}, 2026/2027 навчальний рік`
    );
    setQuantity("1");
    setUnit("пакет");
    setUnitPrice("");
    setInvoiceError(null);
  };

  const generateInvoice = async () => {
    if (!token || !invoiceLead) return;
    setInvoiceError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          buyerName: invoiceLead.school_name,
          buyerCode: buyerCode || undefined,
          description,
          quantity: Number(quantity),
          unit,
          unitPrice: Number(unitPrice),
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Не вдалося згенерувати рахунок");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rahunok-${invoiceLead.school_name.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ0-9]/g, "-")}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      await updateStatus(invoiceLead.id, "invoiced");
      setInvoiceLead(null);
    } catch (e: any) {
      setInvoiceError(e.message || "Помилка генерації");
    } finally {
      setGenerating(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center gap-2">
              <School size={28} className="text-cyan-400" /> Заявки шкіл
            </h1>
          </div>
          <a
            href="/admin/schools/outreach"
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm transition-colors"
          >
            <Send size={15} /> Холодний аутріч (Prozorro-школи)
          </a>
        </div>

        {leads.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10 text-center text-slate-400">
            Заявок ще немає. Форма — на публічній сторінці{" "}
            <a href="/dlya-shkil" target="_blank" className="text-cyan-400 hover:underline">/dlya-shkil</a>.
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-lg">{lead.school_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {lead.contact_name} · <a href={`tel:${lead.phone}`} className="hover:text-cyan-400">{lead.phone}</a> ·{" "}
                      <a href={`mailto:${lead.email}`} className="hover:text-cyan-400">{lead.email}</a>
                    </p>
                    {(lead.teachers_count || lead.package_id) && (
                      <p className="text-slate-500 text-xs mt-1">
                        {lead.teachers_count && `Вчителів: ${lead.teachers_count}`}
                        {lead.teachers_count && lead.package_id && " · "}
                        {lead.package_id && `Пакет: ${lead.package_id}`}
                      </p>
                    )}
                    {lead.comment && <p className="text-slate-400 text-sm mt-2 italic">«{lead.comment}»</p>}
                    <p className="text-slate-600 text-xs mt-2">{new Date(lead.created_at).toLocaleString("uk-UA")}</p>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                      className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value} className="bg-slate-800">{label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => openInvoiceForm(lead)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm transition-colors"
                    >
                      <FileDown size={14} /> Рахунок
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {invoiceLead && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setInvoiceLead(null)}>
            <div
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white">Рахунок для «{invoiceLead.school_name}»</h2>

              <div>
                <label className="block text-sm text-slate-400 mb-1">ЄДРПОУ закладу (необов'язково)</label>
                <input
                  value={buyerCode}
                  onChange={(e) => setBuyerCode(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Опис послуги</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Кількість</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Одиниця</label>
                  <input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ціна, грн</label>
                  <input
                    type="number"
                    min={1}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              {invoiceError && <p className="text-red-400 text-sm">{invoiceError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setInvoiceLead(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors"
                >
                  Скасувати
                </button>
                <button
                  onClick={generateInvoice}
                  disabled={generating || !unitPrice || !description}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  {generating ? <Loader className="animate-spin" size={16} /> : <FileDown size={16} />}
                  {generating ? "Генерація..." : "Завантажити .docx"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
