/**
 * Дані для календарних планів з німецької мови, 10-11 класи.
 * Джерело: «Навчальні програми з іноземних мов для загальноосвітніх
 * навчальних закладів і спеціалізованих шкіл із поглибленим вивченням
 * іноземних мов. 10-11 класи» (МОН України, 19.09.2017).
 * Теми ситуативного спілкування спільні для всіх чотирьох мов джерела —
 * відрізняється лише граматичний матеріал.
 */
import type { LangTrackData } from "./language-plan-engine";

export const GERMAN_ADVANCED: LangTrackData = {
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
      { category: "Adjektiv", structure: "Adjektive auf -a, -er, -el" },
      { category: "Pronomen", structure: "Demonstrativpronomen solcher, jener, derjenige" },
      { category: "Satz", structure: "Bedingungssätze mit wenn; Satzreihe mit entweder ... oder, nicht ... sondern; Sätze mit haben/sein+zu+Infinitiv" },
      { category: "Verb", structure: "Das Verb lassen; Partizip I; Plusquamperfekt (im Satzgefüge)" },
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
      { category: "Satz", structure: "Kausalsätze mit ob; Konzessivsätze mit obwohl, deswegen, trotzdem; Temporalsätze mit seit" },
      { category: "Verb", structure: "Modalverbe im Perfekt und Plusquamperfekt Aktiv; Indirekte Rede mit Modalverben; Infinitiv Passiv; Passiv mit Modalverben; Konjunktiv I (indirekte Rede); Konjunktiv II von haben, sein, können, mögen; Konditionalis I (würde+Infinitiv)" },
    ],
  },
};

export const GERMAN_STANDARD: LangTrackData = {
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
      { category: "Adjektiv", structure: "Deklination der Adjektive auf -a, -e, -er, -el" },
      { category: "Pronomen", structure: "Demonstrativpronomen – dieser, jener, solcher" },
      { category: "Satz", structure: "Konditionalsätze; die Satzreihe" },
      { category: "Verb", structure: "Das Verb lassen; Partizip I; Plusquamperfekt: Vorzeitigkeit" },
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
      { category: "Satz", structure: "Temporalsätze; Konsekutivsätze; Konzessivsätze" },
      { category: "Verb", structure: "Konjunktiv II von haben, sein, werden, können, mögen; irreale Bedingungssätze; Umschreibung des Konjunktivs II mit würde+Infinitiv (Höflichkeit, Wunsch, Vorschlag, Aufforderung)" },
    ],
  },
};

export const GERMAN_SECOND: LangTrackData = {
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
      { category: "Adjektiv", structure: "Substantivierte Adjektive" },
      { category: "Adverb", structure: "Pronominaladverbien" },
      { category: "Pronomen", structure: "Relativpronomen" },
      { category: "Satz", structure: "Attributsätze; Finalsätze" },
      { category: "Substantiv", structure: "Substantive der fremden Herkunft" },
      { category: "Verb", structure: "Infinitivkonstruktion um ... zu + Infinitiv" },
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
      { category: "Adjektiv", structure: "Steigerungsstufen der Adjektive (besondere Formen)" },
      { category: "Adverb", structure: "Temporaladverbien" },
      { category: "Satz", structure: "Lokalsätze" },
      { category: "Verb", structure: "Konjunktiv II; Infinitivkonstruktion statt ... zu + Infinitiv, ohne ... zu + Infinitiv" },
      { category: "Zahlwort", structure: "Systematisierung" },
    ],
  },
};
