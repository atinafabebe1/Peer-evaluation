import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    const storedAuth = localStorage.getItem('accessToken');

    if (storedUser && storedIsAuthenticated) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(JSON.parse(storedIsAuthenticated));
      setAccessToken(storedAuth);
    }
  }, []);

  const login = (userData, accessToken) => {
    const userDataString = JSON.stringify(userData);
    setIsAuthenticated(true);
    setUser(userData);
    setAccessToken(accessToken);
    console.log(accessToken);
    localStorage.setItem('accessToken', accessToken.token);
    localStorage.setItem('user', userDataString);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return <UserContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
