import './App.css'
import React, { useState, useEffect, useCallback, useContext  } from 'react';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteExaminationType } from './service/examinationTypeActions';
import {
  Card,
  Table,
  ButtonGroup,
  Button,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";

const ExaminationTypePanel = () => {
  const [showToast, setShowToast] = useState(false);
  const [state, setState] = useState({
    examinationTypes: [],
    currentPage: 1,
    examinationTypesPerPage: 5,
    totalPages: 0,
    totalElements: 0,
  });

  

  const getExaminationTypes = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;

    const params = {
    page: pageNumber,
    pageSize: state.examinationTypesPerPage,
  };

    const response = await axios.get("http://localhost:8080/api/examinationType", { params });
    const data = response.data;
    setState(prev => ({
      ...prev,
      examinationTypes: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number + 1,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке типов обследований:", error);
    localStorage.removeItem("jwtToken");
  }
}, [state.examinationTypesPerPage]);

  
useEffect(() => {
    getExaminationTypes(state.currentPage);
  }, [getExaminationTypes, state.currentPage]);


  const paginationActions = {
    firstPage: () => getExaminationTypes(1),
    prevPage: () => getExaminationTypes(state.currentPage - 1),
    nextPage: () => getExaminationTypes(state.currentPage + 1),
    lastPage: () => getExaminationTypes(state.totalPages),
  };

  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === state.totalPages;

const handelDeleteExaminationType = async (examinationTypeId) => {
    try {
      const result = await deleteExaminationType(examinationTypeId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);      
      await getExaminationTypes(state.currentPage);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
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
      <Card className={"border border-dark bg-dark text-white"} style={{display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
        <Card.Header className="bg-secondary text-white">
            <button 
        type="button" 
        className="btn btn-primary w-100 mb-3"
      >
        Создать новый тип обследования
      </button>
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
                {state.examinationTypes.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных типов обследований.</td>
                  </tr>
                ) : (
                  state.examinationTypes.map((examinationType) => (
                    <tr key={examinationType.id}>
                      <td>{examinationType.name}</td>
                      <td>
                        <ButtonGroup className="gap-4">
                          <Button
                            size="sm"
                            onClick={() => this.handelDeleteExamination(examinationType.id)}
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

export default ExaminationTypePanel;