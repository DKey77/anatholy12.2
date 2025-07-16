import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { useTranslation } from 'react-i18next';
import { saveWorkoutResult } from '../utils/storage';
import type { WorkoutResult } from '../utils/storage';
import './ActiveWorkoutModal.css';

const ActiveWorkoutModal: React.FC = () => {
  const { activeWorkout, finishWorkout } = useWorkout();
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<any[]>(activeWorkout?.exercises || []);
  const [now, setNow] = useState(Date.now());
  const [showElapsedModal, setShowElapsedModal] = useState(false);
  const [finalElapsed, setFinalElapsed] = useState<number | null>(null);

  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  useEffect(() => {
    if (activeWorkout) setExercises(activeWorkout.exercises);
  }, [activeWorkout]);

  // Show elapsed modal for 3 seconds after finishing
  useEffect(() => {
    if (showElapsedModal) {
      const timeout = setTimeout(() => setShowElapsedModal(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showElapsedModal]);

  // DEBUG: выводим состояние для диагностики (удалить после проверки)
  // console.log('activeWorkout', activeWorkout);
  // console.log('exercises', exercises);
  if (!activeWorkout && !showElapsedModal) return null;

  const elapsed = activeWorkout ? Math.floor((now - activeWorkout.startTime) / 1000) : finalElapsed || 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateWeight = (exerciseIndex: number, change: number) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex] = {
        ...updated[exerciseIndex],
        weight: Math.max(0, (updated[exerciseIndex].weight || 0) + change)
      };
      return updated;
    });
  };

  const handleFinish = () => {
    if (!activeWorkout) return;
    // Сохраняем результат
    const result: WorkoutResult = {
      workoutId: activeWorkout.id,
      date: new Date().toISOString(),
      duration: elapsed,
      exercises: exercises.map(ex => ({
        name: ex.name,
        weight: ex.weight || 0
      }))
    };
    saveWorkoutResult(result);
    setFinalElapsed(elapsed);
    finishWorkout();
    setShowElapsedModal(true);
  };

  return (
    <>
      {/* DEBUG-блок удалён */}
      {activeWorkout && (
        <div className="active-workout-modal">
          <div className="modal-content">
            <h2>{activeWorkout.title}</h2>
            <div className="workout-timer">{t('time')}: {formatTime(elapsed)}</div>
            <button className="finish-workout-btn" onClick={handleFinish}>{t('finish_workout', 'Завершить тренировку')}</button>
            <div className="active-exercises-list">
              {exercises.map((exercise, index) => (
                <div key={index} className="active-exercise-item">
                  <div className="exercise-info">
                    <div className="exercise-name">{exercise.name}</div>
                    {exercise.details && <div className="exercise-details">{exercise.details}</div>}
                    <div className="exercise-sets">{exercise.sets}</div>
                  </div>
                  <div className="weight-controls">
                    <div className="weight-buttons weight-buttons-left">
                      <button className="weight-btn minus" onClick={() => updateWeight(index, -20)}>-20</button>
                      <button className="weight-btn minus" onClick={() => updateWeight(index, -5)}>-5</button>
                      <button className="weight-btn minus" onClick={() => updateWeight(index, -1)}>-1</button>
                      <button className="weight-btn minus" onClick={() => updateWeight(index, -0.5)}>-0.5</button>
                      <button className="weight-btn minus" onClick={() => updateWeight(index, -0.25)}>-0.25</button>
                    </div>
                    <div className="weight-display">{exercise.weight || 0} кг</div>
                    <div className="weight-buttons weight-buttons-right">
                      <button className="weight-btn plus" onClick={() => updateWeight(index, 0.25)}>+0.25</button>
                      <button className="weight-btn plus" onClick={() => updateWeight(index, 0.5)}>+0.5</button>
                      <button className="weight-btn plus" onClick={() => updateWeight(index, 1)}>+1</button>
                      <button className="weight-btn plus" onClick={() => updateWeight(index, 5)}>+5</button>
                      <button className="weight-btn plus" onClick={() => updateWeight(index, 20)}>+20</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showElapsedModal && (
        <div className="elapsed-modal-overlay">
          <div className="elapsed-modal glassmorphic">
            <div className="elapsed-title">{t('workout_completed', 'Тренировка завершена!')}</div>
            <div className="elapsed-time">{t('elapsed_time', 'Время')}: {formatTime(finalElapsed ?? 0)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveWorkoutModal;
