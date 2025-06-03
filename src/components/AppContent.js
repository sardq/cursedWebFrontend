import  React, { useContext } from 'react';

import { request, setAuthHeader } from '../helpers/axios_helper';
import axios from 'axios';

import { AuthContent } from './AuthContent';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import AuthSelection from './AuthSelection';
import ExaminationInfo from './ExaminationInfo';
import AdminHome from './AdminHome';
import EmailAuth from './EmailAuth';
import UserHome from './UserHome';
import ExaminationPanel from './ExaminationPanel';
import ExaminationTypePanel from './ExaminationTypePanel';
import ParametersPanel from './ParametersPanel';
import UserPanel from './UserPanel';
import ExaminationStatistics from './ExaminationStatistic';

export default function AppContent() {

    const { role, setRole, view, setEmail, setView } = useContext(AuthContent);


    const onLogin = (e, email, password) => {
        e.preventDefault();
        request(
            "POST",
            "/login",
            {
                email: email,
                password: password
            }).then(
            (response) => {
                const data = response.data;
                const token = data.token;
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthHeader(token);
                const userRole = data.role;
                setRole(userRole);
                if (userRole === "ADMIN")
                {
                    setEmail(data.email);
                    //setView("authSelection");
                    setView("adminHome");
                }
                else
                {
                    setEmail(data.email);
                    setView("userHome");
                }
            }).catch(
            (error) => {
                setAuthHeader(null);
            }
        );
    };

    const onRegister = (event, fullname, email, password) => {
        event.preventDefault();
        request(
            "POST",
            "/register",
            {
                fullname: fullname,
                email: email,
                password: password
            }).then(
            (response) => {
                const token = response.data?.token || response.data;
                setAuthHeader(token);
                setView("login");
            }).catch(
            (error) => {
                setAuthHeader(null);
            }
        );
    };

    return (
      <>
        {view === "login" && <LoginForm onLogin={onLogin} />}
        {view === "register" && <RegistrationForm onRegister={onRegister} />}
        {view === "userHome" && role === "USER" && <UserHome/>}
        {view === "examinationInfo" && role === "USER" && <ExaminationInfo/>}
        {view === "authSelection" && role === "ADMIN" && <AuthSelection/>}
        {view === "emailAuth" && role === "ADMIN" && <EmailAuth/>}
        {view === "adminHome" && role === "ADMIN" && <AdminHome/>}
        {view === "examinationPanel" && role === "ADMIN" && <ExaminationPanel/>}
        {view === "examinationTypePanel" && role === "ADMIN" && <ExaminationTypePanel/>}
        {view === "parametersPanel" && role === "ADMIN" && <ParametersPanel/>}
        {view === "userPanel" && role === "ADMIN" && <UserPanel/>}
        {view === "examinationStatistic" && role === "ADMIN" && <ExaminationStatistics/>}
      </>
    );
}