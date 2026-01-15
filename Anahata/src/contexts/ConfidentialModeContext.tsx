import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConfidentialModeContextType {
  isConfidential: boolean;
  toggleConfidential: () => void;
  enableConfidential: () => void;
  disableConfidential: () => void;
}

const ConfidentialModeContext = createContext<ConfidentialModeContextType | undefined>(undefined);

export const ConfidentialModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConfidential, setIsConfidential] = useState<boolean>(() => {
    const saved = localStorage.getItem('confidentialMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('confidentialMode', isConfidential.toString());
    if (isConfidential) {
      document.documentElement.setAttribute('data-confidential', 'true');
    } else {
      document.documentElement.removeAttribute('data-confidential');
    }
  }, [isConfidential]);

  const toggleConfidential = () => {
    setIsConfidential(prev => !prev);
  };

  const enableConfidential = () => {
    setIsConfidential(true);
  };

  const disableConfidential = () => {
    setIsConfidential(false);
  };

  return (
    <ConfidentialModeContext.Provider value={{ 
      isConfidential, 
      toggleConfidential, 
      enableConfidential, 
      disableConfidential 
    }}>
      {children}
    </ConfidentialModeContext.Provider>
  );
};

export const useConfidentialMode = (): ConfidentialModeContextType => {
  const context = useContext(ConfidentialModeContext);
  if (!context) {
    throw new Error('useConfidentialMode must be used within a ConfidentialModeProvider');
  }
  return context;
};

