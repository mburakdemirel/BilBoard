import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReconnectingWebSocket from 'reconnecting-websocket';
import axios from "axios";

function Chat() {

    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);



    useEffect(() => {
        // Get the username from local storage or prompt the user to enter it

        // Connect to the WebSocket server with the username as a query parameter
        //const newSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/26/");

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
        const newSocket = new ReconnectingWebSocket("ws://127.0.0.1:8000/ws/chat/26/");
        const data = axios.get("http://127.0.0.1:8000/chat/26/");
        console.log(data);


        setSocket(newSocket);

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {

        if (socket) {
            socket.onopen = function (e) {
                console.log("WebSocket is connected");

                //socket.send(JSON.stringify({command: 'new_message', chat_id: 26 }));


            }
        }
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.send(JSON.stringify({
            'command': 'new_message',
            'message': "burakı senin döndürdüğün değerin amk",
            'author': 6,
            'chat_id': 26
        }));
    };


    return (
        <div className="chat-container">
            <div className="chat-header">Chat</div>
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        {/*<div className="message-username">{message.username}:</div>
                        <div className="message-content">{message.message}</div>
                        <div className="message-timestamp">{message.timestamp}</div>*/}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
export default Chat;