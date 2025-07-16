import ActiveWorkoutModal from '../components/ActiveWorkoutModal';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './WorkoutsScreen.css';
// Импортируем функции для работы с результатами тренировок
// import { saveWorkoutResult } from '../utils/storage';
// import type { WorkoutResult } from '../utils/storage';
import { useLocalizedWorkouts } from '../data/useLocalizedWorkouts';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const workouts = useLocalizedWorkouts();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const exercisesRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Используем глобальный WorkoutContext
  const { startWorkout } = useWorkout();



  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };




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
        <ActiveWorkoutModal />
      </div>
    </div>
  );
};

export default WorkoutsScreen;
