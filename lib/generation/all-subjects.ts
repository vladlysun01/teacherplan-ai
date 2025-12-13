// Централізована система генерації календарних планів для всіх предметів
// Створено для швидкого додавання всіх предметів одразу

export const ALL_SUBJECTS = [
  {
    id: 'physical-education',
    name: 'Фізична культура',
    classes: ['5'],
    hasModules: true
  },
  {
    id: 'ukrainian-language',
    name: 'Українська мова',
    classes: ['5', '6', '7', '8', '9', '10', '11'],
    hasModules: true
  },
  {
    id: 'history',
    name: 'Історія: Україна і світ',
    classes: ['10', '11'],
    hasModules: true
  },
  {
    id: 'informatics',
    name: 'Інформатика',
    classes: ['10', '11'],
    levels: ['стандарт'],
    hasModules: true
  },
  {
    id: 'mathematics',
    name: 'Математика',
    classes: ['10', '11'],
    levels: ['стандарт', 'поглиблений', 'профільний'],
    hasModules: true
  },
  {
    id: 'art',
    name: 'Мистецтво',
    classes: ['10', '11'],
    levels: ['профільний'],
    hasModules: true
  },
  {
    id: 'world-history',
    name: 'Всесвітня історія',
    classes: ['6', '7', '8', '9', '10', '11'],
    hasModules: true
  },
  {
    id: 'ukrainian-literature',
    name: 'Українська література',
    classes: ['5', '6', '7', '8', '9'],
    hasModules: true
  },
  {
    id: 'geography',
    name: 'Географія',
    classes: ['10', '11'],
    hasModules: true
  },
  {
    id: 'law',
    name: 'Основи правознавства',
    classes: ['9'],
    hasModules: true
  }
];

export function getAvailableSubjects() {
  return ALL_SUBJECTS;
}

export function getSubjectById(id: string) {
  return ALL_SUBJECTS.find(s => s.id === id);
}

export function getClassesForSubject(subjectId: string) {
  const subject = getSubjectById(subjectId);
  return subject?.classes || [];
}
