import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './WorkoutsScreen.css';
// Импортируем функции для работы с результатами тренировок
import { saveWorkoutResult } from '../utils/storage';
import type { WorkoutResult } from '../utils/storage';
import { useLocalizedWorkouts } from '../data/useLocalizedWorkouts';

const WorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const workouts = useLocalizedWorkouts();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const exercisesRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

      // После завершения круга ничего не удаляем — статистика сохраняется.
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
            <div className="workout-timer">{t('time')}: {formatTime(workoutTimer)}</div>
            <button className="finish-workout-btn" onClick={finishWorkout}>{t('finish_workout', 'Завершить тренировку')}</button>
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
          {workouts.map((workout) => {
            const isExpanded = expandedCard === workout.id;
            return (
              <div 
                key={workout.id} 
                className={`workout-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleCard(workout.id)}
              >
                <div className="workout-header">
                  <div className="workout-number">{workout.id}</div>
                  <div className="workout-info">
                    <h3 className="workout-title">{workout.title}</h3>
                    <span className="exercise-count">{workout.exercises.length} {t('exercises', 'упражнений')}</span>
                  </div>
                  <div className="expand-icon">
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>
                <div
                  className="exercises-list-wrapper"
                  style={{
                    maxHeight: isExpanded && exercisesRefs.current[workout.id]?.scrollHeight
                      ? exercisesRefs.current[workout.id]!.scrollHeight + 'px'
                      : '0px',
                    opacity: isExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <div
                    className="exercises-list"
                    ref={el => { exercisesRefs.current[workout.id] = el; }}
                  >
                    {workout.exercises.map((exercise: any, index: number) => (
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
                  </div>
                </div>
                {isExpanded && (
                  <button
                    className="start-workout-btn"
                    onClick={e => {
                      e.stopPropagation();
                      startWorkout(workout);
                    }}
                    style={{ margin: '20px auto 0', display: 'block' }}
                  >
                    {t('start_workout')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutsScreen;
