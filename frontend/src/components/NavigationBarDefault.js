import React, {useContext, useEffect, useState} from 'react';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import Burak from './assets/img/burak.png'
import ContextApi from "../context/ContextApi";
import {useNavigate, useParams} from "react-router-dom";
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';
import ProfilePlaceholder from "./assets/img/default_profile.webp";
import axios from "axios";
import {Dropdown} from 'react-bootstrap';
import Profile from "./Profile";

function NavigationBarDefault() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    const {sendNewMessage, isProfileChanged, changeProfile} = useContext(ContextApi);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = React.useRef(null);
    const favoritesIdList = [];
    const [myProfile, setMyProfile] = useState(JSON.parse(localStorage.getItem('myProfile')));

    useEffect(() => {

        getProfile();
        getFavorites();
        if(isProfileChanged){
            changeProfile(false);
        }

    }, [favoritesIdList,myProfile,isProfileChanged]);


    const getProfile = async () =>{

        if(!myProfile || isProfileChanged){
            try{
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');

                const {data} = await axios.get('http://127.0.0.1:8000/api/user/me/') ;
                console.log(data);
                localStorage.setItem('myProfile', JSON.stringify(data));
                setMyProfile(JSON.parse(localStorage.getItem('myProfile')));
            }
            catch (error){
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log('No response received from the server.');
                } else {
                    console.log('An error occurred while setting up the request.');
                }
            }
        }

    }

    const getFavorites = async () => {
        try{

            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/user/my-favorites/');
            console.log("favorites from backend " , data.message);
            data.message.forEach((product) => favoritesIdList.push(product.id));
            localStorage.setItem('favoritesObjects', JSON.stringify(data.message));
            console.log(favoritesIdList);
            localStorage.setItem('favorites', JSON.stringify(favoritesIdList));
        }
        catch (error){
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log('No response received from the server.');
            } else {
                console.log('An error occurred while setting up the request.');
            }
        }
    }


    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const {pageType,searchText} = useParams();
    console.log("pagetype in nav" + pageType);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const{isImageViewerOpen, changeIsImageViewerOpen} = useContext(ContextApi);

    const enterClick = (e) => {
        if(pageType){
            if(e.key === "Enter") {
                console.log("Enter Click")
                navigate('/main_page/' + pageType + '/' + searchInput);
            }
        }
    }

    const sendMessage = () => {
        sendNewMessage();
        navigate("/messages");
    }

    return (<div>
        {!isImageViewerOpen &&
        <nav className="navbar navbar-expand-md sticky-top bg-body py-3" style={navbarStyle}>
            <div className="container">
                <a onClick={() => {navigate('/main_page/secondhand')}} className="navbar-brand d-flex align-items-center">
                    <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon" style={brandIconStyle}>
                        <img style={brandLogoStyle} src={Logo} alt="Logo" />
                    </span>
                    <span style={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>BilBoard</span>
                </a>
                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-3">
                    <span className="visually-hidden">Toggle navigation</span>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navcol-3" className="collapse navbar-collapse" style={{ backgroundColor: 'white', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                    <nav className="navbar-nav mx-auto" style={{ fontWeight: 'bold' }}>
                        <li type="button"  className="nav-item"><a onClick={() => {navigate('/main_page/secondhand')}} className="nav-link" style={{ textDecoration: pageType==="secondhand" ? 'underline': '', color: pageType==="secondhand" ? '#2d3647': '' }}>Second-Hand</a></li>
                        <li type="button"  className="nav-item"><a onClick={() => {navigate('/main_page/borrow')}} className="nav-link"  style={{ textDecoration: pageType==="borrow" ? 'underline': '', color: pageType==="borrow" ? '#2d3647': '' }}>Borrow</a></li>
                        <li type="button"  className="nav-item"><a onClick={() => {navigate('/main_page/donation')}} className="nav-link" style={{ textDecoration: pageType==="donation" ? 'underline': '', color: pageType==="donation" ? '#2d3647': '' }}>Donation</a></li>
                        <li type="button"  className="nav-item"><a onClick={() => {navigate('/main_page/lost&found')}} className="nav-link" style={{ textDecoration: pageType==="lost&found" ? 'underline': '', color: pageType==="lost&found" ? '#2d3647': '' }}>Lost & Found</a></li>
                        <li type="button"  className="nav-item"><a onClick={() => {navigate('/main_page/complaint')}} className="nav-link" style={{ textDecoration: pageType==="complaint" ? 'underline': '', color: pageType==="complaint" ? '#2d3647': '' }}>Complaint</a></li>
                    </nav>
                    <div className="me-4" style={{ maxWidth: '200px', height: '40px' }}>
                        <input className="d-flex justify-content-xxl-center" onKeyDown={enterClick} onChange={(e)=> setSearchInput(e.target.value)}
                             type="search" disabled={!pageType} style={{ width: '100%', height: '100%', borderRadius: '6px', border: '2px solid var(--bs-navbar-active-color)', paddingLeft: '5px', paddingRight: '5px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }} placeholder="Search" />
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
                    <i className="bi bi-bell position-relative" type="button" onClick={handleClick} style={{ fontSize: '28px',marginRight: '15px', marginLeft: '15px'}}>
                        <span className="d-flex justify-content-center position-absolute top-0 start-100 bg-danger translate-middle p-2 rounded-circle " style={{height:'20px', width:'20px'}}>
                            <h1 className="d-flex justify-content-center align-items-center" style={{fontSize:'14px', fontFamily:'Inter,sans-serif'}}>9</h1>
                      </span>

                    </i>
                    <Overlay  show={show} target={target} placement="bottom" container={ref.current} containerPadding={10} >
                        <Popover id="popover-contained" s>
                            <Popover.Header>Notifications</Popover.Header>
                            <Popover.Body >
                                {Array(5).fill().map((_, index) => {
                                        return(
                                            <div key={index} style={{width:'240px', height:'inherit', background:'#EDF0F7', marginBottom:'10px', padding:'10px', borderRadius:'10px', border:'solid', borderWidth:'1.6px',borderColor:'#A0ABC0' }}>
                                                <p style={{width:'100%',fontFamily: 'Inter, sans-serif', fontSize:'13px', marginBottom:'5px'}}>Burak Demirel “McQueen Yatak az yatılmış” adlı ürününüz için mesaj gönderdi.</p>
                                                <div className="d-flex justify-content-between" style={{width:'100%'}}>
                                                    <button className="btn" href="#" style={{paddingTop:'2px', paddingBottom:'2px', fontFamily: 'Inter, sans-serif', fontSize:'11px',color:'white' , background:'#2d3648'}}>See Message</button>
                                                    <button className="btn" href="#" style={{paddingTop:'2px', paddingBottom:'2px',paddingLeft:'5px',paddingRight:'5px' , fontFamily: 'Inter, sans-serif', fontSize:'11px',color:'white' , background:'#2d3648'}}>
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                </div>

                                            </div>)
                                })}
                            </Popover.Body>
                        </Popover>
                    </Overlay>

                    <i className="bi bi-envelope position-relative" type="button" style={{ fontSize: '28px', marginRight: '15px', marginTop: '5px', marginBottom: '5px' }}
                       onClick={() => {sendMessage()}}>
                        <span className="d-flex justify-content-center position-absolute top-0 start-100 bg-danger translate-middle p-2 rounded-circle " style={{height:'20px', width:'20px'}}>
                            <h1 className="d-flex justify-content-center align-items-center" style={{fontSize:'14px', fontFamily:'Inter,sans-serif'}}>9</h1>
                      </span>

                    </i>

                    <div >
                        <img
                            onClick={(e)=>navigate('/profile')} className="rounded-circle" style={{ width: '50px', height: '50px' }} src={myProfile && myProfile.profile_photo ? myProfile.profile_photo : ProfilePlaceholder} alt="Profile" />
                    </div>
                </div>
            </div>
        </nav>}
        </div>


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