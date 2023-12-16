import PlaceHolder from './assets/img/WF Image Placeholder.png';
import axios, {all} from "axios";
import React, {useContext, useEffect, useState} from "react";
import ContextApi from "../context/ContextApi";
import ReconnectingWebSocket from "reconnecting-websocket";
import InfiniteScroll from 'react-infinite-scroll-component';
import Placeholder from "./assets/img/WF Image Placeholder2.png"
import AOS from "aos";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {set} from "react-hook-form";
// TODO: put all style attributes into a css file and think about the layout of this page
// Should there be products next to the messages??
function MessagePage() {
    const navigate = useNavigate();
    const [allMessages, setAllMessages] = useState([]);
    const myProfile = JSON.parse(localStorage.getItem('myProfile'));
    const {chatId} = useParams();
    const [participiant, setParticipiant] = useState();
    const [loading, setLoading] = useState(true);
    const [firstMessage, setFirstMessage] = useState(true);
    const {newMessage} = useContext(ContextApi);
    const id = myProfile.id;
    const location = useLocation();
    let notificationSocket;

    useEffect(()=>{
        console.log("fucking my progile id", id);

        notificationSocket  = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/status/" + id + "/");

        notificationSocket.onopen =  (e) => {
            console.log("WebSocket Notification is connected");
            notificationSocket.send(JSON.stringify({
                'user_id': myProfile.id,
                'connection': 'open'
            }));
        };

        notificationSocket.onclose =  (e) => {
            console.log("WebSocket Notification is closed");
        };


        return () => {
            notificationSocket.send(JSON.stringify({
                'user_id': myProfile.id,
                'connection': 'closed'
            }));
            console.log("Closing WebSocket due to component unmounting");
            notificationSocket.close();
        };

    },[])



    useEffect(()=>{
        AOS.init();
        // User messages will be uploaded when page first open
        setLoading(true);
        uploadAllMessages();

    },[])

    useEffect(() => {
        if(!firstMessage){
            uploadAllMessages();
        }
    }, [firstMessage]);

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    // Get all messages of user
    const uploadAllMessages = async () => {
        await sleep(300);
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            await axios.get("http://127.0.0.1:8000/chat/").then(response => {
                console.log("chat", response.data.results);
                setAllMessages(response.data.results);
                setLoading(false);

            });

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


    const pull_data = (id, participiants) => {
        console.log("chat id " + id);
        console.log("participiant ", participiants);
        setParticipiant(participiants);
    }
    const pull_first_message = (firstMessage) => {
        console.log("firstMessage" + firstMessage);
        setFirstMessage(firstMessage);
    }


    const deleteMessage = async (e,messageId) => {
        e.preventDefault();
        let confirmed;

        if (window.confirm("Do you confirm deleting the product?")) {
            confirmed = true;

        } else {
            confirmed = false;

        }
        if (confirmed) {
            setLoading(true);
            try {
                // do update operations
                await axios.delete('http://127.0.0.1:8000/chat/' + messageId + '/delete/');
                uploadAllMessages();
                navigate("/messages");
            } catch (error) {
            }
        }
    };



    return (
        <section className="d-flex justify-content-center align-items-center py-4" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container">
                <div className="row gx-1 gy-3 justify-content-center" style={{ width: '100%', marginTop: '-21px' }}>
                    {/* I think this should not be here this page should be more like a pop-up page */}
                    <Products allMessages={allMessages} pull_data={pull_data} deleteMessage={deleteMessage} loading={loading}  chatId={chatId} firstMessage={firstMessage}></Products>
                    <Messages  chatId={chatId} participiant={participiant} pull_first_message={pull_first_message} loadingDelete={loading}></Messages>
                </div>
            </div>
        </section>
    )
}


function Products({allMessages, pull_data, deleteMessage, loading, chatId,firstMessage}) {
    const navigate = useNavigate();
    const [firstOpen, setFirstOpen] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {newMessage} = useContext(ContextApi);
    console.log("newmessage", newMessage)

    useEffect(()=>{
       if(!chatId){
           setActiveIndex(-1);
       }
    },[chatId])

    useEffect(()=>{

        findActiveIndex();
        console.log("all messages", allMessages.length);
        // Messages in the selected index will be opened on the right side
        console.log(activeIndex);
    },[allMessages])


    const messageClick = (chatId, participiants,index) => {
        console.log("message index", chatId, participiants);
        pull_data(chatId, participiants);

        setActiveIndex(index);

    };

    const goToItem = (category, id, name) => {
        if(category==="secondhand" || category ==="borrow" || category==="donation"){
            navigate("/product_detail/" + category + "/" + id);
        }
        else if(category==="lost" || category==="found"){
            navigate("/main_page/lost&found/?specific=" + id);
        }
    };



    const findActiveIndex = () => {

        if(!firstMessage){
            setActiveIndex(0);
        }
        else{
            if(newMessage){
                for(let i=0; i<allMessages.length;i++){
                    if(allMessages[i].id == newMessage.chat_id){
                        setActiveIndex(i);
                        console.log("active index", activeIndex);
                        pull_data(allMessages[i].id, allMessages[i].participiants);
                    }
                }
            }

            else{
                for(let i=0; i<allMessages.length;i++){
                    if(allMessages[i].id == chatId){
                        setActiveIndex(i);
                        console.log("active index", activeIndex);
                        pull_data(allMessages[i].id, allMessages[i].participiants);
                    }
                }
            }
        }

    };



        return (
            <div className=" d-flex flex-grow-1 justify-content-center align-items-center " data-aos="fade-right" data-aos-duration="600" style={{ height: '40vw', width: '600px', minHeight: '230px' }}>

                <div className="d-flex flex-column" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%', padding: '5%' }} data-bs-smooth-scroll="true">
                    <div className="" style={{height:'100%', width:'100%', padding:'0px', margin:'0px'}}>
                    {loading ? <div className="d-flex justify-content-center align-items-center " style={{height:'100%', width:'100%'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                        :
                        <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                            {Array(allMessages.length).fill().map((_,index) => (
                                <li key={index} className="list-group-item" onClick={()=>navigate("/messages/" + allMessages[index].id)} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none'}}  data-aos="fade-right" data-aos-duration="600" data-aos-delay={index*100}>
                                <div className="card d-flex justify-content-center" style={{ minHeight:'90px', maxHeight:'90px', borderStyle: 'none',  background: index===activeIndex? '#346fad' : '#EDF0F7'}} onClick={()=>{messageClick(allMessages[index].id, allMessages[index].participiants, index)}}>
                                    <div className="d-flex flex-row align-items-center " style={{ height: '20%', minHeight: '80px', paddingTop: '5px', paddingBottom: '5px', borderStyle: 'none', paddingLeft: '20px', paddingRight: '6px' }}>
                                        <div className="d-flex flex-column align-items-start " style={{ width: '50%', height: '100%' }}>
                                            <h4 className="d-flex text-start" style={{width:'fit-content', fontSize: '18px', marginBottom: '5px', fontFamily: 'Inter, sans-serif', color: index===activeIndex? '#ffffff' : '#000000' }}>{allMessages[index].product_name}</h4>
                                            <h3 className="d-flex text-start" style={{width:'fit-content', paddingTop: '0px', margin: '0px', marginTop: '5px', fontSize: '18px', fontFamily:'Inter, sans-serif', fontWeight:'bold' ,color: index===activeIndex? '#ffffff' : '#000000' }}>{allMessages[index] && (allMessages[index].participiants.contact_name + " " + allMessages[index].participiants.contact_surname)}</h3>
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center" style={{ width: '50%', height: '100%' }}>
                                            <button className="rounded-circle btn btn-primary d-flex justify-content-center align-items-center" style={{ width: '32px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '32px' }}
                                                    onClick={(e)=>deleteMessage(e,allMessages[index].id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                            <span style={{ width: '12px' }}></span>
                                            <div role="button" className="d-flex justify-content-center align-items-center" style={{ height:'80px', width: '80px', margin: '0px', padding: '0px' }}
                                                 onClick={(e) => {
                                                     e.stopPropagation(); // This will stop the event from bubbling up
                                                     goToItem(allMessages[index].category, allMessages[index].product_id, allMessages[index].product_name);
                                                 }}>
                                                {allMessages[index].category === "lost" || allMessages[index].category === "found" ?
                                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '40%', width: '100%', background: '#9ebcdb', borderRadius: '10px' }}>
                                                        <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', color: 'rgb(255,255,255)' }}>{allMessages[index].category}</span>
                                                    </div>
                                                    :
                                                    <img
                                                        role="button"
                                                        className="d-block w-100"
                                                        style={{ borderRadius: '8px', height: '95%', objectFit: 'cover' }}
                                                        src={allMessages[index].image_url == null ? Placeholder : allMessages[index].image_url}

                                                    />
                                                }

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </li>))}
                        </ul>
                    }
                </div>
                </div>

            </div>

    );
}

function Messages({chatId,participiant,loadingDelete,pull_first_message}) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState([]);

    const [socket, setSocket] = useState();
    const [myProfile, setMyProfile] = useState(JSON.parse(localStorage.getItem('myProfile')));
    const {newMessage} = useContext(ContextApi);
    const [newSendedMessage, setNewSendedMessage] = useState('');

    // pagination variables
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(true);
    const [firstMessage, setFirstMessage] = useState();
    const [contact, setContact] = useState();

    console.log(myProfile);
    console.log(myProfile.id);
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
    //const newSocket = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/" + chatId + "/");

    useEffect(() => {

        setLoading(true);
        setPage(1);
        setHasMore(true);
        uploadMessages();
        setNewSendedMessage("");

    }, [chatId]);




    const uploadMessages = async ()=> {

        if(chatId){
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            await axios.get("http://127.0.0.1:8000/chat/" + chatId + "/").then(response => {
                console.log("messages",response.data.messages);
                if(response.data.messages){
                    setMessages(response.data.messages);
                }
                if(response.data){
                    console.log(response.data);
                }


                setChat(response.data);
                setLoading(false);
              /*  setMessages(prevMessages => [...response.data.messages, ...prevMessages]);
                setPage(prevPage => prevPage + 1);
                setHasMore(response.data.messages.length >= 10);*/
            })
        }
    }

    useEffect(() => {
        // Setting up the WebSocket connection
        if(newMessage){
            chatId = newMessage.chat_id;
            setContact({contact_name:newMessage.contact_name, contact_surname:newMessage.contact_surname, contact_id:newMessage.contact_id})
        }
        if(participiant){
            setContact(participiant);
        }
        debugger;
        const newSocket = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/"+ chatId + "/");

        setFirstMessage(true);
        pull_first_message(true);
        newSocket.onopen = function (e) {
            setSocket(newSocket);
            console.log("WebSocket is connected");
        };


        newSocket.onmessage = (event) => {

            const data = JSON.parse(event.data);
            if(data["command"]==='new_message'){
                console.log("message", data);
                setMessages((prevMessages) => [data.message, ...prevMessages]);
            }
        };


        return () => {
            newSocket.close();
        };
    }, [chatId]);




   const sendMessageCommant =  () => {
       if (newSendedMessage) {
            debugger;
           socket.send(JSON.stringify({
               'command': 'new_message',
               'message': newSendedMessage,
               'author': myProfile.id,
               'chat_id': chat.id
           }));

           if (firstMessage) {
               setFirstMessage(false);
               pull_first_message(false);
           }
       }

       setNewSendedMessage("");
   }

    const sendMessageWithEnter = (e) => {

        if(e.key === "Enter") {
            console.log("Enter Click")
            sendMessageCommant();
        }

    };



    const sendMessage = (e) => {
        sendMessageCommant();
    };


    const getHourAndMinuteFromTime = (timestamp) => {
        //let timestamp = "2023-12-04T13:03:48";
        let date = new Date(timestamp);

        let hours = date.getHours();
        let minutes = date.getMinutes();


        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ':' + minutes;
    };


    return (
        //flex-grow-1
            <div className="d-flex flex-grow-1 justify-content-center align-items-center " data-aos="fade-left" data-aos-duration="600" style={{ width: '600px', height: '40vw', minHeight: '380px' }}>
                <div  className="d-flex flex-column align-items-center" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%' }} >
                    <div className="d-flex flex-row align-items-center"  style={{ height: '10%', width: '100%', paddingRight: '20px', paddingBottom: '10px', paddingLeft: '20px', paddingTop: '10px' }} >
                        {(chatId && !loadingDelete) && <h1 className="d-flex justify-content-start"  role="button" style={{ width: '50%', fontSize: '150%', fontFamily: 'Inter, sans-serif', marginBottom: '0px' }}
                         onClick={(e)=>navigate("/profile/"+ contact.contact_id)}> {contact && contact.contact_name + " " + contact.contact_surname}</h1>}
                    </div>
                    <hr style={{ width: '100%', margin: '0px' }} />
                    {chatId ? loading || loadingDelete ? <div className="d-flex justify-content-center, align-items-center" style={{height:'76%', paddingTop: '10px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                        :
                    <div className="d-flex flex-row justify-content-center" style={{ height: '76%', width: '100%', overflow: 'scroll' }} >

                        <ul className="list-group flex-column-reverse" style={{ width: '90%', height: '100%', paddingTop: '20px', overflow: 'scroll' }} data-bs-smooth-scroll="true" data-aos="fade" data-aos-duration="600">

                            {messages.map((message, index) => (

                                <li key={index} className="list-group-item d-flex w-100 " style={{justifyContent: message.author === myProfile.id ? 'right' : 'left', padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                    <div className="card" style={{ borderStyle: 'none', background: message.author === myProfile.id ? '#9ebcdb' : '#d9e9fa', width: '70%', borderRadius:'10px' }}>
                                        <div className="d-flex text-start" style={{ height: '100%', borderStyle: 'none', width: '100%', padding: '10px', fontSize: '20%' }}>
                                            <p style={{ marginBottom: '0px', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '600%' }}>{message && message.content}</p>
                                            <p className="d-flex align-items-end justify-content-end" style={{ textAlign:'end', padding:'0px', margin: '0px', fontFamily: 'Inter, sans-serif', fontSize: '8px' }}>{message && getHourAndMinuteFromTime(message.timestamp)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>


                    </div>
                        :
                        <div style={{height:'76%'}}></div>
                    }


                        <div className="d-flex flex-row " style={{ minHeight:'32px', height: '7%', width: '90%', background: '#edf0f7', borderRadius: '10px', marginTop: '12px', border: '2px solid #CBD2E0' }}>

                            <input className="form-control-sm" type="text" style={{  fontSize:'1em', width: '90%',  background: '#edf0f7', borderRadius: '0px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px', borderStyle: 'none', borderTopWidth: '2px', borderTopStyle: 'none', borderRight: '2px solid #CBD2E0', borderBottomWidth: '2px', borderBottomStyle: 'none', borderLeft: '2px solid #CBD2E0' }}
                                   disabled={loading} value={newSendedMessage} onKeyDown={(e)=>{sendMessageWithEnter(e)}} onChange={(e)=> setNewSendedMessage(e.target.value)}/>
                            <div className="d-flex align-items-center justify-content-center" role="button" onClick={(e)=>{sendMessage(e)}} style={{ width: '10%', height: '100%', borderStyle: 'none' }}>
                                <i className="bi bi-send-fill" style={{ fontSize: '20px' }} ></i>
                            </div>
                        </div>


                </div>

            </div>

    );
}

export default MessagePage;
