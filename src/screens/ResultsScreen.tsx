
import React, { useEffect, useState } from 'react';
import './ResultsScreen.css';
import { getResultsWithRounds, getPreviousResult } from '../utils/storage';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import type { WorkoutResult } from '../utils/storage';




// Карточка результата тренировки для сравнения прогресса
const WorkoutResultCard: React.FC<{ result: WorkoutResult }> = ({ result }) => {
  const prev = getPreviousResult(result.workoutId, result.date);
  return (
    <div className="workout-result-card compact">
      <div className="workout-result-header">
        <span className="workout-id">#{result.workoutId}</span>
        <span className="workout-date">{new Date(result.date).toLocaleDateString()}</span>
        <span className="workout-duration">⏱ {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')}</span>
      </div>
      <div className="workout-result-exercises compact">
        {result.exercises.map((ex, i) => {
          const prevEx = prev?.exercises.find(e => e.name === ex.name);
          let diff = null;
          if (prevEx) {
            const d = ex.weight - prevEx.weight;
            if (d > 0) diff = <span className="progress-up">+{d}</span>;
            else if (d < 0) diff = <span className="progress-down">{d}</span>;
            else diff = <span className="progress-same">•</span>;
          }
          return (
            <div key={i} className="workout-result-exercise compact">
              <span className="exercise-name">{ex.name}</span>
              <span className="exercise-weight">{ex.weight}</span>
              {diff && <span className="exercise-diff">{diff}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Аналитика по всем тренировкам
const AnalyticsBlock: React.FC<{ results: Array<WorkoutResult & { round: number }> }> = ({ results }) => {
  // Считаем общее время, количество тренировок, средний вес по упражнениям
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);
  const totalWorkouts = results.length;
  // Собираем статистику по упражнениям
  const exerciseStats: Record<string, { weights: number[], dates: string[] }> = {};
  results.forEach(r => {
    r.exercises.forEach(ex => {
      if (!exerciseStats[ex.name]) exerciseStats[ex.name] = { weights: [], dates: [] };
      exerciseStats[ex.name].weights.push(ex.weight);
      exerciseStats[ex.name].dates.push(r.date);
    });
  });

  // Для графика: показываем топ-1 упражнение по количеству записей
  const topExercise = Object.entries(exerciseStats).sort((a, b) => b[1].weights.length - a[1].weights.length)[0];
  let chartData: { date: string, weight: number }[] = [];
  let chartLabel = '';
  if (topExercise) {
    chartLabel = topExercise[0];
    chartData = topExercise[1].weights.map((w, i) => ({
      date: new Date(topExercise[1].dates[i]).toLocaleDateString(),
      weight: w
    }));
  }

  return (
    <div className="analytics-block">
      <h3>Аналитика</h3>
      <div className="analytics-row">
        <div>Всего тренировок: <b>{totalWorkouts}</b></div>
        <div>Общее время: <b>{Math.floor(totalTime / 60)} мин</b></div>
      </div>
      {chartData.length > 1 && (
        <div className="analytics-chart">
          <div className="chart-title">Прогресс: {chartLabel}</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} width={32} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#007aff" strokeWidth={2} dot={{ r: 3 }} name="Вес (кг)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};


// Группировка результатов по кругам
const ResultsScreen: React.FC = () => {
  const [results, setResults] = useState<Array<WorkoutResult & { round: number }>>([]);

  useEffect(() => {
    // Сортируем по дате убыванию, группируем по кругам
    setResults(getResultsWithRounds().sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  // Группируем по кругам
  const grouped = results.reduce((acc, r) => {
    acc[r.round] = acc[r.round] || [];
    acc[r.round].push(r);
    return acc;
  }, {} as Record<number, Array<WorkoutResult & { round: number }>>);

  const rounds = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="screen">
      <div className="screen-content">
        <h2>Ваша статистика</h2>
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>Здесь будет отображаться прогресс ваших тренировок</p>
          </div>
        ) : (
          <>
            <AnalyticsBlock results={results} />
            <div className="workout-results-list">
              {rounds.map(round => (
                <div key={round} className="results-round-block">
                  <div className="results-round-title">Круг {round}</div>
                  {grouped[Number(round)].map((r, i) => (
                    <WorkoutResultCard key={r.date + r.workoutId + i} result={r} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;
