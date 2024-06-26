import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import user from '../img/user.png'
import acompanha from '../img/busca.png'
import home from '../img/home.png'
import encerra from '../img/encerra.png'
import dashboard from '../img/dashboard.png'
import add from '../img/addFunc.png'
import funcionarios from '../img/funcionarios.png'
import logout from '../img/logout.png'
import novoProcesso from '../img/novoReg.png'
import existentes from '../img/existentes.png'


export function BarraLateral(){
    //redirecionamentos
    const navigate = useNavigate();

    const homePath = () =>{
        navigate('/Home');
    };
    const acompanhaPath = () =>{
        navigate('/Acompanhamento');
    };
    const encerraPath = () =>{
        navigate('/Encerrados');
    };
    const adicionaPath = () =>{
        navigate('/AdicionarFunc');
    };
    const funcionariosPath = () =>{
        navigate('/Funcionarios');
    };
    const existentesPath = () =>{
        navigate('/PatentesExistentes')
    };
    const editarPerfilPath = () =>{
        navigate('/EditarPerfil')
    };
    const novaPatentePath = () =>{
        navigate('/NovaPatente')
    };
    const logoutPath = () =>{
        localStorage.clear()
        navigate('/')
    };
    

    switch(localStorage.getItem("cargo")){

        case 'presidente':

            //  Presidente

            return(
                <nav class="menu">
                    <div class="lateral-user" onClick={editarPerfilPath}>
                        <img src={user} alt='' class="user"></img>
                    </div>
                   
                   <div class="lateral-user" onClick={editarPerfilPath}>
                        <c class="name">{localStorage.getItem("nome")}</c>
                        <c class="name">{localStorage.getItem("cargo")}</c>
                    </div>
                    
                    <br></br><br></br><br></br>
                    <a href="#" onClick={homePath} ><img alt='' src={home} class="side-icon"></img><t>Home</t></a>
                    <a href="#" onClick={acompanhaPath}><img alt='' src={acompanha} class="side-icon"></img><t>Acompanhamento</t></a>
                    <a href="#" onClick={encerraPath}><img alt='' src={encerra} class="side-icon"></img><t>Encerrados</t></a>
                    <a href="#"><img alt='' src={dashboard} class="side-icon"></img><t>Dashboards</t></a>
                    <a href="#" onClick={adicionaPath}><img alt='' src={add} class="side-icon"></img><t>Adicionar Funcionario</t></a>
                    <a href="#" onClick={funcionariosPath}><img alt='' src={funcionarios} class="side-icon"></img><t>funcionários</t></a>
                    <b class="line"></b>
                    <a href="#" onClick={logoutPath}><img alt='' src={logout} class="side-icon"></img><t>Sair</t></a>

                </nav>
            )
            break;
        
        case 'tecnico':

            //  Tecnico

            return(
                <nav class="menu">
                    <div class="lateral-user" onClick={editarPerfilPath}>
                        <img alt='' src={user} class="user"></img>
                    </div>
                   
                   <div class="lateral-user" onClick={editarPerfilPath}>
                        <c class="name">{localStorage.getItem("nome")}</c>
                        <c class="name">{localStorage.getItem("cargo")}</c>
                    </div>
                    <br></br><br></br><br></br>
                    <a href="#" onClick={homePath}><img alt='' src={home} class="side-icon"></img><t>Home</t></a>
                    <a href="#" onClick={novaPatentePath} ><img alt='' src={novoProcesso} class="side-icon"></img><t>Novo registro</t></a>
                    <a href="#" onClick={acompanhaPath}><img alt='' src={acompanha} class="side-icon"></img><t>Acompanhamento</t></a>
                    <a href="#" onClick={encerraPath}><img alt='' src={encerra} class="side-icon"></img><t>Encerrados</t></a>
                    <a href="#" onClick={existentesPath}><img alt='' src={existentes} class="side-icon"></img><t>Patentes existentes</t></a>
                    <b class="line"></b>
                    <a href="#" onClick={logoutPath}><img alt='' src={logout} class="side-icon"></img><t>Sair</t></a>

                </nav>
            )
            break;

        case 'advogado':

            // Advogado

            return(
                <nav class="menu">
                   <div class="lateral-user" onClick={editarPerfilPath}>
                        <img alt='' src={user} class="user"></img>
                    </div>
                   
                   <div class="lateral-user" onClick={editarPerfilPath}>
                        <c class="name">{localStorage.getItem("nome")}</c>
                        <c class="name">{localStorage.getItem("cargo")}</c>
                    </div>
                    <br></br><br></br><br></br>
                    <a href="#" onClick={homePath}><img alt='' src={home} class="side-icon"></img><t>Home</t></a>
                    <a href="#" onClick={acompanhaPath}><img alt='' src={acompanha} class="side-icon"></img><t>Acompanhamento</t></a>
                    <a href="#" onClick={encerraPath}><img alt='' src={encerra} class="side-icon"></img><t>Encerrados</t></a>
                    <a href="#"><img alt='' src={dashboard} class="side-icon"></img><t>Dashboards</t></a>
                    <a href="#" onClick={existentesPath}><img alt='' src={existentes} class="side-icon"></img><t>Patentes existentes</t></a>
                    <b class="line"></b>
                    <a href="#" onClick={logoutPath}><img alt='' src={logout} class="side-icon"></img><t>Sair</t></a>

            </nav>
            )
            
            
    }

}