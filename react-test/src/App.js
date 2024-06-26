import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, redirect } from 'react-router-dom';
import HomePage from './components/HomePres';
import HtmlPage from './components/HtmlPage';
import Acompanhamento from './components/Acompanhamento'
import Encerrados from './components/Encerrados';
import Detalhes from './components/Detalhes';
import DetalhesEncerrados from './components/DetalhesEncerrados';
import Funcionarios from './components/Funcionarios';
import Add from './components/AdicionarFunc';
import Login from './components/login';
import PatentesExistentes from './components/PatentesExistentes';
import EditarPerfil from './components/EditarPerfil';
import NovaPatente from './components/NovaPatente';
import NovaAcao from './components/NovaAcao';
import EditarPatente from './components/EditarPatente';
import { isAutenticated } from './Auth';
import './App.css';

function App() {

  return (
    <Router>
      <div>
        <Routes> 
          <Route path="/" element={<Login />} /> 
          <Route path="/Home" element={isAutenticated() ? <HomePage/>: <Login/>}   /> 
          <Route path="/html-page" element={<HtmlPage />} />
          <Route path="/Acompanhamento" element={isAutenticated() ? <Acompanhamento/> : <Login/>} />
          <Route path="/Encerrados" element={isAutenticated() ? <Encerrados/> : <Login/>} /> 
          <Route path="/Detalhes" element={isAutenticated() ? <Detalhes/> : <Login/>} /> 
          <Route path="/DetalhesEncerrados" element={isAutenticated() ? <DetalhesEncerrados/> : <Login/>} />
          <Route path="/Funcionarios"  element={isAutenticated() ? <Funcionarios/> : <Login/>} />
          <Route path='/AdicionarFunc' element={isAutenticated() ? <Add/> : <Login/>} />
          <Route path='/NovaPatente' element={isAutenticated() ? <NovaPatente/> : <Login/>} />
          <Route path='/PatentesExistentes' element={isAutenticated() ? <PatentesExistentes/> : <Login/>} />
          <Route path='/EditarPerfil' element={isAutenticated() ? <EditarPerfil/> : <Login/>}/>
          <Route path='/NovaAcao' element={isAutenticated() ? <NovaAcao/> : <Login/>}/>
          <Route path='/EditarPatente' element={isAutenticated() ? <EditarPatente/> : <Login/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
