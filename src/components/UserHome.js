import './App.css'
import React, { useState, useEffect, useCallback, useContext  } from 'react';
import ExaminationDescribe from './ExaminationDescribe';
import CalendarComp from './CalendarComp';
import axios from 'axios';
import {
  Card,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContent } from './AuthContent';

const UserHome = () => {
  const { email } = useContext(AuthContent);
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());
  const [state, setState] = useState({
    examinations: [],
    search: "",
    currentPage: 1,
    examinationsPerPage: 5,
    sortDir: "asc",
    totalPages: 0,
    totalElements: 0,
    showToast: false,
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
    sortOrder: state.sortDir === "asc" ? "Сначала старые" : "Сначала новые",
    dateStart: formatToLocalDate(dateStart),
    dateEnd: formatToLocalDate(dateEnd)
  };

    console.log("📤 Отправляемые параметры:", params);
    
    const response = await axios.get("http://localhost:8080/api/examination/filter", { params });
    console.log("📥 Ответ от сервера:", response.data);
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
}, [state.search, state.sortDir, state.examinationsPerPage, dateStart, dateEnd, email]);

  const handleSort = () => {
    setState(prev => ({ 
      ...prev, 
      sortDir: prev.sortDir === "asc" ? "desc" : "asc" 
    }));
    setTimeout(() => getExaminations(state.currentPage), 500);
  };
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


  return (
   <div style={{ display: 'flex', flexDirection: 'column', minHeight: '86vh' }}>
      <Card className={"border border-dark bg-dark text-white"} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
  <div>
    <FontAwesomeIcon icon={faList} /> Список обследований
  </div>
  <div>
    <h6>Начало</h6>
    <CalendarComp value={dateStart} onChange={setStartDate} />
  </div>
  <div>
    <h6>Конец</h6>
    <CalendarComp value={dateEnd} onChange={setEndDate} />
  </div>
  <div>
    <InputGroup size="sm">
      <FormControl
        placeholder="Search"
        name="search"
        value={state.search}
        className="info-border bg-dark text-white"
        onChange={handleSearchChange}
      />
      <Button
        variant="outline-info"
        onClick={() => getExaminations(1)}
      >
        <FontAwesomeIcon icon={faSearch} />
      </Button>
      <Button
        variant="outline-danger"
        onClick={handleCancelSearch}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
    </InputGroup>
  </div>
</Card.Header>

        <Card.Body>
          {state.examinations.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Обследования не найдены
            </div>
          ) : (
            <div className="examination-list">
            {state.examinations.map((examination) => (
              <div key={examination.id} className="examination-item">
              <ExaminationDescribe
                description={examination.description}
                examinationType={examination.examinationTypeName}
                time={examination.time}
              />
              </div>
            ))}
          </div>
        )}
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

export default UserHome;