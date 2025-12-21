/**
 * Універсальна утиліта для конвертації параметрів з dashboard
 * Використовується всіма генераторами
 */

// Конвертація днів тижня - повертає масив рядків ["Пн", "Вт", "Ср"]
export function convertWeekdays(weekdays: string | string[]): string[] {
  if (typeof weekdays === 'string') {
    return weekdays.split(',').map(d => d.trim()).filter(d => d);
  }
  return weekdays;
}

// Конвертація семестру
export function convertSemester(semester: string | number): number {
  return typeof semester === 'string' ? parseInt(semester) : semester;
}

// Конвертація дати старту
export function convertStartDate(startDate: string | Date): Date {
  return typeof startDate === 'string' ? new Date(startDate) : startDate;
}

// ✅ НОВА ФУНКЦІЯ: Дати семестрів (український навчальний рік)
export function getSemesterDates(schoolYear: string) {
  const year = parseInt(schoolYear.split('/')[0]);
  
  return {
    semester1: {
      start: new Date(year, 8, 1),   // 1 вересня
      end: new Date(year, 11, 31)     // 31 грудня
    },
    semester2: {
      start: new Date(year + 1, 0, 9), // 9 січня
      end: new Date(year + 1, 4, 31)   // 31 травня
    }
  };
}

// ✅ НОВА ФУНКЦІЯ: Підрахунок уроків у періоді
export function countLessonsInPeriod(
  startDate: Date,
  endDate: Date,
  weekdays: number[]
): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (weekdays.includes(current.getDay())) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// ✅ НОВА ФУНКЦІЯ: Генерація дат уроків для семестру
export function generateLessonDates(
  startDate: Date,
  endDate: Date,
  weekdays: number[],
  totalLessons: number
): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  
  while (dates.length < totalLessons && current <= endDate) {
    if (weekdays.includes(current.getDay())) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// ✅ НОВА ФУНКЦІЯ: Розподіл тем на уроки семестру
export function distributeTopicsToLessons<T extends { topic: string }>(
  topics: T[],
  totalLessons: number
): Array<T & { lessonNumber: number; repeatNumber?: number }> {
  const result: Array<T & { lessonNumber: number; repeatNumber?: number }> = [];
  
  const totalTopics = topics.length;
  
  if (totalTopics === 0) {
    return result;
  }
  
  if (totalTopics >= totalLessons) {
    // Тем достатньо - беремо потрібну кількість
    for (let i = 0; i < totalLessons; i++) {
      result.push({
        ...topics[i],
        lessonNumber: i + 1
      });
    }
  } else {
    // Тем мало - розподіляємо рівномірно
    const lessonsPerTopic = Math.floor(totalLessons / totalTopics);
    const extraLessons = totalLessons % totalTopics;
    
    let lessonNumber = 1;
    
    topics.forEach((topic, topicIdx) => {
      const lessonsForThisTopic = lessonsPerTopic + (topicIdx < extraLessons ? 1 : 0);
      
      for (let repeatNum = 0; repeatNum < lessonsForThisTopic; repeatNum++) {
        result.push({
          ...topic,
          lessonNumber,
          repeatNumber: lessonsForThisTopic > 1 ? repeatNum + 1 : undefined
        });
        lessonNumber++;
      }
    });
  }
  
  return result;
}

// Форматування дати для відображення
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// ✅ НОВА ФУНКЦІЯ: Конвертація programId в параметри
export function parseProgramId(programId: string): {
  level?: 'стандарт' | 'поглиблений' | 'профільний';
  type?: string;
  classes?: number[];
} {
  const result: any = {};
  
  // Визначаємо рівень
  if (programId.includes('standard') || programId.includes('standart')) {
    result.level = 'стандарт';
  } else if (programId.includes('advanced')) {
    result.level = 'поглиблений';
  } else if (programId.includes('profile') || programId.includes('profil')) {
    result.level = 'профільний';
  }
  
  // Визначаємо класи
  if (programId.includes('10-11')) {
    result.classes = [10, 11];
  } else if (programId.includes('5-9')) {
    result.classes = [5, 6, 7, 8, 9];
  } else if (programId.includes('6-9')) {
    result.classes = [6, 7, 8, 9];
  }
  
  return result;
}
