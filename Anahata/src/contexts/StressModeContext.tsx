import React, { createContext, useContext, useState, ReactNode } from 'react';

type StressModeType = 'none' | 'exam' | 'work' | 'internship';

interface StressModeContextType {
  stressMode: StressModeType;
  setStressMode: (mode: StressModeType) => void;
  isActive: boolean;
}

const StressModeContext = createContext<StressModeContextType | undefined>(undefined);

export const StressModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stressMode, setStressModeState] = useState<StressModeType>(() => {
    const saved = localStorage.getItem('stressMode') as StressModeType;
    return saved || 'none';
  });

  const setStressMode = (mode: StressModeType) => {
    setStressModeState(mode);
    localStorage.setItem('stressMode', mode);
  };

  return (
    <StressModeContext.Provider value={{ 
      stressMode, 
      setStressMode, 
      isActive: stressMode !== 'none' 
    }}>
      {children}
    </StressModeContext.Provider>
  );
};

export const useStressMode = (): StressModeContextType => {
  const context = useContext(StressModeContext);
  if (!context) {
    throw new Error('useStressMode must be used within a StressModeProvider');
  }
  return context;
};

