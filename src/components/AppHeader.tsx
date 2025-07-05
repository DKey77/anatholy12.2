import React from 'react';
import { LogoIcon } from './Icons';
import './AppHeader.css';

interface AppHeaderProps {
  completedWorkouts: number;
  totalWorkouts: number;
  lastWorkoutName?: string;
  nextWorkoutName?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  completedWorkouts, 
  totalWorkouts, 
  lastWorkoutName = "Грудь и трицепс",
  nextWorkoutName = "Спина и бицепс"
}) => {
  const progress = Math.round((completedWorkouts / totalWorkouts) * 100);
  
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <LogoIcon size={32} color="#007aff" />
        </div>
        <div className="workout-counter">
          <div className="progress-bar-container">
            <div className="progress-header">
              <span className="progress-title">Прогресс тренировок</span>
              <span className="workout-stats">{completedWorkouts} из {totalWorkouts}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="workout-info">
              <div className="workout-item">
                <span className="workout-label">Последняя</span>
                <span className="workout-name">{lastWorkoutName}</span>
              </div>
              <div className="workout-item">
                <span className="workout-label">Следующая</span>
                <span className="workout-name">{nextWorkoutName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
