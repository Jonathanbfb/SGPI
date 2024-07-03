import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import headerLogo from '../img/headerLogo.png';
import novoProcesso from '../img/novoReg.png';
import filePdf from '../img/filePdf.png';

import { BarraLateral } from './BarraLateral';

function NovaPatente() {
    const navigate = useNavigate();

    const[patente, setPatente] = useState({})

    const [nomePatente, setName] = useState(patente.name);
    const [status, setStatus] = useState(patente.status);
    const [tipo, setTipo] = useState(patente.tipo);
    const [dataEntrada, setEntrada] = useState(patente.dataEntrada);
    const [codigoAutomatico, setCodigoAutomatico] = useState(patente.codigoAutomatico);
    const [resumo, setResumo] = useState(patente.resumo);
    const [file, setFile] = useState(patente.file);

    const [error, setError] = useState('');

    const employeeId = localStorage.getItem("employeeId");
    const companyId = localStorage.getItem("companyId");
    const idAcompanha = localStorage.getItem("idAcompanha");

    const homePath = () =>{
        navigate('/Home');
    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
          setFile(selectedFile);
        } else {
          alert('Por favor, selecione um arquivo PDF.');
        }
    };

    const HandleUpload = () => {
        if (!file) {
          alert('Por favor, selecione um arquivo PDF.');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        
        //faz o upload caso aceite o arquivo, não sei se a porta ta correta
        axios.post('http://191.135.47.224:4557/upload', formData)
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
            console.error('Erro ao enviar arquivo:', error);
        });
    };

    const handleEditar = async (e) => {

        e.preventDefault();
        console.log(nomePatente, status, tipo, dataEntrada, codigoAutomatico, resumo, employeeId, companyId, file)

        try {
            const formData = new FormData();
            formData.append('nomePatente', nomePatente);
            formData.append('status', status);
            formData.append('tipo', tipo);
            formData.append('dataEntrada', dataEntrada);
            formData.append('codigoAutomatico', codigoAutomatico);
            formData.append('resumo', resumo);
            formData.append('employeeId', employeeId);
            formData.append('companyId', companyId);
            formData.append('file', file); // Adicione o arquivo ao FormData

            const apiUrl = 'http://191.135.47.224:4557/updatePatente/' + idAcompanha
            console.log(apiUrl)

            const response = await axios.post(apiUrl, formData, {
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
            console.log(error)
            console.error('Erro ao fazer upload:', error);
            setError('Erro ao fazer upload');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patenteId = localStorage.getItem("idAcompanha");
                const rota = localStorage.getItem("rota");
                let response;
                let data;
                switch(localStorage.getItem("cargo")){
                    case 'presidente':
                        response = await axios.post('http://191.135.47.224:4557buscarPorIdPatente', JSON.stringify({ patenteId }), { headers: { 'Content-Type': 'application/json' } });
                        data = response.data;
                        setPatente(data);
                        break;

                    case 'advogado':
                        response = await axios.post('http://191.135.47.224:4557buscarPorIdPatente', JSON.stringify({ patenteId }), { headers: { 'Content-Type': 'application/json' } });
                        data = response.data;
                        setPatente(data);
                        break;

                    case 'tecnico':
                        response = await axios.post('http://191.135.47.224:4557buscarPorIdPatente', JSON.stringify({ patenteId }), { headers: { 'Content-Type': 'application/json' } });
                        data = response.data;
                        setPatente(data);
                        setName(data.name)
                        setStatus(data.status)
                        setTipo(data.tipo)
                        setEntrada(data.dataEntrada)
                        setCodigoAutomatico(data.codigoAutomatico)
                        setResumo(data.resumo)
                        setFile(data.pdfDocument)
                        break;

                }
            } catch (error) {
                console.log(error)
                console.error('Erro ao fazer login:', error);
            }
        };

        fetchData();
    }, []);
    
  return (
    <div>
        <header>
            <div class="user-log">
                <img src={headerLogo} alt=''  class="header-logo" href="#" onClick={homePath}></img>
            </div>
            <div>
                <input type="text" id='busca' class="home-search"></input>
            </div>
        </header>
       
        <BarraLateral/>
      
        <main class="main-container-add">
            <div class="add-text-registro">
                <img src={novoProcesso} alt=''  class="side-icon-top"></img>Editar registro
            </div>

            <br></br>

            <div class="container-add-registro">
                <form action="Registrar" method="post">
                    
                    <section id="login">
                        <div class="divisa-registro-geral">
                            
                        <label for="titulo" class="login-user-text">Titulo:</label>
                        <input type="text" name="titulo" placeholder={nomePatente} id="titulo" class="registro-input-titulo" onChange={(e) => setName(e.target.value)}></input>

                                <br></br>
                                <label for="Tipo" class="login-user-text">Tipo:</label>
                                <input type="text" className='registro-text-input' id="campoDeTexto" readonly></input>
                                <select id="dropdown" class='registro-select' onChange={(e) => setTipo(e.target.value)}>
                                    <option value="Patente">Patente</option>
                                    <option value="Programa de Computador">Programa de Computador</option>
                                </select>

                                <label for="data-de-entrada" class="login-user-text">Data de entrada:</label>
                                <input type="text" name="data-de-entrada" placeholder={dataEntrada} id="data-de-entrada" class="registro-text-input" onChange={(e) => setEntrada(e.target.value)}></input>

                                <label for="codigo-automatico" class="login-user-text">Codigo automatico:</label>
                                <input type="text" name="codigo-automatico" placeholder={codigoAutomatico} id="codigo-automatico" class="registro-text-input" onChange={(e) => setCodigoAutomatico(e.target.value)}></input>

                                <label for="resumo" class="login-user-text">Resumo:</label>
                                <input type="text" name="resumo" placeholder={resumo} id="resumo" class="registro-resumo-input" onChange={(e) => setResumo(e.target.value)}></input>
                                <br></br>

                                <label for="drop-area" class="login-user-text">Documentos</label>
                                <div class="registro-resumo-input" name="drop-area">
                                    <div class="drop-area" id="dropArea">
                                        <img src={filePdf} alt='' class="pdf-icon"></img><br/>
                                        <input type="file" accept=".pdf" onChange={handleFileChange}/>
                                    </div>
                                </div>
                                <br/><br/>

                                <div id="login-senha">
                                    <button type="submit" id="btn_entrar" class="" value="entrar" onClick={handleEditar}>SALVAR</button>
                                </div>
                        </div>
                        
                        
                    </section>
                </form>
            </div>
        </main>
    </div>
  );
}

export default NovaPatente;
