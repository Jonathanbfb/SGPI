import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import headerLogo from '../img/headerLogo.png';
import user from '../img/user.png';
import funcionariosImg from '../img/funcionarios.png';
import trash from '../img/trash.png';
import editar from '../img/edit.png';

import { BarraLateral } from './BarraLateral';

function Funcionarios() {
    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);

    const homePath = () => {
        navigate('/Home');
    };

    const editarPerfilPath = (id_usuario) =>{
        console.log(id_usuario)
        localStorage.setItem("quemEstaEditando", "2")
        localStorage.setItem("idUsuario",id_usuario)
        navigate('/EditarPerfil')
    };

    useEffect(() => {
        const verProcessos = async () => {
            try {
                const employeeId = localStorage.getItem("employeeId");
                const companyId = localStorage.getItem("companyId");
                const rota = localStorage.getItem("rota");
                let data;

                const response = await axios.post('http://localhost:4557/searchEmployees',
                    { companyId }, // Modificado para companyId diretamente
                    { headers: { 'Content-Type': 'application/json' } }
                );
    
                data = response.data;
                setFuncionarios(data);
            } catch (error) {
                console.error('Erro ao fazer login:', error);
            }
        }
    
        verProcessos();
    }, []);

    return (
        <div>
            <header>
                <div className="user-log">
                    <img src={headerLogo} alt='' className="header-logo" href="#" onClick={homePath}></img>
                </div>
                <div>
                    <input type="text" id='busca' className="home-search"></input>
                </div>
            </header>

            <BarraLateral/>

            <main className="main-table">
                <div>
                    <img src={funcionariosImg} alt='' className="page-sub-icon"></img>Funcionários
                </div>
                <div className="container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>E-mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map(funcionario =>
                                <tr key={funcionario._id}>
                                    <td><img src={user} alt='' className="table-users"></img> {funcionario.name}</td>
                                    <td><span className="linhaTipo">{funcionario.office}</span></td>
                                    <td>{funcionario.email} <img src={trash} alt='' className="table-icons"></img> 
                                    <img src={editar} onClick={(e) =>editarPerfilPath(funcionario.id)} alt='' className="table-icons"></img></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Funcionarios;
