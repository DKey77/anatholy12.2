
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsScreen.css';
import { clearWorkoutResults } from '../utils/storage';


const SettingsScreen: React.FC = () => {
  const [cleared, setCleared] = useState(false);
  const { t, i18n: i18nextInstance } = useTranslation();

  // Удаляет все данные статистики
  const handleClearStats = () => {
    clearWorkoutResults();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="screen">
      <div className="screen-content">
        {/* Языковой переключатель */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
          <button
            style={{
              padding: '8px 18px',
              borderRadius: 12,
              border: 'none',
              background: i18nextInstance.language === 'ru' ? 'linear-gradient(90deg,#007aff 0%,#00c6fb 100%)' : 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: i18nextInstance.language === 'ru' ? '0 2px 8px rgba(0,122,255,0.10)' : 'none',
              transition: 'background 0.2s',
            }}
            onClick={() => i18nextInstance.changeLanguage('ru')}
          >ru</button>
          <button
            style={{
              padding: '8px 18px',
              borderRadius: 12,
              border: 'none',
              background: i18nextInstance.language === 'uk' ? 'linear-gradient(90deg,#007aff 0%,#00c6fb 100%)' : 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: i18nextInstance.language === 'uk' ? '0 2px 8px rgba(0,122,255,0.10)' : 'none',
              transition: 'background 0.2s',
            }}
            onClick={() => i18nextInstance.changeLanguage('uk')}
          >ua</button>
          <button
            style={{
              padding: '8px 18px',
              borderRadius: 12,
              border: 'none',
              background: i18nextInstance.language === 'en' ? 'linear-gradient(90deg,#007aff 0%,#00c6fb 100%)' : 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: i18nextInstance.language === 'en' ? '0 2px 8px rgba(0,122,255,0.10)' : 'none',
              transition: 'background 0.2s',
            }}
            onClick={() => i18nextInstance.changeLanguage('en')}
          >eng</button>
        </div>
          <div style={{
            margin: '0 0 24px 0',
            fontSize: 15,
            color: '#fff',
            lineHeight: 1.6,
            fontFamily: 'inherit',
            background: 'none',
            padding: 0,
            textAlign: 'left'
          }}>
            {t('about_text', 'Данный курс тренировок создан Владимиром Шмонденком (более известным как MR ANATOLY) — атлетом, тренером и, по совместительству, самым сильным уборщиком на планете. Его авторская методика уже помогла тысячам людей улучшить здоровье, набрать форму и поверить в собственные силы.')}<br /><br />
            {t('support_text', 'Чтобы поддержать автора и получить полный курс с версией для домашних тренировок, планом питания и полезными советами — нажмите кнопку ниже:')}<br />
            <a
              href="https://shmondenkovladimir.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 16,
                padding: '12px 28px',
                background: 'linear-gradient(90deg,#007aff 0%,#00c6fb 100%)',
                color: '#fff',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,122,255,0.10)',
                border: 'none',
                transition: 'background 0.2s',
                textAlign: 'center',
                letterSpacing: 0.2,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {t('support_author', 'Перейти на сайт shmondenkovladimir.com')}
            </a>
          </div>
        <div className="settings-block">
          <button className="clear-stats-btn" onClick={handleClearStats}>
            {t('delete_stats')}
          </button>
          {cleared && <div className="clear-success">{t('stats_deleted', 'Статистика удалена!')}</div>}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
