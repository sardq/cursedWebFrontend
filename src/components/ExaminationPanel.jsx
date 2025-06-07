import './App.css'
import React, { useState, useEffect, useCallback, useRef  } from 'react';
import CalendarComp from './CalendarComp';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteExamination, saveExamination, updateExamination } from './service/examinationActions';
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
import MediaUploadComponent from './MediaComponent';

const ExaminationPanel = () => {

  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());
  const [typeName, setTypeName] = useState("");
  const [modalTypeName, setModalTypeName] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [conclusion, setConclusion] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [examinationTypeId, setExaminationTypeId] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [parameters, setParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [messsage, setMessage] = useState('');
  const [header, setHeader] = useState('');
  const [showToast, setShowToast] = useState(false);

  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const [state, setState] = useState({
    examinations: [],
    search: "",
    currentPage: 1,
    examinationsPerPage: 5,
    sortDir: "asc",
    totalPages: 0,
    totalElements: 0,
  });

const formatToLocalDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
  

  const getExaminations = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;

    const params = {
    page: pageNumber,
    description: state.search,
    pageSize: state.examinationsPerPage,
    sortOrder: state.sortDir  === "desc" ? "Сначала старые" : "Сначала новые",
    dateStart: formatToLocalDate(dateStart),
    dateEnd: formatToLocalDate(dateEnd),
    typeName: typeName,
  };

    const response = await axios.get("http://localhost:8080/api/examination/filter", { params });
    const data = response.data;
    setState(prev => ({
      ...prev,
      examinations: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number + 1,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке обследований:", error);
    localStorage.removeItem("jwtToken");
  }
}, [state.search, state.sortDir, state.examinationsPerPage, dateStart, dateEnd, typeName]);
const [errors, setErrors] = useState({
  name: '',
  modalTypeName: ''
});
const handleStartDateChange = (date) => {
  if (dateEnd && date > dateEnd) {
      setHeader("Ошибка");
      setMessage("Дата начала не может быть позже даты конца");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);      
      return;
  }
   setStartDate(date);
 };

const handleEndDateChange = (date) => {
  if (dateStart && date < dateStart) {
    setHeader("Ошибка");
    setMessage('Дата окончания не может быть раньше даты начала');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);  
    return;    
  }
  setEndDate(date);

};
const validateForm = () => {
  const newErrors = {};

  if (!description.trim()) {
    newErrors.description = 'Введите описание обследования';
  } else if (description.length < 5) {
      newErrors.description = 'Описание обследования должно быть не менее 5 символов';
  } 
  if (!conclusion.trim()) {
    newErrors.conclusion = 'Введите заключение обследования';
  } else if (conclusion.length < 5) {
      newErrors.conclusion = 'Заключение обследования должно быть не менее 5 символов';
  } 
  const now = new Date();
  const inputDate = new Date(time);

  if (!time) {
  newErrors.time =("Дата обследования обязательна.");
  } else if (inputDate > now) {
  newErrors.time =("Дата обследования не может быть позже чем сегодня.");

  }
  if (!modalTypeName) {
  newErrors.type =("Выберите тип обследования.");
  }

  if (!userName) {
  newErrors.user = ("Выберите пациента.");
  }
  const paramErrors = [];
  parameterValues.forEach((param, i) => {
    if (!param.value || !param.value.trim()) {
      paramErrors[i] = `Параметр №${i + 1} не заполнен`;
    }
  });
  if (paramErrors.length > 0) {
    newErrors.parameter = paramErrors;
  }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const mediaRef = useRef();
  const handleSort = () => {
    setState(prev => ({ 
      ...prev, 
      sortDir: prev.sortDir === "asc" ? "desc" : "asc"
    }));
  };
  useEffect(() => {
  getExaminations(1);
}, [state.sortDir, getExaminations]);

  useEffect(() => {
  const fetchTypesAndUsers = async () => {
    try {
      const params = {
    page: 0,
    size: 20,
  };
  const userParams = {
    role: "USER",
    page: 0,
    pageSize: 20,
  };
      const response = await axios.get("http://localhost:8080/api/examinationType", {params});
      setTypeOptions(response.data.content);
      const responseUsers = await axios.get("http://localhost:8080/api/user/patients", { params: userParams});
      console.log(responseUsers);
      setUsers(responseUsers.data.content);
    } catch (error) {
      console.error("Ошибка загрузки типов или пользователей:", error);
    }
  };
  fetchTypesAndUsers();
}, []);
useEffect(() => {
    getExaminations(state.currentPage);
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: true
      });
    }
  }, [getExaminations, state.currentPage]);

  const handleSearchChange = (e) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCancelSearch = () => {
    setState(prev => ({ ...prev, search: "" }));
    getExaminations(1);
  };

  const paginationActions = {
    firstPage: () => getExaminations(1),
    prevPage: () => getExaminations(state.currentPage - 1),
    nextPage: () => getExaminations(state.currentPage + 1),
    lastPage: () => getExaminations(state.totalPages),
  };

  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === state.totalPages;

