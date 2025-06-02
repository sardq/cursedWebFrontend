import React, { useContext } from 'react';
import { AuthContent } from './AuthContent';

const AuthSelection = () => {
    const {setView} = useContext(AuthContent);
  return (
   <div className="container mt-4">
    <h1>Страница сотрудника</h1>
  <div className="row">
    <div className="col-12">
      <h2 className="text-white">Добро пожаловать, сотрудник!</h2>
      <p className="text-light">Выберите одно из доступных действий ниже.</p>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Список обследований</h5>
          <p className="card-text">Просмотр, фильтрация и управление обследованиями.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('examinationPanel')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Создать обследование</h5>
          <p className="card-text">Добавление нового обследования и прикрепление к пациенту.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('managerCourses')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Пользователи</h5>
          <p className="card-text">Управление сотрудниками и пациентами.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('usersControl')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Типы обследований</h5>
          <p className="card-text">Редактирование и настройка типов обследований.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('typeControl')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Статистика</h5>
          <p className="card-text">Анализ и статистика по обследованиям за выбранный период.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('statistics')}>
            Перейти
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default AuthSelection;