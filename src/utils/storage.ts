/**
 * Возвращает id тренировок, завершённых в текущем круге (уникальные)
 */
export function getCurrentRoundCompletedIds(): number[] {
  const results = getResultsWithRounds();
  if (results.length === 0) return [];
  const maxRound = Math.max(...results.map(r => r.round));
  // Берём только результаты текущего круга
  const current = results.filter(r => r.round === maxRound);
  // Уникальные id тренировок
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
export function getResultsWithRounds(): Array<WorkoutResult & { round: number }> {
  const results = loadWorkoutResults().sort((a, b) => a.date.localeCompare(b.date));
  const rounds: Record<number, number> = {};
  let round = 1;
  let seen = new Set<number>();
  return results.map(r => {
    seen.add(r.workoutId);
    if (seen.size === 54) { // если все тренировки пройдены — новый круг
      seen = new Set<number>();
      round++;
    }
    rounds[r.workoutId] = round;
    return { ...r, round };
  });
}
// src/utils/storage.ts
// Модуль для работы с результатами тренировок в localStorage

export type WorkoutResult = {
  workoutId: number;
  date: string; // ISO
  duration: number; // seconds
  exercises: {
    name: string;
    weight: number;
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
