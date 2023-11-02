import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import axios from 'axios';

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios.get('/api/check-session')
    .then(response => {
      setUserId(response.data.userId);
    })
    .catch(error => console.log(error))
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;