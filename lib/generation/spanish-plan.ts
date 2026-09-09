// Генератор календарних планів з іспанської мови, 10-11 класи.
// Логіка розподілу уроків спільна для всіх іноземних мов —
// див. language-plan-engine.ts.
import { resolveTrack, buildLanguageCalendarPlan, type LanguagePlanSettings } from "./language-plan-engine";
import { SPANISH_ADVANCED, SPANISH_STANDARD, SPANISH_SECOND } from "./spanish-data";

export function generateSpanishCalendarPlan(settings: LanguagePlanSettings) {
  const track = resolveTrack(settings.programId, {
    advanced: SPANISH_ADVANCED,
    standard: SPANISH_STANDARD,
    second: SPANISH_SECOND,
  });
  return buildLanguageCalendarPlan(settings, track);
}
