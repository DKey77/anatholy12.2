import React, { useEffect, useState } from 'react';
import './ResultsScreen.css';
import { getResultsWithRounds } from '../utils/storage';
// import recharts removed, no charts used
import type { WorkoutResult } from '../utils/storage';









import { useLocalizedWorkouts } from '../data/useLocalizedWorkouts';
import { useTranslation } from 'react-i18next';

// Карточка тренировки для статистики
type WorkoutType = { id: number; title: string; exercises: Array<{ name: string; details: string; sets: string }> };
const WorkoutStatsCard: React.FC<{ workout: WorkoutType, results: Array<WorkoutResult & { round: number }>, expanded: boolean }> = ({ workout, results, expanded }) => {
  const { t } = useTranslation();
  return (
    <div className={`exercises-list${expanded ? ' expanded' : ''}`}>
      {workout.exercises.map((exercise, index) => {
        // Найти все результаты по этому упражнению в этой тренировке
        const exerciseResults = results
          .filter(r => r.workoutId === workout.id)
          .map(r => {
            const found = r.exercises.find(e => e.name === exercise.name);
            return found ? found.weight : null;
          })
          .filter(w => w !== null)
          .reverse(); // чтобы новый вес был справа

        return (
          <div key={index} className="exercise-item stats">
            <span className="exercise-number">{index + 1}.</span>
            <div className="exercise-content">
              <div className="exercise-name">{exercise.name}</div>
              {exercise.details && (
                <div className="exercise-details">{exercise.details}</div>
              )}
              <div className="exercise-history-weights">
                {exerciseResults.length === 0 ? (
                  <span className="exercise-history-empty">{t('no_data', '—')}</span>
                ) : (
                  exerciseResults.map((w, i) => (
                    <span key={i} className="exercise-history-weight">{w} кг</span>
                  ))
                )}
              </div>
            </div>
            <div className="exercise-sets">{exercise.sets}</div>
          </div>
        );
      })}
    </div>
  );
};


// Группировка результатов по кругам
const ResultsScreen: React.FC = () => {
  const [results, setResults] = useState<Array<WorkoutResult & { round: number }>>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    // Сортируем по дате убыванию, группируем по кругам
    setResults(getResultsWithRounds().sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const { t } = useTranslation();
  const workouts = useLocalizedWorkouts();
  return (
    <div className="screen">
      <div className="screen-content">
        {workouts.map(workout => (
          <div
            key={workout.id}
            className={`workout-card stats${expandedCard === workout.id ? ' expanded' : ''}`}
            onClick={() => toggleCard(workout.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="workout-header">
              <div className="workout-number">{workout.id}</div>
              <div className="workout-info">
                <h3 className="workout-title">{workout.title}</h3>
                <span className="exercise-count">{workout.exercises.length} {t('exercises', 'упражнений')}</span>
                {(() => {
                  const lastResult = results.filter(r => r.workoutId === workout.id)[0];
                  const formatTime = (seconds: number) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                  };
                  return lastResult && (
                    <div className="workout-duration-label">{t('time', 'Время')}: {formatTime(lastResult.duration)}</div>
                  );
                })()}
              </div>
              <div className="expand-icon">{expandedCard === workout.id ? '−' : '+'}</div>
            </div>
            <WorkoutStatsCard workout={workout} results={results} expanded={expandedCard === workout.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsScreen;
