/**
 * Calculates the current Mission Day based on account/onboarding creation date.
 * If created today: Day 1.
 * If created 6 calendar days ago: Day 7.
 * If created 41 calendar days ago: Day 42.
 */
export function calculateMissionDay(createdAt?: string): number {
  if (!createdAt) return 1;

  try {
    const parts = createdAt.split('-');
    if (parts.length === 3) {
      const createdYear = parseInt(parts[0], 10);
      const createdMonth = parseInt(parts[1], 10) - 1;
      const createdDay = parseInt(parts[2], 10);

      const createdDate = new Date(createdYear, createdMonth, createdDay);
      const today = new Date();
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const diffTime = todayMidnight.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return Math.max(1, diffDays + 1);
    }

    const createdDate = new Date(createdAt);
    if (!isNaN(createdDate.getTime())) {
      const today = new Date();
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const createdMidnight = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
      const diffDays = Math.floor((todayMidnight.getTime() - createdMidnight.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays + 1);
    }
  } catch (e) {
    console.error('Error calculating mission day:', e);
  }

  return 1;
}
