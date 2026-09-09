/**
 * Дані для календарних планів з англійської мови, 10-11 класи.
 * Джерело: «Навчальні програми з іноземних мов для загальноосвітніх
 * навчальних закладів і спеціалізованих шкіл із поглибленим вивченням
 * іноземних мов. 10-11 класи» (МОН України, 19.09.2017).
 *
 * Програма рамкова — фіксованої розбивки тем по годинах в оригіналі
 * немає (це прямо сказано в самому документі), тому кількість годин на
 * тему розраховується генератором пропорційно від загальної кількості
 * уроків у семестрі. Тижневе навантаження (weeklyHours) — за чинним
 * Типовим навчальним планом: поглиблене вивчення (спецшколи) — 5 год/тиж,
 * перша іноземна рівня стандарту — 2 год/тиж, друга іноземна — 2 год/тиж.
 */

export interface LangTopic {
  sphere: string; // сфера спілкування: Особистісна / Публічна / Освітня
  topic: string;
}

export interface LangGrammarItem {
  category: string;
  structure: string;
}

export interface LangGradeData {
  topics: LangTopic[];
  grammar: LangGrammarItem[];
}

export interface LangTrackData {
  weeklyHours: number;
  grade10: LangGradeData;
  grade11: LangGradeData;
}

export const ENGLISH_ADVANCED: LangTrackData = {
  // Спеціалізовані школи з поглибленим вивченням, рівень В2
  weeklyHours: 5,
  grade10: {
    topics: [
      { sphere: "Особистісна", topic: "Я, моя родина, мої друзі" },
      { sphere: "Особистісна", topic: "Спорт і дозвілля" },
      { sphere: "Особистісна", topic: "Харчування" },
      { sphere: "Публічна", topic: "Природа і погода" },
      { sphere: "Публічна", topic: "Живопис" },
      { sphere: "Публічна", topic: "Наука і технічний прогрес" },
      { sphere: "Публічна", topic: "Україна" },
      { sphere: "Публічна", topic: "Країни виучуваної мови" },
      { sphere: "Освітня", topic: "Шкільне життя" },
      { sphere: "Освітня", topic: "Робота і професії" },
    ],
    grammar: [
      { category: "Clause", structure: "Past Perfect with adverbial clauses of time; first and second conditionals; so ... that; declarative + so/therefore + declarative" },
      { category: "Modality", structure: "use(d) to / would + infinitive for past routines and habits" },
      { category: "Phrasal Verb", structure: "phrasal and prepositional verbs: position of indirect object" },
      { category: "Phrase", structure: "verbs taking gerund" },
      { category: "Preposition", structure: "prepositions of reason and purpose (due to, owing to, so, because); prepositions in time phrases (before, for, since, till, until, by)" },
      { category: "Verb", structure: "Past Perfect Continuous; Future Continuous; Future Perfect; going to / will for predictions; verb + '-ing' vs. + 'to' infinitive" },
    ],
  },
  grade11: {
    topics: [
      { sphere: "Особистісна", topic: "Я, моя родина, мої друзі" },
      { sphere: "Особистісна", topic: "Харчування" },
      { sphere: "Особистісна", topic: "Дозвілля" },
      { sphere: "Публічна", topic: "Мистецтво" },
      { sphere: "Публічна", topic: "Наука і технічний прогрес" },
      { sphere: "Публічна", topic: "Подорож" },
      { sphere: "Публічна", topic: "Україна в світі" },
      { sphere: "Публічна", topic: "Країни виучуваної мови" },
      { sphere: "Освітня", topic: "Шкільне життя" },
      { sphere: "Освітня", topic: "Робота і професії" },
    ],
    grammar: [
      { category: "Adjective", structure: "adjectives formed with suffixes/prefixes (overview); compound adjectives; present/past participles as adjectives" },
      { category: "Adverb", structure: "common linking words for chronological sequence; advanced adverbials of time (beforehand, afterwards)" },
      { category: "Clause", structure: "defining vs. non-defining relative clauses; overview of relative pronouns; first, second and third conditional; reported speech with changed tenses; reporting verbs + that + complement clause" },
      { category: "Determiner", structure: "overview of all quantifiers with countable/uncountable nouns" },
      { category: "Modality", structure: "modals + passive" },
      { category: "Verb", structure: "question tags (positive/negative, all tenses); prepositional vs. phrasal verbs (separable/inseparable); overview of all tense forms (active/passive)" },
    ],
  },
};

