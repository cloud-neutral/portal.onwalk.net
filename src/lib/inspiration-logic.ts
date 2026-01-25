import { ThemeDefinition, WEEKLY_THEMES, MONTHLY_THEMES, TIMELESS_THEMES } from './theme-constants';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomThemeLogic(): ThemeDefinition {
  // 30% Weekly, 30% Monthly, 40% Timeless
  const rand = Math.random();

  if (rand < 0.3) {
    // Weekly
    const keys = Object.keys(WEEKLY_THEMES).map(Number);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return WEEKLY_THEMES[randomKey];
  } else if (rand < 0.6) {
    // Monthly
    const keys = Object.keys(MONTHLY_THEMES).map(Number);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return MONTHLY_THEMES[randomKey];
  } else {
    // Timeless
    return TIMELESS_THEMES[Math.floor(Math.random() * TIMELESS_THEMES.length)];
  }
}

export function getRandomMediaSubset<T>(items: T[], count: number): T[] {
    return shuffleArray(items).slice(0, count);
}

