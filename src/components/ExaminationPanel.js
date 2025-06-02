import './App.css'
import React, { useState, useEffect, useCallback, useContext, useRef  } from 'react';
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
import { AuthContent } from './AuthContent';
import { Modal } from 'bootstrap';

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
  const [mediaFiles, setMediaFiles] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

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
    sortOrder: state.sortDir  === "asc" ? "Сначала старые" : "Сначала новые",
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
      const response = await axios.get("http://localhost:8080/api/examinationType", {params});
      setTypeOptions(response.data.content);
      const responseUsers = await axios.get("http://localhost:8080/api/user", {params});
      setUsers(responseUsers.data);
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
    setMediaFiles([]);
    closeModal();
    getExaminations(1);
  };

  useEffect(() => {
    if (examinationTypeId) {
      const fetchParameters = async () => {
        try {
          const params = {
            examinationTypeId : examinationTypeId
          }
          const response = await axios.get(
            "http://localhost:8080/api/parametres/GetParametersByTypeId", {params}
          );
          console.log(response.data.content)
          const paramsFromApi = response.data.content;
          setParameters(paramsFromApi);
          setParameterValues(
            paramsFromApi.map(p => ({
              parameterId: p.id,
              value: ''
            }))
          );
        } catch (e) {
          console.error("Ошибка загрузки параметров:", e);
          setParameters([]);
          setParameterValues([]);
        }
      };
      fetchParameters();
    } else {
      setParameters([]);
      setParameterValues([]);
    }
  }, [examinationTypeId]);
const handleParamChange = (idx, newVal) => {
    setParameterValues(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], value: newVal };
      return copy;
    });
  };
  const handleMediaFilesChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };
const handleTypeChoose = (e) => {
    const selectedType = e.target.value;
    const selectedId = typeOptions.find(t => t.name === selectedType);
    
    setExaminationTypeId(selectedId?.id ?? null);
    setModalTypeName(selectedType);
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
            message={"Обследование успешно удалено."}
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
          <div className="modal-content">
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
                    className="form-control"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="conclusion" className="form-label">Заключение</label>
                  <input
                     id="conclusion"
                     className='form-control'
                     value={conclusion}
                     onChange={e => setConclusion(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="time" className="form-label">Дата обследования</label>
                  <CalendarComp value={time} onChange={setTime} />
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
                    <option key={user.id} value={user.fullname}>
                      {user.fullname}
                    </option>
                  ))}
                  </FormControl>
                  </div>  
                  {parameters.length > 0 ? (
                  parameters.map((param, idx) => (
                  <div className="form-group mb-3" key={param.id}>
                    <label>{param.name}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={parameterValues[idx]?.value || ''}
                      onChange={e => handleParamChange(idx, e.target.value)}
                      maxLength={10}
                      required
                    />
                    <input
                      type="hidden"
                      name={`parameterValues[${idx}].parameterId`}
                      value={param.id}
                    />
                  </div>
                ))
              ) : (
                examinationTypeId && (
                  <p className="text-muted">Нет параметров для выбранного типа</p>
                )
              )}
              <div className="form-group mb-3">
                <label className="control-label">Фото и видео</label>
                <input
                  type="file"
                  name="mediaFiles"
                  className="form-control"
                  multiple
                  accept=".jpg,.jpeg,video/mp4"
                  onChange={handleMediaFilesChange}
                />
              </div>
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
                      `parameterValues[${index}].parameterId`,
                      pv.parameterId
                    );
                    formData.append(
                      `parameterValues[${index}].value`,
                      pv.value
                    );
                  });

                  mediaFiles.forEach(file => {
                    formData.append('mediaFiles', file);
                  });

                  if (editingId) {
                    setUpdating(true);
                    try {
                      const response = await updateExamination(editingId, formData);
                      console.log(response);
                      console.log(formData);

                      setUpdating(false);
                      resetForm();
                    } catch (e) {
                      console.error("Ошибка при обновлении:", e);
                      setUpdating(false);
                    }
                  } else {
                    setCreating(true);
                    try {
                      await saveExamination(formData);
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
      <div className="col-6 col-md-4 col-lg-2">
        <h6>Начало</h6>
        <CalendarComp value={dateStart} onChange={setStartDate} />
      </div>
      <div className="col-6 col-md-4 col-lg-2">
        <h6>Конец</h6>
        <CalendarComp value={dateEnd} onChange={setEndDate} />
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
      <div className="col-12 col-md-8 col-lg-2">
        <h6>Поиск</h6>
        <InputGroup size="sm">
          <FormControl
            placeholder="По описанию"
            value={state.search}
            className="info-border bg-dark text-white"
            onChange={handleSearchChange}
          />
          <Button variant="outline-info" onClick={() => getExaminations(1)}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button variant="outline-danger" onClick={handleCancelSearch}>
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

        {state?.examinations?.length > 0 && (
          <Card.Footer className="d-flex justify-content-between align-items-center">
            <div>
              Страница {state.currentPage} из {state.totalPages}
            </div>
            <div>
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
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default ExaminationPanel;