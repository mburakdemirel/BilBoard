import React, { useContext, useEffect, useState } from 'react';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import Burak from './assets/img/burak.png'
import ContextApi from "../context/ContextApi";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';

function NavigationBarDefault() {
    const { pageType, searchText } = useParams();
    console.log("pagetype in nav" + pageType);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');


    const enterClick = (e) => {

        if (e.key === "Enter") {
            console.log("Enter Click")
            navigate('/main_page/' + pageType + '/' + searchInput);
        }
    }

    return (
        <nav className="navbar navbar-expand-md sticky-top bg-body py-3" style={navbarStyle}>
            <div className="container">
                <a onClick={() => { navigate('/main_page/secondhand') }} className="navbar-brand d-flex align-items-center">
                    <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon" style={brandIconStyle}>
                        <img style={brandLogoStyle} src={Logo} alt="Logo" />
                    </span>
                    <span style={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>BilBoard</span>
                </a>
                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-3">
                    <span className="visually-hidden">Toggle navigation</span>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navcol-3" className="collapse navbar-collapse" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                    <nav className="navbar-nav mx-auto" style={{ fontWeight: 'bold' }}>
                        <li className="nav-item"><a onClick={() => { navigate('/main_page/secondhand') }} className="nav-link" style={{ cursor: 'pointer', textDecoration: pageType === "secondhand" ? 'underline' : '', color: pageType === "secondhand" ? '#2d3647' : '' }}>Second-Hand</a></li>
                        <li className="nav-item"><a onClick={() => { navigate('/main_page/lost&found') }} className="nav-link" style={{ cursor: 'pointer', textDecoration: pageType === "lost&found" ? 'underline' : '', color: pageType === "lost&found" ? '#2d3647' : '' }}>Lost & Found</a></li>
                        <li className="nav-item"><a onClick={() => { navigate('/main_page/borrow') }} className="nav-link" style={{ cursor: 'pointer', textDecoration: pageType === "borrow" ? 'underline' : '', color: pageType === "borrow" ? '#2d3647' : '' }}>Borrow</a></li>
                        <li className="nav-item"><a onClick={() => { navigate('/main_page/donation') }} className="nav-link" style={{ cursor: 'pointer', textDecoration: pageType === "donation" ? 'underline' : '', color: pageType === "donation" ? '#2d3647' : '' }}>Donation</a></li>
                        <li className="nav-item"><a onClick={() => { navigate('/main_page/complaint') }} className="nav-link" style={{ cursor: 'pointer', textDecoration: pageType === "complaint" ? 'underline' : '', color: pageType === "complaint" ? '#2d3647' : '' }}>Complaint</a></li>
                    </nav>
                    <div className="me-4" style={{ maxWidth: '200px', height: '40px' }}>
                        <input className="d-flex justify-content-xxl-center" onKeyDown={enterClick} onChange={(e) => setSearchInput(e.target.value)}
                            type="search" style={{ width: '100%', height: '100%', borderRadius: '6px', border: '2px solid var(--bs-navbar-active-color)', paddingLeft: '5px', paddingRight: '5px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }} placeholder="Search" />
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ background: '#2d3648', borderStyle: 'none', height: '40px', width: '90.6875px', padding: '0px', marginTop: '5px', marginBottom: '5px' }}>
                            Add
                            <svg className="bi bi-plus-circle" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '7px', fontSize: '20px' }}>
                                <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                            </svg>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => {navigate("/add_product")}}>Add Product</Dropdown.Item>
                            <Dropdown.Item onClick={() => {navigate("/post_complaint")}}>Add Complaint</Dropdown.Item>
                            <Dropdown.Item onClick={() => {navigate("/post_l&f")}}>Add Lost or Found Entry</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <svg className="bi bi-bell" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{ fontSize: '30px', marginRight: '15px', marginLeft: '15px' }}>
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"></path>
                    </svg>
                    <svg className="bi bi-envelope" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{ fontSize: '30px', marginRight: '15px', marginTop: '5px', marginBottom: '5px' }}>
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>
                    </svg>
                    <div><img onClick={() => { navigate('/profile') }} className="rounded-circle" style={{ width: '50px', height: '50px' }} src={Burak} alt="Profile" /></div>
                </div>
            </div>
        </nav>



    );

};

const navbarStyle = {
    borderBottom: '2px solid #2d3647',
    height: '75px'
};

const brandIconStyle = {
    margin: '0px',
    borderRadius: '10px',
    background: 'var(--bs-body-bg)',
    width: '50px',
    height: '50px',
};

const brandLogoStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '10px',
};

const selectedText = {

}


export default NavigationBarDefault;