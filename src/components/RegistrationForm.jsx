import './App.css'
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { AuthContent } from './AuthContent';
import MyToast from './MyToast';

const RegistrationForm = ({ onRegister, showToast, setShowToast }) => {
    const { setView } = useContext(AuthContent);
  const [activeTab] = useState('register');
  const [formData, setFormData] = useState({
    fullname: '',
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
  
const changeView = () => {
  setShowToast(false);
  setView("login");
}
const validate = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Введите ФИО';
    } else if (formData.fullname.length < 4) {
      newErrors.fullname = 'ФИО должно быть не менее 4 символов';
    } 
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onRegister(e, formData.fullname, formData.email, formData.password);
  };

  return (
    <div>
      <div style={{ display: showToast ? "block" : "none" }}>
              <MyToast
                show={showToast}
                header = {"Ошибка"}
                message={"Пользователь с такой почтой уже зарегистрирован."}
                type={"danger"}
              />
      </div>
    <div className="row justify-content-center text-white">
      <div className="col-4">
        <ul className="nav nav-pills nav-justified mb-3 mt-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link text-white", { active: activeTab === "login" })}
              onClick={() => changeView()}
            >
              Войти
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link bg-secondary", { active: activeTab === "register" })}
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
                  className={classNames("form-control", { "is-invalid": errors.fullname })}
                  value={formData.fullname}
                  onChange={handleChange}
                />
                {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">Электронная почта</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={classNames("form-control", { "is-invalid": errors.email })}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="registerPassword">Пароль</label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  className={classNames("form-control", { "is-invalid": errors.password })}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button type="submit" className="btn btn-secondary btn-block mb-3">
                Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegistrationForm;