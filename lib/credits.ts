// lib/credits.ts
// Функції для роботи з системою кредитів

import { supabase } from './supabase';

// ==========================================
// ТИПИ
// ==========================================

export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  savings?: string;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'spend' | 'bonus' | 'refund';
  package?: string;
  price?: number;
  description?: string;
  created_at: string;
};

// ==========================================
// ПАКЕТИ КРЕДИТІВ
// ==========================================

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: '1_doc',
    name: '1 документ',
    credits: 1,
    price: 99,
  },
  {
    id: '3_docs',
    name: '3 документи',
    credits: 3,
    price: 249,
    popular: true,
    savings: 'Економія 48 грн',
  },
  {
    id: '10_docs',
    name: '10 документів',
    credits: 10,
    price: 599,
    savings: 'Економія 391 грн',
  },
];

// ==========================================
// ОТРИМАННЯ БАЛАНСУ КРЕДИТІВ
// ==========================================

export async function getUserCredits(userId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching credits:', error);
      return null;
    }

    return data?.credits ?? 0;
  } catch (error) {
    console.error('Error in getUserCredits:', error);
    return null;
  }
}

// ==========================================
// ПЕРЕВІРКА ЧИ ДОСТАТНЬО КРЕДИТІВ
// ==========================================

export async function hasEnoughCredits(
  userId: string,
  required: number = 1
): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits !== null && credits >= required;
}

// ==========================================
// ВИТРАТА КРЕДИТУ
// ==========================================

export async function spendCredit(
  userId: string,
  description: string = 'Генерація документу'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Перевіряємо чи є кредити
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      return { success: false, error: 'Недостатньо кредитів' };
    }

    // Викликаємо SQL функцію spend_credit
    const { data, error } = await supabase.rpc('spend_credit', {
      p_user_id: userId,
      p_description: description,
    });

    if (error) {
      console.error('Error spending credit:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Не вдалося витратити кредит' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in spendCredit:', error);
    return { success: false, error: 'Системна помилка' };
  }
}

// ==========================================
// ДОДАВАННЯ КРЕДИТІВ (після оплати)
// ==========================================

export async function addCredits(
  userId: string,
  packageId: string,
  paymentId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      return { success: false, error: 'Невідомий пакет' };
    }

    // Викликаємо SQL функцію add_credits
    const { data, error } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_amount: pkg.credits,
      p_package: pkg.id,
      p_price: pkg.price,
      p_description: `Покупка пакету: ${pkg.name}${paymentId ? ` (ID: ${paymentId})` : ''}`,
    });

    if (error) {
      console.error('Error adding credits:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in addCredits:', error);
    return { success: false, error: 'Системна помилка' };
  }
}

// ==========================================
// ОТРИМАННЯ ІСТОРІЇ ТРАНЗАКЦІЙ
// ==========================================

export async function getCreditTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCreditTransactions:', error);
    return [];
  }
}

// ==========================================
// ОТРИМАННЯ СТАТИСТИКИ
// ==========================================

export async function getUserStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits, total_generations')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    return {
      currentCredits: data?.credits ?? 0,
      totalGenerations: data?.total_generations ?? 0,
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return null;
  }
}

// ==========================================
// ФОРМАТУВАННЯ ЦІНИ
// ==========================================

export function formatPrice(price: number): string {
  return `${price} грн`;
}

// ==========================================
// УКРАЇНСЬКЕ ВІДМІНЮВАННЯ ЛІЧИЛЬНИКІВ
// (баг був у CreditsBalance.tsx: "1 або інше" — тому "3 Кредитів",
// "5 документи" тощо виглядало неправильно; тут повне правило 1/2-4/5+)
// ==========================================

export function pluralUk(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

// ==========================================
// ФОРМАТУВАННЯ ДАТИ
// ==========================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// ==========================================
// ОТРИМАННЯ ІКОНКИ ДЛЯ ТИПУ ТРАНЗАКЦІЇ
// ==========================================

export function getTransactionIcon(type: string): string {
  switch (type) {
    case 'purchase':
      return '💳';
    case 'spend':
      return '📄';
    case 'bonus':
      return '🎁';
    case 'refund':
      return '↩️';
    default:
      return '•';
  }
}

// ==========================================
// ОТРИМАННЯ КОЛЬОРУ ДЛЯ ТИПУ ТРАНЗАКЦІЇ
// ==========================================

export function getTransactionColor(type: string): string {
  switch (type) {
    case 'purchase':
    case 'bonus':
      return 'text-green-600';
    case 'spend':
      return 'text-red-600';
    case 'refund':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}
