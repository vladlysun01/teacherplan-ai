// Генератор календарних планів з англійської мови, 10-11 класи.
// Логіка розподілу уроків спільна для всіх іноземних мов —
// див. language-plan-engine.ts.
import { resolveTrack, buildLanguageCalendarPlan, type LanguagePlanSettings } from "./language-plan-engine";
import { ENGLISH_ADVANCED, ENGLISH_STANDARD, ENGLISH_SECOND } from "./english-data";

export type EnglishPlanSettings = LanguagePlanSettings;

export function generateEnglishCalendarPlan(settings: EnglishPlanSettings) {
  const track = resolveTrack(settings.programId, {
    advanced: ENGLISH_ADVANCED,
    standard: ENGLISH_STANDARD,
    second: ENGLISH_SECOND,
  });
  return buildLanguageCalendarPlan(settings, track);
}
