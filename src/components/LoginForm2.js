import React, { useState } from 'react';
import classNames from 'classnames';

const LoginForm2 = () => {
  const [activeTab, setActiveTab] = useState('login');
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

  

  return (
    <div className="row justify-content-center">
      <div className="col-4">
        <ul className="nav nav-pills nav-justified mb-3 mt-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link", { active: activeTab === "login" })}
              onClick={() => setActiveTab("login")}
            >
              АААААААААААА
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link", { active: activeTab === "register" })}
              onClick={() => setActiveTab("register")}
            >
              ААААААААААААА
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className={classNames("tab-pane", "fade", { "show active": activeTab === "login" })}>
            <form >
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

              <button type="submit" className="btn btn-primary btn-block mb-4">
               ffaaaaaaaaaaaaaaaaaaaaaaa
              </button>
            </form>
          </div>

          <div className={classNames("tab-pane", "fade", { "show active": activeTab === "register" })}>
            <form >
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

export default LoginForm2;