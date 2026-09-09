// Генератор календарних планів з німецької мови, 10-11 класи.
// Логіка розподілу уроків спільна для всіх іноземних мов —
// див. language-plan-engine.ts.
import { resolveTrack, buildLanguageCalendarPlan, type LanguagePlanSettings } from "./language-plan-engine";
import { GERMAN_ADVANCED, GERMAN_STANDARD, GERMAN_SECOND } from "./german-data";

export function generateGermanCalendarPlan(settings: LanguagePlanSettings) {
  const track = resolveTrack(settings.programId, {
    advanced: GERMAN_ADVANCED,
    standard: GERMAN_STANDARD,
    second: GERMAN_SECOND,
  });
  return buildLanguageCalendarPlan(settings, track);
}
