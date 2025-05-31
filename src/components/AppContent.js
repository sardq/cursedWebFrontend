import  React, { useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

import { request, setAuthHeader } from '../helpers/axios_helper';

import { AuthContent } from './AuthContent';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import LoginForm2 from './LoginForm2';
import UserHome from './UserHome';

export default function AppContent() {

    const { role, setRole, view, setView } = useContext(AuthContent);


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
                const token = response.data;
                setAuthHeader(token);
                const userRole = token.role;
                setRole(userRole);
                if (userRole === "ADMIN")
                {
                    setView("login2");
                }
                else
                {
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
        {view === "login2" && <LoginForm2/>}
        {view === "userHome" && <UserHome/>}
      </>
    );
}