"use client";

import { useState } from "react";
import { Loader, CheckCircle } from "lucide-react";

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    schoolName: "",
    contactName: "",
    phone: "",
    email: "",
    teachersCount: "1-10",
    packageId: "10",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/school-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Не вдалося надіслати заявку");
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Помилка. Спробуйте ще раз або напишіть на пошту.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 text-center">
        <CheckCircle className="mx-auto text-cyan-400 mb-4" size={40} />
        <h3 className="text-xl font-bold text-white mb-2">Заявку надіслано</h3>
        <p className="text-slate-400">Ми зв'яжемося з вами протягом 1-2 робочих днів.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Назва закладу *</label>
          <input
            required
            value={form.schoolName}
            onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            placeholder="Наприклад: Олександрівський ліцей"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Контактна особа *</label>
          <input
            required
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            placeholder="Директор / завуч / методист"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Телефон *</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            placeholder="+380..."
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            placeholder="school@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Скільки орієнтовно вчителів</label>
          <select
            value={form.teachersCount}
            onChange={(e) => setForm({ ...form, teachersCount: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="1-10">1-10</option>
            <option value="10-25">10-25</option>
            <option value="25+">25+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Орієнтовний пакет</label>
          <select
            value={form.packageId}
            onChange={(e) => setForm({ ...form, packageId: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="10">10 акаунтів</option>
            <option value="25">25 акаунтів</option>
            <option value="unlimited">Необмежено</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Коментар (необов'язково)</label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          placeholder="Будь-які деталі — зручний час дзвінка, питання щодо оплати тощо"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-semibold transition-all"
      >
        {loading && <Loader className="animate-spin" size={18} />}
        {loading ? "Надсилання..." : "Залишити заявку"}
      </button>
      <p className="text-xs text-slate-500 text-center">
        Без миттєвої оплати карткою — ми зв'яжемось, узгодимо деталі й за потреби виставимо рахунок на заклад.
      </p>
    </form>
  );
}
