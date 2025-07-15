import { useTranslation } from 'react-i18next';
import { workouts as staticWorkouts } from './workouts';

export const useLocalizedWorkouts = () => {
  const { t } = useTranslation();
  const workouts: any[] = [];
  let i = 1;
  while (true) {
    const title = t(`workout_${i}.title`);
    const exercises = t(`workout_${i}.exercises`, { returnObjects: true });
    // Если нет title или exercises не массив — значит, тренировка закончились
    if (!title || !Array.isArray(exercises) || exercises.length === 0) break;
    workouts.push({
      id: i,
      title,
      exercises
    });
    i++;
  }
  // Добавляем fallback из staticWorkouts, если в локалях меньше тренировок
  if (workouts.length < staticWorkouts.length) {
    for (let j = workouts.length; j < staticWorkouts.length; j++) {
      workouts.push(staticWorkouts[j]);
    }
  }
  return workouts;
};