const handelDeleteExamination = async (examinationId) => {
    try {
      await deleteExamination(examinationId);
      setHeader("Успех");
      setMessage("Обследование успешно удалено");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);      
      await getExaminations(state.currentPage);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };
  const handletEditClick = (examination) => {
  
  setEditingId(examination.id);
  setDescription(examination.description);
  setConclusion(examination.conclusion);
  setTime(new Date(examination.time));
  setExaminationTypeId(examination.examinationTypeId);
  setUserId(examination.userId);

  const foundType = typeOptions.find(t => t.id === examination.examinationTypeId);
  const foundUser = users.find(u => u.id === examination.userId);
  setModalTypeName(foundType?.name ?? '');
  setUserName(foundUser?.fullname ?? '');

    openModal();
  }
  const handletCreateClick = () => {
    setEditingId(null);
    mediaRef.current?.clearTemporaryMedia();
    openModal();
  }

const openModal = () => {
    if (modalRef.current) {
      getExaminations()
      modalInstanceRef.current = new Modal(modalRef.current, { backdrop: 'static',
        keyboard: true});
      modalInstanceRef.current.show();
    }
  };
   const closeModal = () => modalInstanceRef.current?.hide();

  const handleParamChange = (idx, newVal) => {
    setParameterValues(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], value: newVal };
      return copy;
    });
  };
const handleSave = async ( examinationId) => {

   if (mediaRef.current) {
  await mediaRef.current.handleSave(editingId);
  }

  for (const param of parameterValues) {
    const parameterName = parameters.find(p => p.id === param.parametersId)?.name;

    const payload = {
      parametersId: param.parametersId,
      examinationId: examinationId,
      parametersName: parameterName,
      body: param.value
    };
    try {
      if (param.id) {
        await axios.post(`/api/protocolParametres/edit/${param.id}`, payload);
      } else {
        await axios.post(`/api/protocolParametres/create/`, payload);
      }
    } catch (error) {
      console.error("Ошибка сохранения параметра:", error);
    }
  }
};
const resetForm = () => {
    setEditingId(null);
    setCreating(false);
    setUpdating(false);
    setDescription('');
    setModalTypeName('');
    setUserName('');
    setConclusion('');
    setTime(new Date());
    setExaminationTypeId('');
    setUserId('');
    setParameters([]);
    setParameterValues([]);
    closeModal();
    mediaRef.current.clearTemporaryMedia();
    getExaminations(1);
  };

  useEffect(() => {
  const fetchParamsAndValues = async () => {
    if (!examinationTypeId) {
      setParameters([]);
      setParameterValues([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/parametres/GetParametersByTypeId", {
        params: { examinationTypeId }
      });
      const paramsFromApi = response.data.content;
      setParameters(paramsFromApi);

      if (editingId) {
        const valResponse = await axios.get(`/api/protocolParametres?examinationId=${editingId}`);
        const values = valResponse.data;

        const paramMap = new Map();
        for (let val of values) {
          paramMap.set(val.parametersId, val);
        }

        const filled = paramsFromApi.map(p => {
          const existing = paramMap.get(p.id);
          return existing ? { 
        id: existing.id,
        parametersId: p.id,
        value: existing.body } : { parametersId: p.id, value: "" };
        });

        setParameterValues(filled);
      } else {
        setParameterValues(paramsFromApi.map(p => ({ parametersId: p.id, value: "" })));
      }
    } catch (e) {
      console.error("Ошибка загрузки параметров:", e);
      setParameters([]);
      setParameterValues([]);
    }
  };

  fetchParamsAndValues();
}, [examinationTypeId, editingId]);