export const ENGLISH_STANDARD: LangTrackData = {
  // Загальноосвітні заклади, перша іноземна мова, рівень В1
  weeklyHours: 2,
  grade10: {
    topics: [
      { sphere: "Особистісна", topic: "Я, моя родина, мої друзі" },
      { sphere: "Особистісна", topic: "Спорт і дозвілля" },
      { sphere: "Особистісна", topic: "Харчування" },
      { sphere: "Публічна", topic: "Природа і погода" },
      { sphere: "Публічна", topic: "Живопис" },
      { sphere: "Публічна", topic: "Наука і технічний прогрес" },
      { sphere: "Публічна", topic: "Україна" },
      { sphere: "Публічна", topic: "Країни виучуваної мови" },
      { sphere: "Освітня", topic: "Шкільне життя" },
      { sphere: "Освітня", topic: "Робота і професії" },
    ],
    grammar: [
      { category: "Clause", structure: "first conditional for future outcomes of a present action or situation; second conditional for hypothetical (counterfactual) current results" },
      { category: "Modality", structure: "use(d) to / would + Infinitive for past routines and habits" },
      { category: "Verb", structure: "comparison of common past forms; comparison of common future forms ('going to', 'will' + Infinitive); Present Perfect Continuous for ongoing states; Past Perfect Continuous in common situations" },
    ],
  },
  grade11: {
    topics: [
      { sphere: "Особистісна", topic: "Я, моя родина, мої друзі" },
      { sphere: "Особистісна", topic: "Харчування" },
      { sphere: "Публічна", topic: "Мистецтво" },
      { sphere: "Публічна", topic: "Молодь і молодіжна культура" },
      { sphere: "Публічна", topic: "Наука і технічний прогрес" },
      { sphere: "Публічна", topic: "Природа і довкілля" },
      { sphere: "Публічна", topic: "Україна в світі" },
      { sphere: "Публічна", topic: "Країни виучуваної мови" },
      { sphere: "Освітня", topic: "Шкільне життя" },
      { sphere: "Освітня", topic: "Робота і професії" },
    ],
    grammar: [
      { category: "Adverb", structure: "until/when for linking events in the present, past and future" },
      { category: "Clause", structure: "relative clauses and compound sentences; direct and reported speech; first, second and third conditional" },
      { category: "Verb", structure: "sequence of tenses; infinitive; present/past participle" },
    ],
  },
};

export const ENGLISH_SECOND: LangTrackData = {
  // Іноземна мова як друга, рівень А2+
  weeklyHours: 2,
  grade10: {
    topics: [
      { sphere: "Особистісна", topic: "Стиль життя" },
      { sphere: "Особистісна", topic: "Бібліотека" },
      { sphere: "Публічна", topic: "Засоби масової інформації" },
      { sphere: "Публічна", topic: "Музика" },
      { sphere: "Публічна", topic: "Україна" },
      { sphere: "Публічна", topic: "Країни виучуваної мови" },
      { sphere: "Освітня", topic: "Шкільне життя" },
    ],
    grammar: [
      { category: "Clause", structure: "comparisons with 'as ... as'; either ... or, neither ... nor; make/help/let + NP + VPinf; reported speech with changed tenses; reported yes/no and wh-questions" },
      { category: "Determiner", structure: "countable vs uncountable nouns" },
      { category: "Phrase", structure: "'said to/asked/told' + person + to + VPinf; '(not) allowed/permitted to' + VPinf" },
      { category: "Verb", structure: "'do/did' as a placeholder for verbs; Past Perfect Continuous; Passive Voice" },
    ],
  },
  grade11: {
    topics: [
      { sphere: "Особистісна", topic: "Стиль життя" },
      { sphere: "Особистісна", topic: "Харчування" },
      { sphere: "Публічна", topic: "Засоби масової інформації" },
      { sphere: "Публічна", topic: "Мистецтво" },
      { sphere: "Публічна", topic: "Україна" },
      { sphere: "Публічна", topic: "Країни виучуваної мови" },
      { sphere: "Освітня", topic: "Шкільне життя" },
      { sphere: "Освітня", topic: "Робота і професії" },
    ],
    grammar: [
      { category: "Clause", structure: "first conditional; reported speech with changed tenses" },
      { category: "Modal Verbs", structure: "'may/might' for likelihood" },
      { category: "Phrase", structure: "verbs taking 'to' + infinitive" },
      { category: "Preposition", structure: "prepositions in time phrases: during, for, since, throughout, till, until, as soon as, if, when" },
      { category: "Verb", structure: "Present/Past Perfect active/passive" },
    ],
  },
};
