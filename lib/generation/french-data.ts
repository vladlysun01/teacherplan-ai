/**
 * Дані для календарних планів з французької мови, 10-11 класи.
 * Джерело: «Навчальні програми з іноземних мов ... 10-11 класи»
 * (МОН України, 19.09.2017). Теми ситуативного спілкування спільні
 * для всіх чотирьох мов джерела — відрізняється лише граматика.
 */
import type { LangTrackData } from "./language-plan-engine";

export const FRENCH_ADVANCED: LangTrackData = {
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
      { category: "Phrase", structure: "Le discours rapporté au présent et au passé" },
      { category: "Préposition", structure: "Les prépositions de temps et de lieu" },
      { category: "Pronom", structure: "Les pronoms possessifs; les pronoms relatifs simples; les pronoms en et y" },
      { category: "Verbe", structure: "Le futur simple; l'imparfait opposé au passé composé; le plus-que-parfait; la concordance des temps; le subjonctif présent; le conditionnel présent; la négation sans+infinitif; la double négation; les formes impersonnelles" },
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
      { category: "Adjectif", structure: "Les adjectifs accompagnés de prépositions" },
      { category: "Phrase", structure: "Les relations logiques: cause, conséquence, but, opposition, concession; le mise en relief" },
      { category: "Pronom", structure: "Les pronoms compléments en et y (verbes à prépositions); les pronoms relatifs composés; les doubles pronoms" },
      { category: "Verbe", structure: "Les formes impersonnelles; le participe passé; la concordance des temps; le passif; l'infinitif passé; les verbes accompagnés de prépositions" },
    ],
  },
};

export const FRENCH_STANDARD: LangTrackData = {
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
      { category: "Phrase", structure: "La phrase exclamative; l'opposition (mais); le but (pour+nom/inf); la cause (parce que, à cause de); la conséquence (c'est pour ça, donc)" },
      { category: "Pronom", structure: "Les pronoms possessifs; les pronoms relatifs" },
      { category: "Verbe", structure: "Les verbes usuels; les verbes pronominaux; le passé composé; l'imparfait; le conditionnel présent; la concordance des temps; il faut+infinitif" },
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
      { category: "Adverbe", structure: "Les adverbes de lieu et de fréquence; les adverbes en -ment; les adverbes de temps: passé au futur" },
      { category: "Phrase", structure: "Le discours indirect au présent" },
      { category: "Pronom", structure: "Les pronoms relatifs; les pronoms relatifs composés; les pronoms interrogatifs composés" },
      { category: "Verbe", structure: "Le futur proche; le passé composé opposé à l'imparfait; le subjonctif; le gérondif; la concordance des temps; le conditionnel présent; le passif" },
    ],
  },
};

export const FRENCH_SECOND: LangTrackData = {
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
      { category: "Adjectif", structure: "L'adjectif indéfini tout; le comparatif de l'adjectif" },
      { category: "Adverbe", structure: "Les adverbes de quantité; le comparatif de l'adverbe" },
      { category: "Phrase", structure: "Les articulateurs chronologiques (tout d'abord/puis/ensuite/après/enfin/premièrement/deuxièmement)" },
      { category: "Pronom", structure: "Les pronoms compléments en et y; les pronoms interrogatifs simples" },
      { category: "Verbe", structure: "Les verbes du type prendre; le passé composé; l'imparfait; la négation" },
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
      { category: "Phrase", structure: "La phrase interro-négative; l'opposition (mais); le but (pour+nom/inf); la cause (parce que, à cause de); la conséquence (c'est pour ça, donc)" },
      { category: "Pronom", structure: "Les pronoms interrogatifs composés; les pronoms relatifs; les pronoms relatifs composés; les pronoms démonstratifs" },
      { category: "Verbe", structure: "Le passé simple; le futur simple; le passif; si+présent/futur (condition); le conditionnel présent" },
    ],
  },
};
