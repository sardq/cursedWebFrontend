import {useContext} from "react";
import OtpInput from "./PhoneOTP";
import { AuthContent } from './AuthContent';
import { request, setAuthHeader } from '../helpers/axios_helper';

const PhoneOtpForm = () => {

    const { phone, setEmail, setPhone, setView } = useContext(AuthContent);


  const onOtpSubmit = (e, otp) => {
     e.preventDefault();
            request(
                "POST",
                "/api/otp/verify",
                {
                    key: phone,
                    otp: otp
                }).then(
                (response) => {
                    const answer = response.data;
                    setAuthHeader(answer);
                    if(answer)
                    {
                        setPhone(null);
                        setEmail(null);
                        setView("homeAdmin");
                    }
                }).catch(
                (error) => {
                    setAuthHeader(null);
                }
            );
  };

  return (
    <div>
        <div>
          <p>Введите код, отправленный на номер +{phone}</p>
          <OtpInput length={4} onOtpSubmit={onOtpSubmit} />
        </div>
    </div>
  );
};

export default PhoneOtpForm;