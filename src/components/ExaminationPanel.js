import './App.css'
import React, { useState, useEffect, useCallback, useContext  } from 'react';
import ExaminationDescribe from './ExaminationDescribe';
import CalendarComp from './CalendarComp';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteExamination } from './service/examinationActions';
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

const ExaminationPanel = () => {
  const { email } = useContext(AuthContent);
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());
  const [typeName, setTypeName] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [showToast, setShowToast] = useState(false);
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
    email: email,
    pageSize: state.examinationsPerPage,
    sortOrder: state.sortDir  === "asc" ? "Сначала старые" : "Сначала новые",
    dateStart: formatToLocalDate(dateStart),
    dateEnd: formatToLocalDate(dateEnd),
    typeName: typeName,
  };

    const response = await axios.get("http://localhost:8080/api/examination/filter", { params });
    const data = response.data;
    console.log(data.content);
    console.log(state.sortDir);
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
}, [state.search, state.sortDir, state.examinationsPerPage, dateStart, dateEnd, email, typeName]);

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
  const fetchTypes = async () => {
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

  fetchTypes();
}, []);
useEffect(() => {
    getExaminations(state.currentPage);
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
      const result = await deleteExamination(examinationId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);      
      await getExaminations(state.currentPage);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
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
                {state.examinations.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных обследований.</td>
                  </tr>
                ) : (
                  state.examinations.map((examination) => (
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
                            onClick={() => this.handelDeleteExamination(examination.id)}
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

        {state.examinations.length > 0 && (
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