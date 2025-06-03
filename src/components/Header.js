import './App.css';
import React, { useContext } from 'react';
import { AuthContent } from './AuthContent';

export default function Header({ pageTitle, logoSrc }) {
  const { role, setView, email } = useContext(AuthContent);

  return (
    <header className="App-header d-flex justify-content-between align-items-center px-4">
      <div className="header-container">
      <div className="d-flex align-items-center">
        <img src={logoSrc} className="App-logo" alt="logo" />
        <h1 className="App-title ml-3">{pageTitle}</h1>
      </div>

      {/* {role === 'ADMIN' && email === null && ( */}
        {role === 'ADMIN' && (
        <nav>
            <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('adminHome')}
          >
            Главная
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('userPanel')}
          >
            Пользователи
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('examinationPanel')}
            >
           Обследования
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('examinationTypePanel')}
            >
            Типы обследования
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('parametersPanel')}
            >
            Параметры
          </button>
        </nav>
      )}
      {role === "USER" && (
        <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('userHome')}
          >
            Главная
          </button>
      )}
      </div>
    </header>
  );
}