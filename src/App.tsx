
import { useState, useEffect } from 'react';
import AppHeader from './components/AppHeader';
import BottomNavigation from './components/BottomNavigation';
import WorkoutsScreen from './screens/WorkoutsScreen';
import ResultsScreen from './screens/ResultsScreen';
import SettingsScreen from './screens/SettingsScreen';
import './App.css';

import { getCurrentRoundCompletedIds, getLastCompletedWorkout, getNextWorkout } from './utils/storage';
import { useLocalizedWorkouts } from './data/useLocalizedWorkouts';

import { WorkoutProvider } from './context/WorkoutContext';



function App() {
  const [activeTab, setActiveTab] = useState('workouts');
  const workouts = useLocalizedWorkouts();
  const totalWorkouts = workouts.length;

  // Состояния для прогресса
  const [completedWorkouts, setCompletedWorkouts] = useState(() => getCurrentRoundCompletedIds(totalWorkouts).length);
  const [lastWorkout, setLastWorkout] = useState(() => getLastCompletedWorkout());
  const [nextWorkout, setNextWorkout] = useState(() => getNextWorkout(workouts.map((w: { id: number; title: string }) => ({ id: w.id, title: w.title }))));

  // Обновлять прогресс при изменении localStorage (результатов)
  useEffect(() => {
    const updateProgress = () => {
      setCompletedWorkouts(getCurrentRoundCompletedIds(totalWorkouts).length);
      setLastWorkout(getLastCompletedWorkout());
      setNextWorkout(getNextWorkout(workouts.map((w: { id: number; title: string }) => ({ id: w.id, title: w.title }))));
    };
    window.addEventListener('storage', updateProgress);
    window.addEventListener('focus', updateProgress);
    updateProgress();
    return () => {
      window.removeEventListener('storage', updateProgress);
      window.removeEventListener('focus', updateProgress);
    };
  }, [activeTab, totalWorkouts]);

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
    <WorkoutProvider>
      <div className="app">
        <AppHeader
          completedWorkouts={completedWorkouts}
          totalWorkouts={totalWorkouts}
          lastWorkoutName={lastWorkout ? `${lastWorkout.workoutId}. ${workouts.find((w: { id: number }) => w.id === lastWorkout.workoutId)?.title || ''}` : ''}
          nextWorkoutName={nextWorkout ? `${nextWorkout.id}. ${nextWorkout.title}` : ''}
        />
        {renderScreen()}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </WorkoutProvider>
  );
}

export default App;
