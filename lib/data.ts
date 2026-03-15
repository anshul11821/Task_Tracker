import { Entry, PersonKey, StreakResult, PEOPLE, TASKS } from "./types";
import { format, parseISO, differenceInDays, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";

/**
 * Calculate current and best streak for a person across all entries (or filtered by task).
 */
export function calcStreak(entries: Entry[], personKey: PersonKey, taskFilter?: string): StreakResult {
  const filtered = taskFilter
    ? entries.filter((e) => e.task === taskFilter)
    : entries;

  // Get unique dates where the person has at least one tick
  const datesWithTicks = new Set<string>();
  for (const entry of filtered) {
    if (entry[personKey]) {
      datesWithTicks.add(entry.date);
    }
  }

  const sortedDates = Array.from(datesWithTicks).sort();
  if (sortedDates.length === 0) return { current: 0, best: 0 };

  let current = 1;
  let best = 1;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = parseISO(sortedDates[i - 1]);
    const curr = parseISO(sortedDates[i]);
    const diff = differenceInDays(curr, prev);

    if (diff === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    if (tempStreak > best) best = tempStreak;
  }

  // Check if the last date is today or yesterday for current streak
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  const lastDate = sortedDates[sortedDates.length - 1];

  if (lastDate === today || lastDate === yesterday) {
    // Count backwards from the end
    current = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const prev = parseISO(sortedDates[i]);
      const curr = parseISO(sortedDates[i + 1]);
      if (differenceInDays(curr, prev) === 1) {
        current++;
      } else {
        break;
      }
    }
  } else {
    current = 0;
  }

  return { current, best };
}

/**
 * Count total ticks for a person across all entries (or filtered by task).
 */
export function countTicks(entries: Entry[], personKey: PersonKey, taskFilter?: string): number {
  const filtered = taskFilter
    ? entries.filter((e) => e.task === taskFilter)
    : entries;
  return filtered.filter((e) => e[personKey]).length;
}

/**
 * Get consistency percentage for a person.
 */
export function getConsistency(entries: Entry[], personKey: PersonKey, totalDays: number, totalTasks: number = TASKS.length): number {
  if (totalDays === 0) return 0;
  const ticks = countTicks(entries, personKey);
  const maxPossible = totalDays * totalTasks;
  return Math.round((ticks / maxPossible) * 100);
}

/**
 * Group entries by date.
 */
export function groupByDate(entries: Entry[]): Record<string, Entry[]> {
  const groups: Record<string, Entry[]> = {};
  for (const entry of entries) {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
  }
  return groups;
}

/**
 * Group entries by month (YYYY-MM).
 */
export function groupByMonth(entries: Entry[]): Record<string, Entry[]> {
  const groups: Record<string, Entry[]> = {};
  for (const entry of entries) {
    const month = entry.date.substring(0, 7);
    if (!groups[month]) groups[month] = [];
    groups[month].push(entry);
  }
  return groups;
}

/**
 * Get total unique days from entries.
 */
export function getTotalDays(entries: Entry[]): number {
  const dates = new Set(entries.map((e) => e.date));
  return dates.size;
}

/**
 * Get leaderboard data sorted by total ticks.
 */
export function getLeaderboard(entries: Entry[], totalDays: number, totalTasks: number = TASKS.length) {
  const maxPossible = totalDays * totalTasks;
  return PEOPLE.map((person) => {
    const totalTicks = countTicks(entries, person.key);
    return {
      ...person,
      totalTicks,
      percentage: maxPossible > 0 ? Math.round((totalTicks / maxPossible) * 100) : 0,
    };
  }).sort((a, b) => b.totalTicks - a.totalTicks);
}

/**
 * Get daily totals for line chart.
 */
export function getDailyTotals(entries: Entry[], taskFilter?: string) {
  const filtered = taskFilter
    ? entries.filter((e) => e.task === taskFilter)
    : entries;
  const grouped = groupByDate(filtered);
  const dates = Object.keys(grouped).sort();

  return dates.map((date) => {
    const dayEntries = grouped[date];
    const result: Record<string, string | number> = { date: format(parseISO(date), "MMM dd") };
    for (const person of PEOPLE) {
      result[person.key] = dayEntries.filter((e) => e[person.key]).length;
    }
    return result;
  });
}

