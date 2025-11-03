'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  name: string;
  avatar?: string;
  email?: string;
}

interface UserContextType {
  user: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const user: User = {
    name: 'John Doe',
    avatar: '🧑‍💼',
    email: 'john@example.com',
  };

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context.user;
};