const handleTypeChoose = (e) => {
    const selectedType = e.target.value;
    const selectedId = typeOptions.find(t => t.name === selectedType);
    
    setExaminationTypeId(selectedId?.id ?? null);
    setModalTypeName(selectedType);
      setParameterValues([]);
  };
  const handleUserChoose = (e) => {
    const selectedUser = e.target.value;
    const selectedId = users.find(u => u.fullname === selectedUser);
    
    setUserId(selectedId?.id ?? null);
    setUserName(selectedUser);
  };

  return (
   <div className="main-content">
     <div style={{ display: showToast ? "block" : "none" }}>
          <MyToast
            show={showToast}
            header = {header}
            message={messsage}
            type={"danger"}
          />
      </div>
      <div
        className="modal fade"
        ref={modalRef}
        id="examinationModal"
        tabIndex="-1"
        aria-labelledby="examinationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content text-white">
            <div className="modal-header">
              <h5 className='modal-title' id="examinationModalLabel">{editingId ? 'Редактировать обследование' : 'Создать обследование'}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={resetForm}
                aria-label="Закрыть"
              />
            </div>
            <div className="modal-body">
               <div className='mb-3'>
                  <label htmlFor="description" className="form-label">Описание</label>
                  <input
                    type="text"
                    id="description"
                   className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                   {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="conclusion" className="form-label">Заключение</label>
                  <input
                     id="conclusion"
                     className={`form-control ${errors.conclusion ? 'is-invalid' : ''}`}
                     value={conclusion}
                     onChange={e => setConclusion(e.target.value)}
                  />
                   {errors.conclusion && <div className="invalid-feedback">{errors.conclusion}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="time" className="form-label">Дата обследования</label>
                  <CalendarComp value={time} onChange={setTime} error={errors.time}/>
                  {errors.time && <div className="invalid-feedback d-block">{errors.time}</div>}
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
                  {errors.type && (
                      <div className="invalid-feedback d-block">{errors.type}</div>
                  )}
                  </div>
                  <div className="mb-3">
                  <label htmlFor="userSelect" className="form-label">Пациент</label>
                  <FormControl
                    as = "select"
                    id="userSelect"
                    className="form-control"
                    value={userName}
                    onChange={e => handleUserChoose(e)}
                  >
                  <option value="">-- Выберите пациента --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.fullname}
                    </option>
                  ))}
                  </FormControl>
                  {errors.user && (
                      <div className="invalid-feedback d-block">{errors.user}</div>
                  )}
                  </div>  
                  {parameters.length > 0 ? (
                  parameters.map((param, idx) => (
                  <div className="form-group mb-3" key={param.id}>
                    <label>{param.name}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.parameter?.[idx] ? 'is-invalid' : ''}`}
                      value={parameterValues[idx]?.value || ''}
                      onChange={e => handleParamChange(idx, e.target.value)}
                      maxLength={10}
                      required
                    />
                    {errors.parameter?.[idx] && (
                    <div className="invalid-feedback">{errors.parameter[idx]}</div>
                    )}
                    <input
                      type="hidden"
                      name={`parameterValues[${idx}].parametersId`}
                      value={param.id}
                    />
                  </div>
                ))
              ) : (
                examinationTypeId && (
                  <p className="text-muted">Нет параметров для выбранного типа</p>
                )
              )}
              <MediaUploadComponent ref={mediaRef} examinationId={editingId} isModalOpen={editingId ? true : false}/>
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
                  formData.append('description', description);
                  formData.append('conclusion', conclusion);
                  formData.append('time', formatToLocalDate(time));
                  formData.append('examinationTypeName', modalTypeName);
                  formData.append('examinationTypeId', examinationTypeId);
                  formData.append('userId', userId);
                  formData.append('userFullname', userName);
                  parameterValues.forEach((pv, index) => {
                    formData.append(
                      `parameterValues[${index}].body`,
                      pv.value
                    );
                  });

                  if (editingId) {
                    setUpdating(true);
                    try {
                      const response = await updateExamination(editingId, formData);
                      setEditingId(response.id);
                      await handleSave(response.id);
                      if (mediaRef.current) await mediaRef.current.handleSave(editingId);
                      setUpdating(false);
                      resetForm();
                    } catch (e) {
                      console.error("Ошибка при обновлении:", e);
                      setUpdating(false);
                    }
                  } else {
                    setCreating(true);
                    try {
                      const response = await saveExamination(formData);
                      console.log(response);
                      setEditingId(response.id);
                      await handleSave(response.id);
                      if (mediaRef.current) await mediaRef.current.handleSave(response.id);
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
                    
                  
      <Card className={"border border-dark bg-dark text-white"} style={{display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
        <Card.Header className="bg-secondary text-white">
      <div className="container-fluid">
    <div className="row g-3">
      <div className="col-12 col-md-4 col-lg-2">
        <FontAwesomeIcon icon={faList} /> Список обследований
      </div>
      <div className="col-12 col-md-8 col-lg-2">
        <h6>Поиск</h6>
        <InputGroup size="sm">
          <FormControl
            placeholder="По описанию"
            value={state.search}
            
            className="info-border bg-dark text-white"
            onChange={handleSearchChange}
          />
          <Button variant="outline-dark" className="no-hover-effect" onClick={() => getExaminations(1)} >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button variant="outline-dark" className="no-hover-effect" onClick={handleCancelSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </InputGroup>
      </div>
      <div className="col-6 col-md-4 col-lg-2">
        <h6>Начало</h6>
        <CalendarComp value={dateStart} onChange={handleStartDateChange} />
      </div>
      <div className="col-6 col-md-4 col-lg-2">
        <h6>Конец</h6>
        <CalendarComp value={dateEnd} onChange={handleEndDateChange} />
      </div>
      <div className="col-6 col-md-4 col-lg-2">
        <h6>Сортировка</h6>
        <FormControl
          size ="sm"
          as="select"
          className="info-border bg-dark text-white"
          value={state.sortDir}
          onChange={handleSort}
        >
          <option value="asc">Сначала новые</option>
          <option value="desc">Сначала старые</option>
        </FormControl>
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
    <col style={{ width: "20%" }} /> 
    <col style={{ width: "20%" }} /> 
    <col style={{ width: "10%" }} /> 
    <col style={{ width: "15%" }} /> 
    <col style={{ width: "20%" }} /> 
    <col style={{ width: "15%" }} />
  </colgroup>
              <thead>
                <tr>
                  <th>Описание</th>
                  <th>заключение</th>
                  <th>Время</th>
                  <th>Тип обследования</th>
                  <th>ФИО пациента</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {state?.examinations?.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных обследований.</td>
                  </tr>
                ) : (
                  state?.examinations?.map((examination) => (
                    <tr key={examination.id}>
                      <td>{examination.description}</td>
                      <td>{examination.conclusion}</td>
                      <td>{examination.time}</td>
                      <td>{examination.examinationTypeName}</td>
                      <td>{examination.userFullname}</td>
                      <td>
                        <ButtonGroup className="gap-4">
                          <Button
                            size="sm"
                            onClick={() => handletEditClick(examination)}
                          >
                          <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handelDeleteExamination (examination.id)}
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