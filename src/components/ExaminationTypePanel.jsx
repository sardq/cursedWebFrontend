import './App.css'
import React, { useState, useEffect, useCallback, useRef  } from 'react';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteExaminationType, saveExaminationType, updateExaminationType } from './service/examinationTypeActions';
import {
  Card,
  Table,
  ButtonGroup,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faEdit,
  faTrash,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from 'bootstrap';

const ExaminationPanel = () => {


  const [name, setName] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const [state, setState] = useState({
    examinationTypes: [],
    search: "",
    currentPage: 1,
    examinationTypesPerPage: 5,
    sortDir: "asc",
    totalPages: 0,
    totalElements: 0,
  });
  const [errors, setErrors] = useState({
  name: '',
  modalTypeName: ''
});
const validateForm = () => {
  const newErrors = {};

  if (!name.trim()) {
    newErrors.name = 'Введите название типа обследования';
  } else if (name.length < 3) {
      newErrors.name = 'Название типа обследования должно быть не менее 3 символов';
    } 

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  const getExaminationTypes = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;

    const params = {
    page: pageNumber,
    name: state.search,
    pageSize: state.examinationTypesPerPage,
  };

    const response = await axios.get("http://localhost:8080/api/examinationType/filter", { params });
    const data = response.data;
    setState(prev => ({
      ...prev,
      examinationTypes: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number + 1,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке обследований:", error);
    localStorage.removeItem("jwtToken");
  }
}, [state.search, state.examinationTypesPerPage]);

useEffect(() => {
    getExaminationTypes(state.currentPage);
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: true
      });
    }
  }, [getExaminationTypes, state.currentPage]);

  const handleSearchChange = (e) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCancelSearch = () => {
    setState(prev => ({ ...prev, search: "" }));
    getExaminationTypes(1);
  };

  const paginationActions = {
    firstPage: () => getExaminationTypes(1),
    prevPage: () => getExaminationTypes(state.currentPage - 1),
    nextPage: () => getExaminationTypes(state.currentPage + 1),
    lastPage: () => getExaminationTypes(state.totalPages),
  };

  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === state.totalPages;

const handelDeleteExaminationType = async (examinationId) => {
    try {
      await deleteExaminationType(examinationId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);      
      await getExaminationTypes(state.currentPage);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };
  const handletEditClick = (examinationType) => {
    setEditingId(examinationType.id);
    setName(examinationType.name);
    openModal();
  }
  const handletCreateClick = () => {
    openModal();
  }

const openModal = () => {
    if (modalRef.current) {
      getExaminationTypes()
      modalInstanceRef.current = new Modal(modalRef.current, { backdrop: 'static',
        keyboard: true});
      modalInstanceRef.current.show();
    }
  };
   const closeModal = () => modalInstanceRef.current?.hide();

const resetForm = () => {
    setEditingId(null);
    setCreating(false);
    setUpdating(false);
    setErrors({});
    setName('');
    closeModal();
    getExaminationTypes(1);
  };

  return (
   <div className="main-content">
     <div style={{ display: showToast ? "block" : "none" }}>
          <MyToast
            show={showToast}
            message={"Тип обследования успешно удален."}
            type={"danger"}
          />
      </div>
      <div
        className="modal fade"
        ref={modalRef}
        id="examinationTypeModal"
        tabIndex="-1"
        aria-labelledby="examinationTypeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content text-white">
            <div className="modal-header">
              <h5 className='modal-title' id="examinationTypeModalLabel">{editingId ? 'Редактировать тип обследования' : 'Создать тип обследования'}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={resetForm}
                aria-label="Закрыть"
              />
            </div>
            <div className="modal-body">
               <div className='mb-3'>
                  <label htmlFor="name" className="form-label">Название</label>
                  <input
                    type="text"
                    id="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Отменить
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={creating || updating}
                onClick={async () => {
                    if (!validateForm()) return;
                  const formData = new FormData();
                  formData.append('name', name);

                  if (editingId) {
                    setUpdating(true);
                    try {
                      await updateExaminationType(editingId, formData);
                      setUpdating(false);
                      resetForm();
                    } catch (e) {
                      console.error("Ошибка при обновлении:", e);
                      setUpdating(false);
                    }
                  } else {
                    setCreating(true);
                    try {
                      await saveExaminationType(formData);
                      setCreating(false);
                      resetForm();
                    } catch (e) {
                      console.error("Ошибка при создании:", e);
                      setCreating(false);
                    }
                  }
                }}
              >
                {editingId
                  ? (updating ? 'Сохранение...' : 'Сохранить')
                  : (creating ? 'Сохранение...' : 'Создать')}
              </button>
            </div>

          </div>
        </div>
      </div>      
    </div>        
                  
      <Card className={"border border-dark bg-dark text-white"} style={{display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
        <Card.Header className="bg-secondary text-white">
      <div className="container-fluid">
    <div className="row g-3">
      <div className="col-12 col-md-4 col-lg-2">
        <FontAwesomeIcon icon={faList} /> Список типов обследований
      </div>
      <div className="col-12 col-md-8 col-lg-2">
        <h6>Поиск</h6>
        <InputGroup size="sm">
          <FormControl
            placeholder="По названию"
            value={state.search}
            className="info-border bg-dark text-white"
            onChange={handleSearchChange}
          />
          <Button variant="outline-dark" className="no-hover-effect" onClick={() => getExaminationTypes(1)}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button variant="outline-dark" className="no-hover-effect" onClick={handleCancelSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </InputGroup>
      </div>
    </div>
  </div>
</Card.Header>

        <Card.Body style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
          <Table bordered hover striped variant="dark" style = {{ tableLayout: "fixed", width: "100%" }}>
  < colgroup>
    <col style={{ width: "80%" }} /> 
    <col style={{ width: "20%" }} /> 
  </colgroup>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {state?.examinationTypes?.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных типов обследований.</td>
                  </tr>
                ) : (
                  state?.examinationTypes?.map((examinationType) => (
                    <tr key={examinationType.id}>
                      <td>{examinationType.name}</td>
                      <td>
                        <ButtonGroup className="gap-4">
                          <Button
                            size="sm"
                            onClick={() => handletEditClick(examinationType)}
                          >
                          <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handelDeleteExaminationType (examinationType.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </Table>
      </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div className="d-none d-md-block">
            {state.totalPages > 0 && (
              <>Страница {state.currentPage} из {state.totalPages}</>
            )}
          </div>
        
          <div className="text-center flex-grow-1">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handletCreateClick}
            >
              Создать новое обследование
            </button>
          </div>
        
          <div className="d-flex gap-1 justify-content-end">
            {state.totalPages > 0 && (
              <InputGroup size="sm">
                <Button
                  variant="outline-info"
                  disabled={isFirstPage}
                  onClick={paginationActions.firstPage}
                >
                  <FontAwesomeIcon icon={faFastBackward} /> First
                </Button>
                <Button
                  variant="outline-info"
                  disabled={isFirstPage}
                  onClick={paginationActions.prevPage}
                >
                  <FontAwesomeIcon icon={faStepBackward} /> Prev
                </Button>
                <Button
                  variant="outline-info"
                  disabled={isLastPage}
                  onClick={paginationActions.nextPage}
                >
                  <FontAwesomeIcon icon={faStepForward} /> Next
                </Button>
                <Button
                  variant="outline-info"
                  disabled={isLastPage}
                  onClick={paginationActions.lastPage}
                >
                  <FontAwesomeIcon icon={faFastForward} /> Last
                </Button>
              </InputGroup>
            )}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ExaminationPanel;