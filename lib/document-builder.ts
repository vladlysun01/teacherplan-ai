// lib/document-builder.ts
//
// Генерація .docx у нашому власному коді — заміна Google Apps Script.
// Причини переходу (реальні, не гіпотетичні):
// 1) кожен документ раніше падав в ОСОБИСТИЙ Google Drive власника
//    Apps Script, а не в інфраструктуру продукту — звідси "Almost out
//    of storage" на реальному акаунті;
// 2) ітерація вимагала копіювати код руками в редактор Apps Script,
//    вручну передеплоювати і чекати скріншот, щоб побачити результат;
// 3) Web App має власні квоти виконання/запитів, які могли почати
//    падати непередбачувано під реальним навантаженням.
//
// Логіка (титульна сторінка, відступи, відмінки, абревіатура ПІБ)
// перенесена з GOOGLE_APPS_SCRIPT.js 1-в-1, тільки одиниці виміру інші:
// Apps Script рахує в пунктах, docx — у твіпах (1pt = 20 twips) для
// відступів і в напівпунктах (1pt = 2) для розміру шрифту.

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  Packer,
  VerticalAlign,
  TableLayoutType,
} from "docx";

const PT = 20; // twips на пункт (spacing)
const HP = 2; // напівпункти на пункт (розмір шрифту)
const BLACK = "000000";

export type Lesson = {
  number?: number;
  lessonNumber?: number;
  date?: string;
  topic?: string;
  moduleName?: string;
  homework?: string;
  content?:
    | string
    | {
        organizationalMoment?: string;
        actualization?: string;
        motivation?: string;
        mainPart?: string;
        practice?: string;
        consolidation?: string;
        homework?: string;
      };
};

export type PlanData = {
  subject: string;
  class: string | number;
  schoolName?: string;
  schoolYear?: string;
  semester?: string;
  teacherName?: string;
  teacherCategory?: string;
  lessons: Lesson[];
  // Реферальна програма: тонкий підпис знизу документа. Учителі й так
  // обмінюються готовими планами між собою — кожен такий обмін файлом
  // стає точкою поширення без жодної додаткової дії користувача.
  referralLink?: string;
};

// "Іванов Іван Іванович" → "Іванов І.І." Якщо вже скорочено чи 1-2 слова —
// не ламаємо. (1-в-1 з GOOGLE_APPS_SCRIPT.js formatTeacherName)
function formatTeacherName(fullName?: string): string {
  if (!fullName) return "";
  if (fullName.includes(".")) return fullName;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
  if (parts.length === 2) return `${parts[0]} ${parts[1][0]}.`;
  return fullName;
}

// Родовий відмінок для "Календарне планування з ..." — фіксований словник
// на 14 предметів (1-в-1 з GOOGLE_APPS_SCRIPT.js genitiveSubject).
const GENITIVE: Record<string, string> = {
  "Фізична культура": "фізичної культури",
  "Українська мова": "української мови",
  "Українська література": "української літератури",
  "Математика": "математики",
  "Інформатика": "інформатики",
  "Історія України": "історії України",
  "Всесвітня історія": "всесвітньої історії",
  "Мистецтво": "мистецтва",
  "Географія": "географії",
  "Основи правознавства": "основ правознавства",
  "Хімія": "хімії",
  "Біологія": "біології",
  "Фізика": "фізики",
  "Захист України": "захисту України",
};
function genitiveSubject(subject: string): string {
  return GENITIVE[subject] || subject;
}

function centerParagraph(text: string, opts: { size?: number; bold?: boolean } = {}): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text,
        bold: !!opts.bold, // завжди явно true/false — саме тут була жирність "нізвідки" в Apps Script
        size: (opts.size || 12) * HP,
        color: BLACK,
      }),
    ],
  });
}

