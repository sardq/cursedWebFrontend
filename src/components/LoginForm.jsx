import './App.css';
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { AuthContent } from './AuthContent';
import MyToast from './MyToast';

const LoginForm = ({ onLogin, showToast, setShowToast }) => {
  const { setView } = useContext(AuthContent);

  const [activeTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Пароль должен быть не менее 5 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onLogin(e, formData.email, formData.password);
  };
const changeView = () => {
  setShowToast(false);
  setView("register");
}

  return (
    <div>
      <div style={{ display: showToast ? "block" : "none" }}>
              <MyToast
                show={showToast}
                header = {"Ошибка"}
                message={"Пользователь с такими данными не найден."}
                type={"danger"}
              />
      </div>
    <div className="row justify-content-center text-white">
      <div className="col-4">
        <ul className="nav nav-pills nav-justified mb-3 mt-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link bg-secondary", { active: activeTab === "login" })}
            >
              Войти
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link text-white", { active: activeTab === "register" })}
              onClick={() => changeView()}
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
                  className={classNames("form-control", { "is-invalid": errors.email })}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="loginPassword">Пароль</label>
                <input
                  type="password"
                  id="loginPassword"
                  name="password"
                  className={classNames("form-control", { "is-invalid": errors.password })}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button type="submit" className="btn btn-secondary btn-block mb-4">
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
