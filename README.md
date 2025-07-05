### Прогресс и навигация по тренировкам

- В шапке приложения отображается прогресс-бар: сколько тренировок завершено из 54 в текущем круге.
- После каждой завершённой тренировки прогресс обновляется автоматически.
- Отображается последняя завершённая тренировка (номер, название).
- Отображается следующая рекомендуемая тренировка — та, которую вы ещё не прошли в текущем круге.
- После завершения всех 54 тренировок круг считается завершённым, прогресс сбрасывается, начинается новый круг.
# BeAnatoly - Мобильное приложение для тренировок

Современное мобильное приложение для отслеживания тренировок, построенное с использованием React, TypeScript и Vite.

## Особенности

- ✨ Дизайн в стиле iOS
- 📱 Адаптивный интерфейс для мобильных устройств
- 🎯 Три основных раздела: Тренировки, Результаты, Настройки
- 🚀 Быстрая разработка с Vite
- 💪 TypeScript для типобезопасности

## Технологии

- **React 18** - Современная библиотека для создания пользовательских интерфейсов
- **TypeScript** - Статическая типизация для JavaScript
- **Vite** - Быстрый сборщик и сервер разработки
- **CSS3** - Современные стили с поддержкой темной темы

## Быстрый старт

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер разработки:
```bash
npm run dev
```

3. Откройте [http://localhost:5173](http://localhost:5173) в браузере


## Хранение и статистика тренировок

### Как работает статистика

1. Пользователь выбирает тренировку, нажимает «Начать тренировку».
2. В процессе фиксирует веса для каждого упражнения.
3. По завершении — нажимает «Завершить тренировку», данные сохраняются в localStorage.
4. В разделе «Ваша статистика» отображаются все завершённые тренировки, прогресс по каждому упражнению и тренировке.
5. Если тренировка проходится повторно — показывается сравнение с предыдущими результатами (разница в весах, времени и т.д.).

### Структура данных результата тренировки

```ts
type WorkoutResult = {
  workoutId: number;
  date: string; // ISO
  duration: number; // seconds
  exercises: {
    name: string;
    weight: number;
  }[];
};
```

### Где хранятся данные

Все результаты тренировок сохраняются в localStorage браузера под ключом `workoutResults`.

### Как добавить новые функции

- Для работы с результатами используйте функции из `src/utils/storage.ts`.
- Для отображения прогресса используйте данные из localStorage.
- Для сброса статистики вызовите функцию `clearWorkoutResults()`.

---
## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   └── BottomNavigation # Нижняя навигационная панель
├── screens/             # Экраны приложения
│   ├── WorkoutsScreen   # Экран тренировок
│   ├── ResultsScreen    # Экран результатов
│   └── SettingsScreen   # Экран настроек
└── App.tsx             # Главный компонент приложения
```

## Доступные команды

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка для production
- `npm run preview` - Предварительный просмотр production сборки
- `npm run lint` - Проверка кода с ESLint

## Дизайн

Приложение следует рекомендациям Apple Human Interface Guidelines и включает:

- Нижнюю навигационную панель с тремя вкладками
- Поддержку темной темы
- Плавные анимации и переходы
- Адаптивный дизайн для различных размеров экранов
- Поддержку Safe Area для iPhone X и новее
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
