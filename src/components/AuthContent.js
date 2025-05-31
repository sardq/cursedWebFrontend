import React from 'react';

export const AuthContent = React.createContext({
  role: null,
  setRole: () => {},
  view: 'login',
  setView: () => {},
});