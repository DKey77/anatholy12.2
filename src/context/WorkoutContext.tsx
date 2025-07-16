import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ActiveWorkout = {
  id: number;
  title: string;
  exercises: any[];
  startTime: number; // timestamp (ms)
};

interface WorkoutContextType {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (workout: { id: number; title: string; exercises: any[] }) => void;
  finishWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEY = 'activeWorkout';

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);

  // Восстановление из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setActiveWorkout(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Сохранять в localStorage
  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeWorkout]);

  const startWorkout = (workout: { id: number; title: string; exercises: any[] }) => {
    setActiveWorkout({ ...workout, startTime: Date.now() });
  };

  const finishWorkout = () => {
    setActiveWorkout(null);
  };

  return (
    <WorkoutContext.Provider value={{ activeWorkout, startWorkout, finishWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
};
