import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NightWatchContextType {
  isNightMode: boolean;
  currentHour: number;
}

const NightWatchContext = createContext<NightWatchContextType | undefined>(undefined);

export const NightWatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      setCurrentHour(hour);
      setIsNightMode(hour >= 0 && hour < 6);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isNightMode) {
      document.documentElement.setAttribute('data-night-watch', 'true');
    } else {
      document.documentElement.removeAttribute('data-night-watch');
    }
  }, [isNightMode]);

  return (
    <NightWatchContext.Provider value={{ isNightMode, currentHour }}>
      {children}
    </NightWatchContext.Provider>
  );
};

export const useNightWatch = (): NightWatchContextType => {
  const context = useContext(NightWatchContext);
  if (!context) {
    throw new Error('useNightWatch must be used within a NightWatchProvider');
  }
  return context;
};

