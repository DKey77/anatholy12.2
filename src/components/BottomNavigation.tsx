import React from 'react';
import { WorkoutIcon, ResultsIcon, SettingsIcon } from './Icons';
import './BottomNavigation.css';

interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const navItems: NavItem[] = [
  { id: 'workouts', icon: WorkoutIcon },
  { id: 'results', icon: ResultsIcon },
  { id: 'settings', icon: SettingsIcon },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            type="button"
          >
            <IconComponent 
              size={24} 
              color={activeTab === item.id ? '#007aff' : '#8e8e93'}
              strokeWidth={item.id !== 'workouts' ? (activeTab === item.id ? 2.5 : 2) : undefined}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
