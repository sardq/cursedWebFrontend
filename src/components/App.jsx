import './App.css';
import logo from '../logo.svg';
import React, { useState } from 'react';

import AppContent from './AppContent';
import Header from './Header';
import { AuthContent } from './AuthContent';

function App() {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [view, setView] = useState('login');

  return (
    <div className="App">
          <div className="app-wrapper">
            <AuthContent.Provider value={{ role, setRole, view, setView, email, setEmail }}>
               <Header pageTitle="Клиника. Обследование" logoSrc={logo} />
              <AppContent />
            </AuthContent.Provider>
        </div>
    </div>
  );
}

export default App;
