import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AgentActivity {
  id: string;
  message: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'info';
}

interface ActivityContextType {
  activities: AgentActivity[];
  addActivity: (message: string, status?: 'pending' | 'success' | 'info') => void;
}

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  addActivity: () => {},
});

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<AgentActivity[]>([]);

  const addActivity = useCallback((message: string, status: 'pending' | 'success' | 'info' = 'info') => {
    setActivities(prev => [
      { id: Math.random().toString(36).substring(7), message, timestamp: new Date(), status },
      ...prev
    ].slice(0, 10)); // keep last 10
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
