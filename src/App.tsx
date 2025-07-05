
import { useState } from 'react';
import AppHeader from './components/AppHeader';
import BottomNavigation from './components/BottomNavigation';
import WorkoutsScreen from './screens/WorkoutsScreen';
import ResultsScreen from './screens/ResultsScreen';
import SettingsScreen from './screens/SettingsScreen';
import './App.css';
import { getCurrentRoundCompletedIds, getLastCompletedWorkout, getNextWorkout } from './utils/storage';


function App() {
  const [activeTab, setActiveTab] = useState('workouts');

  // Получаем список всех тренировок (id и title) из WorkoutsScreen
  // Для этого импортируем workouts из WorkoutsScreen (или выносим в отдельный модуль)
  // Здесь временно дублируем для примера:
  const workouts = [
    { id: 1, title: 'Ноги' },
    { id: 2, title: 'Грудь, Бицепсы, Плечи' },
    { id: 3, title: 'Спина, Трицепс' },
    // ... остальные тренировки ...
    { id: 54, title: '🏆 Финальный тест силы' },
  ];
  const totalWorkouts = 54;
  const completedWorkouts = getCurrentRoundCompletedIds().length;
  const lastWorkout = getLastCompletedWorkout();
  const nextWorkout = getNextWorkout(workouts);

  const renderScreen = () => {
    switch (activeTab) {
      case 'workouts':
        return <WorkoutsScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <WorkoutsScreen />;
    }
  };

  return (
    <div className="app">
      <AppHeader
        completedWorkouts={completedWorkouts}
        totalWorkouts={totalWorkouts}
        lastWorkoutName={lastWorkout ? `${lastWorkout.workoutId}. ${workouts.find(w => w.id === lastWorkout.workoutId)?.title || ''}` : ''}
        nextWorkoutName={nextWorkout ? `${nextWorkout.id}. ${nextWorkout.title}` : ''}
      />
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