/**
 * Get bar chart totals per person.
 */
export function getBarTotals(entries: Entry[], taskFilter?: string) {
  const filtered = taskFilter
    ? entries.filter((e) => e.task === taskFilter)
    : entries;
  return PEOPLE.map((person) => ({
    name: person.label,
    ticks: countTicks(filtered, person.key),
    color: person.color,
  }));
}

/**
 * Get radar chart data (completion % per person per task).
 */
export function getRadarData(entries: Entry[]) {
  const totalDays = getTotalDays(entries);
  if (totalDays === 0) return [];

  return TASKS.map((task) => {
    const taskEntries = entries.filter((e) => e.task === task.key);
    const result: Record<string, string | number> = { task: task.label };
    for (const person of PEOPLE) {
      const ticks = taskEntries.filter((e) => e[person.key]).length;
      result[person.key] = Math.round((ticks / totalDays) * 100);
    }
    return result;
  });
}

/**
 * Get monthly grouped bar data.
 */
export function getMonthlyBarData(entries: Entry[]) {
  const grouped = groupByMonth(entries);
  const months = Object.keys(grouped).sort();

  return months.map((month) => {
    const monthEntries = grouped[month];
    const result: Record<string, string | number> = {
      month: format(parseISO(month + "-01"), "MMM yyyy"),
    };
    for (const person of PEOPLE) {
      result[person.key] = countTicks(monthEntries, person.key);
    }
    return result;
  });
}

/**
 * Get stacked bar data by task.
 */
export function getStackedByTask(entries: Entry[]) {
  return TASKS.map((task) => {
    const taskEntries = entries.filter((e) => e.task === task.key);
    const result: Record<string, string | number> = { task: task.label };
    for (const person of PEOPLE) {
      result[person.key] = countTicks(taskEntries, person.key);
    }
    return result;
  });
}

/**
 * Get stacked daily bar chart data (for streaks page).
 */
export function getStackedDailyData(entries: Entry[]) {
  const grouped = groupByDate(entries);
  const dates = Object.keys(grouped).sort();

  return dates.map((date) => {
    const dayEntries = grouped[date];
    const result: Record<string, string | number> = { date: format(parseISO(date), "MMM dd") };
    for (const task of TASKS) {
      const taskEntry = dayEntries.find((e) => e.task === task.key);
      if (taskEntry) {
        const count = PEOPLE.filter((p) => taskEntry[p.key]).length;
        result[task.key] = count;
      } else {
        result[task.key] = 0;
      }
    }
    return result;
  });
}

/**
 * Get heatmap data for a person and optional task filter.
 */
export function getHeatmapData(
  entries: Entry[],
  personKey: PersonKey,
  taskFilter?: string,
  year: number = 2026,
  startMonth: number = 0,
  endMonth: number = 2
) {
  const filtered = taskFilter
    ? entries.filter((e) => e.task === taskFilter)
    : entries;

  const start = new Date(year, startMonth, 1);
  const end = endOfMonth(new Date(year, endMonth, 1));
  const days = eachDayOfInterval({ start, end });

  const grouped = groupByDate(filtered);

  return days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayEntries = grouped[dateStr] || [];
    const count = dayEntries.filter((e) => e[personKey]).length;
    return {
      date: dateStr,
      day: format(day, "d"),
      month: format(day, "MMM"),
      weekday: day.getDay(),
      count,
    };
  });
}

/**
 * Get longest streaks table data.
 */
export function getLongestStreaks(entries: Entry[]) {
  const results: Array<{
    person: string;
    personKey: PersonKey;
    color: string;
    task: string;
    streak: number;
  }> = [];

  for (const person of PEOPLE) {
    for (const task of TASKS) {
      const streak = calcStreak(entries, person.key, task.key);
      results.push({
        person: person.label,
        personKey: person.key,
        color: person.color,
        task: `${task.icon} ${task.label}`,
        streak: streak.best,
      });
    }
  }

  return results.sort((a, b) => b.streak - a.streak).slice(0, 10);
}
