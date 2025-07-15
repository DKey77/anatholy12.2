# Миграция на единый workouts массив

1. Вынести workouts в src/data/workouts.ts (уже сделано)
2. В файле src/screens/WorkoutsScreen.tsx:
   - Удалить весь массив workouts (от const workouts = [ ... ]; до закрывающей скобки)
   - Добавить импорт: import { workouts } from '../data/workouts';
3. Проверить, что App.tsx и WorkoutsScreen.tsx используют один и тот же workouts
4. Проверить работу прогресс-бара и логики следующей тренировки

Если потребуется — добавить описание следующих шагов.
