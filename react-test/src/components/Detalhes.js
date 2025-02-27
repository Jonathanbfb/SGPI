import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Page } from 'react-pdf';



import headerLogo from '../img/headerLogo.png'
import seta from '../img/setaEsquerda.png'

import { BarraLateral } from './BarraLateral';

function Detalhes(){
    const navigate = useNavigate();

    const idAcompanha = localStorage.getItem("idAcompanha");
    const rota = localStorage.getItem("rota");


    const [processos, setProcessos] = useState([]);
    const [nomes, setNomes] = useState({});
    const [patente, setPatente] = useState({});
    const [documento, setDocumento] = useState();
    const [error, setError] = useState('');

    const homePath = () =>{
        navigate('/Home');
    };
    const editarPatentePath =() =>{
        navigate('/EditarPatente');
    };
    const novaAcaoPath = () =>{
        navigate('/NovaAcao');
    };

    const downloadPDF = () => {
        if (documento) {
            alert(documento)
            alert(typeof documento)
            const blob = new Blob([documento], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'documento.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            console.error('Nenhum documento PDF disponível para download.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patenteId = localStorage.getItem("idAcompanha");
                let response;
                let data;
                const rota = localStorage.getItem("rota");

                switch(localStorage.getItem("cargo")){
                    case 'presidente':
                        try{
                            response = await axios.post('http://localhost:4557/buscarPorIdPatente', JSON.stringify({ patenteId }), { headers: { 'Content-Type': 'application/json' } });
                            data = response.data;
                            setPatente(data);
                        }catch(error){
                            setError(error)
                        }

                        try{
                            response = await axios.get('http://localhost:4557/getPdf/' + patenteId, { headers: { 'Content-Type': 'application/json' }})
                            setDocumento(response.data)
                        }catch(error){
                            setError(error)
                        }

                        try{
                            response = await axios.post('http://localhost:4557/buscarDocumentosPorPatente/' + patenteId, { headers: { 'Content-Type': 'application/json' }})
                            data = response.data;
                            setProcessos(response.data)
                        }catch(error){
                            setError(error)
                        }
                        break;

                    case 'advogado':
                        try{
                            response = await axios.post('http://localhost:4557/buscarPorIdPatente', JSON.stringify({ patenteId }), { headers: { 'Content-Type': 'application/json' } });
                            data = response.data;
                            setPatente(data);
                        }catch(error){
                            setError(error)
                        }

                        try{
                            response = await axios.get('http://localhost:4557/getPdf/' + patenteId, { headers: { 'Content-Type': 'application/json' }})
                            setDocumento(response.data)
                        }catch(error){
                            setError(error)
                        }

                        try{
                            response = await axios.post('http://localhost:4557/buscarDocumentosPorPatente/' + patenteId, { headers: { 'Content-Type': 'application/json' }})
                            data = response.data;
                            setProcessos(response.data)
                        }catch(error){
                            setError(error)
                        }
                        break;

                    case 'tecnico':
                        try{
                            response = await axios.post('http://localhost:4557/buscarPorIdPatente', JSON.stringify({ patenteId }), { headers: { 'Content-Type': 'application/json' } });
                            data = response.data;
                            setPatente(data);
                        }catch(error){
                            setError(error)
                        }

                        try{
                            console.log(patenteId)
                            response = await axios.get('http://localhost:4557/getPdf/' + patenteId, { headers: { 'Content-Type': 'application/json' }})
                            setDocumento(response.data)
                        }catch(error){
                            setError(error)
                        }

                        try{
                            response = await axios.post('http://localhost:4557/buscarDocumentosPorPatente/' + patenteId, { headers: { 'Content-Type': 'application/json' }})
                            data = response.data;
                            setProcessos(response.data)
                        }catch(error){
                            setError(error)
                        }
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

    const encerrarProcesso = async (e) => {

        e.preventDefault();

        const apiUrl = 'http://localhost:4557/encerrarPatente/' + idAcompanha

        try {
            const response = await axios.post(apiUrl, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 200) {
                setError('');
                homePath();
            } else {
                setError('Não foi possível efetuar o Upload');
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            setError('Erro ao fazer upload');
        }
    };

    async function getName(employeeId) {
        try {
            const response = await axios.post('http://localhost:4557/searchNomeId', JSON.stringify({ employeeId }), { headers: { 'Content-Type': 'application/json' } });
            const { nome } = response.data;
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar nome:', error);
            return 'haha'; // Retornar uma string vazia em caso de erro
        }
    }
    
    return(
        <div>
            <header>
                <div>
                    <img alt='' src={headerLogo} class="header-logo" href="#" onClick={homePath}></img>
                </div>
                <div>
                    <input type="text" id='busca' class="home-search"></input>
                </div>
            </header>
            
            <BarraLateral/>

            <main>
                <div class="detalhes-text">
                    <img alt='' src={seta} class="seta-retorno" onClick={homePath}></img>
                </div>
                    <div class="detalhes-text">
                        <h1>Ver detalhes</h1>
                    </div>
                <div class="detalhes-container">
                    <d class="linhaTipo"> {patente.tipo} </d>
                    <d class="linhaStatus"> {patente.status} </d><br></br><br></br>
                    <d> {patente.name} </d><br></br>
                    <d> {patente.codigoAutomatico} </d><br></br>
                    <d>Resumo:</d><d> {patente.resumo} </d><br></br>
                    <d>Anexos </d><br></br>

                    <div>
                        <button onClick={downloadPDF} download>Baixar PDF</button>
                    </div>

                    <d>Detalhamento de Status</d>
                    <table>
                        <thead>
                            <th>Ação</th>
                            <th>Data</th>
                            <th>Responsável</th>
                            <th>Documento</th>
                        </thead>
                        <tbody>
                        {processos.map((processo) =>
                            <tr>
                                <td> {processo.name} </td>
                                <td> {processo.data} </td>
                                <td> {nomes[processo.employeeId]} </td>
                                <td><a href={documento} download>Documento</a></td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <button type="submit" id="btn_nova_acao" onClick={novaAcaoPath} class="" value="entrar">Nova Ação</button>
                    <button type="submit" id="btn_finalizar" class="" value="entrar" onClick={encerrarProcesso}>Finalizar</button>
                    
                </div>

                <div id="btn_edit_nv">
                    <button type="submit" id="btn_editar" onClick={editarPatentePath} class="" value="entrar">Editar informações</button>
                </div>
            </main>
        </div>
    );
}

export default Detalhes;
