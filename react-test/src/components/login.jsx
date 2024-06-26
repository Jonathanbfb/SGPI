import './static/Login.css';
import { useState } from 'react';
import React from 'react';

import logo from './static/imagens/logo.png';
import Recuperar from './Recuperar';


export function Login() {

    const [openRecuperar, setRecuperar] = useState(true)


    return(
        <main className="login-form-wrap">
            <body className="login-main">

                <div class="main-logo">
                    <img src={logo}  alt='' class="main-logo-img"/>
                </div>
                <Recuperar isOpen={openRecuperar} setSwitchs={() => setRecuperar(!openRecuperar)} />
                
            </body>
        </main>
    );
}

export default Login;