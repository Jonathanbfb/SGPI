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

    const [resumo, setResumo] = useState('--nome--');
    const [data, setData] = useState('Em andamento');
    const [file, setFile] = useState(null);
    const rota = localStorage.getItem("rota");

    const [error, setError] = useState('');

    const employeeId = localStorage.getItem("employeeId");
    const idAcompanha = localStorage.getItem("idAcompanha");

    const homePath = () =>{
        navigate('/Home');
    };

    // Verifica se o arquivo é pdf, se for salva em file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
          setFile(selectedFile);
        } else {
          alert('Por favor, selecione um arquivo PDF.');
        }
    };

    const handleUpload = () => {
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

    const handleAcao = async (e) => {

        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', resumo);
            formData.append('data', data);
            formData.append('employeeId', employeeId);
            formData.append('patenteId', idAcompanha);
            formData.append('file', file); // Adicione o arquivo ao FormData
            
            console.log(formData)

            const response = await axios.post('http://191.135.47.224:4557/uploadDocumento', formData, {
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
                <img src={novoProcesso} alt=''  class="side-icon-top"></img>Nova Ação
            </div>

            <br></br>

            <div class="container-add-registro">
                <form action="Registrar" method="post">
                    
                    <section id="login">
                        <div class="divisa-registro-geral">
                            
                        <label for="titulo" class="login-user-text">Ação:</label>
                        <input type="text" name="titulo" id="titulo" class="registro-input-titulo" onChange={(e) => setResumo(e.target.value)} required></input>

                                <br></br>

                                <label for="data-de-entrada" class="login-user-text">Data de Modificação:</label>
                                <input type="text" name="data-de-entrada" id="data-de-entrada" class="registro-text-input" onChange={(e) => setData(e.target.value)} required></input>

                                <br></br>

                                <label for="drop-area" class="login-user-text">Documentos</label>
                                <div class="registro-resumo-input" name="drop-area">
                                    <div class="drop-area" id="dropArea">
                                    <img src={filePdf} alt='' class="pdf-icon"></img><br/>
                                        { /* recebe o arquivo */ }
                                        <input type="file" accept=".pdf" onChange={handleFileChange}/>
                                    </div>
                                </div>
                               
                                <div id="login-senha">
                                    <button onClick={handleAcao} type="submit" id="btn_entrar" class="" value="entrar">SALVAR</button>
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
