import React from 'react';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import { NavLink } from 'react-router-dom';

function NavigationBarLanding(){
    return (

            <nav className="navbar navbar-expand-sm sticky-top d-lg-flex align-items-start py-3 navbar-light"
                style={{background: '#ffffff',height: '75px', width:'100%' }}>

                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                    <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon" style={{ width: '36px' }}>
                        <img className="img-thumbnail" src={Logo} alt="Logo" />
                    </span>
                        <span className="fw-semibold" style={{ fontFamily: 'Inter, sans-serif'}}>Bilboard</span>
                    </a>
                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-2">
                        <span className="visually-hidden">Toggle navigation</span>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="navcol-2" className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <ul className="navbar-nav">
                                    <li className="nav-item"></li>
                                    <li className="nav-item"></li>
                                    <li className="nav-item"></li>
                                </ul>
                            </li>
                            <li className="nav-item"></li>
                            <li className="nav-item"></li>
                        </ul>
                        <NavLink
                            className="btn btn-primary fw-semibold center "
                            role="button"
                            style={{
                                width: '83.5781px',
                                background: '#2d3648',
                                borderStyle: 'none',
                                fontSize: '14px',
                                height: '35px',
                                fontFamily: 'Inter, sans-serif',
                                margin: '5px',
                            }} to={'/profile'}>About
                        </NavLink>
                        <NavLink
                            className="btn btn-primary fw-semibold center "
                            role="button"
                            style={{
                                width: '83.5781px',
                                background: '#2d3648',
                                borderStyle: 'none',
                                fontSize: '14px',
                                height: '35px',
                                fontFamily: 'Inter, sans-serif',
                                margin: '5px',
                            }} to={'/login'}>Login
                        </NavLink>
                        <NavLink
                            className="btn btn-primary fw-semibold center "
                            role="button"
                            style={{
                                width: '83.5781px',
                                background: '#2d3648',
                                borderStyle: 'none',
                                fontSize: '14px',
                                height: '35px',
                                fontFamily: 'Inter, sans-serif',
                                margin: '5px',
                            }} to={'/register'}>Register
                        </NavLink>
                    </div>
                </div>


            </nav>




    );

};

export default NavigationBarLanding;