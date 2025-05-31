import React, { useContext } from 'react';
import { AuthContent } from './AuthContent';
import { request, setAuthHeader } from '../helpers/axios_helper';
import axios from 'axios';

const AuthSelection = () => {
    const { email, phone, setView } = useContext(AuthContent);
  
   const onPhoneAuth = (e) => {
          e.preventDefault();
          request(
              "POST",
              "/api/otp/send/phone",
              {
                  phone: phone,
              }).then(
              (response) => {
                  const token = response.data;
                  setView("phoneAuth");
              }).catch(
              (error) => {
              }
          );
      };
  const onEmailAuth = (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  axios.post(
    "/api/otp/send/email",
    { email },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
  .then(response => {
    console.log(response.data.message); 
    console.log("OTP:", response.data.otp); 
    setView("emailAuth");
  })
  .catch(error => {
    console.error("Ошибка при отправке email:", error);
  });
};
  return (
    <div className="d-flex justify-content-center mt-5">
  <div className="text-center" style={{ width: '300px' }}>
    <form>
      <button 
        type="button" 
        className="btn btn-primary w-100 mb-3"
        onClick={onPhoneAuth}
      >
        Войти с помощью телефона
      </button>
      
      <button 
        type="button" 
        className="btn btn-primary w-100 mb-3"
        onClick={onEmailAuth}
      >
        Войти с помощью почты
      </button>
      
      <button 
        type="button" 
        className="btn btn-primary w-100"
        onClick={() => setView("login")}
      >
        Вернуться назад
      </button>
    </form>
  </div>
</div>
  );
};

export default AuthSelection;