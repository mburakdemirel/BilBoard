import PlaceHolder from './assets/img/WF Image Placeholder.png';
import axios from "axios";
import React, {useEffect, useState} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
// TODO: put all style attributes into a css file and think about the layout of this page
// Should there be products next to the messages??
function MessagePage() {
    const [allMessages, setAllMessages] = useState("");

    useEffect(()=>{
        // User messages will be uploaded when page first open
        uploadAllMessages();

        var messages = [
            { product_name: 'Deneme1', product_price: "33" },
            { product_name: 'Deneme2', product_price: "12" },
            { product_name: 'Deneme3', product_price: "222"  }
        ];
        console.log(messages)
        setAllMessages(messages)

    },[])


    // Get all messages of user
    const uploadAllMessages = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/user/me/') ;
            console.log(data);



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





    return (
        <section className="d-flex py-4 py-xl-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container d-flex">
                <div className="row gx-1 gy-3 justify-content-center" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                    {/* I think this should not be here this page should be more like a pop-up page */}
                    <Products allMessages={allMessages}></Products>
                    <Messages></Messages>
                </div>
            </div>
        </section>
    )
}


function Products({allMessages}) {

    const [activeIndex, setActiveIndex] = useState(0);

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    useEffect(()=>{
        uploadSelectedMessages();
        // Messages in the selected index will be opened on the right side
        console.log(activeIndex);
    },[activeIndex])



    const uploadSelectedMessages = async () => {
        try{
            const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/`);
            setSocket(newSocket);

            newSocket.onopen = () => console.log("WebSocket connected");
            newSocket.onclose = () => console.log("WebSocket disconnected");

            // Clean up the WebSocket connection when the component unmounts
            return () => {
                newSocket.close();
            };
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


    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            };
        }
    }, [socket]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message && socket) {
            const data = {
                message: message,
                //username: username,
            };
            socket.send(JSON.stringify(data));
            setMessage("");
        }
    };




        return (
        <>
            <div className=" d-flex flex-grow-1 justify-content-center align-items-center" data-aos="fade-right" data-aos-duration="600" style={{ height: '40vw', width: '600px', minHeight: '230px' }}>
                <div className="d-flex flex-column" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%', padding: '5%' }} data-bs-smooth-scroll="true">
                    <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                        {Array(allMessages.length).fill().map((_,index) => (
                            <li key={index} className="list-group-item" onClick={()=>setActiveIndex(index)} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                            <div className="card" style={{ borderStyle: 'none',  background: index===activeIndex? '#A0ABC0' : '#EDF0F7'}}>
                                <div className="d-flex flex-row align-items-center " style={{ height: '20%', minHeight: '80px', paddingTop: '5px', paddingBottom: '5px', borderStyle: 'none', paddingLeft: '20px', paddingRight: '6px' }}>
                                    <div className="d-flex flex-column " style={{ width: '50%', height: '100%' }}>
                                        <h4 style={{width:'fit-content', fontSize: '20px', margin: '0px' }}>{allMessages[index].product_name}</h4>
                                        <h3 style={{width:'fit-content', paddingTop: '0px', margin: '0px', marginTop: '1px' }}>{allMessages[index].product_price + "₺"}</h3>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center" style={{ width: '50%', height: '100%' }}>
                                        <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '35px' }}>
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
        </>
    );
}

function Messages() {
    return (
        //flex-grow-1
        <>
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
                            <li className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0', width: '70%' }}>
                                    <div className="text-start" style={{ height: '100%', borderStyle: 'none', width: '100%', padding: '10px', fontSize: '20%' }}>
                                        <p style={{ marginBottom: '0px', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '600%' }}>Paragraphdasfasdfasdfsadfasdfsadfasdfadsfasdfasdfasdf</p>
                                        <div className="d-flex" style={{ width: '50%', height: '100%' }}></div>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item d-flex justify-content-end" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0', width: '70%' }}>
                                    <div className="text-start" style={{ height: '100%', borderStyle: 'none', width: '100%', padding: '10px', fontSize: '20%' }}>
                                        <p style={{ marginBottom: '0px', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '600%' }}>Paragraphdasfasdfasdfsadfasdfsadfasdfadsfasdfasdfasdf</p>
                                        <div className="d-flex d-xxl-flex flex-row justify-content-end align-items-center flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-xxl-end align-items-xxl-center" style={{ width: '50%', height: '100%' }}/>
                                    </div>
                                </div>
                            </li>
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
        </>
    );
}

export default MessagePage;
