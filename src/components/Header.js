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

      {role === 'ADMIN' && email === null && (
        <nav>
            <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('adminHome')}
          >
            Главная
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('usersControl')}
          >
            Пользователи
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('examinationControl')}
            >
           Обследования
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('typeControl')}
            >
            Типы обследования
          </button>
          <button
            className="btn m-2 bg-transparent"
            onClick={() => setView('managerCourses')}
            >
            Создание обследования
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