// Генератор календарних планів з французької мови, 10-11 класи.
// Логіка розподілу уроків спільна для всіх іноземних мов —
// див. language-plan-engine.ts.
import { resolveTrack, buildLanguageCalendarPlan, type LanguagePlanSettings } from "./language-plan-engine";
import { FRENCH_ADVANCED, FRENCH_STANDARD, FRENCH_SECOND } from "./french-data";

export function generateFrenchCalendarPlan(settings: LanguagePlanSettings) {
  const track = resolveTrack(settings.programId, {
    advanced: FRENCH_ADVANCED,
    standard: FRENCH_STANDARD,
    second: FRENCH_SECOND,
  });
  return buildLanguageCalendarPlan(settings, track);
}
