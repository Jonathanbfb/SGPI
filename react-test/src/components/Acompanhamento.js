import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import headerLogo from '../img/headerLogo.png';
import acompanha from '../img/busca.png';

import { BarraLateral } from './BarraLateral';

function Listagem() {
    const [processos, setProcessos] = useState([]);
    const [nomes, setNomes] = useState({});
    const navigate = useNavigate();

    const homePath = () => {
        navigate('/Home');
    };
    
    //const detalhesPath = () => {
    //    navigate('/Detalhes');    
    //};

    const detalhesPath = (id_processo) =>{
        localStorage.setItem("idAcompanha",id_processo)
        navigate('/Detalhes');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeId = localStorage.getItem("employeeId");
                const companyId = localStorage.getItem("companyId");
                const rota = localStorage.getItem("rota");
                let response;
                let data;

                switch(localStorage.getItem("cargo")){
                    case 'presidente':
                        response = await axios.post('http://127.0.0.1:3010/buscarEmAndamentoPorIdEmpresa', JSON.stringify({ companyId }), { headers: { 'Content-Type': 'application/json' } });
                        data = response.data;
                        setProcessos(data);
                        break;

                    case 'advogado':
                        response = await axios.post('http://127.0.0.1:3010/buscarEmAndamentoPorIdEmpresa', JSON.stringify({ companyId }), { headers: { 'Content-Type': 'application/json' } });
                        data = response.data;
                        setProcessos(data);
                        break;

                    case 'tecnico':
                        response = await axios.post('http://127.0.0.1:3010/buscarEmAndamentoPorIdFuncionario', JSON.stringify({ employeeId }), { headers: { 'Content-Type': 'application/json' } });
                        data = response.data;
                        setProcessos(data);
                        break;
                }

                // Obtendo os nomes dos funcionários
                const namesPromises = data.map(processo => getName(processo.employeeId));
                const names = await Promise.all(namesPromises);
                const namesMap = {};
                data.forEach((processo, index) => {
                    namesMap[processo.employeeId] = names[index];
                });
                setNomes(namesMap);
            } catch (error) {
                console.error('Erro ao fazer login:', error);
            }
        };
        fetchData();
    }, []);

    async function getName(employeeId) {
        try {
            const response = await axios.post('http://127.0.0.1:3010/searchNomeId', JSON.stringify({ employeeId }), { headers: { 'Content-Type': 'application/json' } });
            const { nome } = response.data;
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar nome:', error);
            return 'haha'; // Retornar uma string vazia em caso de erro
        }
    }

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
                    <img src={acompanha} alt='' className="page-sub-icon"></img>Acompanhamento de processos
                </div>
                <div className="container">
                    <table>
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Titulo</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Responsavel</th>
                                <th>Data Início</th>
                            </tr>
                        </thead>
                        <tbody>
                        {processos.map((processo) =>
                            <tr onClick={(e) => detalhesPath(processo._id)}>
                                <td> {processo.codigoAutomatico} </td>
                                <td> {processo.name} </td>
                                <td><d class="linhaTipo"> {processo.tipo} </d></td>
                                <td><d class="linhaStatus"> {processo.status} </d></td>
                                <td>{nomes[processo.employeeId]}</td>
                                <td>{processo.dataEntrada}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Listagem;
