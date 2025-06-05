import './App.css'
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { AuthContent } from './AuthContent';

const LoginForm = ({ onLogin, onRegister }) => {
    const { setView } = useContext(AuthContent);
  const [activeTab] = useState('login');
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(e, formData.email, formData.password);
  };


  return (
    <div className="row justify-content-center text-white">
      <div className="col-4">
        <ul className="nav nav-pills nav-justified mb-3 mt-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link bg-secondary", { active: activeTab === "login"  })}
            >
              Войти
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link text-white", { active: activeTab === "register" })}
              onClick={() => setView("register")}
            >
              Зарегистрироваться
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className={classNames("tab-pane", "fade", { "show active": activeTab === "login" })}>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="loginEmail">Электронная почта</label>
                <input
                  type="email"
                  id="loginEmail"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="loginPassword">Пароль</label>
                <input
                  type="password"
                  id="loginPassword"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-secondary btn-block mb-4">
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;