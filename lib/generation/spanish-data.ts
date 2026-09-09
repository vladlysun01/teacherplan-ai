/**
 * Дані для календарних планів з іспанської мови, 10-11 класи.
 * Джерело: «Навчальні програми з іноземних мов ... 10-11 класи»
 * (МОН України, 19.09.2017). Теми ситуативного спілкування спільні
 * для всіх чотирьох мов джерела — відрізняється лише граматика.
 */
import type { LangTrackData } from "./language-plan-engine";

export const SPANISH_ADVANCED: LangTrackData = {
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
      { category: "Adjetivo", structure: "El uso de los verbos ser y estar con adjetivos" },
      { category: "Artículo", structure: "El neutro 'lo' y su uso" },
      { category: "Construcciones sintácticas", structure: "Las oraciones causales, consecutivas, finales, concesivas" },
      { category: "Perífrasis verbales", structure: "Permanecer+Gerundio, acabar (tener)+Gerundio, venir+Gerundio, quedarse+Gerundio, llevar+Gerundio" },
      { category: "Pronombre", structure: "Los impersonales (algo, alguien, quienquiera, cualquiera, alguno)" },
      { category: "Verbo", structure: "Los verbos semicopulativos de cambio (ponerse, hacerse, volverse, quedarse); Presente de Subjuntivo (irregulares); El Modo Subjuntivo con ojalá; la concordancia de los tiempos en Modo Indicativo; El Condicional Simple; el complemento directo e indirecto" },
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
      { category: "Adjetivo", structure: "De valoración y cantidad (tan, tanto)" },
      { category: "Adverbio", structure: "De valoración y cantidad (tan, tanto), de duda; locuciones adverbiales de tiempo y de modo" },
      { category: "Construcciones sintácticas", structure: "Las oraciones relativas; oraciones subordinadas condicionales del II tipo" },
      { category: "Preposición", structure: "A, hacia, hasta" },
      { category: "Pronombre", structure: "Los reflexivos" },
      { category: "Verbo", structure: "Pretérito Imperfecto de Subjuntivo y su uso" },
    ],
  },
};

export const SPANISH_STANDARD: LangTrackData = {
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
      { category: "Adjetivo", structure: "El uso de los verbos ser y estar con adjetivos" },
      { category: "Artículo", structure: "El neutro 'lo' y su uso" },
      { category: "Perífrasis verbales", structure: "Permanecer+Gerundio, acabar (tener)+Gerundio, venir+Gerundio, llevar+Gerundio" },
      { category: "Pronombre", structure: "Los impersonales" },
      { category: "Verbo", structure: "Los verbos semicopulativos de cambio (ponerse, hacerse, volverse); Presente de Subjuntivo (regulares e irregulares); la concordancia de los tiempos en Modo Indicativo; el complemento directo e indirecto" },
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
      { category: "Adjetivo", structure: "De cantidad" },
      { category: "Adverbio", structure: "De cantidad, de duda; locuciones adverbiales de tiempo y de modo" },
      { category: "Construcciones sintácticas", structure: "Las oraciones relativas; oraciones subordinadas condicionales del II tipo" },
      { category: "Preposición", structure: "A, hacia, hasta" },
      { category: "Verbo", structure: "Pretérito Imperfecto de Subjuntivo y su uso" },
    ],
  },
};

export const SPANISH_SECOND: LangTrackData = {
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
      { category: "Adjetivo", structure: "Grados de comparación de los adjetivos (más ... que, menos ... que, tan ... como, -ísimo, -ísima)" },
      { category: "Adverbio", structure: "Muy, mucho y sus usos" },
      { category: "Preposición", structure: "De tiempo, de lugar; las formas contractas 'al', 'del'" },
      { category: "Pronombres personales", structure: "Caso dativo y acusativo" },
      { category: "Sustantivo", structure: "La concordancia con el adjetivo" },
      { category: "Verbo", structure: "La concordancia de los tiempos en Modo Indicativo; el Modo Subjuntivo; el Presente de Subjuntivo" },
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
      { category: "Artículo", structure: "El uso de los determinados e indeterminados" },
      { category: "Conjunción", structure: "Ni ... ni, así ... como, también, tampoco, no solo ... sino" },
      { category: "Oraciones condicionales", structure: "El I tipo" },
      { category: "Perífrasis verbales", structure: "Iniciar a + Inf., principiar a + Inf., tener + Participio" },
      { category: "Preposición", structure: "De lugar, de tiempo, de modo" },
      { category: "Pronombre", structure: "Pronombres negativos" },
      { category: "Sustantivo", structure: "Sustantivos compuestos en singular y en plural" },
      { category: "Verbo", structure: "Las formas impersonales del verbo; Pretérito Perfecto de Subjuntivo; el Gerundio; construcciones verbales con Gerundio" },
    ],
  },
};
