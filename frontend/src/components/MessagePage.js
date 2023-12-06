import PlaceHolder from './assets/img/WF Image Placeholder.png';
import axios from "axios";
import React, {useEffect, useState} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {useContext} from "react";
import ContextApi from "../context/ContextApi";
import chat from "./Chat";
import ReconnectingWebSocket from "reconnecting-websocket";
import {set} from "react-hook-form";
// TODO: put all style attributes into a css file and think about the layout of this page
// Should there be products next to the messages??
function MessagePage() {
    const [allMessages, setAllMessages] = useState("");
    const [chatId, setChatId] = useState("");
    const {newMessage} = useContext(ContextApi);
    console.log(newMessage)

    useEffect(()=>{
        // User messages will be uploaded when page first open
        uploadAllMessages();

        var messages = [
            { product_name: 'Deneme1', product_price: "33" },
            { product_name: 'Deneme2', product_price: "12" },
            { product_name: 'Deneme3', product_price: "222"  }
        ];

        if(newMessage){
            setAllMessages([...messages, newMessage].reverse())
        }
        else{
            setAllMessages(messages)
        }

    },[])




    // Get all messages of user
    const uploadAllMessages = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            axios.get("http://127.0.0.1:8000/chat/").then(response => {
                console.log(response.data.results);
                setAllMessages(response.data.results);
            })

            //const {data} = await axios.get('http://127.0.0.1:8000/api/user/me/') ;
            //console.log(data);
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


    const pull_data = (id) => {
        console.log("chat id " + id); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
        setChatId(id);
    }



    return (
        <section className="d-flex justify-content-center align-items-center py-4" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container">
                <div className="row gx-1 gy-3 justify-content-center" style={{ width: '100%', marginTop: '-21px' }}>
                    {/* I think this should not be here this page should be more like a pop-up page */}
                    <Products allMessages={allMessages} pull_data={pull_data}></Products>
                    <Messages pull_data={pull_data} chatId={chatId} ></Messages>
                </div>
            </div>
        </section>
    )
}


