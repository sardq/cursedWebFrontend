import React from "react";
import { Modal, Button } from "react-bootstrap";

const ExaminationFullModal = ({ show, onHide, examination, parameters, media, onDownloadReport  }) => {
    if (!examination) return null;
  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable className="text-white">
      <Modal.Header closeButton className="bg-secondary text-white">
        <Modal.Title>Детали обследования</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-white">
        <p><strong>ID:</strong> {examination.id}</p>
        <p><strong>Дата:</strong> {new Date(examination.time).toLocaleDateString()}</p>
        <p><strong>Пациент:</strong> {examination.userFullname}</p>
        <p><strong>Тип обследования:</strong> {examination.examinationTypeName}</p>
        <p><strong>Описание:</strong> {examination.description}</p>
        <p><strong>Заключение:</strong> {examination.conclusion}</p>

        <hr />
        <h5>Информация</h5>
        {parameters.length > 0 ? (
          <ul>
            {parameters.map((param) => (
              <li key={param.id}>
                {param.name}: <strong>{param.value}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет параметров</p>
        )}

        <hr />
        <h5>Медиафайлы</h5>
        {media.length > 0 ? (
          <ul>
            {media.map((file) => (
              <li key={file.id}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.originalName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет медиафайлов</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => onDownloadReport(examination.id)}>Сохранить отчёт</Button>
        <Button variant="secondary" onClick={onHide}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExaminationFullModal;