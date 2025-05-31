import React, { useState } from 'react';

const UserHome = () => {
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
        
        <div>
          <div >
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
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;