import React, { useContext } from 'react';
import { AuthContent } from './AuthContent';
const downloadLogFile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Пользователь не авторизован");
      return;
    }

    const response = await fetch("http://localhost:8080/api/log/download", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при загрузке лога");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "application.log";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("Не удалось загрузить лог");
  }
};
const AuthSelection = () => {
    const {setView} = useContext(AuthContent);
  return (
   <div className="container mt-4">
    <h1 className="text-white" >Страница сотрудника</h1>
  <div className="row">
    <div className="col-12">
      <h2 className="text-white">Добро пожаловать, сотрудник!</h2>
      <p className="text-light">Выберите одно из доступных действий ниже.</p>
    </div>
<div
      className="row"
      style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}
    >
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
          <h5 className="card-title">Пользователи</h5>
          <p className="card-text">Управление сотрудниками и пациентами.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('userPanel')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Список типов обследований</h5>
          <p className="card-text">Просмотр, фильтрация и управление типами обследованиями.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('examinationTypePanel')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
      <div className="card bg-dark text-white border-info h-100">
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">Список параметров</h5>
          <p className="card-text">Просмотр, фильтрация и управление параметрами.</p>
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('parametersPanel')}>
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
          <button className="btn btn-outline-info mt-auto" onClick={() => setView('examinationStatistic')}>
            Перейти
          </button>
        </div>
      </div>
    </div>

    <div className="col-sm-6 col-lg-4">
  <div className="card bg-dark text-white border-info h-100">
    <div className="card-body d-flex flex-column justify-content-between">
      <h5 className="card-title">Загрузка лога</h5>
      <p className="card-text">Скачивание логов приложения.</p>
      <button
        className="btn btn-outline-info mt-auto"
        onClick={ downloadLogFile}
      >
        Скачать лог
      </button>
    </div>
  </div>
</div>
<div className="col-sm-6 col-lg-4 mb-3">
        <div className="card bg-dark text-white border-info h-100">
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title">Обработка тикетов</h5>
            <p className="card-text">Ответы на обращения пользователей.</p>
            <button className="btn btn-outline-info mt-auto" onClick={() => setView('ticketPanel')}>
              Перейти
            </button>
          </div>
        </div>
      </div>
      
  </div>
</div>
</div>
  );
};

export default AuthSelection;