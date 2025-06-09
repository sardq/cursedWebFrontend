import './App.css'
import React, { useState, useEffect, useCallback, useRef  } from 'react';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteTicket } from './service/ticketActions';
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
  faTrash,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from 'bootstrap';
import { answerTicket } from './service/ticketActions';

const TicketPanel = () => {

  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState("InProcess")

  const [answeringId, setAnsweringId] = useState(null);
  const [creating, setCreating] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const [state, setState] = useState({
    tickets: [],
    search: "",
    currentPage: 1,
    ticketsPerPage: 5,
    totalPages: 0,
    totalElements: 0,
  });
  const [errors, setErrors] = useState({
    answer: '',
  });
  const validateForm = () => {
  const newErrors = {};

  if (!answer.trim()) {
    newErrors.answer = 'Введите название параметра';
  } else if (answer.length < 10) {
      newErrors.answer = 'Ответ должен быть не менее 10 символов';
    } 

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  const getTickets = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;

    const params = {
    page: pageNumber,
    search: state.search,
    status: status,
    pageSize: state.ticketsPerPage,
  };

    const response = await axios.get("http://localhost:8080/api/ticket/filter", { params });
    const data = response.data;
    setState(prev => ({
      ...prev,
      tickets: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number + 1,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке обследований:", error);
    localStorage.removeItem("jwtToken");
  }
}, [state.search, state.ticketsPerPage, status]);

useEffect(() => {
    getTickets(state.currentPage);
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: true
      });
    }
  }, [getTickets, state.currentPage]);
useEffect(() => {
  getTickets(1); 
}, [getTickets]);
  const handleSearchChange = (e) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCancelSearch = () => {
    setState(prev => ({ ...prev, search: "" }));
    getTickets(1);
  };

  const paginationActions = {
    firstPage: () => getTickets(1),
    prevPage: () => getTickets(state.currentPage - 1),
    nextPage: () => getTickets(state.currentPage + 1),
    lastPage: () => getTickets(state.totalPages),
  };

  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === state.totalPages;

const handelDeleteTicket = async (ticketId) => {
  try {
    await deleteTicket(ticketId);

   

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    await getTickets(state.currentPage);
  } catch (error) {
    console.error("Ошибка при удалении:", error);
  }
};
const getRussianStatus = (status) => {
  switch (status) {
    case 'InProcess':
      return 'В обработке';
    case 'Answered':
      return 'Отвечено';
    default:
      return status;
  }
};
const openModal = (ticket) => {
    if (modalRef.current) {
      setAnsweringId(ticket.id)
      setMessage(ticket.message || '');
      setAnswer('');
      setErrors({});
      modalInstanceRef.current = new Modal(modalRef.current, { backdrop: 'static',
        keyboard: true});
      modalInstanceRef.current.show();
    }
  };
   const closeModal = () => modalInstanceRef.current?.hide();
const hasInProcessTickets = state?.tickets.some(ticket => ticket.status === 'InProcess');
const resetForm = () => {
    setAnsweringId(null);
    setCreating(false);
    setAnswer('');
    setErrors({});
    closeModal();
    getTickets(1);
  };

  return (
   <div className="main-content">
     <div style={{ display: showToast ? "block" : "none" }}>
          <MyToast
            header={"Успех"}
            show={showToast}
            message={"Тикет успешно удален."}
            type={"danger"}
          />
      </div>
                <div
                        className="modal fade"
                        ref={modalRef}
                        id="ticketModal"
                        tabIndex="-1"
                        aria-labelledby="ticketModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog ">
                          <div className="modal-content text-white">
                            <div className="modal-header">
                              <h5 className='modal-title' id="ticketModalLabel">Ответить на вопрос в техподдержке</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={resetForm}
                                aria-label="Закрыть"
                              />
                            </div>
                            <div className="modal-body">
                              <div className='mb-3'>
                                  <label htmlFor="name" className="form-label">Описание ошибки</label>
                                  <div className="border p-2 bg-secondary text-white" style={{ whiteSpace: 'pre-wrap' }}>
                                    {message}
                                  </div>
                                </div>
                               <div className='mb-3'>
                                  <label htmlFor="answer" className="form-label">Ответ на сообщение</label>
                                  <input
                                    type="text"
                                    id="answer"
                                    className={`form-control ${errors.answer ? 'is-invalid' : ''}`}
                                    value={answer}
                                    onChange={e => setAnswer(e.target.value)}
                                  />
                                  {errors.answer && <div className="invalid-feedback">{errors.answer}</div>}
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
                                disabled={creating}
                                onClick={async () => {
                                  if (!validateForm()) return;
                                  const formData = new FormData();
                                  formData.append('answer', answer);

                                    setCreating(true);
                                    try {
                                      const resp = await answerTicket(answeringId, formData);
                                      console.log(resp);
                                      resetForm();
                                    } catch (e) {
                                      console.error("Ошибка при обновлении:", e);
                                      setCreating(false);
                                    
                                  }
                                }}
                              >
                                {(creating ? 'Отвечаем...' : 'Ответить')}
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
        <FontAwesomeIcon icon={faList} /> Список тикетов
      </div>
      <div className="col-12 col-md-8 col-lg-2">
        <h6>Поиск</h6>
        <InputGroup size="sm">
          <FormControl
            placeholder="По почте"
            value={state.search}
            className="info-border bg-dark text-white"
            onChange={handleSearchChange}
          />
          <Button variant="outline-dark" className="no-hover-effect" onClick={() => getTickets(1)}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button variant="outline-dark" className="no-hover-effect" onClick={handleCancelSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </InputGroup>
      </div>
      <div className="col-6 col-md-4 col-lg-2">
                    <h6>Статус</h6>
                    <FormControl
          as="select"
          value={status}
          onChange={(e) => {
           setStatus(e.target.value);
            getTickets(1); 
          }}
         className="form-select bg-dark text-white"
          >
          <option value="InProcess">В обработке</option>
          <option value="Answered">Отвечено</option>
          </FormControl>
                  </div>
    </div>
  </div>
</Card.Header>

        <Card.Body style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
          <Table bordered hover striped variant="dark" style = {{ tableLayout: "fixed", width: "100%" }}>
  < colgroup>
    <col style={{ width: "20%" }} /> 
    <col style={{ width: "30%" }} /> 
    <col style={{ width: "20%" }} /> 
     {hasInProcessTickets && <col style={{ width: "20%" }} />}
    <col style={{ width: hasInProcessTickets ? "10%" : "20%" }} />
  </colgroup>
              <thead>
                <tr>
                  <th>ID чата</th>
                  <th>Сообщение</th>
                  <th>Статус</th>
                  {hasInProcessTickets && <th>Ответить</th>}
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {state?.tickets?.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных тикетов.</td>
                  </tr>
                ) : (
                  state?.tickets?.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.chatId}</td>
                      <td>{ticket.message}</td>
                      <td>{getRussianStatus(ticket.status)}</td>
                      {ticket.status === 'InProcess' && (
                        <td>
                         <div className="d-flex justify-content-center" >
                      <Button
                      variant="outline-info"
                      onClick={() => openModal(ticket)}
                      >

                      Ответить
                      </Button>
                      </div>
                      </td>
                       )}
                       <td>
                        <ButtonGroup className="justify-content-between">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handelDeleteTicket (ticket.id)}
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

        {state?.tickets?.length > 0 && (
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

export default TicketPanel;