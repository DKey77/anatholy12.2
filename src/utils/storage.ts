/**
 * Возвращает id тренировок, завершённых в текущем круге (уникальные)
 */
export function getCurrentRoundCompletedIds(workoutsCount?: number): number[] {
  const results = getResultsWithRounds(workoutsCount);
  if (results.length === 0) return [];
  const maxRound = Math.max(...results.map(r => r.round));
  const current = results.filter(r => r.round === maxRound);
  return Array.from(new Set(current.map(r => r.workoutId)));
}

/**
 * Возвращает последнюю завершённую тренировку (объект результата)
 */
export function getLastCompletedWorkout(): WorkoutResult | null {
  const results = loadWorkoutResults();
  if (results.length === 0) return null;
  // Последняя по дате
  return results.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
}

/**
 * Возвращает следующую рекомендуемую тренировку (номер и название)
 * @param workoutsList полный список тренировок (массив объектов с id и title)
 */
export function getNextWorkout(workoutsList: { id: number; title: string }[]): { id: number; title: string } | null {
  const completed = getCurrentRoundCompletedIds();
  // Ищем первую тренировку, которой нет в списке завершённых
  const next = workoutsList.find(w => !completed.includes(w.id));
  // Если все завершены — возвращаем первую (новый круг)
  return next || workoutsList[0] || null;
}
/**
 * Для каждого результата определяет номер круга (цикла) прохождения программы.
 * Возвращает массив с добавленным полем round (начиная с 1).
 */
export function getResultsWithRounds(workoutsCount?: number): Array<WorkoutResult & { round: number }> {
  const results = loadWorkoutResults().sort((a, b) => a.date.localeCompare(b.date));
  let count = workoutsCount;
  if (!count) {
    // fallback: максимальный id среди результатов
    const ids = Array.from(new Set(results.map(r => r.workoutId)));
    count = Math.max(...ids, 1);
  }
  let round = 1;
  let seen = new Set<number>();
  return results.map(r => {
    seen.add(r.workoutId);
    const resultWithRound = { ...r, round };
    if (seen.size === count) {
      seen = new Set<number>();
      round++;
    }
    return resultWithRound;
  });
}
// src/utils/storage.ts
// Модуль для работы с результатами тренировок в localStorage

export type WorkoutResult = {
  workoutId: number;
  date: string; // ISO
  duration: number; // seconds (всей тренировки)
  exercises: {
    name: string;
    weight: number;
    duration?: number; // seconds, время выполнения упражнения
  }[];
};

const STORAGE_KEY = 'workoutResults';

/**
 * Сохраняет результат тренировки в localStorage
 * @param result WorkoutResult
 */
export function saveWorkoutResult(result: WorkoutResult) {
  const data: WorkoutResult[] = loadWorkoutResults();
  data.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Загружает все результаты тренировок из localStorage
 */
export function loadWorkoutResults(): WorkoutResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Очищает все результаты тренировок
 */
export function clearWorkoutResults() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Находит предыдущий результат для данной тренировки (по дате)
 * @param workoutId id тренировки
 * @param date текущая дата (ISO)
 */
export function getPreviousResult(workoutId: number, date: string): WorkoutResult | null {
  const results = loadWorkoutResults();
  const prev = results
    .filter(r => r.workoutId === workoutId && r.date < date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return prev || null;
}
