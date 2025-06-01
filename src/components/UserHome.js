import React, { useState, useEffect, useCallback  } from 'react';
import ExaminationDescribe from './ExaminationDescribe';
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

const UserHome = () => {
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


  

  const getExaminations = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;

    const params = {
      page: pageNumber,
      typeName: state.search,
      pageSize : state.examinationsPerPage,
      sortOrder: state.sortDir === "asc" ? "Сначала старые" : "Сначала новые",
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
}, [state.search, state.sortDir, state.examinationsPerPage]);

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

const handlePageChange = (e) => {
    const targetPage = parseInt(e.target.value);
    setState(prev => ({ ...prev, currentPage: targetPage }));
  };

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
   <div>
      <Card className={"border border-dark bg-dark text-white"}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon icon={faList} /> Список обследований
          </div>
          <div>
            <InputGroup size="sm">
              <FormControl
                placeholder="Search"
                name="search"
                value={state.search}
                className={"info-border bg-dark text-white"}
                onChange={handleSearchChange}
              />
              <InputGroup>
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
              <ExaminationDescribe
                key={examination.id}
                examinationType={examination.examinationTypeName}
                time={new Date(examination.time).toLocaleString()}
              />
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
                <InputGroup>
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
                </InputGroup>
                <FormControl
                  className="page-num bg-dark"
                  name="currentPage"
                  value={state.currentPage}
                  onChange={handlePageChange}
                />
                <InputGroup>
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
              </InputGroup>
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default UserHome;