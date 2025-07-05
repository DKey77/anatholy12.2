
import React, { useState } from 'react';
import './SettingsScreen.css';
import { clearWorkoutResults } from '../utils/storage';


const SettingsScreen: React.FC = () => {
  const [cleared, setCleared] = useState(false);

  // Удаляет все данные статистики
  const handleClearStats = () => {
    clearWorkoutResults();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="screen">
      <div className="screen-content">
        <h2>Настройки</h2>
        <div className="settings-block">
          <button className="clear-stats-btn" onClick={handleClearStats}>
            Удалить все данные статистики
          </button>
          {cleared && <div className="clear-success">Статистика удалена!</div>}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
