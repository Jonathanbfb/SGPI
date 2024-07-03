import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import headerLogo from '../img/headerLogo.png'
import encerra from '../img/encerra.png'


import { BarraLateral } from './BarraLateral';

function Encerrados(){

    const [processos, setProcessos] = useState([]);
    const navigate = useNavigate();

    const homePath = () =>{
        navigate('/Home');
    };
    const detalhesEncerraPath = (id_processo) =>{
        console.log('hehehe '+ id_processo)
        localStorage.setItem("idEncerrados",id_processo)
        navigate('/DetalhesEncerrados');
    };

    const getName = async (employeeId) => {
        let response = await axios.post(rota + '/seachrNomeId',
        JSON.stringify({ employeeId }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
    const name = response.data;
    }

    useEffect(() => {
        const verProcessos = async () => {
            
            try {
                const rota = localStorage.getItem("rota");
                const employeeId = localStorage.getItem("employeeId");
                const companyId = localStorage.getItem("companyId");
                let response;
                let data;
                switch(localStorage.getItem("cargo")){
                    case 'presidente':
                        console.log('presidente')
                        response = await axios.post(rota + '/buscarEncerradoPorIdEmpresa',
                            JSON.stringify({ companyId }),
                            {
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );

                        data = response.data;
                        setProcessos(data);
                        break;

                        case 'advogado':
                            console.log('presidente')
                            response = await axios.post(rota + '/buscarEncerradoPorIdEmpresa',
                                JSON.stringify({ companyId }),
                                {
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            );
    
                            data = response.data;
                            setProcessos(data);
                            break;

                    case 'tecnico':
                        console.log('tecnico')
                        response = await axios.post(rota + '/buscarEncerradoPorIdFuncionario',
                            JSON.stringify({ employeeId }),
                            {
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                
                        data = response.data;
                        setProcessos(data);
                        break;

                    }

            } catch (error) {
                console.error('Erro ao fazer login:', error);
            }
        }
        console.log(processos)

        verProcessos();
    }, []);

    return(
        <div>
            <header>
                <div>
                    <img src={headerLogo} alt='' class="header-logo" href="#" onClick={homePath}></img>
                </div>
                <div>
                    <input type="text" id='busca' class="home-search"></input>
                </div>
            </header>
            
            <BarraLateral/>

            <main class="main-table">
                <div>
                    <img src={encerra} alt='' class="page-sub-icon"></img>Processos encerrados
                </div>
                <div class="container">
                    <table>
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Titulo</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Data de Entrada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processos.map(processo =>
                                <tr onClick={(e) =>detalhesEncerraPath(processo._id)}>
                                    <td>{processo.codigoAutomatico} </td>
                                    <td>{processo.name} </td>
                                    <td><d class="linhaTipo"> {processo.tipo}</d></td>
                                    <td><d class="linhaStatusE"> {processo.status} </d></td>
                                    <td> {processo.dataEntrada} </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Encerrados;
