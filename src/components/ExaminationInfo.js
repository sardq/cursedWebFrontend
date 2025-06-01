import { useContext } from "react";
import { AuthContent } from "./AuthContent";

const ExaminationInfo = ({examination}) => {
  
  const {setView} = useContext(AuthContent)
  return (
    <div>
      <p>Описание: {examination.description}</p>
      <p>Тип обследования: {examination.examinationType}</p>
      <p>Дата: {examination.time}</p>
      <button 
            type="button" 
            className="btn btn-primary w-40 "
            onClick={() => setView("examinationInfo")}
            >
            Вернуться назад
            </button>
    </div>
  );
};

export default ExaminationInfo;