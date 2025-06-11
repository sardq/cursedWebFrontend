import './App.css'
import ExaminationFullModal from './ExaminationInfo';
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
import MyToast from './MyToast';

const UserHome = () => {
  const { email } = useContext(AuthContent);
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());
  const [typeName, setTypeName] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);

  const [messsage, setMessage] = useState('');
  const [header, setHeader] = useState('');
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

const [fullModalData, setFullModalData] = useState({
  show: false,
  examination: null,
  parameters: [],
  media: [],
});
const openFullExaminationModal = async (id) => {
  try {
    const examResp = await axios.get(`/api/examination/${id}`);
    const exam = examResp.data;
    const paramDefs = await axios.get(`/api/parametres/GetParametersByTypeId`, { params: { examinationTypeId: exam.examinationTypeId } });
    const paramVals = await axios.get(`/api/protocolParametres`, { params: { examinationTypeId:exam.examinationTypeId } });
    const mediaResp = await axios.get(`/api/media`, { params: { examinationId:id } });
    console.log(mediaResp);
    const valueMap = new Map(paramVals.data.map(pv => [pv.parametersId, pv.body]));
    const combinedParams = paramDefs.data.content.map(p => ({
      id: p.id,
      name: p.name,
      value: valueMap.get(p.id) || ''
    }));

    
    setFullModalData({
      show: true,
      examination: exam,
      parameters: combinedParams,
      media: [...mediaResp.data]
    });
    console.log(fullModalData);
  } catch (error) {
    console.error("Ошибка загрузки данных обследования:", error);
  }
};
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
const formatToLocalDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
  
const downloadReport = async (id) => {
    
    try {
const examResp = await axios.get(`/api/examination/${id}`);
    const exam = examResp.data;
    const paramDefs = await axios.get(`/api/parametres/GetParametersByTypeId`, { params: { examinationTypeId: exam.examinationTypeId } });
    const paramVals = await axios.get(`/api/protocolParametres`, { params: {  examinationId: id, page: 0 } });
    const mediaResp = await axios.get(`/api/media`, { params: { examinationId:id } });
    const filteredParamVals = paramVals.data.filter(pv => pv.examinationId === id);
    const valueMap = new Map(filteredParamVals.map(pv => [pv.parametersId, pv.body]));
    const combinedParams = paramDefs.data.content.map(p => ({
      name: p.name,
      value: valueMap.get(p.id) || ''
    }));
    const params = {
      id: exam.id,
      description: exam.description,
      conclusion: exam.conclusion,
      time: formatToLocalDate(exam.time),
      patientFullName: exam.userFullname,
      examinationTypeName: exam.examinationTypeName,
      parameters: combinedParams,
      mediaFiles: mediaResp.data
    }
    console.log(params);
      await axios.post('/api/protocol/pdf', {
      id: exam.id,
      description: exam.description,
      conclusion: exam.conclusion,
      time: formatToLocalDate(exam.time),
      patientFullName: exam.userFullname,
      examinationTypeName: exam.examinationTypeName,
      parameters: combinedParams,
      mediaFiles: mediaResp.data
    });

    const response = await axios.get(`/api/protocol/pdf/${id}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `protocol_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Ошибка при загрузке отчета:", error);
  }
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


  return (
    <div>
      <div style={{ display: showToast ? "block" : "none" }}>
                <MyToast
                  show={showToast}
                  header = {header}
                  message={messsage}
                  type={"danger"}
                />
            </div>
      <ExaminationFullModal
  show={fullModalData.show}
  onHide={() => setFullModalData(prev => ({ ...prev, show: false }))}
  examination={fullModalData.examination}
  parameters={fullModalData.parameters}
    media={fullModalData.media} onDownloadReport={downloadReport}
  />
   <div className="main-content">
      <Card className={"border border-dark bg-dark text-white"} style={{display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 500, overflow: 'hidden' }}>
        <Card.Header className="bg-secondary text-white">
  <div className="container-fluid">
    <div className="row g-3">
      <div className="col-12 col-md-4 col-lg-2">
        <FontAwesomeIcon icon={faList} /> Список обследований
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
          {state.examinations.length === 0 ? (
            <div className="text-center py-4 text-white">
              Обследования не найдены
            </div>
          ) : (
            <div className="examination-list">
            {state.examinations.map((examination) => (
              <div key={examination.id} className="examination-item">
              <ExaminationDescribe
                examination={examination}  openFullExaminationModal ={openFullExaminationModal}
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
    </div>
  );
};

export default UserHome;