function Products({allMessages,pull_data}) {

    const [activeIndex, setActiveIndex] = useState(0);




    useEffect(()=>{
        console.log(allMessages.participiants);
        // Messages in the selected index will be opened on the right side
        console.log(activeIndex);
    },[activeIndex,allMessages])


    const messageClick = (index) => {
        pull_data(index);
    };


        return (
            <div className=" d-flex flex-grow-1 justify-content-center align-items-center" data-aos="fade-right" data-aos-duration="600" style={{ height: '40vw', width: '600px', minHeight: '230px' }}>
                <div className="d-flex flex-column" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%', padding: '5%' }} data-bs-smooth-scroll="true">
                    <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                        {Array(allMessages.length).fill().map((_,index) => (
                            <li key={index} className="list-group-item" onClick={()=>setActiveIndex(index)} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                            <div className="card" style={{ borderStyle: 'none',  background: index===activeIndex? '#A0ABC0' : '#EDF0F7'}} onClick={()=>{messageClick(allMessages[index].id)}}>
                                <div className="d-flex flex-row align-items-center " style={{ height: '20%', minHeight: '80px', paddingTop: '5px', paddingBottom: '5px', borderStyle: 'none', paddingLeft: '20px', paddingRight: '6px' }}>
                                    <div className="d-flex flex-column " style={{ width: '50%', height: '100%' }}>
                                        <h4 style={{width:'fit-content', fontSize: '20px', marginBottom: '5px', fontFamily: 'Inter, sans-serif' }}>{"Yatak"}</h4>
                                        <h3 style={{width:'fit-content', paddingTop: '0px', margin: '0px', marginTop: '5px', fontSize: '20px', fontFamily:'Inter, sans-serif', fontWeight:'bold' }}>{allMessages[index].participiants && (allMessages[index].participiants.contact_name + " " + allMessages[index].participiants.contact_surname)}</h3>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center" style={{ width: '50%', height: '100%' }}>
                                        <button className="rounded-circle btn btn-primary d-flex justify-content-center align-items-center" style={{ width: '24px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '24px' }}>
                                            <i className="fas fa-share-alt"></i>
                                        </button>
                                        <span style={{ width: '12px' }}></span>
                                        <img alt="" src={PlaceHolder} style={{ width: '35%', height: '95%', minWidth: '70px' }} />
                                    </div>
                                </div>
                            </div>
                        </li>))}
                    </ul>
                </div>
            </div>

    );
}

function Messages({chatId}) {
    const [id, setId] = useState(chatId);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState();

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
    const newSocket = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/26/");

    useEffect(() => {
        setId(chatId);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
        axios.get("http://127.0.0.1:8000/chat/26/").then(response => {
            //console.log(response.data.messages);
            setMessages(response.data.messages);

        })
    }, [chatId]);

    useEffect(() => {
        // Setting up the WebSocket connection
        const newSocket = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/26/");
        setSocket(newSocket);

        newSocket.onopen = function (e) {
            console.log("WebSocket is connected");
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if(data["command"]==='new_message'){
                console.log("message", data);
                setMessages((prevMessages) => [...prevMessages, data.message]);
            }


        };

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, []);






    return (
        //flex-grow-1
            <div className="d-flex flex-grow-1 justify-content-center align-items-center " data-aos="fade-left" data-aos-duration="600" style={{ width: '600px', height: '40vw', minHeight: '380px' }}>
                <div className="d-flex flex-column align-items-center" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%' }}>
                    <div className="d-flex flex-row align-items-center" style={{ height: '18%', width: '100%', paddingRight: '20px', paddingBottom: '10px', paddingLeft: '20px', paddingTop: '10px' }}>
                        <h1 className="d-flex justify-content-start" style={{ width: '50%', fontSize: '150%', fontFamily: 'Inter, sans-serif', marginBottom: '0px' }}>Seller Name</h1>
                        <div className="d-flex justify-content-end" style={{ height: '100%', width: '60%' }}>
                            <img alt="" className="rounded-circle" src={PlaceHolder} style={{ height: '100%', width: '30%' }} />
                        </div>
                    </div>
                    <hr style={{ width: '100%', margin: '0px' }} />
                    <div className="d-flex flex-row justify-content-center" style={{ height: '68%', width: '100%', overflow: 'scroll' }}>
                        <ul className="list-group flex-column-reverse" style={{ width: '90%', height: '100%', paddingTop: '20px', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                            {/** burada kimin mesajı olduğuna göre sağa veya sola alignlanmış halini göstermeliyiz 
                             * backendden mesajları alıp kim tarafından gönderildiğine göre buna karar veririz
                            */}
                            {messages.map((message, index) => (
                                <li key={index} className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                    <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0', width: '70%' }}>
                                        <div className="text-start" style={{ height: '100%', borderStyle: 'none', width: '100%', padding: '10px', fontSize: '20%' }}>
                                            <p style={{ marginBottom: '0px', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '600%' }}>{message && message.content}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="d-flex flex-row " style={{ minHeight:'32px', height: '7%', width: '90%', background: '#edf0f7', borderRadius: '10px', marginTop: '12px', border: '2px solid #CBD2E0' }}>
                        <div className="d-flex align-items-center  justify-content-center" style={{ width: '10%', height: '100%', borderWidth: '2px', borderStyle: 'none' }}>
                            <i className="bi bi-plus-lg" style={{ fontSize: '20px'}}></i>
                        </div>
                        <input className="form-control-sm" type="text" style={{  fontSize:'1em', width: '80%',  background: '#edf0f7', borderRadius: '0px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px', borderStyle: 'none', borderTopWidth: '2px', borderTopStyle: 'none', borderRight: '2px solid #CBD2E0', borderBottomWidth: '2px', borderBottomStyle: 'none', borderLeft: '2px solid #CBD2E0' }} />
                        <div className="d-flex align-items-center justify-content-center" style={{ width: '10%', height: '100%', borderStyle: 'none' }}>
                            <i className="bi bi-send-fill" style={{ fontSize: '20px' }}></i>
                        </div>
                    </div>
                </div>
            </div>

    );
}

export default MessagePage;
