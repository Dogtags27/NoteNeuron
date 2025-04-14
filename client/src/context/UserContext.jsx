// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username && parsedUser.email) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user'); // Cleanup bad data
        }
      }
    } catch (err) {
      console.error('Invalid user data in localStorage:', err);
      localStorage.removeItem('user'); // Cleanup malformed data
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
