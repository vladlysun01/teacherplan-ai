"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function AuthHeaderButtons() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setChecked(true);
    };
    checkUser();
  }, []);

  // Поки йде перевірка користувача, показуємо кнопки для неавторизованих —
  // це те, що бачить і краулер, і 95% реальних відвідувачів (гості).
  // Це НЕ блокує рендер решти сторінки на відміну від попередньої реалізації.
  if (checked && user) {
    return (
      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 font-medium"
      >
        Перейти до Dashboard
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
      >
        Увійти
      </button>
      <button
        onClick={() => router.push("/register")}
        className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 font-medium"
      >
        Зареєструватись
      </button>
    </>
  );
}
