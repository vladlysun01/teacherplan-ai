// Генератор календарних планів з англійської мови, 10-11 класи.
//
// На відміну від предметів із фіксованою розбивкою тем по годинах
// (історія, хімія тощо), програма з іноземної мови — рамкова: у
// офіційному документі немає погодинного плану, лише перелік тем
// ситуативного спілкування й мовний інвентар (лексика/граматика).
// Тому кількість уроків на тему тут розраховується пропорційно від
// загальної кількості уроків семестру, а не береться з джерела напряму.
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { ENGLISH_ADVANCED, ENGLISH_STANDARD, ENGLISH_SECOND, type LangTrackData } from "./english-data";

export interface EnglishPlanSettings {
  class: string;
  subject: string;
  schoolYear: string;
  semester: string;
  weekdays: string;
  startDate: string;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
  programId?: string;
}

// Той самий патерн визначення рівня з programId, що й у mathematics-plan.ts.
function getTrack(programId?: string): LangTrackData {
  if (programId?.includes("advanced")) return ENGLISH_ADVANCED;
  if (programId?.includes("second")) return ENGLISH_SECOND;
  return ENGLISH_STANDARD;
}

// Уроки з певної теми циклічно проходять ці види діяльності — так
// реальний учитель і будує послідовність уроків з іноземної мови:
// від уведення лексики до контролю.
const LESSON_CYCLE = [
  "Уведення й активізація лексики за темою",
  "Аудіювання за темою",
  "Розвиток навичок говоріння (діалогічне мовлення)",
  "Читання автентичного тексту за темою",
  "Граматичний матеріал у контексті теми",
  "Розвиток навичок писемного мовлення",
  "Узагальнення теми, контроль мовленнєвих умінь",
];

function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function generateEnglishCalendarPlan(settings: EnglishPlanSettings) {
  const track = getTrack(settings.programId);
  const classNum = parseInt(settings.class);
  const grade = classNum === 11 ? track.grade11 : track.grade10;

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  const maxLessons = (semester === 1 ? 16 : 19) * track.weeklyHours;
  const topics = grade.topics;

  // Розподіляємо уроки семестру між темами пропорційно — залишок
  // (maxLessons % topics.length) додається першим темам, щоб не
  // втрачати уроки на округленні.
  const base = Math.floor(maxLessons / topics.length);
  const remainder = maxLessons % topics.length;
  const lessonsPerTopic = topics.map((_, i) => base + (i < remainder ? 1 : 0));

  const lessons: any[] = [];
  let lessonNumber = 1;
  let currentDate = new Date(startDate);

  topics.forEach((topic, topicIndex) => {
    const count = lessonsPerTopic[topicIndex];
    for (let i = 0; i < count; i++) {
      if (lessons.length >= maxLessons) return;

      while (weekdays.length > 0 && !weekdays.includes(getWeekdayName(currentDate))) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const activity = LESSON_CYCLE[i % LESSON_CYCLE.length];
      const grammarItem = grade.grammar[lessonNumber % grade.grammar.length];

      lessons.push({
        number: lessonNumber,
        date: formatDate(currentDate),
        moduleName: `${topic.sphere}: ${topic.topic}`,
        topic: `${topic.topic}. ${activity}`,
        content:
          activity.includes("Граматичний")
            ? `Опрацювання граматичної теми в контексті «${topic.topic}»: ${grammarItem.category} — ${grammarItem.structure}. Практичні вправи, комунікативні завдання за темою уроку.`
            : `${activity} у межах теми «${topic.topic}» (сфера спілкування: ${topic.sphere}). Мовленнєві завдання відповідно до комунікативних потреб учнів, робота з лексичним матеріалом теми.`,
      });

      lessonNumber++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return {
    subject: settings.subject,
    class: settings.class,
    schoolYear: settings.schoolYear,
    semester: settings.semester,
    teacherName: settings.teacherName,
    teacherCategory: settings.teacherCategory,
    schoolName: settings.schoolName,
    lessons,
  };
}
