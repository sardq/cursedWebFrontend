import {useContext} from "react";
import OtpInput from "./EmailOTP";
import { AuthContent } from './AuthContent';
import { request } from '../helpers/axios_helper';

const EmailOtpForm = () => {

    const { email, setEmail, setView } = useContext(AuthContent);


  const onOtpSubmit = (otp) => {
        request(
            "POST",
            "/api/otp/verify",
            { key: email, otp: otp }
        ).then(response => {
            console.log("OTP verified successfully", response.data);
            if(response.data.status === "Sucess")
            {
                setEmail(null);
                setView("adminHome");
            }
        }).catch(error => {
            console.error("Ошибка при верификации OTP:", error);
        });
    };
  return (
    <div className="d-flex justify-content-center mt-5">
        <div className="text-center fabuttons text-white" >
          <p>Введите код, отправленный на почту {email}</p>
          <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
          <button 
            type="button" 
            className="btn btn-primary w-40 mt-3"
            onClick={() => setView("authSelection")}
            >
            Вернуться назад
            </button>
        </div>
    </div>
  );
};

export default EmailOtpForm;