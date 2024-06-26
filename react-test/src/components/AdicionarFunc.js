import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import headerLogo from '../img/headerLogo.png'
import userPlus from '../img/userPlus.png'
import blankUser from '../img/addUser.png'

import { BarraLateral } from './BarraLateral';

function AdicionarFunc() {
    const navigate = useNavigate();

    const homePath = () =>{
        navigate('/Home');
    };

    
  return (
    <div>
        <header>
            <div class="user-log">
                <img src={headerLogo} alt='' class="header-logo" href="#" onClick={homePath}></img>
            </div>
            <div>
                <input type="text" id='busca' class="home-search"></input>
            </div>
        </header>
       
        <BarraLateral/>
      
        <main class="main-container-add">
            <div class="add-text">
                <img src={userPlus} alt='' class="side-icon-top"></img>Adicionar funcionario
            </div>

            <br></br>

            <div class="container-add">
                <form action="Adicionar" method="post">
                    
                    <section id="login">
                        <div class="divisa-geral">
                            <div class="image-holder">
                                <img src={blankUser}></img>
                            </div>
                            <div class="input-holder-um">
                                <label for="nome" class="login-user-text">Nome:</label>
                                <input type="text" name="nome" id="nome" class="login-user-input" required></input>
                                <br></br>
                                <label for="email" class="login-user-text">E-mail:</label>
                                <input type="text" name="email" id="email" class="login-user-input" required></input>
                                <br></br>
                                <label for="dropdown" class="login-user-text">Cargo:</label>
                                <br></br>
                                <select id="dropdown">
                                    <option value="opcao1">Presidente</option>
                                    <option value="opcao2">Tecnico</option>
                                    <option value="opcao3">Advogado</option>
                                </select>
                                
                            </div>
                            <div class="input-holder-dois">
                                <br></br>
                                <label for="senha" class="login-user-text">Senha:</label>
                                <input type="password" name="senha" id="senha" class="login-user-input" required></input>
                                <br></br>
                                <label for="confirma" class="login-user-text">Confirmar senha:</label>
                                <input type="password" name="confirma" id="confirma" class="login-user-input" required></input>
                            </div>
                        </div>
                        <br></br>

                        <div id="login-senha">
                            <button type="submit" id="btn-entrar" class="submit" value="entrar">SALVAR</button>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    </div>
  );
}

export default AdicionarFunc;