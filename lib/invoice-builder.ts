// lib/invoice-builder.ts
//
// "Рахунок на оплату" для шкіл/методоб'єднань, що платять безготівковим
// переказом на IBAN (не карткою через WayForPay) — окремий, набагато
// менший рід документа, ніж календарний план, тому власний білдер, а не
// розширення document-builder.ts. Використовує ту саму бібліотеку docx,
// що й план, — нової залежності не додаємо.
//
// Реквізити ФОП зафіксовані тут навмисно (не в .env і не в БД): це
// публічні дані з Єдиного державного реєстру, міняються вкрай рідко, і
// зберігати їх поруч із кодом, що їх використовує, простіше й надійніше,
// ніж плутатися з env-змінними для документа, який генерує лише адмін.
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, Packer, VerticalAlign } from "docx";

const PT = 20;
const HP = 2;
const BLACK = "000000";

export const FOP_REQUISITES = {
  fullName: "Фізична особа-підприємець Лисун Владислав Сергійович",
  shortName: "ФОП Лисун В. С.",
  rnokpp: "3494908755",
  bank: "monobank (Універсал Банк)",
  iban: "UA863220010000026003370027931",
  vatNote: "Без ПДВ (платник єдиного податку, 3 група)",
  email: "teacher_plan_ai@proton.me",
  phone: "+380 93 197 20 61",
  sealNote: "Рахунок дійсний без підпису та печатки.",
};

export type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: string; // formatted, e.g. "10.09.2026"
  buyerName: string; // повна назва школи/закладу
  buyerCode?: string; // ЄДРПОУ закладу, якщо відоме — необов'язково
  description: string; // напр. "Доступ до TeacherPlan AI, пакет «25 акаунтів», 1 навчальний рік"
  quantity: number;
  unit: string; // напр. "акаунт", "пакет"
  unitPrice: number; // грн
};

function cell(text: string, opts: { bold?: boolean; align?: typeof AlignmentType[keyof typeof AlignmentType]; width?: number } = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [new TextRun({ text, bold: opts.bold, color: BLACK, size: 10 * HP })],
      }),
    ],
  });
}

export async function buildInvoiceDocx(data: InvoiceData): Promise<Buffer> {
  const total = data.quantity * data.unitPrice;
  const totalFormatted = `${total.toLocaleString("uk-UA")} грн`;

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: FOP_REQUISITES.bank, color: BLACK, size: 10 * HP })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `IBAN: ${FOP_REQUISITES.iban}`, color: BLACK, size: 10 * HP })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 12 * PT },
      children: [new TextRun({ text: `Отримувач: ${FOP_REQUISITES.fullName}, РНОКПП ${FOP_REQUISITES.rnokpp}`, color: BLACK, size: 10 * HP })],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 12 * PT, after: 4 * PT },
      children: [
        new TextRun({ text: `Рахунок на оплату № ${data.invoiceNumber} від ${data.invoiceDate}`, bold: true, size: 14 * HP, color: BLACK }),
      ],
    }),

    new Paragraph({
      spacing: { before: 16 * PT },
      children: [new TextRun({ text: "Постачальник: ", bold: true, color: BLACK }), new TextRun({ text: FOP_REQUISITES.fullName, color: BLACK })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `РНОКПП: ${FOP_REQUISITES.rnokpp}`, color: BLACK })],
    }),
    new Paragraph({
      spacing: { after: 10 * PT },
      children: [new TextRun({ text: FOP_REQUISITES.vatNote, color: BLACK, italics: true, size: 9 * HP })],
    }),

    new Paragraph({
      children: [new TextRun({ text: "Покупець: ", bold: true, color: BLACK }), new TextRun({ text: data.buyerName, color: BLACK })],
    }),
    ...(data.buyerCode
      ? [new Paragraph({ spacing: { after: 10 * PT }, children: [new TextRun({ text: `ЄДРПОУ: ${data.buyerCode}`, color: BLACK })] })]
      : [new Paragraph({ spacing: { after: 10 * PT }, text: "" })]),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
        left: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
        right: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      },
      rows: [
        new TableRow({
          children: [
            cell("№", { bold: true, align: AlignmentType.CENTER, width: 6 }),
            cell("Назва товару/послуги", { bold: true, width: 42 }),
            cell("К-сть", { bold: true, align: AlignmentType.CENTER, width: 12 }),
            cell("Од.", { bold: true, align: AlignmentType.CENTER, width: 10 }),
            cell("Ціна, грн", { bold: true, align: AlignmentType.CENTER, width: 15 }),
            cell("Сума, грн", { bold: true, align: AlignmentType.CENTER, width: 15 }),
          ],
        }),
        new TableRow({
          children: [
            cell("1", { align: AlignmentType.CENTER }),
            cell(data.description),
            cell(String(data.quantity), { align: AlignmentType.CENTER }),
            cell(data.unit, { align: AlignmentType.CENTER }),
            cell(data.unitPrice.toLocaleString("uk-UA"), { align: AlignmentType.RIGHT }),
            cell(total.toLocaleString("uk-UA"), { align: AlignmentType.RIGHT }),
          ],
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 10 * PT, after: 4 * PT },
      children: [new TextRun({ text: `Разом до сплати: ${totalFormatted}`, bold: true, size: 12 * HP, color: BLACK })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 20 * PT },
      children: [new TextRun({ text: FOP_REQUISITES.vatNote, italics: true, size: 9 * HP, color: BLACK })],
    }),

    new Paragraph({
      spacing: { before: 20 * PT },
      children: [new TextRun({ text: FOP_REQUISITES.sealNote, color: BLACK, italics: true, size: 9 * HP })],
    }),
    new Paragraph({
      spacing: { before: 30 * PT },
      children: [
        new TextRun({ text: `Контакти для узгодження: ${FOP_REQUISITES.email}, ${FOP_REQUISITES.phone}`, color: BLACK, size: 9 * HP }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 50 * PT, bottom: 50 * PT, left: 50 * PT, right: 50 * PT } },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// TP-YYYYMMDD-HHmm — завжди унікальний без окремого лічильника в БД;
// достатньо для B2B-потоку з невеликою кількістю рахунків.
export function generateInvoiceNumber(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `TP-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}
