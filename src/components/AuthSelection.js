import React, { useContext } from 'react';
import { AuthContent } from './AuthContent';
import axios from 'axios';

const AuthSelection = () => {
    const { email, setView } = useContext(AuthContent);


  const onEmailAuth = (e) => {
    e.preventDefault();
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
    setView("emailAuth");
  })
  .catch(error => {
    console.error("Ошибка при отправке email:", error);
  });
};
  return (
  <div className="d-flex justify-content-center mt-5">
  <div className="text-center fabuttons" >
      <button 
        type="button" 
        className="btn btn-primary w-100 mb-3"
        onClick={onEmailAuth}
      >
        Получить код на почту
      </button>
      
      <button 
        type="button" 
        className="btn btn-primary w-100"
        onClick={() => setView("login")}
      >
        Вернуться назад
      </button>
      </div>
  </div>
  );
};

export default AuthSelection;