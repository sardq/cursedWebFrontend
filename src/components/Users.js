// import React, { useState, useEffect, useCallback  } from 'react';
// import CalendarComp from './CalendarComp';
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Card,
//   Table,
//   Image,
//   ButtonGroup,
//   Button,
//   InputGroup,
//   FormControl,
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faList,
//   faEdit,
//   faTrash,
//   faStepBackward,
//   faFastBackward,
//   faStepForward,
//   faFastForward,
//   faSearch,
//   faTimes,
// } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
// import MyToast from "../MyToast";

// const UserHome = () => {
//   const [state, setState] = useState({
//     examinations: [],
//     search: "",
//     currentPage: 1,
//     examinationsPerPage: 5,
//     sortDir: "asc",
//     totalPages: 0,
//     totalElements: 0,
//     showToast: false,
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const bookObject = useSelector((state) => state.book);

//   useEffect(() => {
//     fetchBooks(state.currentPage);
//   }, [fetchBooks, state.currentPage]);

//   const fetchBooks = useCallback(async (page) => {
//     try {
//       const pageNumber = page - 1;
//       const url = state.search
//         ? `http://localhost:8081/rest/books/search/${state.search}?page=${pageNumber}&size=${state.booksPerPage}`
//         : `http://localhost:8081/rest/books?pageNumber=${pageNumber}&pageSize=${state.booksPerPage}&sortBy=price&sortDir=${state.sortDir}`;

//       const response = await axios.get(url);
//       const data = response.data;

//       setState(prev => ({
//         ...prev,
//         books: data.content,
//         totalPages: data.totalPages,
//         totalElements: data.totalElements,
//         currentPage: data.number + 1,
//       }));
//     } catch (error) {
//       console.error(error);
//       localStorage.removeItem("jwtToken");
//       navigate("/");
//     }
//   }, [state.search, state.booksPerPage, state.sortDir, navigate]);

//   const handleSort = () => {
//     setState(prev => ({ 
//       ...prev, 
//       sortDir: prev.sortDir === "asc" ? "desc" : "asc" 
//     }));
//     setTimeout(() => fetchBooks(state.currentPage), 500);
//   };

// const handlePageChange = (e) => {
//     const targetPage = parseInt(e.target.value);
//     setState(prev => ({ ...prev, currentPage: targetPage }));
//   };

//   const handleSearchChange = (e) => {
//     setState(prev => ({ ...prev, search: e.target.value }));
//   };

//   const handleCancelSearch = () => {
//     setState(prev => ({ ...prev, search: "" }));
//     fetchBooks(1);
//   };

//   const paginationActions = {
//     firstPage: () => fetchBooks(1),
//     prevPage: () => fetchBooks(state.currentPage - 1),
//     nextPage: () => fetchBooks(state.currentPage + 1),
//     lastPage: () => fetchBooks(state.totalPages),
//   };

//   const isFirstPage = state.currentPage === 1;
//   const isLastPage = state.currentPage === state.totalPages;


//   return (
//    <div>
//       <MyToast
//         show={state.showToast}
//         message={"Book Deleted Successfully."}
//         type={"danger"}
//         onClose={() => setState(prev => ({ ...prev, showToast: false }))}
//       />

//       <Card className={"border border-dark bg-dark text-white"}>
//         <Card.Header className="d-flex justify-content-between align-items-center">
//           <div>
//             <FontAwesomeIcon icon={faList} /> Book List
//           </div>
//           <div>
//             <InputGroup size="sm">
//               <FormControl
//                 placeholder="Search"
//                 name="search"
//                 value={state.search}
//                 className={"info-border bg-dark text-white"}
//                 onChange={handleSearchChange}
//               />
//               <InputGroup.Append>
//                 <Button
//                   variant="outline-info"
//                   onClick={() => fetchBooks(1)}
//                 >
//                   <FontAwesomeIcon icon={faSearch} />
//                 </Button>
//                 <Button
//                   variant="outline-danger"
//                   onClick={handleCancelSearch}
//                 >
//                   <FontAwesomeIcon icon={faTimes} />
//                 </Button>
//               </InputGroup.Append>
//             </InputGroup>
//           </div>
//         </Card.Header>

//         <Card.Body>
//           <Table bordered hover striped variant="dark">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Author</th>
//                 <th>ISBN Number</th>
//                 <th onClick={handleSort}>
//                   Price{" "}
//                   <span className={`arrow ${state.sortDir === "asc" ? "arrow-up" : "arrow-down"}`} />
//                 </th>
//                 <th>Language</th>
//                 <th>Genre</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {state.books.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center">No Books Available.</td>
//                 </tr>
//               ) : (
//                 state.books.map((book) => (
//                   <tr key={book.id}>
//                     <td>
//                       <Image
//                         src={book.coverPhotoURL}
//                         roundedCircle
//                         width="25"
//                         height="25"
//                         className="mr-2"
//                       />
//                       {book.title}
//                     </td>
//                     <td>{book.author}</td>
//                     <td>{book.isbnNumber}</td>
//                     <td>{book.price}</td>
//                     <td>{book.language}</td>
//                     <td>{book.genre}</td>
//                     <td>
//                       <ButtonGroup>
//                         <Link
//                           to={`edit/${book.id}`}
//                           className="btn btn-sm btn-outline-primary"
//                         >
//                           <FontAwesomeIcon icon={faEdit} />
//                         </Link>
//                         <Button
//                           size="sm"
//                           variant="outline-danger"
//                           onClick={() => handleDelete(book.id)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} />
//                         </Button>
//                       </ButtonGroup>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>

//         {state.books.length > 0 && (
//           <Card.Footer className="d-flex justify-content-between align-items-center">
//             <div>
//               Showing Page {state.currentPage} of {state.totalPages}
//             </div>
//             <div>
//               <InputGroup size="sm">
//                 <InputGroup.Prepend>
//                   <Button
//                     variant="outline-info"
//                     disabled={isFirstPage}
//                     onClick={paginationActions.firstPage}
//                   >
//                     <FontAwesomeIcon icon={faFastBackward} /> First
//                   </Button>
//                   <Button
//                     variant="outline-info"
//                     disabled={isFirstPage}
//                     onClick={paginationActions.prevPage}
//                   >
//                     <FontAwesomeIcon icon={faStepBackward} /> Prev
//                   </Button>
//                 </InputGroup.Prepend>
//                 <FormControl
//                   className="page-num bg-dark"
//                   name="currentPage"
//                   value={state.currentPage}
//                   onChange={handlePageChange}
//                 />
//                 <InputGroup.Append>
//                   <Button
//                     variant="outline-info"
//                     disabled={isLastPage}
//                     onClick={paginationActions.nextPage}
//                   >
//                     <FontAwesomeIcon icon={faStepForward} /> Next
//                   </Button>
//                   <Button
//                     variant="outline-info"
//                     disabled={isLastPage}
//                     onClick={paginationActions.lastPage}
//                   >
//                     <FontAwesomeIcon icon={faFastForward} /> Last
//                   </Button>
//                 </InputGroup.Append>
//               </InputGroup>
//             </div>
//           </Card.Footer>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default UserHome;