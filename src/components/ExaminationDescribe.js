
const ExaminationDescribe = ({examinationType, time}) => {
  

  return (
    <div>
      <p>Тип обследования: {examinationType}</p>
      <p>Время: {time}</p>
    </div>
  );
};

export default ExaminationDescribe;