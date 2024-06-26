import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useState } from 'react';


import headerLogo from '../img/headerLogo.png'
import lupa from '../img/lupa.png'
import existentes from '../img/existentes.png'

import { BarraLateral } from './BarraLateral';

function PatentesExistentes() {
    const navigate = useNavigate();


    const [patentes, setPatentes] = useState([])
    const [nomePatente, setNomePatente] = useState('');
    const [error, setError] = useState('');

    const pesquisar = async(e) => {
        e.preventDefault();

        try{
            console.log('aqui dentro')
            console.log(nomePatente)

            const response = await axios.post('http://127.0.0.1:3106/result', {'buscaPatente' : nomePatente})
            
            const data = (response.data);
            console.log(data.patentes)
            setPatentes(data.patentes);

            console.log('----------------------------------------')
            console.log(patentes)
        } catch (error) {
            if (!error?.response) {  
                setError('Erro ao acessar o servidor');
            } else if (error.response.status == 401) {
                setError('Erro na busca');
            }
            console.log('erro:')
            console.log(error)
        }
    }

    const homePath = () =>{
        navigate('/Home');
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

        <main class="main-table">
            <div>
                <img src={existentes} alt=''  class="page-sub-icon"></img>  Patentes Existentes
            </div>
            <div>
                <input 
                    type="text" 
                    class="existentes-search"
                    placeholder="          Digite o nome da patente" 
                    required
                    onChange={(e) => setNomePatente(e.target.value)}>
                </input>
                <button
                onClick={(e) => pesquisar(e)}> 
                    Resultados
                </button>
            </div>
            <div class="container">
                
                <table>
                    <tbody>
                        
                                {patentes.map(patente => <tr><td class="titulos-existentes"><a href={patente.link} target="_blank" rel="noopener noreferrer" class="nome-patente">{patente.titulo} </a></td></tr>)}
                        
                    </tbody>
                </table>
            </div>
        </main>
    </div>
  );
}

export default PatentesExistentes