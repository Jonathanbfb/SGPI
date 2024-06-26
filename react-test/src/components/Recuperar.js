'./static/Login.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import setaEsquerda from '../img/setaEsquerda.png';
import logo from './static/imagens/logo.png';
import user from './static/imagens/user.png';
import axios from 'axios';

import usuarios from './Usuarios.json';


export default function Recuperar({isOpen, setSwitchs}) {
    const [openRecuperar, setRecuperar] = useState(true)

    const navigate = useNavigate();
    //const rota = "http://172.18.0.2:3010"
    const rota = "http://localhost:3010"

    const homePath = () =>{
        navigate('/Home');
    };
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    

    const handlLogin = () => {
        
        
        const usuarioAutenticado = usuarios.find(
            (user) => user.nome === email && user.senha === senha,
            
        );
        if (usuarioAutenticado) {
            localStorage.setItem("nome", usuarioAutenticado.nome);
            localStorage.setItem("cargo", usuarioAutenticado.office);
            localStorage.setItem("rota", usuarioAutenticado.rota);
            setError('');
            homePath()
        } else {
            setError('Usuário ou senha incorretos');
        }        
        
    };

    const Handlelogin = async (email, password) => {
        try {
            const response = await axios.post(rota + '/login',
                JSON.stringify({email, password}),
                {
                    headers: { 'Content-Type': 'application/json'}
                }
            );

            const data = response.data;
    
            if (response.status === 200) {
                localStorage.setItem("nome", data.name);
                localStorage.setItem("cargo", data.office);
                localStorage.setItem("employeeId", data._id);
                localStorage.setItem("companyId", data.company);
                setError('');
                homePath()
            } else {
                setError('Usuário ou senha incorretos');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setError('Erro ao fazer login');
        }
    }

    if(isOpen){
        return(
            <div class="containerLogin">
                    <img src={user} alt=''  class="login-user-img"/>

                    <form className="login-form">
                        <section id="login">
                            <label for="nome" class="login-user-text">Login</label>
                            <input type="text" 
                                    name="nome" 
                                    id="nome" 
                                    value={email}
                                    class="login-user-input" 
                                    placeholder="Digite seu email" 
                                    required
                                    onChange={(e) => setEmail(e.target.value)}/>
                            <label for="senha" class="login-user-text">Senha</label>
                            <input type="password" 
                                    name="senha" 
                                    id="senha" 
                                    value={senha}
                                    class="login-user-input" 
                                    placeholder="Digite sua senha" 
                                    required
                                    onChange={(e) => setSenha(e.target.value)}/>
                            <br></br>
                            <input type="checkbox" id="Manter" name="Manter"/>
                            <label for="Manter">Mantenha-me conectado</label>
                            <div id="login-senha">
                                <a class="forgot" onClick={setSwitchs}>Esqueceu a senha?</a>
                                <button type="submit" 
                                        id="btn-entrar" 
                                        class="submit" 
                                        value="entrar"
                                        onClick={(e) => {
                                            e.preventDefault(); // Evitar o envio do formulário
                                            Handlelogin(email, senha);
                                        }} >ENTRAR</button>
                            </div>
                        </section>
                    </form>
                </div>
        );
        
    }else{
        return(
            <div class="popup" id="popup-1">
                        <div class="overlay"></div>
                        <div class="content">
                            <div class="close-btn" >
                                <img class="return" src={setaEsquerda} onClick={setSwitchs} /><b>Esqueceu a senha?</b>
                            </div>

                            <div class="email-background">
                                <a>
                                    Um código de recuperação será<br/> 
                                    enviado por e-mail
                                </a>
                            </div>

                            <div>
                                <button class="reenviar">Reenviar codigo</button>
                            </div>

                            <br/>
                            <br/>
                            <br/>
                            <br/>

                            <div>
                                <label for="codigo" class="cod-email-text">Inserir codigo</label>
                                <input type="text" name="codigo" class="codigo-email"/>
                            </div>

                            <div>
                                <button class="confirmar">Confirmar</button>
                            </div>

                        </div>
                    </div>
        );
        
    }
  
}