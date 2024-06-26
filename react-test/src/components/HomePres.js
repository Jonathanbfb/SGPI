import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import headerLogo from '../img/headerLogo.png'
import lupa from '../img/lupa.png'

import { BarraLateral } from './BarraLateral';
import { HomeUsers } from './HomeUsers';




function HomePage() {

    const navigate = useNavigate();

    const homePath = () =>{
        navigate('/Home');
    };

  return (
    <div>
        <header>
            <div href="#">
                <img src={headerLogo} class="header-logo" href="#" alt='' onClick={homePath}></img>
            </div>

            <div class="popup" id="popup-1">
                <input id="busca" type="text" class="home-search"></input>
            </div>
        </header>

        <BarraLateral/>

        <HomeUsers/>
    </div>
    
  );

    
}


export default HomePage;
