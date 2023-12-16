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
import AOS from "aos";
import ReconnectingWebSocket from "reconnecting-websocket";

function NavigationBarDefault() {

    const {sendNewMessage, isProfileChanged, changeProfile} = useContext(ContextApi);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = React.useRef(null);
    const favoritesIdList = [];
    const [myProfile, setMyProfile] = useState(JSON.parse(localStorage.getItem('myProfile')));


    const {pageType,searchText} = useParams();
    console.log("pagetype in nav" + pageType);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const{isImageViewerOpen, changeIsImageViewerOpen} = useContext(ContextApi);
    const [socket, setSocket] = useState();
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSearchInput('');
    }, [pageType]);

    useEffect(() => {
        AOS.init();
        getProfile();
        getFavorites();
        if(isProfileChanged){
            changeProfile(false);
        }

    }, [favoritesIdList,myProfile,isProfileChanged]);



    useEffect(() => {
        getNotifications();

        //Web Socket

        if(myProfile){
            const newSocket  = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/notification/"+ myProfile.id + "/");

            newSocket.onopen =  (e) => {
                console.log("WebSocket Notification is connected");
                setSocket(newSocket);
            };

            newSocket.onclose =  (e) => {
                console.log("WebSocket Notification is closed");
            };

            newSocket.onmessage = (event) => {
                debugger;
                const data = JSON.parse(event.data);
                if(data['command'] === 'marked'){
                    setNotificationCount(0);
                }
                else if(data['command'] === 'single_marked'){

                }
                else{
                    setNotificationCount((prevCount) => prevCount+1);
                    setNotifications((prevNotifications) => [data, ...prevNotifications]);
                    console.log(data);
                }
            };

            return () => {
                newSocket.close();
            };

        }

    }, []);


    const markAll = () => {
            setNotificationCount(0);
            console.log("notif", notifications);
            console.log("mark all");
            socket.send(JSON.stringify({
                "command": "mark_all",
                "user_id": myProfile.id,
            }));
            setNotifications([]);
    }

    const markSingle = (notificationId,notificationIndex) => {
        debugger;
        console.log("notif", notifications);
        console.log("mark single");
        socket.send(JSON.stringify({
            "command": "mark_single",
            "notification_id": notificationId,
            "user_id": myProfile.id,
        }));
        setNotifications(prevNotifications =>
            prevNotifications.filter((_, index) => index !== notificationIndex)
        );
        setNotificationCount((prevCount)=> prevCount-1);
    }

    const seeDetail = (selectedNotification,index) => {
        setShow(!show);
        if(selectedNotification.related_item ==="CHAT"){
            notifications.forEach((notification, index) => {
                if (notification.related_item_id == selectedNotification.related_item_id) {
                    markSingle(notification.id, index);
                }
            });;


            navigate("/messages/" + selectedNotification.related_item_id);
        }
        else{
            notifications.forEach((notification, index) => {
                if (notification.related_item_id == selectedNotification.related_item_id) {
                    markSingle(notification.id, index);
                }
            });

            navigate("/main_page/complaint/?specific=" + selectedNotification.related_item_id);
        }
    }

    const getHourAndMinuteFromTime = (timestamp) => {
        //let timestamp = "2023-12-04T13:03:48";
        let date = new Date(timestamp);

        let hours = date.getHours();
        let minutes = date.getMinutes();


        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ':' + minutes;
    };



    const getNotifications = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/notifications/unread/');
            console.log("notifications",data.results);
            setNotifications(data.results);
            setNotificationCount(data.results.length);

        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log('No response received from the server.');
            } else {
                console.log('An error occurred while setting up the request.');
            }
        }

    }

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



    const enterClick = (e) => {
        if(pageType){
            if(e.key === "Enter") {
                console.log("Enter Click")
                navigate(window.location.pathname +  '?search=' + searchInput);

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
                        <input className="d-flex justify-content-xxl-center" onKeyDown={enterClick} onChange={(e)=> setSearchInput(e.target.value)} value={searchInput}
                             type="search" disabled={!pageType} style={{ width: '100%', height: '100%', borderRadius: '6px', border: '2px solid var(--bs-navbar-active-color)', paddingLeft: '5px', paddingRight: '5px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }} placeholder="Search" />
                    </div>
                    <Dropdown  >
                        <Dropdown.Toggle  variant="primary" id="dropdown-basic" style={{ background: '#2d3648', borderStyle: 'none', height: '40px', width: '90.6875px', padding: '0px', marginTop: '5px', marginBottom: '5px' }}>
                            Add
                            <svg  className="bi bi-plus-circle" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '7px', fontSize: '20px' }}>
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

                    <i  className="bi bi-bell position-relative" type="button" onClick={(e) =>{handleClick(e)}} style={{ fontSize: '28px',marginRight: '15px', marginLeft: '15px'}}>
                        {notifications!=0 &&
                            <span className="d-flex justify-content-center position-absolute top-0 start-100  translate-middle p-2 rounded-circle " style={{height:'21px', width:'21px', background:'#2d3648'}}>
                            <h1 className="d-flex justify-content-center align-items-center" style={{fontSize:'13px', fontFamily:'Inter,sans-serif', color:'white', paddingTop:'2px'}}>{notificationCount}</h1>
                            </span>
                        }
                    </i>
                    <Overlay transition={true} rootClose={true} show={show} target={target} placement="bottom" container={ref.current} containerPadding={10} >
                        <Popover id="popover-contained">
                            <Popover.Header>
                                <div className="d-flex align-items-center justify-content-between w-100"  >
                                    <a>Notifications</a>
                                    <button onClick={markAll} className="btn"  style={{ marginLeft:'10px', padding:'4px' ,fontFamily: 'Inter, sans-serif', fontSize:'11px',color:'white' , background:'#2d3648'}}>
                                        Mark All
                                    </button>
                                </div>
                            </Popover.Header>
                            <Popover.Body>
                                {Array(notifications.length).fill().map((_, index) => {
                                        return(
                                            <div key={index} style={{width:'240px', height:'inherit', background:'#EDF0F7', marginBottom:'10px', padding:'10px', borderRadius:'10px', border:'solid', borderWidth:'1.6px',borderColor:'#A0ABC0' }}>
                                                <p style={{width:'100%',fontFamily: 'Inter, sans-serif', fontSize:'13px', marginBottom:'-2px'}}>{notifications[index] && notifications[index].description}</p>
                                                <p style={{width:'100%',fontFamily: 'Inter, sans-serif', fontSize:'9px', marginBottom:'0px', marginTop:'0px', textAlign:'end'}}>{notifications[index] && getHourAndMinuteFromTime(notifications[index].timestamp)}</p>
                                                <div className="d-flex justify-content-between" style={{width:'100%'}}>
                                                    <button className="btn" onClick={()=>seeDetail(notifications[index],index)} style={{paddingTop:'2px', paddingBottom:'2px', fontFamily: 'Inter, sans-serif', fontSize:'11px',color:'white' , background:'#2d3648'}}>{notifications[index] && notifications[index].related_item==="CHAT" ? "See Message" : "See Complaint"}</button>
                                                    <button className="btn" onClick={()=>markSingle(notifications[index].id,index)}  style={{paddingTop:'2px', paddingBottom:'2px',paddingLeft:'5px',paddingRight:'5px' , fontFamily: 'Inter, sans-serif', fontSize:'11px',color:'white' , background:'#2d3648'}}>
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