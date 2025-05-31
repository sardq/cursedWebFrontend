import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { AuthContent } from './AuthContent';

const RegistrationForm = ({ onRegister }) => {
    const { setView } = useContext(AuthContent);
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister(e, formData.fullname, formData.email, formData.password);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-4">
        <ul className="nav nav-pills nav-justified mb-3 mt-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link", { active: activeTab === "login" })}
              onClick={() => setView("login")}
            >
              Войти
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link", { active: activeTab === "register" })}
            >
              Зарегистрироваться
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className={classNames("tab-pane", "fade", { "show active": activeTab === "register" })}>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="fullname">ФИО</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="form-control"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">Электронная почта</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="registerPassword">Пароль</label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block mb-3">
                Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;