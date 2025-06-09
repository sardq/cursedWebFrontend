import './App.css'
import React, { useState, useEffect, useCallback, useRef  } from 'react';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteParameters, saveParameters, updateParameters } from './service/parameterActions';
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

const ParametersPanel = () => {


  const [name, setName] = useState('');
  const [typeName, setTypeName] = useState('');
  const [modalTypeName, setModalTypeName] = useState('');
  const [typeId, setTypeId] = useState(null);

  const [typeOptions, setTypeOptions] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const [state, setState] = useState({
    parameters: [],
    search: "",
    currentPage: 1,
    parametersPerPage: 5,
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
    newErrors.name = 'Введите название параметра';
  } else if (name.length < 3) {
      newErrors.name = 'Название параметра должно быть не менее 3 символов';
    } 

  if (!modalTypeName) {
    newErrors.modalTypeName = 'Выберите тип обследования';
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  const getParameters = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;
    const params = {
    page: pageNumber,
    name: state.search,
    typeName: typeName,
    pageSize: state.parametersPerPage,
  };

    const response = await axios.get("http://localhost:8080/api/parametres/filter", { params });
    const data = response.data;
    setState(prev => ({
      ...prev,
      parameters: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number + 1,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке параметров:", error);
    localStorage.removeItem("jwtToken");
  }
}, [state.search, state.parametersPerPage, typeName]);

useEffect(() => {
    getParameters(state.currentPage);
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: true
      });
    }
  }, [getParameters, state.currentPage]);

  const handleSearchChange = (e) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCancelSearch = () => {
    setState(prev => ({ ...prev, search: "" }));
    getParameters(1);
  };

  const paginationActions = {
    firstPage: () => getParameters(1),
    prevPage: () => getParameters(state.currentPage - 1),
    nextPage: () => getParameters(state.currentPage + 1),
    lastPage: () => getParameters(state.totalPages),
  };

  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === state.totalPages;

const handelDeleteParameters = async (examinationId) => {
    try {
      await deleteParameters(examinationId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);      
      await getParameters(state.currentPage);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };
  const handletEditClick = (parameters) => {
    setEditingId(parameters.id);
    setName(parameters.name);
    openModal();
  }
  const handletCreateClick = () => {
    openModal();
  }

const openModal = () => {
    if (modalRef.current) {
      getParameters()
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
    setName('');
    setModalTypeName('');
    setErrors({});
    setTypeId(null);
    closeModal();
    getParameters(1);
  };

  const handleTypeChoose = (e) => {
    const selectedType = e.target.value;
    const selectedId = typeOptions.find(t => t.name === selectedType);
    
    setTypeId(selectedId?.id ?? null);
    setModalTypeName(selectedType);
  };
useEffect(() => {
  const fetchTypesAndUsers = async () => {
    try {
      const params = {
    page: 0,
    size: 20,
  };
      const response = await axios.get("http://localhost:8080/api/examinationType", {params});
      setTypeOptions(response.data.content);
    } catch (error) {
      console.error("Ошибка загрузки типов:", error);
    }
  };
  fetchTypesAndUsers();
}, []);

  return (
   <div className="main-content">
     <div style={{ display: showToast ? "block" : "none" }}>
          <MyToast
            show={showToast}
            message={"Параметр успешно удален."}
            type={"danger"}
          />
      </div>
      <div
        className="modal fade"
        ref={modalRef}
        id="parameterModal"
        tabIndex="-1"
        aria-labelledby="parameterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content text-white">
            <div className="modal-header">
              <h5 className='modal-title' id="parameterModalLabel">{editingId ? 'Редактировать параметр' : 'Создать параметр'}</h5>
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
                <div className="mb-3">
                  <label htmlFor="examinationType" className="form-label">Тип обследования</label>
                    <FormControl
                      id="examinationType"
                      className="form-control"
                      as = "select"
                      value={modalTypeName}
                      onChange={e => handleTypeChoose(e)}
                      >
                      <option value="">-- Выберите тип обследования --</option>
                      {typeOptions.map(t => (
                      <option key={t.id} value={t.name}>
                      {t.name}
                      </option>
                      ))}
                      </FormControl>
                       {errors.modalTypeName && (
                      <div className="invalid-feedback d-block">{errors.modalTypeName}</div>
                       )}
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
                  formData.append('examinationTypeId', typeId);
                  formData.append('examinationTypeName', modalTypeName);
                  if (editingId) {
                    setUpdating(true);
                    try {
                      await updateParameters(editingId, formData);
                      setUpdating(false);
                      resetForm();
                    } catch (e) {
                      console.error("Ошибка при обновлении:", e);
                      setUpdating(false);
                    }
                  } else {
                    setCreating(true);
                    try {
                      await saveParameters(formData);
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
        <FontAwesomeIcon icon={faList} /> Список параметров
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
          <Button variant="outline-dark" className="no-hover-effect" onClick={() => getParameters(1)}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button variant="outline-dark" className="no-hover-effect" onClick={handleCancelSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </InputGroup>
      </div>
      <div className="col-6 col-md-4 col-lg-2">
              <h6>Тип обследования</h6>
              <FormControl
                size ="sm"
                as="select"
                className="info-border bg-dark text-white"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              >
                <option value="">Все</option>
                {typeOptions.map(type => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </FormControl>
            </div>
    </div>
  </div>
</Card.Header>

        <Card.Body style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
          <Table bordered hover striped variant="dark" style = {{ tableLayout: "fixed", width: "100%" }}>
  < colgroup>
    <col style={{ width: "40%" }} /> 
    <col style={{ width: "40%" }} /> 
    <col style={{ width: "20%" }} /> 
  </colgroup>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Тип обследования</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {state?.parameters?.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных параметров.</td>
                  </tr>
                ) : (
                  state?.parameters?.map((parameters) => (
                    <tr key={parameters.id}>
                      <td>{parameters.name}</td>
                      <td>{parameters.examinationTypeName}</td>
                      <td>
                        <ButtonGroup className="justify-content-between">
                          <Button
                            size="sm"
                            onClick={() => handletEditClick(parameters)}
                          >
                          <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handelDeleteParameters (parameters.id)}
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
              Создать новый параметр
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

export default ParametersPanel;