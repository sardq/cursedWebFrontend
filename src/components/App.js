import './App.css';
import React, { useState } from 'react';

import AppContent from './AppContent';
import { AuthContent } from './AuthContent';

function App() {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [view, setView] = useState('login');

  return (
    <div className="App">
      
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <AuthContent.Provider value={{ role, setRole, view, setView, phone, setPhone, email, setEmail }}>
              <AppContent />
            </AuthContent.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
