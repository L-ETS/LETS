import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import axios from 'axios';

const UserProvider = ({ children }) => {
  const [logginedUserId, setLogginedUserId] = useState(null);

  useEffect(() => {
    axios.get('/api/check-session')
    .then(response => {
      setLogginedUserId(response.data.userId);
    })
    .catch(error => console.log(error))
  }, []);

  return (
    <UserContext.Provider value={{ logginedUserId, setLogginedUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;