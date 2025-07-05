
import React, { useState, useEffect } from 'react';
import './WorkoutsScreen.css';
// Импортируем функции для работы с результатами тренировок
import { saveWorkoutResult } from '../utils/storage';
import type { WorkoutResult } from '../utils/storage';

const WorkoutsScreen: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // СОСТОЯНИЯ ДЛЯ ТРЕНИРОВКИ
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [workoutTimer, setWorkoutTimer] = useState<number>(0);

  // ТАЙМЕР ТРЕНИРОВКИ
  useEffect(() => {
    let interval: number | null = null;
    if (activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeWorkout]);

  // ФУНКЦИИ ТРЕНИРОВКИ
  const startWorkout = (workout: any) => {
    const exercisesWithWeight = workout.exercises.map((exercise: any) => ({
      ...exercise,
      weight: 0
    }));
    setActiveWorkout({
      ...workout,
      exercises: exercisesWithWeight,
      startTime: new Date()
    });
    setWorkoutTimer(0);
  };


  /**
   * Завершает тренировку, сохраняет результат в localStorage
   */
  const finishWorkout = () => {
    if (activeWorkout) {
      // Формируем результат тренировки
      const result: WorkoutResult = {
        workoutId: activeWorkout.id,
        date: new Date().toISOString(),
        duration: workoutTimer,
        exercises: activeWorkout.exercises.map((ex: any) => ({
          name: ex.name,
          weight: ex.weight || 0
        }))
      };
      saveWorkoutResult(result);
    }
    setActiveWorkout(null);
    setWorkoutTimer(0);
  };

  const updateWeight = (exerciseIndex: number, change: number) => {
    if (!activeWorkout) return;
    const updated = { ...activeWorkout };
    updated.exercises[exerciseIndex].weight = Math.max(0, updated.exercises[exerciseIndex].weight + change);
    setActiveWorkout(updated);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const workouts = [
    {
      id: 1,
      title: "Ноги",
      exercises: [
        { name: "Приседания со штангой", details: "верхнее положение штанги на трапеции", sets: "3×12" },
        { name: "Жим ногами", details: "низкая постановка стоп", sets: "2×15" },
        { name: "Становая тяга с гантелями", details: "пауза 1 секунда в нижней точке", sets: "3×8" },
        { name: "Приседания на одной ноге", details: "с опорой или без", sets: "3×10" },
        { name: "Прыжки вверх до максимальной высоты", details: "прыгай как можно выше", sets: "4×10" }
      ]
    },
    {
      id: 2,
      title: "Грудь, Бицепсы, Плечи",
      exercises: [
        { name: "Жим штанги лёжа", details: "с паузой 2 секунды в нижней точке", sets: "3×10" },
        { name: "Отжимания на брусьях", details: "с дополнительным весом или без", sets: "3×10" },
        { name: "Жим гантелей на наклонной скамье", details: "угол 45°", sets: "3×8" },
        { name: "Молитвенный жим", details: "", sets: "3×15" },
        { name: "Молотковые сгибания рук", details: "", sets: "3×8" },
        { name: "Сгибания рук с супинацией", details: "на наклонной скамье угол 45°", sets: "3×10" },
        { name: "Махи руками стоя", details: "", sets: "2×20" }
      ]
    },
    {
      id: 3,
      title: "Спина, Трицепс",
      exercises: [
        { name: "Становая тяга", details: "сумо или классическая – как удобнее", sets: "3×10" },
        { name: "Тяга штанги в наклоне", details: "", sets: "2×10" },
        { name: "Тяга верхнего блока", details: "широким хватом", sets: "3×10" },
        { name: "Тяга гантели в наклоне", details: "на скамье", sets: "3×12" },
        { name: "Шраги с гантелями", details: "", sets: "3×12" },
        { name: "Разгибания рук на блоке", details: "с канатной рукояткой для трицепсов", sets: "3×12" }
      ]
    },
    {
      id: 4,
      title: "Ноги, Плечи",
      exercises: [
        { name: "Приседания со штангой", details: "", sets: "2×8" },
        { name: "Приседания со штангой с паузой", details: "в нижней точке", sets: "2×7" },
        { name: "Жим ногами", details: "с широкой и высокой постановкой стоп", sets: "4×12" },
        { name: "Выпады с гантелями при ходьбе", details: "на каждую ногу", sets: "3×10" },
        { name: "Подъёмы гантелей в стороны сидя", details: "на среднюю дельту", sets: "3×15" },
        { name: "Жим штанги стоя", details: "армейский жим", sets: "3×8" }
      ]
    },
    {
      id: 5,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Жим на наклонной скамье", details: "угол 30°", sets: "3×10" },
        { name: "Жим гантелей лёжа", details: "", sets: "3×10" },
        { name: "Сведение рук в кроссовере", details: "на блоках", sets: "3×12" },
        { name: "Жим штанги узким хватом", details: "", sets: "3×8" },
        { name: "Передние подъёмы гантелей сидя", details: "", sets: "3×10" },
        { name: "Максимальное количество отжиманий", details: "до отказа", sets: "1×max" }
      ]
    },
    {
      id: 6,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Становая тяга с подставки", details: "высота 3–5 см", sets: "3×8" },
        { name: "Становая тяга классическая", details: "", sets: "2×3" },
        { name: "Подтягивания", details: "или тяга верхнего блока", sets: "3×10" },
        { name: "Тяга гантелей в наклоне", details: "", sets: "3×10" },
        { name: "Шраги с гантелями сидя", details: "", sets: "3×10" },
        { name: "Сгибания рук со штангой", details: "обычный хват", sets: "3×12" },
        { name: "Сгибания рук со штангой", details: "обратным хватом", sets: "2×15" }
      ]
    },
    {
      id: 7,
      title: "Ноги",
      exercises: [
        { name: "Приседания со штангой", details: "", sets: "4×6" },
        { name: "Фронтальные приседания", details: "", sets: "2×10" },
        { name: "Становая тяга", details: "", sets: "3×10" },
        { name: "Жим ногами с паузой", details: "внизу на 3 секунды", sets: "3×8" },
        { name: "Прыжки вверх до максимальной высоты", details: "", sets: "3×10" }
      ]
    },
    {
      id: 8,
      title: "Грудь",
      exercises: [
        { name: "Жим гантелей лёжа", details: "", sets: "3×8" },
        { name: "Жим штанги узким хватом", details: "", sets: "2×10" },
        { name: "Отжимания на брусьях", details: "по возможности с отягощением", sets: "3×8" },
        { name: "Разведения гантелей лёжа", details: "flyes", sets: "4×12" },
        { name: "Жим блина", details: "plate press", sets: "2×20" }
      ]
    },
    {
      id: 9,
      title: "Спина",
      exercises: [
        { name: "Становая тяга", details: "", sets: "3×7" },
        { name: "Тяга в стойке с упором", details: "штанга покоится на высоте 3–5 см над коленом", sets: "2×9" },
        { name: "Тяга блока сидя", details: "", sets: "3×10" },
        { name: "Тяга верхнего блока", details: "широким хватом", sets: "3×10" },
        { name: "Тяга прямыми руками вниз", details: "straight-arm pulldowns", sets: "4×12" }
      ]
    },
    {
      id: 10,
      title: "Руки, Плечи",
      exercises: [
        { name: "Молотковые сгибания рук", details: "", sets: "3×8" },
        { name: "Сгибания рук со штангой", details: "широким хватом", sets: "3×8" },
        { name: "Французский жим лёжа", details: "skull crushers", sets: "3×8" },
        { name: "Разгибания рук с гантелями", details: "на наклонной скамье", sets: "4×12" },
        { name: "Подъёмы гантелей в стороны сидя", details: "", sets: "4×15" }
      ]
    },
    {
      id: 11,
      title: "Ноги",
      exercises: [
        { name: "Приседания", details: "", sets: "5×5" },
        { name: "Жим ногами", details: "пауза 3 секунды в нижней точке", sets: "3×8" },
        { name: "Фронтальные приседания с гантелью", details: "", sets: "4×12" },
        { name: "Прыжки в длину", details: "", sets: "3×8" },
        { name: "Гиперэкстензии с весом", details: "", sets: "3×10" }
      ]
    },
    {
      id: 12,
      title: "Жим лёжа",
      exercises: [
        { name: "Жим штанги лёжа", details: "", sets: "5×5" },
        { name: "Жим гантелей узким хватом", details: "", sets: "3×10" },
        { name: "Разведения гантелей лёжа", details: "на наклонной скамье 30°", sets: "3×12" },
        { name: "Сведения рук в кроссовере", details: "блоки", sets: "4×15" },
        { name: "Жим вниз на трицепс", details: "в кроссовере", sets: "3×12" },
        { name: "Жим штанги узким хватом", details: "3 секунды вниз и 1 секунда вверх, выполнять с партнёром", sets: "3×5" }
      ]
    },
    {
      id: 13,
      title: "Спина и Бицепс",
      exercises: [
        { name: "Становая тяга", details: "", sets: "5×5" },
        { name: "Подтягивания", details: "или тяга верхнего блока", sets: "4×8" },
        { name: "Горизонтальная тяга на блоке", details: "", sets: "4×10" },
        { name: "Тяга штанги в наклоне", details: "важно не брать слишком большой вес, сосредоточься на технике и ощущениях", sets: "3×10" }
      ]
    },
    {
      id: 14,
      title: "Ноги",
      exercises: [
        { name: "Приседания", details: "", sets: "4×4" },
        { name: "Фронтальные приседания", details: "", sets: "3×10" },
        { name: "Жим ногами", details: "", sets: "3×10" },
        { name: "Прыжки вверх", details: "high jumps", sets: "4×12" },
        { name: "Приседания на одной ноге", details: "можно с опорой", sets: "2×10" }
      ]
    },
    {
      id: 15,
      title: "Грудные мышцы",
      exercises: [
        { name: "Жим штанги лёжа", details: "", sets: "4×4" },
        { name: "Жим штанги лёжа", details: "с 4-секундной паузой внизу", sets: "3×3" },
        { name: "Жим гантелей лёжа", details: "", sets: "3×12" },
        { name: "Пуловер", details: "", sets: "3×12" },
        { name: "Жим с пола", details: "floor presses", sets: "2×max" }
      ]
    },
    {
      id: 16,
      title: "Спина и Ноги",
      exercises: [
        { name: "Становая тяга", details: "", sets: "4×4" },
        { name: "Жим ногами", details: "", sets: "3×10" },
        { name: "Тяга блока сидя", details: "с 2-секундной паузой в верхней точке", sets: "5×8" },
        { name: "Прыжки вверх", details: "vertical jumps", sets: "3×10" }
      ]
    },
    {
      id: 17,
      title: "Ноги",
      exercises: [
        { name: "Приседания", details: "", sets: "3×3" },
        { name: "Приседания с трап-грифом", details: "trap bar", sets: "3×10" },
        { name: "Жим ногами", details: "", sets: "3×10" },
        { name: "Сумо-приседания с гантелью", details: "на груди", sets: "3×10" }
      ]
    },
    {
      id: 18,
      title: "Грудь",
      exercises: [
        { name: "Жим штанги лёжа", details: "", sets: "3×3" },
        { name: "Жим штанги лёжа на наклонной скамье", details: "45°", sets: "3×8" },
        { name: "Жим штанги стоя", details: "армейский жим", sets: "3×6" },
        { name: "Жим гантелей на наклонной скамье", details: "40°", sets: "4×15" }
      ]
    },
    {
      id: 19,
      title: "Спина",
      exercises: [
        { name: "Становая тяга", details: "", sets: "3×3" },
        { name: "Тяга штанги в наклоне", details: "обратным хватом", sets: "3×8" },
        { name: "Тяга верхнего блока", details: "", sets: "3×10" },
        { name: "Тяга Т-грифа", details: "Т-bar rows", sets: "4×10" },
        { name: "Шраги со штангой", details: "", sets: "4×10" }
      ]
    },
    {
      id: 20,
      title: "Ноги и плечи",
      exercises: [
        { name: "Приседания", details: "", sets: "2×2" },
        { name: "Фронтальные приседания", details: "", sets: "3×12" },
        { name: "Жим ногами", details: "сумо", sets: "3×10" },
        { name: "Жим штанги стоя", details: "", sets: "3×6" },
        { name: "Жим гантелей сидя", details: "", sets: "3×10" }
      ]
    },
    {
      id: 21,
      title: "Грудь и трицепсы",
      exercises: [
        { name: "Жим штанги лёжа", details: "", sets: "2×2" },
        { name: "Жим гантелей на наклонной скамье", details: "30°", sets: "3×10" },
        { name: "Отжимания на брусьях", details: "дипсы", sets: "3×15" },
        { name: "Французский жим гантелей", details: "на наклонной скамье 30°", sets: "3×12" },
        { name: "Разгибания на блоке на трицепс", details: "", sets: "4×12" }
      ]
    },
    {
      id: 22,
      title: "Спина и бицепсы",
      exercises: [
        { name: "Становая тяга", details: "", sets: "2×2" },
        { name: "Тяга штанги в наклоне", details: "", sets: "3×8" },
        { name: "Тяга гантелей в наклоне", details: "", sets: "3×10" },
        { name: "Подтягивания", details: "", sets: "3×10" },
        { name: "Сгибания штанги", details: "обратным хватом", sets: "3×10" },
        { name: "Сгибания рук на бицепс", details: "в кроссовере", sets: "3×20" }
      ]
    },
    {
      id: 23,
      title: "Ноги, плечи",
      exercises: [
        { name: "Присед", details: "на рекорд", sets: "1×1" },
        { name: "Приседания", details: "", sets: "3×12" },
        { name: "Жим ногами", details: "", sets: "3×15" },
        { name: "Подъёмы гантелей в стороны", details: "", sets: "4×12" },
        { name: "Жим гантелей стоя", details: "", sets: "3×12" }
      ]
    },
    {
      id: 24,
      title: "Грудь, бицепс",
      exercises: [
        { name: "Жим штанги", details: "на рекорд", sets: "1×1" },
        { name: "Жим штанги", details: "", sets: "3×10" },
        { name: "Жим гантелей на наклонной скамье", details: "", sets: "3×10" },
        { name: "Сгибания рук «молот»", details: "", sets: "5×5" },
        { name: "Сгибания одной руки на блоке", details: "", sets: "3×10" }
      ]
    },
    {
      id: 25,
      title: "Становая тяга",
      exercises: [
        { name: "Тяга штанги в наклоне", details: "", sets: "1×max" },
        { name: "Тяга штанги в наклоне", details: "", sets: "3×8" },
        { name: "Тяга верхнего блока к груди", details: "", sets: "5×10" },
        { name: "Разгибания рук на блоке", details: "", sets: "3×12" },
        { name: "Французский жим гантелей", details: "на горизонтальной скамье", sets: "3×10" },
        { name: "Отжимания с узкой постановкой рук", details: "алмазные", sets: "2×max" }
      ]
    },
    {
      id: 26,
      title: "Ноги",
      exercises: [
        { name: "Приседания «пистолет»", details: "каждая нога, можно с опорой", sets: "3×12" },
        { name: "Прыжки на тумбу", details: "box jumps", sets: "3×10" },
        { name: "Выпады на платформу с дополнительным весом", details: "каждая нога", sets: "3×14" },
        { name: "Подъёмы на носки на одной ноге с весом", details: "", sets: "4×20" },
        { name: "Поза стула", details: "", sets: "1×max" }
      ]
    },
    {
      id: 27,
      title: "Спина, бицепс",
      exercises: [
        { name: "Подтягивания широким хватом", details: "", sets: "3×10" },
        { name: "Подтягивания обратным хватом", details: "", sets: "3×8" },
        { name: "Подтягивания одной рукой к низкому турнику", details: "", sets: "3×8" },
        { name: "Подтягивания узким обратным хватом", details: "к низкому турнику", sets: "3×8" }
      ]
    },
    {
      id: 28,
      title: "Грудь и трицепсы",
      exercises: [
        { name: "Отжимания на брусьях", details: "дипсы", sets: "3×10" },
        { name: "Отжимания с поднятыми ногами", details: "", sets: "3×12" },
        { name: "Узкие отжимания", details: "", sets: "3×12" },
        { name: "Отжимания «лучник»", details: "", sets: "3×10" },
        { name: "Французский жим", details: "", sets: "3×8" }
      ]
    },
    {
      id: 29,
      title: "Пресс и статика",
      exercises: [
        { name: "Подъёмы ног в висе", details: "", sets: "3×12" },
        { name: "Подъёмы ног на брусьях", details: "", sets: "3×12" },
        { name: "Скручивания", details: "crunches", sets: "3×20" },
        { name: "Планка", details: "", sets: "2×max" }
      ]
    },
    {
      id: 30,
      title: "Ноги",
      exercises: [
        { name: "Пистолет-приседания", details: "на каждую ногу, можно делать с опорой", sets: "3×12" },
        { name: "Прыжки на коробку", details: "", sets: "3×10" },
        { name: "Подъёмы на платформу с дополнительным весом", details: "на каждую ногу", sets: "3×14" },
        { name: "Подъёмы на носки стоя с дополнительным весом", details: "на одной ноге", sets: "4×20" },
        { name: "Поза стула", details: "", sets: "1×max" }
      ]
    },
    {
      id: 31,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Подтягивания широким хватом", details: "", sets: "3×10" },
        { name: "Подтягивания обратным хватом", details: "", sets: "3×8" },
        { name: "Подтягивания одной рукой", details: "низкий турник", sets: "3×8" },
        { name: "Подтягивания обратным узким хватом", details: "низкий турник", sets: "3×8" }
      ]
    },
    {
      id: 32,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Отжимания на брусьях", details: "", sets: "3×10" },
        { name: "Отжимания с поднятыми ногами", details: "", sets: "3×12" },
        { name: "Отжимания узким хватом", details: "", sets: "3×12" },
        { name: "Отжимания \"лучник\"", details: "", sets: "3×10" },
        { name: "Французский жим", details: "", sets: "3×8" }
      ]
    },
    {
      id: 33,
      title: "Пресс, Статика",
      exercises: [
        { name: "Подъёмы ног в висе", details: "", sets: "3×12" },
        { name: "Подъёмы ног на параллельных брусьях", details: "", sets: "3×12" },
        { name: "Скручивания", details: "", sets: "3×20" },
        { name: "Планка", details: "", sets: "2×max" }
      ]
    },
    {
      id: 34,
      title: "Ноги",
      exercises: [
        { name: "Приседания с весом и прыжком", details: "", sets: "3×15" },
        { name: "Пистолет-приседания", details: "", sets: "3×10" },
        { name: "Выпады с весом", details: "на каждую ногу", sets: "3×15" },
        { name: "Поза стула с весом", details: "", sets: "1×max" },
        { name: "Подъёмы на носки на одной ноге с весом", details: "", sets: "4×25" }
      ]
    },
    {
      id: 35,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Подтягивания обратным хватом", details: "", sets: "4×12" },
        { name: "Подтягивания широким хватом попеременно", details: "", sets: "3×8" },
        { name: "Подтягивания низким хватом узким", details: "", sets: "3×10" },
        { name: "Подтягивания за голову", details: "", sets: "5×6" }
      ]
    },
    {
      id: 36,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Отжимания на брусьях", details: "", sets: "4×10" },
        { name: "Отжимания с поднятой одной ногой", details: "", sets: "4×10" },
        { name: "Отжимания на трицепс", details: "", sets: "4×12" },
        { name: "Французский жим", details: "", sets: "4×8" },
        { name: "Отжимания", details: "", sets: "1×max" }
      ]
    },
    {
      id: 37,
      title: "Пресс, Статика",
      exercises: [
        { name: "Подъёмы ног в висе", details: "", sets: "3×12" },
        { name: "Скручивания", details: "", sets: "3×20" },
        { name: "Касания пяток поочерёдно", details: "", sets: "3×15" },
        { name: "Подъёмы ног лёжа", details: "", sets: "3×20" },
        { name: "Планка", details: "", sets: "2×max" }
      ]
    },
    {
      id: 38,
      title: "Ноги",
      exercises: [
        { name: "Приседания с прыжком", details: "", sets: "3×18" },
        { name: "Прыжки на возвышенность", details: "ступеньки", sets: "3×10" },
        { name: "Выпады на каждую ногу", details: "в одном подходе с прыжками", sets: "3×12" },
        { name: "Поза стула с весом перед собой", details: "", sets: "2×25" }
      ]
    },
    {
      id: 39,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Подтягивания широким хватом с паузой", details: "", sets: "3×10" },
        { name: "Подтягивания параллельным хватом", details: "", sets: "3×10" },
        { name: "Подтягивания на низком турнике", details: "", sets: "3×12" },
        { name: "Подтягивания параллельным хватом", details: "на низком турнике", sets: "3×8" },
        { name: "Тяга штанги в наклоне", details: "с весом", sets: "3×15" }
      ]
    },
    {
      id: 40,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Отжимания на брусьях широким хватом", details: "с небольшим наклоном вперёд", sets: "3×12" },
        { name: "Отжимания с поднятыми ногами", details: "", sets: "3×12" },
        { name: "Узкие отжимания", details: "", sets: "3×12" },
        { name: "Гиперэкстензии с отягощением", details: "гантели, бутылки или другие веса в наклоне", sets: "3×10" },
        { name: "Французский жим", details: "", sets: "3×10" }
      ]
    },
    {
      id: 41,
      title: "Пресс, Статическая нагрузка",
      exercises: [
        { name: "Подъёмы ног на перекладине", details: "", sets: "3×12" },
        { name: "Подъёмы ног на параллельных брусьях", details: "", sets: "3×12" },
        { name: "Скручивания", details: "колени согнуты, ноги на возвышенности", sets: "3×20" },
        { name: "Поза стула", details: "", sets: "2×max" },
        { name: "Планка", details: "", sets: "1×max" }
      ]
    },
    {
      id: 42,
      title: "Ноги",
      exercises: [
        { name: "Приседания плие с дополнительным весом", details: "широкая постановка ног", sets: "3×15" },
        { name: "Приседания с панелью и весом", details: "", sets: "3×12" },
        { name: "Болгарские сплит-приседания", details: "", sets: "3×15" },
        { name: "Румынская тяга с дополнительным весом", details: "", sets: "3×12" }
      ]
    },
    {
      id: 43,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Подтягивания снизу", details: "", sets: "4×10" },
        { name: "Тяга в наклоне", details: "гантели, гири, бутылки с водой — любой утяжелитель", sets: "4×12" },
        { name: "Горизонтальные подтягивания", details: "", sets: "3×12" },
        { name: "Подтягивания за голову", details: "", sets: "4×6" }
      ]
    },
    {
      id: 44,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Отжимания с весом на спине", details: "", sets: "4×10" },
        { name: "Отжимания на брусьях", details: "широкий хват", sets: "4×10" },
        { name: "Обратные отжимания на трицепс", details: "прямые ноги", sets: "4×12" },
        { name: "Французский жим", details: "", sets: "4×8" },
        { name: "Разводки с весом", details: "ладони вперед", sets: "3×12" }
      ]
    },
    {
      id: 45,
      title: "Пресс, Статика",
      exercises: [
        { name: "Подъемы коленей в висе", details: "", sets: "3×10" },
        { name: "Скручивания", details: "", sets: "3×20" },
        { name: "Поочередные касания пяток", details: "", sets: "3×15" },
        { name: "\"Ножницы\" лежа", details: "", sets: "3×25" },
        { name: "Планка", details: "", sets: "2×max" }
      ]
    },
    {
      id: 46,
      title: "Ноги",
      exercises: [
        { name: "Боковые выпады", details: "", sets: "3×12" },
        { name: "Приседания на одной ноге с опорой", details: "стена или другая вертикальная поверхность", sets: "3×8" },
        { name: "Подъемы на носки стоя с дополнительным весом", details: "", sets: "3×25" },
        { name: "Поза стула", details: "статическое удержание", sets: "1×max" }
      ]
    },
    {
      id: 47,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Подтягивания обратным хватом", details: "", sets: "3×6" },
        { name: "Тяга гантелей в наклоне", details: "поочередно, с утяжелителями", sets: "3×8" },
        { name: "Горизонтальная тяга на низкой перекладине", details: "", sets: "3×8" },
        { name: "Шраги с весом и сведенными лопатками", details: "без вращений", sets: "3×12" }
      ]
    },
    {
      id: 48,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Разводки лежа", details: "гантели, гири или бутылки с водой", sets: "3×15" },
        { name: "Отжимания с ногами на возвышении", details: "", sets: "3×8" },
        { name: "Отжимания узким хватом с ногами на возвышении", details: "", sets: "3×15" },
        { name: "Отжимания лучника", details: "", sets: "3×7" },
        { name: "Поочередные разгибания на трицепс с гантелью", details: "из-за головы", sets: "3×10" }
      ]
    },
    {
      id: 49,
      title: "Пресс, Статика",
      exercises: [
        { name: "Подъемы коленей в висе", details: "не опускать ниже параллели", sets: "3×8" },
        { name: "Подъемы ног в висе с дополнительным весом", details: "", sets: "3×8" },
        { name: "Скручивания с утяжелением", details: "", sets: "3×15" },
        { name: "Боковая планка", details: "", sets: "2×max" }
      ]
    },
    {
      id: 50,
      title: "Ноги",
      exercises: [
        { name: "Обратные выпады", details: "на каждую ногу", sets: "4×12" },
        { name: "Прыжки из приседа с весом", details: "", sets: "3×12" },
        { name: "Фронтальные приседания с весом", details: "акцент на негативной фазе", sets: "4×12" },
        { name: "Выпады с весом на плечах", details: "", sets: "3×12" }
      ]
    },
    {
      id: 51,
      title: "Спина, Бицепс",
      exercises: [
        { name: "Подтягивания широким хватом за голову", details: "", sets: "3×10" },
        { name: "Сведение лопаток в висе", details: "", sets: "3×15" },
        { name: "Подтягивания за голову", details: "", sets: "3×10" },
        { name: "Подтягивания узким хватом", details: "на низкой перекладине обратный хват", sets: "3×18" },
        { name: "Подъем штанги на бицепс с супинацией", details: "", sets: "4×10" }
      ]
    },
    {
      id: 52,
      title: "Грудь, Трицепс",
      exercises: [
        { name: "Отжимания на брусьях", details: "", sets: "4×12" },
        { name: "Отжимания от пола", details: "суперсет", sets: "4×12" },
        { name: "Отжимания с упором на плечи", details: "ноги на возвышении, таз приподнят", sets: "4×15" },
        { name: "Трицепсовые отжимания от перекладины", details: "с доп. весом", sets: "4×12" },
        { name: "Отжимания на брусьях узким хватом", details: "", sets: "4×12" },
        { name: "Французский жим с гантелью", details: "поочередно каждой рукой", sets: "4×12" },
        { name: "Отжимания с ногами на возвышении", details: "", sets: "1×max" }
      ]
    },
    {
      id: 53,
      title: "Спринты, Статика",
      exercises: [
        { name: "Спринты", details: "60 метров", sets: "4×max" },
        { name: "Планка", details: "", sets: "2×max" }
      ]
    },
    {
      id: 54,
      title: "🏆 Финальный тест силы",
      isFinalTest: true,
      exercises: [
        { name: "Подтягивания на максимум", details: "1 подход до отказа • отдых 15 минут", sets: "MAX" },
        { name: "Отжимания на брусьях", details: "1 подход до отказа • отдых 20 минут", sets: "MAX" },
        { name: "Отжимания от пола", details: "1 подход до отказа • покажи всё на что способен!", sets: "MAX" }
      ]
    }
  ];

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };


  // ЕСЛИ АКТИВНАЯ ТРЕНИРОВКА - ПОКАЗЫВАЕМ ФОРМУ ТРЕНИРОВКИ
  if (activeWorkout) {
    return (
      <div className="screen">
        <div className="screen-content">
          <div className="active-workout-header">
            <h2>{activeWorkout.title}</h2>
            <div className="workout-timer">Время: {formatTime(workoutTimer)}</div>
            <button className="finish-workout-btn" onClick={finishWorkout}>Завершить тренировку</button>
          </div>
          <div className="active-exercises-list">
            {activeWorkout.exercises.map((exercise: any, index: number) => (
              <div key={index} className="active-exercise-item">
                <div className="exercise-info">
                  <div className="exercise-name">{exercise.name}</div>
                  {exercise.details && <div className="exercise-details">{exercise.details}</div>}
                  <div className="exercise-sets">{exercise.sets}</div>
                </div>
                <div className="weight-controls">
                  <div className="weight-display">{exercise.weight} кг</div>
                  <div className="weight-buttons">
                    <button onClick={() => updateWeight(index, -20)}>-20</button>
                    <button onClick={() => updateWeight(index, -5)}>-5</button>
                    <button onClick={() => updateWeight(index, -0.5)}>-0.5</button>
                    <button onClick={() => updateWeight(index, 0.5)}>+0.5</button>
                    <button onClick={() => updateWeight(index, 5)}>+5</button>
                    <button onClick={() => updateWeight(index, 20)}>+20</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="screen">
      <div className="screen-content">
        <div className="workouts-list">
          {workouts.map((workout) => (
            <div 
              key={workout.id} 
              className={`workout-card ${expandedCard === workout.id ? 'expanded' : ''} ${workout.isFinalTest ? 'final-test' : ''}`}
              onClick={() => toggleCard(workout.id)}
            >
              <div className="workout-header">
                <div className="workout-number">{workout.id}</div>
                <div className="workout-info">
                  <h3 className="workout-title">{workout.title}</h3>
                  <span className="exercise-count">{workout.exercises.length} упражнений</span>
                </div>
                <div className="expand-icon">
                  {expandedCard === workout.id ? '−' : '+'}
                </div>
              </div>
              
              {expandedCard === workout.id && (
                <div className="exercises-list">
                  {workout.isFinalTest && (
                    <div className="final-test-description">
                      <p>🎯 Время проверить свой прогресс! Выполни каждое упражнение до отказа и зафиксируй результат.</p>
                      <p>💪 Это твой момент истины - покажи на что способен после всех тренировок!</p>
                    </div>
                  )}
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <span className="exercise-number">{index + 1}.</span>
                      <div className="exercise-content">
                        <div className="exercise-name">{exercise.name}</div>
                        {exercise.details && (
                          <div className="exercise-details">{exercise.details}</div>
                        )}
                      </div>
                      <div className="exercise-sets">{exercise.sets}</div>
                    </div>
                  ))}
                  <button className="start-workout-btn" onClick={(e) => { e.stopPropagation(); startWorkout(workout); }}>
                    {workout.isFinalTest ? "🚀 ПОКАЖИ СВОЮ СИЛУ!" : "Начать тренировку"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutsScreen;
