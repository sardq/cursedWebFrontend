import './App.css'
import React, { useState, useEffect, useCallback, useRef, useContext  } from 'react';
import MyToast from './MyToast';
import axios from 'axios';
import { deleteUser } from './service/userActions';
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
import { getCurrentUserFromToken } from './service/jwtHelper';
import { AuthContent } from './AuthContent';

const UserPanel = () => {

  const { email, setView } = useContext(AuthContent);
  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const [state, setState] = useState({
    users: [],
    search: "",
    currentPage: 1,
    usersPerPage: 5,
    totalPages: 0,
    totalElements: 0,
  });
  
  const getUsers = useCallback(async (page) => {
  try {
    const pageNumber = page - 1;

    const params = {
    page: pageNumber,
    email: state.search,
    pageSize: state.usersPerPage,
  };

    const response = await axios.get("http://localhost:8080/api/user/filter", { params });
    const data = response.data;
    setState(prev => ({
      ...prev,
      users: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number + 1,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке обследований:", error);
    localStorage.removeItem("jwtToken");
  }
}, [state.search, state.usersPerPage]);

useEffect(() => {
    getUsers(state.currentPage);
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: true
      });
    }
  }, [getUsers, state.currentPage]);

  const handleSearchChange = (e) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCancelSearch = () => {
    setState(prev => ({ ...prev, search: "" }));
    getUsers(1);
  };

  const paginationActions = {
    firstPage: () => getUsers(1),
    prevPage: () => getUsers(state.currentPage - 1),
    nextPage: () => getUsers(state.currentPage + 1),
    lastPage: () => getUsers(state.totalPages),
  };

  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === state.totalPages;

const handelDeleteUser = async (userId) => {
  try {
    await deleteUser(userId);

    const currentUser = getCurrentUserFromToken();
    const currentUserEmail = currentUser?.sub;
    if (currentUserEmail === email) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      setView("login")
      return;
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    await getUsers(state.currentPage);
  } catch (error) {
    console.error("Ошибка при удалении:", error);
  }
};

  return (
   <div className="main-content">
     <div style={{ display: showToast ? "block" : "none" }}>
          <MyToast
            header = {"Успех"}
            show={showToast}
            message={"Пользователь успешно удален."}
            type={"danger"}
          />
      </div>
                
      <Card className={"border border-dark bg-dark text-white"} style={{display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
        <Card.Header className="bg-secondary text-white">
      <div className="container-fluid">
    <div className="row g-3">
      <div className="col-12 col-md-4 col-lg-2">
        <FontAwesomeIcon icon={faList} /> Список пользователей
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
          <Button variant="outline-dark" className="no-hover-effect" onClick={() => getUsers(1)}>
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
    <col style={{ width: "40%" }} /> 
    <col style={{ width: "40%" }} /> 
    <col style={{ width: "20%" }} /> 
  </colgroup>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Почта</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {state?.users?.length === 0 ? (
                  <tr align="center">
                    <td colSpan="7">Нет доступных пользователей.</td>
                  </tr>
                ) : (
                  state?.users?.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>
                        <ButtonGroup className="justify-content-between">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handelDeleteUser (user.id)}
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

        {state?.users?.length > 0 && (
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

export default UserPanel;