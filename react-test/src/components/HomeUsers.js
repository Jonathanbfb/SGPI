import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import acompanha from '../img/busca.png'
import encerra from '../img/encerra.png'
import dashboard from '../img/dashboard.png'
import add from '../img/addFunc.png'
import funcionarios from '../img/funcionarios.png'
import novoProcesso from '../img/novoReg.png'
import existentes from '../img/existentes.png'

export function HomeUsers(){

    const navigate = useNavigate();

    const acompanhaPath = () =>{
        navigate('/Acompanhamento');
    };
    const encerraPath = () =>{
        navigate('/Encerrados');
    };
    const adicionar = () =>{
        navigate('/AdicionarFunc');
    };
    const funcionariosPath = () =>{
        navigate('/Funcionarios');
    };
    const existentesPath = () =>{
        navigate('/PatentesExistentes')
    };
    const novaPatentePath = () =>{
        navigate('/NovaPatente')
    };

    const cargo = localStorage.getItem("cargo");
   if (!cargo) {
        return <h2 style={{ textAlign: "center", marginTop: "20px" }}>Erro: Cargo não encontrado. Faça login novamente.</h2>;
    }

switch(cargo){
        case 'presidente':

            //   Presidente
            
            return(
                <main>
                    <a href="#"  class="bloco" onClick={acompanhaPath}>
                        <img src={acompanha} alt='' class="icon"></img><br></br>
                        <h2>Acompanhamento de processos</h2>
                        
                    </a>

                    <a href="#"  class="bloco" onClick={encerraPath}>
                        <img src={encerra} alt='' class="icon"></img><br></br>
                        <h2>Processos encerrados</h2>
                    </a>

                    <a href="#"  class="bloco">
                        <img src={dashboard} alt=''  class="icon"></img><br></br>
                        <h2>Dashboards</h2>
                    </a>

                    <br></br>

                    <a href="#"  class="bloco" onClick={adicionar}>
                        <img src={add} alt=''  class="icon"></img><br></br>
                        <h2>Adicionar Funcionários</h2>
                    </a>

                    <a href="#"  class="bloco" onClick={funcionariosPath}>
                        <img src={funcionarios}  alt='' class="icon"></img><br></br>
                        <h2>Funcionários</h2>
                    </a>


                </main>
            )
            break;

        case 'tecnico':

            //  Tecnico

            return(
                <main>
                    <a href="#"  class="bloco" onClick={novaPatentePath}>
                        <img src={novoProcesso} alt=''  class="icon"></img><br></br>
                        <h2>Novo registro</h2>
                        
                    </a>

                    <a href="#"  class="bloco" onClick={acompanhaPath}>
                        <img src={acompanha} alt=''  class="icon"></img><br></br>
                        <h2>Acompanhamento de processos</h2>
                    </a>

                    <a href="#"  class="bloco"onClick={encerraPath}>
                        <img src={encerra} alt=''  class="icon"></img><br></br>
                        <h2>Processos encerrados</h2>
                    </a>

                    <br></br>

                    <a href="#"  class="bloco" onClick={existentesPath}>
                        <img src={existentes}  alt='' class="icon"></img><br></br>
                        <h2>Patentes existentes</h2>
                    </a>

                </main>
            )
            break;
        
        case 'advogado':
            // Advogado
            return(
                <main>
                    <a href="#"  class="bloco" onClick={acompanhaPath}>
                        <img src={acompanha}  alt='' class="icon"></img><br></br>
                        <h2>Acompanhamento de processos</h2>  
                    </a>
                    <a href="#"  class="bloco" onClick={encerraPath}>
                        <img src={encerra}  alt='' class="icon"></img><br></br>
                        <h2>Processos encerrados</h2>
                    </a>

                    <a href="#"  class="bloco">
                        <img src={dashboard}  alt='' class="icon"></img><br></br>
                        <h2>Dashboards</h2>
                    </a>
                    <br></br>
                    <a href="#"  class="bloco" onClick={existentesPath}>
                        <img src={existentes} alt=''  class="icon"></img><br></br>
                        <h2>Patentes existentes</h2>
                    </a>
                </main>
            )
            break;
    }
}