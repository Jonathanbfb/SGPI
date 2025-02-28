import './static/Login.css';
import { useState } from 'react';
import React from 'react';
import logo from './static/imagens/logo.png';
import Recuperar from './Recuperar';

export function Login() {
    const [openRecuperar, setRecuperar] = useState(true);

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="main-logo">
                    <img src={logo} alt="Logo" className="main-logo-img" />
                </div>
                 <Recuperar isOpen={openRecuperar} setSwitchs={() => setRecuperar(!openRecuperar)} /> 
            </div>
        </div>
    );
}

export default Login;