// Вертикальний відступ на титульній сторінці — просто N окремих
// порожніх абзаців БЕЗ жодних спеціальних властивостей (не
// spacing.before, не line/lineRule).
//
// Історія двох попередніх спроб, обидві провалились на реальному
// скріні з Pages:
//   1) paragraph.spacing.before (twips) — у XML значення були рівно
//      такі, як задумано (120pt/160pt/210pt), перевірено прямо в
//      document.xml, але Pages текст усе одно стягнув угору сторінки.
//   2) один порожній абзац із spacing.line + lineRule: EXACT — та сама
//      історія, Pages і це проігнорував.
// Обидва рази Pages явно не рахує "розумні" властивості відступу на
// майже порожньому абзаці. Тому тепер — найпримітивніший можливий
// прийом: просто N абзаців зі звичайним пробілом, кожен своєї
// стандартної висоти, буквально як людина натиснула б Enter кілька
// разів. Це не спеціальна фіча, яку можна проігнорувати чи по-своєму
// трактувати — це базове верстання тексту, однакове в будь-якому
// редакторі.
//
// Приймає КІЛЬКІСТЬ рядків напряму (не pt) — щоб позиція завжди
// рахувалась від конкретної цілі (buildTitlePage нижче), а не від
// зашитого наперед числа.
function blankLines(count: number, alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.CENTER): Paragraph[] {
  // alignment на порожньому рядку нічого візуально не змінює (там лише
  // пробіл), АЛЕ: реальний скрін показав усю титульну сторінку
  // притиснутою ліворуч, хоча XML має правильні jc=center/right —
  // підозра, що Pages плутає вирівнювання НАСТУПНИХ абзаців, коли між
  // ними стоїть абзац зовсім БЕЗ w:jc (default None). Явно виставляємо
  // його тут теж, щоб у всьому документі не лишалось жодного абзацу
  // без прямо заданого вирівнювання.
  return Array.from({ length: Math.max(0, count) }, () => new Paragraph({ alignment, children: [new TextRun({ text: " " })] }));
}

// Параметри сторінки й калібрування — з реального зразка користувача
// (той самий Word-документ, що показує, як має виглядати титулка) і з
// прямих замірів того, як Pages насправді рендерить наш .docx:
//   - сторінка за замовчуванням у бібліотеці docx — A4 (841.9pt);
//   - висота ОДНОГО порожнього/текстового рядка в Pages ≈ 12pt —
//     виміряно з двох реальних генерацій (2 рядки відступу дали 10.9%
//     висоти сторінки, 17 рядків — 32.4%: (0.324-0.109)*841.9/15 ≈ 12pt);
//   - цільові позиції (частка висоти сторінки, де має починатись кожен
//     блок) — виміряні напряму зі скріна оригінального зразка: титул
//     35.85%, блок вчителя 67.02%, нижній рядок 91.68%.
// Оскільки довжина назви школи чи кількість рядків вчителя можуть бути
// різними, відступи рахуються ДИНАМІЧНО від поточної позиції до цілі —
// а не фіксованою кількістю рядків, яка "розповзається" при зміні
// вхідних даних.
const PAGE_HEIGHT_PT = 841.9; // A4
const MARGIN_PT = 50; // ті самі 50pt, що і page.margin.top/bottom нижче
const LINE_HEIGHT_PT = 12;
const TITLE_TARGET_PT = 0.3585 * PAGE_HEIGHT_PT;
const TEACHER_TARGET_PT = 0.6702 * PAGE_HEIGHT_PT;
const FOOTER_TARGET_PT = 0.9168 * PAGE_HEIGHT_PT;

// Запобіжник від переповнення на другу сторінку. LINE_HEIGHT_PT=12 —
// емпіричне наближення; на короткій назві школи (1 рядок замість 3)
// накопичена похибка за ~45 порожніх абзаців виявилась достатньою,
// щоб нижній рядок фактично зʼїхав на сторінку 2, хоча розрахунок "на
// папері" мав ще запас. 40pt запасу знизу — краще трохи не дотягнути
// до ідеальних 91.68%, ніж гарантовано провалитись на другу сторінку.
const SAFE_BOTTOM_PT = PAGE_HEIGHT_PT - MARGIN_PT - 40;

function gapLinesTo(currentPt: number, targetPt: number): number {
  return Math.max(0, Math.round((targetPt - currentPt) / LINE_HEIGHT_PT));
}

// Не дає жодному відступу штовхнути контент за межі безпечної зони
// внизу сторінки — рахує, скільки рядків реально лишається "в бюджеті"
// з урахуванням того, що ПІСЛЯ цього відступу ще йде принаймні один
// рядок тексту.
function clampToBudget(currentPt: number, lines: number): number {
  const maxLines = Math.max(0, Math.floor((SAFE_BOTTOM_PT - LINE_HEIGHT_PT - currentPt) / LINE_HEIGHT_PT));
  return Math.min(lines, maxLines);
}

