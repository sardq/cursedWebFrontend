import  React, { useContext } from 'react';

import { request, setAuthHeader } from '../helpers/axios_helper';
import axios from 'axios';

import { AuthContent } from './AuthContent';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import AuthSelection from './AuthSelection';
import PhoneAuth from './PhoneAuth';
import EmailAuth from './EmailAuth';
import UserHome from './UserHome';

export default function AppContent() {

    const { role, setRole, view, setPhone, setEmail, setView } = useContext(AuthContent);


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
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthHeader(token.token);
                const userRole = token.role;
                setRole(userRole);
                if (userRole === "ADMIN")
                {
                    setEmail(token.email);
                    setPhone(token.phone);
                    setView("authSelection");
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
        {view === "userHome" && role === "ADMIN" && <UserHome/>}
        {view === "authSelection" && role === "ADMIN" && <AuthSelection/>}
        {view === "phoneAuth" && role === "ADMIN" && <PhoneAuth/>}
        {view === "emailAuth" && role === "ADMIN" && <EmailAuth/>}
      </>
    );
}