const ExaminationDescribe = ({examination, openFullExaminationModal}) => {
  
  return (
    <div>
      <p>Описание: {examination.description}</p>
      <p>Тип обследования: {examination.examinationType}</p>
      <p>Дата: {examination.time}</p>
      <button 
            type="button" 
            className="btn btn-primary w-40 "
            onClick={() => openFullExaminationModal(examination.id)}
            >
            Посмотреть подробнее
            </button>
    </div>
  );
};

export default ExaminationDescribe;