function buildTitlePage(data: PlanData, className: string): Paragraph[] {
  const paras: Paragraph[] = [];
  let pos = MARGIN_PT; // поточна позиція від верху сторінки (pt)

  // Назва закладу — підтримуємо той самий формат: користувач може ввести
  // текст із \n (кілька рядків) або одним абзацом, що сам перенесеться
  // (word wrap робить Word/Google Docs автоматично).
  if (data.schoolName) {
    const schoolLines = data.schoolName.split("\n");
    schoolLines.forEach((line) => paras.push(centerParagraph(line.trim())));
    pos += schoolLines.length * LINE_HEIGHT_PT;
  }

  const n1 = clampToBudget(pos, gapLinesTo(pos, TITLE_TARGET_PT));
  paras.push(...blankLines(n1));
  pos += n1 * LINE_HEIGHT_PT;

  const titleLines = [
    { text: "Календарне планування", opts: { size: 14, bold: true } },
    { text: `з предмету «${data.subject}» у ${className} класі`, opts: {} },
    { text: "курсу інваріантної складової навчального плану,", opts: {} },
    { text: `на ${data.schoolYear || "2024/2025"} навчальний рік`, opts: {} },
  ];
  titleLines.forEach(({ text, opts }) => paras.push(centerParagraph(text, opts)));
  pos += titleLines.length * LINE_HEIGHT_PT;

  const n2 = clampToBudget(pos, gapLinesTo(pos, TEACHER_TARGET_PT));
  paras.push(...blankLines(n2, AlignmentType.RIGHT)); // далі йде блок вчителя, по правому краю
  pos += n2 * LINE_HEIGHT_PT;

  const teacherLines = [
    "Вчитель предмету",
    `«${data.subject}»`,
    data.teacherCategory || "",
    formatTeacherName(data.teacherName),
  ].filter((line) => line && line.trim());

  teacherLines.forEach((line) => {
    paras.push(
      new Paragraph({
        // По правому краю, як в оригінальному зразку. Був короткий
        // період "по центру" за одним із запитів користувача, потім
        // повернули назад до правого краю — це фінальне рішення.
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: line, size: 12 * HP, color: BLACK, bold: false })],
      })
    );
  });
  pos += teacherLines.length * LINE_HEIGHT_PT;

  const n3 = clampToBudget(pos, gapLinesTo(pos, FOOTER_TARGET_PT));
  paras.push(...blankLines(n3));

  paras.push(
    new Paragraph({
      // Відцентровано, а не по лівому краю — так само, як інші рядки
      // титульної сторінки.
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Календарне планування з ${genitiveSubject(data.subject)}`,
          size: 12 * HP,
          color: BLACK,
          bold: false,
        }),
      ],
    })
  );

  // Наступна секція (таблиці уроків) — з нової сторінки.
  paras.push(new Paragraph({ children: [new PageBreak()] }));

  return paras;
}

function lessonContentText(lesson: Lesson): string {
  if (typeof lesson.content === "string") return lesson.content;
  if (lesson.content && typeof lesson.content === "object") {
    const c = lesson.content;
    const parts: string[] = [];
    if (c.organizationalMoment) parts.push(`Орг. момент: ${c.organizationalMoment}`);
    if (c.actualization) parts.push(`Актуалізація: ${c.actualization}`);
    if (c.motivation) parts.push(`Мотивація: ${c.motivation}`);
    if (c.mainPart) parts.push(`Основна частина: ${c.mainPart}`);
    if (c.practice) parts.push(`Практика: ${c.practice}`);
    if (c.consolidation) parts.push(`Закріплення: ${c.consolidation}`);
    if (c.homework) parts.push(`Д/З: ${c.homework}`);
    return parts.join("; ");
  }
  return lesson.homework || "";
}

// Ширини колонок — ті самі пропорції (в pt), що були в Apps Script
// (40, 70, 160, 186, 40 = 496pt), переведені в twips для docx.
const COL_WIDTHS_PT = [40, 70, 160, 186, 40];
const COL_WIDTHS_DXA = COL_WIDTHS_PT.map((pt) => pt * PT);
const HEADERS = ["№", "Дата", "Тема уроку", "Зміст", "Прим."];

function headerCell(text: string, widthDxa: number): TableCell {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { fill: "E0E0E0" },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size: 11 * HP, color: BLACK })],
      }),
    ],
  });
}

function bodyCell(text: string, widthDxa: number, fontSizePt: number, center: boolean): TableCell {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { fill: "FFFFFF" },
    children: [
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [new TextRun({ text: text || "", size: fontSizePt * HP, color: BLACK, bold: false })],
      }),
    ],
  });
}

function lessonRow(lesson: Lesson, fallbackNumber: number): TableRow {
  const num = lesson.number ?? lesson.lessonNumber ?? fallbackNumber;
  return new TableRow({
    children: [
      bodyCell(String(num), COL_WIDTHS_DXA[0], 11, true),
      bodyCell(lesson.date || "", COL_WIDTHS_DXA[1], 11, true),
      bodyCell(lesson.topic || "", COL_WIDTHS_DXA[2], 11, false),
      bodyCell(lessonContentText(lesson), COL_WIDTHS_DXA[3], 10, false),
      bodyCell("", COL_WIDTHS_DXA[4], 10, false),
    ],
  });
}

function lessonsTable(lessons: Lesson[], startCounter: { value: number }): Table {
  const headerRow = new TableRow({
    children: HEADERS.map((h, i) => headerCell(h, COL_WIDTHS_DXA[i])),
  });
  const rows = [headerRow];
  lessons.forEach((lesson) => {
    rows.push(lessonRow(lesson, startCounter.value));
    if (lesson.number == null && lesson.lessonNumber == null) startCounter.value++;
  });
  return new Table({
    width: { size: COL_WIDTHS_DXA.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    // Без layout: FIXED Word/Pages рахують ширину колонок за вмістом
    // ("autofit"), ігноруючи наші width у клітинках — саме тому текст
    // ліг по одній букві в рядок (реальний баг, зловлений на скріні
    // з готовим .docx). columnWidths дублює ширини на рівні таблиці
    // (<w:tblGrid>), яку читають і Word, і Pages.
    layout: TableLayoutType.FIXED,
    columnWidths: COL_WIDTHS_DXA,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      left: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      right: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
    },
    rows,
  });
}

export async function buildCalendarPlanDocx(data: PlanData): Promise<Buffer> {
  const className = String(data.class ?? "");
  const children: (Paragraph | Table)[] = [...buildTitlePage(data, className)];

  if (!data.lessons || data.lessons.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "Помилка: не знайдено уроків для генерації" })] }));
  } else {
    const hasModules = !!data.lessons[0]?.moduleName;
    const counter = { value: 1 };

    if (hasModules) {
      const byModule = new Map<string, Lesson[]>();
      data.lessons.forEach((lesson) => {
        const name = lesson.moduleName || "Без модуля";
        if (!byModule.has(name)) byModule.set(name, []);
        byModule.get(name)!.push(lesson);
      });
      byModule.forEach((moduleLessons, moduleName) => {
        children.push(
          new Paragraph({
            spacing: { before: 8 * PT, after: 4 * PT },
            shading: { fill: "F5F5F5" },
            children: [new TextRun({ text: moduleName, bold: true, size: 12 * HP, color: BLACK })],
          })
        );
        children.push(lessonsTable(moduleLessons, counter));
        children.push(new Paragraph({ text: "" }));
      });
    } else {
      children.push(lessonsTable(data.lessons, counter));
      children.push(new Paragraph({ text: "" }));
    }

    children.push(new Paragraph({ text: "" }));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Календарно-тематичний план складено відповідно до чинної навчальної програми з предмету "${data.subject}".`,
            color: BLACK,
          }),
        ],
      })
    );
    children.push(new Paragraph({ text: "" }));
    children.push(
      new Paragraph({
        spacing: { before: 20 * PT },
        children: [
          new TextRun({ text: `Вчитель: _________________ ${data.teacherName || ""}`, color: BLACK }),
        ],
      })
    );

    if (data.referralLink) {
      children.push(
        new Paragraph({
          spacing: { before: 30 * PT },
          children: [
            new TextRun({
              text: `Створено на TeacherPlan AI · ${data.referralLink}`,
              color: "999999",
              size: 8 * HP,
              italics: true,
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 50 * PT, bottom: 50 * PT, left: 50 * PT, right: 50 * PT },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
